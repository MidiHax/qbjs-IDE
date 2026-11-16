/* qb64-ide: compiles and runs a program with the QBJS engine.
 *
 * Shared by the IDE (app.js) and the embedded player, so both run programs the same way.
 * Needs qbjs/vfs.js, gx/gx.js, qbjs/qb.js and qbjs/qb2js.js loaded first. Knows nothing
 * about the page around it: what to show is left to the callbacks.
 *
 *   const result = await QBRunner.run({
 *     source,            program text
 *     path,              its VFS path ('' if untitled): names the program and sets the folder
 *                        it starts in (relative OPEN, $INCLUDE, RUN "x" are resolved there)
 *     debug,             compile with a debugger hook before each line (QB.dbgHit)
 *     ready,             optional promise awaited before the first compile (fonts, say)
 *     decodeSource(bytes), optional: turns a source file's bytes (a Uint8Array) into text, for
 *                        $INCLUDE files and programs started by RUN "name". Without it, one
 *                        character per byte, as the IDE stores files.
 *     args,              optional: COMMAND$ (the arguments, as typed after the program name)
 *     onTitle(text),     optional: _TITLE calls this instead of renaming the page
 *     onCompile(label),                       before each compile
 *     onCompiled(js, label),                  after each compile, errors or not
 *     onCompileMessage(kind, line, text, file),  compiler errors ('error') and warnings ('warn')
 *     onMessage(kind, text, line, file, label),  what the program writes with _ECHO, _LOG...
 *     onStart(js, cwd, label),                just before a compiled program starts
 *   });
 *
 * label is '' for the program passed in, and the VFS path of the program a RUN "name"
 * started (RUN ends the program with a signal, and the program named is compiled and run
 * here, in the folder that was current, as in QBasic).
 *
 * result.reason is one of:
 *   'end'            the program ended (or was stopped with QBRunner.stop())
 *   'stop'           it was stopped while paused in the debugger, or while compiling
 *   'compile-error'  the compiler reported an error (see onCompileMessage)
 *   'error'          it failed while running: result.error, result.line (BASIC line, 0 if
 *                    unknown), result.message, result.file (the label of the program)
 */
var QBRunner = new function() {
    'use strict';
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    let _compiler = null;
    let _compiling = false;
    let _stopRequested = false; // stop() while compiling: QB.start() clears QB's halt flag

    // A program's relative paths start from its own folder, or the root when it is untitled
    function programFolder(path) {
        const vfs = GX.vfs();
        const dir = path ? vfs.getNode(vfs.getParentPath(path)) : null;
        return dir && dir.type === vfs.DIRECTORY ? dir : vfs.rootDirectory();
    }

    // A program started by RUN "name": decoded by decodeSource, or one character per byte, as
    // the IDE reads programs
    function readSource(path, decodeSource) {
        const vfs = GX.vfs();
        const f = vfs.getNode(path);
        if (!f || f.type !== vfs.FILE) return null;
        const view = new Uint8Array(f.data);
        if (decodeSource) return decodeSource(view);
        let s = '';
        for (let i = 0; i < view.length; i += 8192) s += String.fromCharCode.apply(null, view.subarray(i, i + 8192));
        return s;
    }

    // The BASIC line of a run-time error, from the JavaScript line in its stack (0 if unknown)
    function errorLine(error) {
        let line = NaN;
        if (error && error.line) line = error.line - 1;                      // Safari
        const stack = (error && error.stack) || '';
        let m = stack.match(/<anonymous>:(\d+):\d+/);                         // Chrome / Edge
        if (!m) m = stack.match(/> AsyncFunction:(\d+):\d+/);                 // Firefox
        if (m) line = Number(m[1]) - 2;                                       // AsyncFunction wraps the body in 2 lines
        if (isNaN(line) || !_compiler) return 0;
        try { return Number(_compiler.getSourceLine(line)) || 0; } catch (e) { return 0; }
    }

    function running() { return !!(_compiling || QB.running() || GX.sceneActive()); }

    async function run(opts) {
        let source = opts.source;
        let path = opts.path || '';
        const call = (name, ...args) => { if (opts[name]) opts[name](...args); };
        // set before the first await, so running() is true as soon as run() is called
        _compiling = true;
        _stopRequested = false;
        QB.setSourceDecoder(opts.decodeSource || null);
        QB.setTitleHandler(opts.onTitle || null);

        let runCwd = null;
        let label = '';
        try {
            if (opts.ready) await opts.ready;
            if (!_compiler) _compiler = await _QBCompiler();
            for (;;) {
                call('onCompile', label);
                GX.reset();
                const runLabel = label;
                QB.setMessageHandler((kind, text, line, file) => call('onMessage', kind, text, line, file, runLabel));
                QB.start();
                QB.setCommand(opts.args || '', path);
                // $INCLUDE files are looked up from the program's folder, not from whatever
                // folder the last program left current
                const cwd = runCwd || programFolder(path);
                GX.vfsCwd(cwd);
                const js = await _compiler.compile(source, !!opts.debug);
                call('onCompiled', js, label);

                let hasError = false;
                for (const w of _compiler.getWarnings() || []) {
                    const isErr = w.mtype == 1;
                    hasError = hasError || isErr;
                    call('onCompileMessage', isErr ? 'error' : 'warn', w.line, w.text, w.module && w.module.path ? w.module.path : label);
                }
                if (hasError) {
                    QB.halt(); GX.sceneStop();
                    return { reason: 'compile-error' };
                }

                // Programs start in their own folder, so relative paths in OPEN, _LOADIMAGE
                // etc. resolve next to the .bas file. A program started by RUN starts in the
                // folder that was current, as in QBasic.
                const body = js.replace('QB.start();', 'QB.start(); GX.vfsCwd(__cwd);');
                const fn = new AsyncFunction('__cwd', body);
                if (_stopRequested) { QB.halt(); GX.sceneStop(); return { reason: 'stop' }; }
                if (!opts.debug) QB.dbgStart(null);
                call('onStart', js, cwd, label);
                _compiling = false;
                try {
                    await fn(cwd);
                    return { reason: 'end' };
                } catch (error) {
                    if (error && error._qbStop) return { reason: 'stop' }; // Stop while paused in the debugger
                    if (!(error && error._qbRun)) throw error;
                    runCwd = GX.vfsCwd();
                    if (error.runPath) {
                        path = error.runPath;
                        source = readSource(path, opts.decodeSource);
                        label = path;
                        if (source === null) throw new Error('File not found: ' + path);
                    }
                    _compiling = true;
                }
            }
        } catch (error) {
            console.error(error);
            QB.halt(); GX.sceneStop();
            return {
                reason: 'error', error,
                line: errorLine(error),
                message: error && error.message ? error.message : String(error),
                file: label,
            };
        } finally {
            _compiling = false;
        }
    }

    function stop() {
        // While compiling, only note it: the compiler runs on the QB runtime too, and halting
        // QB would cut the compile short. run() stops before starting the program.
        if (_compiling) { _stopRequested = true; return; }
        QB.halt();
        GX.sceneStop();
        QB.dbgResume('stop');
    }

    this.run = run;
    this.stop = stop;
    this.running = running;
    this.compiling = function() { return _compiling; };
    this.programFolder = programFolder;
    this.errorLine = errorLine;
};
