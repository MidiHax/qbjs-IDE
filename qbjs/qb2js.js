async function __qblib_lib_io_fs_bas() {
/* global constants: */ const ALL =    0; const FILE =    1; const DIRECTORY =    2; 
/* shared variables: */ 
/* static method variables: */ 

async function main() {

/* implicit variables: */ 
/* implicit variables: */ 
} await main();

async function func_ListDirectory(dirpath/*STRING*/,listMode/*INTEGER*/) {
if (QB.halted()) { return; }; listMode = Math.round(listMode); 
var ListDirectory = null;
/* implicit variables: */ 
   if ( dirpath ==   undefined) {
      dirpath = "";
   }
   if ( listMode ==   undefined) {
      listMode = Math.round(  ALL );
   }
   var children = {};  /* OBJECT */ 
   //-------- BEGIN JS native code block --------
        var vfs = QB.vfs();
        var pnode = null;
        if (dirpath == "") {
            pnode = QB.vfsCwd();
        }
        else {
            pnode = vfs.getNode(dirpath, QB.vfsCwd());
        }
        if (!pnode) {
            throw Object.assign(new Error("Path not found: [" + dirpath + "]"), { _stackDepth: 1 });
        }
        var mode = null;
        if (listMode == DIRECTORY) {
            mode = vfs.DIRECTORY;
        }
        else if (listMode == FILE) {
            mode = vfs.FILE;
        }
        children = vfs.getChildren(pnode, mode);
//-------- END JS native code block --------
   var type = 0;  /* SINGLE */ var i = 0;  /* INTEGER */ 
   var results = QB.initArray([{l:0,u: children.length}], {});  /* OBJECT */ 
   var ___v7641413 = 0; ___l0: for ( i=  0; (1 > 0) ? ( i <=  children.length -  1) : ( i >=  children.length -  1);  i+=1) { if (QB.halted()) { return; } ___v7641413++;   if (___v7641413 % 100 == 0) { await QB.autoLimit(); }
      QB.arrayValue(results, [ i + 1]).value .name =  children[i].name;
      //-------- BEGIN JS native code block --------
            if (children[i].type == vfs.FILE) { 
                type = FILE;
            }
            else {
                type = DIRECTORY;
            }
//-------- END JS native code block --------
      QB.arrayValue(results, [ i + 1]).value .type =  type;
   } 
   ListDirectory =  results;
return ListDirectory;
}
async function sub_DownloadFile(filepath/*STRING*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
        var vfs = QB.vfs();
        var file = vfs.getNode(filepath, QB.vfsCwd());
        if (!file || file.type != vfs.FILE) {
            throw Object.assign(new Error("File not found: [" + filepath + "]"), { _stackDepth: 1 });
        }
        await QB.downloadFile(new Blob([file.data]), file.name);
//-------- END JS native code block --------
}
async function sub_UploadFile(destpath/*STRING*/,filter/*STRING*/,fnCallback/*OBJECT*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
        var vfs = QB.vfs();
        var parentDir = null;
        if (destpath == "/") {
            parentDir = QB.vfs().rootDirectory();
            destpath = "";
        }
        else if (destpath == undefined || destpath == "") {
            parentDir = QB.vfsCwd();
        }
        else {
            parentDir = vfs.getNode(destpath, QB.vfsCwd());
            if (!parentDir) {
                throw Object.assign(new Error("Path not found: [" + destpath + "]"), { _stackDepth: 1 });
            }
            else if (parentDir && parentDir.type != vfs.DIRECTORY) {
                throw Object.assign(new Error("Path is not a directory: [" + destpath + "]"), { _stackDepth: 1 });
            }
        }
        var fileInput = document.getElementById("upload-file-input");
        if (fileInput == null) {
            fileInput = document.createElement("input");
            fileInput.id = "upload-file-input";
            fileInput.type = "file";
        }
        fileInput.value = null;
        if (filter != undefined) {
            fileInput.accept = filter;
        }
        fileInput.onchange = function(event) {
            if (event.target.files.length > 0) {
                var f = event.target.files[0];
                var fr = new FileReader();
                fr.onload = function() {
                    var file = vfs.createFile(f.name, parentDir);
                    vfs.writeData(file, fr.result);
                    if (fnCallback) {
                        fnCallback(vfs.fullPath(file));
                    }
                }
                fr.readAsArrayBuffer(f);
            }
        };
        fileInput.click();
//-------- END JS native code block --------
}
async function func_ReadText(filename/*STRING*/) {
if (QB.halted()) { return; }; 
var ReadText = null;
/* implicit variables: */ 
   if ((await QB.func__FileExists(  filename)) ) {
      var fh = 0;  /* INTEGER */ 
      fh = Math.round( QB.func_FreeFile() );
      await QB.sub_Open( filename, QB.BINARY,  fh, undefined);
      var text = '';  /* STRING */ 
      text = (QB.func_Space( (QB.func_LOF(  fh))));
      var ___v3576428 = { value: text }; QB.sub_Get( fh, undefined, 'STRING', ___v3576428); text = ___v3576428.value;
      QB.sub_Close(fh);
   }
   ReadText =  text;
return ReadText;
}
async function sub_WriteText(filename/*STRING*/,text/*STRING*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   var fh = 0;  /* INTEGER */ 
   fh = Math.round( QB.func_FreeFile() );
   await QB.sub_Open( filename, QB.BINARY,  fh, undefined);
   QB.sub_Put( fh, undefined, 'STRING', text);
   QB.sub_Close(fh);
}
async function func_GetFilename(filepath/*STRING*/) {
if (QB.halted()) { return; }; 
var GetFilename = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
        var vfs = QB.vfs();
        return vfs.getFileName(filepath);
//-------- END JS native code block --------
return GetFilename;
}
async function func_GetParentPath(filepath/*STRING*/) {
if (QB.halted()) { return; }; 
var GetParentPath = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
        var vfs = QB.vfs();
        return vfs.getParentPath(filepath);
//-------- END JS native code block --------
return GetParentPath;
}
async function func_NormalizePath(filepath/*STRING*/) {
if (QB.halted()) { return; }; 
var NormalizePath = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
        filepath = filepath.replaceAll("\\", "/"); 
        var prefix = "";
        if      (filepath.startsWith("http://"))  { prefix = "http://" }
        else if (filepath.startsWith("https://")) { prefix = "https://" }
        else if (filepath.startsWith("//"))       { prefix = "//" }
        else if (filepath.startsWith("/"))        { prefix = "/" }
        filepath = filepath.substring(prefix.length);
        var parts = filepath.split("/"); 
        var stack = [];
        for (var part of parts) {
            if (part === "" || part === ".") {
                continue;
            }
            if (part === "..") {
                if (stack.length > 0) {
                    stack.pop();
                }
            } else {
                stack.push(part);
            }
        }
        return prefix + stack.join("/");
//-------- END JS native code block --------
return NormalizePath;
}
return {
ALL: ALL,
FILE: FILE,
DIRECTORY: DIRECTORY,
func_ListDirectory: func_ListDirectory,
sub_DownloadFile: sub_DownloadFile,
sub_UploadFile: sub_UploadFile,
func_ReadText: func_ReadText,
sub_WriteText: sub_WriteText,
func_GetFilename: func_GetFilename,
func_GetParentPath: func_GetParentPath,
func_NormalizePath: func_NormalizePath,
};
}
async function __qblib_lib_lang_object_bas() {
/* global constants: */ 
/* shared variables: */ 
/* static method variables: */ 

async function main() {

/* implicit variables: */ 
/* implicit variables: */ 
} await main();

async function sub_Assign(target/*OBJECT*/,source/*OBJECT*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    Object.assign(target, source);
//-------- END JS native code block --------
}
async function func_GetProperty(obj/*OBJECT*/,pname/*STRING*/) {
if (QB.halted()) { return; }; 
var GetProperty = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    return obj[pname];
//-------- END JS native code block --------
return GetProperty;
}
async function func_HasProperty(obj/*OBJECT*/,pname/*STRING*/) {
if (QB.halted()) { return; }; 
var HasProperty = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    return (obj[pname] != undefined) ? -1 : 0;
//-------- END JS native code block --------
return HasProperty;
}
async function func_Keys(obj/*OBJECT*/) {
if (QB.halted()) { return; }; 
var Keys = null;
/* implicit variables: */ 
   var k = {};  /* OBJECT */ 
   //-------- BEGIN JS native code block --------
    k = Object.keys(obj);
//-------- END JS native code block --------
   var i = 0;  /* INTEGER */ 
   var results = QB.initArray([{l:0,u: k.length}], {});  /* OBJECT */ 
   var ___v7075312 = 0; ___l1068624: for ( i=  0; (1 > 0) ? ( i <=  k.length -  1) : ( i >=  k.length -  1);  i+=1) { if (QB.halted()) { return; } ___v7075312++;   if (___v7075312 % 100 == 0) { await QB.autoLimit(); }
      QB.arrayValue(results, [ i + 1]).value =  k[i];
   } 
   Keys =  results;
return Keys;
}
async function sub_SetProperty(obj/*OBJECT*/,pname/*STRING*/,pvalue/*OBJECT*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    obj[pname] = pvalue;
//-------- END JS native code block --------
}
async function sub_RemoveProperty(obj/*OBJECT*/,pname/*STRING*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    delete obj[pname];
//-------- END JS native code block --------
}
return {
sub_Assign: sub_Assign,
func_GetProperty: func_GetProperty,
func_HasProperty: func_HasProperty,
func_Keys: func_Keys,
sub_SetProperty: sub_SetProperty,
sub_RemoveProperty: sub_RemoveProperty,
};
}
async function __qblib_lib_lang_array_bas() {
/* global constants: */ 
/* shared variables: */ 
/* static method variables: */ 

async function main() {

/* implicit variables: */ 
/* implicit variables: */ 
} await main();

async function func_At(a/*OBJECT*/,index/*INTEGER*/) {
if (QB.halted()) { return; }; index = Math.round(index); 
var At = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    return a.at(index);
//-------- END JS native code block --------
return At;
}
async function sub_Clear(a/*OBJECT*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   a.length =  0;
}
async function func_Concat(a/*OBJECT*/) {
if (QB.halted()) { return; }; 
var Concat = null;
/* implicit variables: */ var a2 = 0;  /* SINGLE */ var a2 = QB.initArray([{l:0,u: 10}], 0);  /* SINGLE */ 
   var i = 0;  /* INTEGER */ var j = 0;  /* INTEGER */ var isArray = 0;  /* INTEGER */ 
   var ___v5364588 = 0; ___l480418: for ( j=  1; (1 > 0) ? ( j <=  arguments.length -  1) : ( j >=  arguments.length -  1);  j+=1) { if (QB.halted()) { return; } ___v5364588++;   if (___v5364588 % 100 == 0) { await QB.autoLimit(); }
      a2 =  arguments[j];
      if ((await func_IsJSArray(  a2)) ) {
         //-------- BEGIN JS native code block --------
            a = a.concat(a2);
//-------- END JS native code block --------
      } else if ( a2._dimensions) {
         var i = 0;  /* INTEGER */ 
         var ___v6161923 = 0; ___l7288614: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  a2))) : ( i >= (QB.func_UBound(  a2)));  i+=1) { if (QB.halted()) { return; } ___v6161923++;   if (___v6161923 % 100 == 0) { await QB.autoLimit(); }
            await sub_Push(  a,   QB.arrayValue(a2, [ i]).value);
         } 
      } else {
         await sub_Push(  a,    a2);
      }
   } 
   Concat =  a;
return Concat;
}
async function func_Create() {
if (QB.halted()) { return; }; 
var Create = null;
/* implicit variables: */ var a2 = 0;  /* SINGLE */ 
   var i = 0;  /* INTEGER */ 
   var a = {};  /* OBJECT */ 
   a =  [];
   var ___v4082566 = 0; ___l2480838: for ( i=  0; (1 > 0) ? ( i <=  arguments.length - 1) : ( i >=  arguments.length - 1);  i+=1) { if (QB.halted()) { return; } ___v4082566++;   if (___v4082566 % 100 == 0) { await QB.autoLimit(); }
      a2 =  arguments[i];;
      a = (await func_Concat(  a,    a2));
   } 
   Create =  a;
return Create;
}
async function func_Every(a/*OBJECT*/,fn/*FUNCTION*/) {
if (QB.halted()) { return; }; 
var Every = null;
/* implicit variables: */ 
   fn = (await func_PrepareCallback(  fn));
   //-------- BEGIN JS native code block --------
    return QB.toBoolean(a.every(fn));    
//-------- END JS native code block --------
return Every;
}
async function func_Fill(a/*OBJECT*/,value/*SINGLE*/,start/*SINGLE*/,end/*SINGLE*/) {
if (QB.halted()) { return; }; 
var Fill = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    return a.fill(value, start, end);
//-------- END JS native code block --------
return Fill;
}
async function func_Filter(a/*OBJECT*/,fn/*FUNCTION*/) {
if (QB.halted()) { return; }; 
var Filter = null;
/* implicit variables: */ 
   fn = (await func_PrepareCallback(  fn));
   //-------- BEGIN JS native code block --------
    return a.filter(fn);
//-------- END JS native code block --------
return Filter;
}
async function func_IndexOf(a/*OBJECT*/,searchElement/*SINGLE*/,fromIndex/*SINGLE*/) {
if (QB.halted()) { return; }; 
var IndexOf = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    return a.indexOf(searchElement, fromIndex);
//-------- END JS native code block --------
return IndexOf;
}
async function func_IsJSArray(a/*SINGLE*/) {
if (QB.halted()) { return; }; 
var IsJSArray = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    return QB.toBoolean(Array.isArray(a));
//-------- END JS native code block --------
return IsJSArray;
}
async function func_IsQBArray(a/*SINGLE*/) {
if (QB.halted()) { return; }; 
var IsQBArray = null;
/* implicit variables: */ 
   var result = 0;  /* INTEGER */ 
   if ( a._dimensions) {
      result = Math.round(  -  1 );
   }
   IsQBArray =  result;
return IsQBArray;
}
async function sub_Insert(a/*OBJECT*/,index/*INTEGER*/) {
if (QB.halted()) { return; }; index = Math.round(index); 
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    var values = Array.from(arguments).slice(2);
    a.splice(index, 0, values);
//-------- END JS native code block --------
}
async function func_Item(a/*OBJECT*/,index/*INTEGER*/) {
if (QB.halted()) { return; }; index = Math.round(index); 
var Item = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    return a[index];
//-------- END JS native code block --------
return Item;
}
async function func_Join(a/*OBJECT*/,separator/*SINGLE*/) {
if (QB.halted()) { return; }; 
var Join = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    return a.join(separator);
//-------- END JS native code block --------
return Join;
}
async function func_LastIndexOf(a/*OBJECT*/,searchElement/*SINGLE*/,fromIndex/*SINGLE*/) {
if (QB.halted()) { return; }; 
var LastIndexOf = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    if (fromIndex == undefined) { fromIndex = a.length; }
    return a.lastIndexOf(searchElement, fromIndex);
//-------- END JS native code block --------
return LastIndexOf;
}
async function func_Length(a/*OBJECT*/) {
if (QB.halted()) { return; }; 
var Length = null;
/* implicit variables: */ 
   Length =  0;
   if ( a.length) {
      Length =  a.length;
   }
return Length;
}
async function func_Pop(a/*OBJECT*/) {
if (QB.halted()) { return; }; 
var Pop = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    return a.pop();
//-------- END JS native code block --------
return Pop;
}
async function sub_Push(a/*OBJECT*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   var i = 0;  /* INTEGER */ 
   var ___v7070014 = 0; ___l9476965: for ( i=  1; (1 > 0) ? ( i <=  arguments.length -  1) : ( i >=  arguments.length -  1);  i+=1) { if (QB.halted()) { return; } ___v7070014++;   if (___v7070014 % 100 == 0) { await QB.autoLimit(); }
      //-------- BEGIN JS native code block --------
        a.push(arguments[i]);
//-------- END JS native code block --------
   } 
}
async function func_Reduce(a/*OBJECT*/,fn/*FUNCTION*/,initialValue/*SINGLE*/) {
if (QB.halted()) { return; }; 
var Reduce = null;
/* implicit variables: */ 
   fn = (await func_PrepareCallback(  fn));
   //-------- BEGIN JS native code block --------
    if (initialValue == undefined) { 
        return a.reduce(fn);
    }
    else {
        return a.reduce(fn, initialValue);
    }
//-------- END JS native code block --------
return Reduce;
}
async function func_ReduceRight(a/*OBJECT*/,fn/*FUNCTION*/,initialValue/*SINGLE*/) {
if (QB.halted()) { return; }; 
var ReduceRight = null;
/* implicit variables: */ 
   fn = (await func_PrepareCallback(  fn));
   //-------- BEGIN JS native code block --------
    if (initialValue == undefined) { 
        return a.reduceRight(fn);
    }
    else {
        return a.reduceRight(fn, initialValue);
    }
//-------- END JS native code block --------
return ReduceRight;
}
async function sub_Remove(a/*OBJECT*/,start/*SINGLE*/,deleteCount/*SINGLE*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   if ( deleteCount ==   undefined) {
      deleteCount =  1;
   }
   //-------- BEGIN JS native code block --------
    a.splice(start, deleteCount);
//-------- END JS native code block --------
}
async function sub_Reverse(a/*OBJECT*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    a.reverse();
//-------- END JS native code block --------
}
async function func_Shift(a/*OBJECT*/) {
if (QB.halted()) { return; }; 
var Shift = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    return a.shift();
//-------- END JS native code block --------
return Shift;
}
async function func_Slice(a/*SINGLE*/,start/*SINGLE*/,end/*SINGLE*/) {
if (QB.halted()) { return; }; 
var Slice = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    return a.slice(start, end);
//-------- END JS native code block --------
return Slice;
}
async function sub_Sort(a/*OBJECT*/,sortFn/*FUNCTION*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   if ( sortFn !=   undefined) {
      sortFn = (await func_PrepareCallback(  sortFn));
   }
   //-------- BEGIN JS native code block --------
    a.sort(sortFn);
//-------- END JS native code block --------
}
async function sub_Splice(a/*OBJECT*/,index/*INTEGER*/,deleteCount/*SINGLE*/) {
if (QB.halted()) { return; }; index = Math.round(index); 
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    var values = Array.from(arguments).slice(3);
    a.splice(index, deleteCount, values);
//-------- END JS native code block --------
}
async function sub_Unshift(a/*OBJECT*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   var i = 0;  /* INTEGER */ 
   var ___v4271988 = 0; ___l9837131: for ( i=  arguments.length -  1; ( - 1 > 0) ? ( i <=  1) : ( i >=  1);  i+= - 1) { if (QB.halted()) { return; } ___v4271988++;   if (___v4271988 % 100 == 0) { await QB.autoLimit(); }
      //-------- BEGIN JS native code block --------
        a.unshift(arguments[i]);
//-------- END JS native code block --------
   } 
}
async function func_ToQBArray(a/*OBJECT*/) {
if (QB.halted()) { return; }; 
var ToQBArray = null;
/* implicit variables: */ 
   var qbArray = QB.initArray([{l:0,u: a.length}], 0);  /* SINGLE */ 
   var i = 0;  /* INTEGER */ 
   var ___v6924219 = 0; ___l4633799: for ( i=  1; (1 > 0) ? ( i <=  a.length) : ( i >=  a.length);  i+=1) { if (QB.halted()) { return; } ___v6924219++;   if (___v6924219 % 100 == 0) { await QB.autoLimit(); }
      QB.arrayValue(qbArray, [ i]).value =  a[i - 1];
   } 
   ToQBArray =  qbArray;
return ToQBArray;
}
async function func_PrepareCallback(fn/*FUNCTION*/) {
if (QB.halted()) { return; }; 
var PrepareCallback = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    var fs = fn.toString();
    var pstart = fs.indexOf("(")
    var pend = fs.indexOf(")")
    var paramstr = fs.substring(pstart+1, pend-1);
    var params = paramstr.split(",");
    for (var i=0; i < params.length; i++) {
        var idx = params[i].indexOf("/");
        params[i] = params[i].substring(0, idx);
    }
    var bstart = fs.indexOf("{");
    var bend = fs.lastIndexOf("}");
    var body = fs.substring(bstart+1, bend-1);
    if      (params.length == 1) { return new Function(params[0], body); }
    else if (params.length == 2) { return new Function(params[0], params[1], body); }
    else if (params.length == 3) { return new Function(params[0], params[1], params[2], body); }
    else if (params.length == 4) { return new Function(params[0], params[1], params[2], params[3], body); }
//-------- END JS native code block --------
return PrepareCallback;
}
return {
func_At: func_At,
sub_Clear: sub_Clear,
func_Concat: func_Concat,
func_Create: func_Create,
func_Every: func_Every,
func_Fill: func_Fill,
func_Filter: func_Filter,
func_IndexOf: func_IndexOf,
sub_Insert: sub_Insert,
func_Item: func_Item,
func_IsJSArray: func_IsJSArray,
func_IsQBArray: func_IsQBArray,
func_Join: func_Join,
func_LastIndexOf: func_LastIndexOf,
func_Length: func_Length,
func_Pop: func_Pop,
sub_Add: sub_Push,
sub_Push: sub_Push,
func_Reduce: func_Reduce,
func_ReduceRight: func_ReduceRight,
sub_Remove: sub_Remove,
sub_Reverse: sub_Reverse,
func_Shift: func_Shift,
func_Slice: func_Slice,
sub_Sort: sub_Sort,
sub_Splice: sub_Splice,
sub_Unshift: sub_Unshift,
func_ToQBArray: func_ToQBArray,
};
}
async function __qblib_lib_lang_system_bas() {
/* global constants: */ 
/* shared variables: */ 
/* static method variables: */ 

async function main() {

/* implicit variables: */ 
/* implicit variables: */ 
} await main();

async function func_Await(fn/*SINGLE*/,thisArg/*SINGLE*/) {
if (QB.halted()) { return; }; 
var Await = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    return await fn.apply(thisArg, Array.prototype.slice.call(arguments, 2));
//-------- END JS native code block --------
return Await;
}
async function sub_Await(fn/*SINGLE*/,thisArg/*SINGLE*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    await fn.apply(thisArg, Array.prototype.slice.call(arguments, 2));
//-------- END JS native code block --------
}
async function func_Call(fn/*SINGLE*/,thisArg/*SINGLE*/) {
if (QB.halted()) { return; }; 
var Call = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    return fn.apply(thisArg, Array.prototype.slice.call(arguments, 2));
//-------- END JS native code block --------
return Call;
}
async function sub_Call(fn/*SINGLE*/,thisArg/*SINGLE*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    fn.apply(thisArg, Array.prototype.slice.call(arguments, 2));
//-------- END JS native code block --------
}
async function func_Construct(className/*SINGLE*/,thisArg/*SINGLE*/) {
if (QB.halted()) { return; }; 
var Construct = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    if (thisArg == undefined) { thisArg = globalThis; }
    return Reflect.construct(thisArg[className], Array.prototype.slice.call(arguments, 2));
//-------- END JS native code block --------
return Construct;
}
async function func_TypeOf(o/*SINGLE*/) {
if (QB.halted()) { return; }; 
var TypeOf = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    return typeof o;
//-------- END JS native code block --------
return TypeOf;
}
async function func_IsRunning() {
if (QB.halted()) { return; }; 
var IsRunning = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    return QB.toBoolean(QB.running());
//-------- END JS native code block --------
return IsRunning;
}
async function sub_SetTimeout(fnCallback/*SUB*/,millis/*INTEGER*/) {
if (QB.halted()) { return; }; millis = Math.round(millis); 
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
        setTimeout(fnCallback, millis);
//-------- END JS native code block --------
}
async function func_TimeInMillis() {
if (QB.halted()) { return; }; 
var TimeInMillis = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    return Date.now();
//-------- END JS native code block --------
return TimeInMillis;
}
async function func_ToInteger(value/*SINGLE*/) {
if (QB.halted()) { return; }; 
var ToInteger = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    var result = parseInt(value);
    if (isNaN(result)) {
        result = 0;
    }
    return result;
//-------- END JS native code block --------
return ToInteger;
}
async function func_ToFloat(value/*SINGLE*/) {
if (QB.halted()) { return; }; 
var ToFloat = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    var result = parseFloat(value);
    if (isNaN(result)) {
        result = 0;
    }
    return result;
//-------- END JS native code block --------
return ToFloat;
}
async function func_ToBoolean(value/*SINGLE*/) {
if (QB.halted()) { return; }; 
var ToBoolean = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    return value ? -1 : 0;
//-------- END JS native code block --------
return ToBoolean;
}
async function func_ToString(value/*SINGLE*/) {
if (QB.halted()) { return; }; 
var ToString = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    return `${value}`;
//-------- END JS native code block --------
return ToString;
}
return {
sub_Await: sub_Await,
func_Await: func_Await,
sub_Call: sub_Call,
func_Call: func_Call,
func_Construct: func_Construct,
func_IsRunning: func_IsRunning,
sub_SetTimeout: sub_SetTimeout,
func_TypeOf: func_TypeOf,
func_TimeInMillis: func_TimeInMillis,
func_ToFloat: func_ToFloat,
func_ToInteger: func_ToInteger,
func_ToBoolean: func_ToBoolean,
func_ToString: func_ToString,
};
}
async function __qblib_lib_lang_string_bas() {
var Sys = await __qblib_lib_lang_system_bas();
var JSArray = await __qblib_lib_lang_array_bas();
/* global constants: */ 
/* shared variables: */ 
/* static method variables: */ 

async function main() {

/* implicit variables: */ 
/* implicit variables: */ 
} await main();

async function func_EndsWith(s/*STRING*/,searchStr/*STRING*/) {
if (QB.halted()) { return; }; 
var EndsWith = null;
/* implicit variables: */ 
   s = (await Sys.func_ToString(  s));
   EndsWith = (await Sys.func_ToBoolean( (await Sys.func_Call(  s.endsWith,    s,    searchStr))));
return EndsWith;
}
async function func_FormatUsing() {
if (QB.halted()) { return; }; 
var FormatUsing = null;
/* implicit variables: */ 
   //-------- BEGIN JS native code block --------
    return QB.formatUsing.apply(QB, arguments);
//-------- END JS native code block --------
return FormatUsing;
}
async function func_Includes(s/*STRING*/,searchStr/*STRING*/) {
if (QB.halted()) { return; }; 
var Includes = null;
/* implicit variables: */ 
   s = (await Sys.func_ToString(  s));
   Includes = (await Sys.func_ToBoolean( (await Sys.func_Call(  s.includes,    s,    searchStr))));
return Includes;
}
async function func_Match(s/*STRING*/,regex/*STRING*/,g/*OBJECT*/) {
if (QB.halted()) { return; }; 
var Match = null;
/* implicit variables: */ 
   s = (await Sys.func_ToString(  s));
   var jsresult = {};  /* OBJECT */ 
   //-------- BEGIN JS native code block --------
        if (g == undefined) { g = 0; }
        jsresult = [];
        var matches = s.matchAll(new RegExp(regex, "g"));
        for (m of matches) {
            var value = null;
            if (typeof g == "string") { value = m.groups[g]; }
            else { value = m[g]; }
            if (value) { jsresult.push(value); }
        }
//-------- END JS native code block --------
   Match = (await JSArray.func_ToQBArray(  jsresult));
return Match;
}
async function sub_Match(s/*STRING*/,regex/*STRING*/,result/*STRING*/,g/*OBJECT*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   s = (await Sys.func_ToString(  s));
   result = (await func_Match(  s,    regex,    g));
}
async function func_PadEnd(s/*STRING*/,targetLength/*INTEGER*/,padStr/*STRING*/) {
if (QB.halted()) { return; }; targetLength = Math.round(targetLength); 
var PadEnd = null;
/* implicit variables: */ 
   s = (await Sys.func_ToString(  s));
   PadEnd = (await Sys.func_Call(  s.padEnd,    s,    targetLength,    padStr));
return PadEnd;
}
async function func_PadStart(s/*STRING*/,targetLength/*INTEGER*/,padStr/*STRING*/) {
if (QB.halted()) { return; }; targetLength = Math.round(targetLength); 
var PadStart = null;
/* implicit variables: */ 
   s = (await Sys.func_ToString(  s));
   PadStart = (await Sys.func_Call(  s.padStart,    s,    targetLength,    padStr));
return PadStart;
}
async function func_Replace(s/*STRING*/,searchStr/*STRING*/,replaceStr/*STRING*/,regex/*INTEGER*/) {
if (QB.halted()) { return; }; regex = Math.round(regex); 
var Replace = null;
/* implicit variables: */ 
   s = (await Sys.func_ToString(  s));
   if ( regex) {
      Replace = (await Sys.func_Call(  s.replace,    s,   (await Sys.func_Construct( "RegExp" , undefined,    searchStr,   "g")) ,    replaceStr));
   } else {
      Replace = (await Sys.func_Call(  s.replaceAll,    s,    searchStr,    replaceStr));
   }
return Replace;
}
async function func_Search(s/*STRING*/,regex/*STRING*/) {
if (QB.halted()) { return; }; 
var Search = null;
/* implicit variables: */ 
   s = (await Sys.func_ToString(  s));
   Search = (await Sys.func_Call(  s.search,    s,   (await Sys.func_Construct( "RegExp" , undefined,    regex,   "g"))))  +  1;
return Search;
}
async function func_Split(s/*STRING*/,delimiter/*STRING*/,regex/*INTEGER*/) {
if (QB.halted()) { return; }; regex = Math.round(regex); 
var Split = null;
/* implicit variables: */ 
   s = (await Sys.func_ToString(  s));
   if ( delimiter ==   undefined) {
      delimiter = ",";
   }
   var jsresult = {};  /* OBJECT */ 
   if ( regex) {
      jsresult = (await Sys.func_Call(  s.split,    s,   (await Sys.func_Construct( "RegExp" , undefined,    delimiter,   "g"))));
   } else {
      jsresult = (await Sys.func_Call(  s.split,    s,    delimiter));
   }
   Split = (await JSArray.func_ToQBArray(  jsresult));
return Split;
}
async function sub_Split(s/*STRING*/,delimiter/*STRING*/,result/*STRING*/,regex/*INTEGER*/) {
if (QB.halted()) { return; }; regex = Math.round(regex); 
/* implicit variables: */ 
   var temp = QB.initArray([{l:0,u: 0}], 0);  /* SINGLE */ 
   temp = (await func_Split(  s,    delimiter,    regex));
   var i = 0;  /* INTEGER */ 
   QB.resizeArray(result, [{l:0,u:(QB.func_UBound(  temp))}], 0, false);  /* SINGLE */ 
   var ___v6304556 = 0; ___l6800396: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  temp))) : ( i >= (QB.func_UBound(  temp)));  i+=1) { if (QB.halted()) { return; } ___v6304556++;   if (___v6304556 % 100 == 0) { await QB.autoLimit(); }
      QB.arrayValue(result, [ i]).value = QB.arrayValue(temp, [ i]).value;
   } 
}
async function func_StartsWith(s/*STRING*/,searchStr/*STRING*/) {
if (QB.halted()) { return; }; 
var StartsWith = null;
/* implicit variables: */ 
   s = (await Sys.func_ToString(  s));
   StartsWith = (await Sys.func_ToBoolean( (await Sys.func_Call(  s.startsWith,    s,    searchStr))));
return StartsWith;
}
async function func_Trim(s/*STRING*/) {
if (QB.halted()) { return; }; 
var Trim = null;
/* implicit variables: */ 
   s = (await Sys.func_ToString(  s));
   Trim = (await Sys.func_Call(  s.trim,    s));
return Trim;
}
async function func_TrimEnd(s/*STRING*/) {
if (QB.halted()) { return; }; 
var TrimEnd = null;
/* implicit variables: */ 
   s = (await Sys.func_ToString(  s));
   TrimEnd = (await Sys.func_Call(  s.trimEnd,    s));
return TrimEnd;
}
async function func_TrimStart(s/*STRING*/) {
if (QB.halted()) { return; }; 
var TrimStart = null;
/* implicit variables: */ 
   s = (await Sys.func_ToString(  s));
   TrimStart = (await Sys.func_Call(  s.trimStart,    s));
return TrimStart;
}
return {
func_FormatUsing: func_FormatUsing,
func_EndsWith: func_EndsWith,
func_Includes: func_Includes,
sub_Match: sub_Match,
func_Match: func_Match,
func_PadEnd: func_PadEnd,
func_PadStart: func_PadStart,
func_Replace: func_Replace,
func_Search: func_Search,
sub_Split: sub_Split,
func_Split: func_Split,
func_StartsWith: func_StartsWith,
func_Trim: func_Trim,
func_TrimEnd: func_TrimEnd,
func_TrimStart: func_TrimStart,
};
}
if (typeof QB == 'undefined' && module) { QB = require('./qb-console.js').QB(); }
async function _QBCompiler() {
var FS = await __qblib_lib_io_fs_bas();
var OBJ = await __qblib_lib_lang_object_bas();
var JSArray = await __qblib_lib_lang_array_bas();
var String = await __qblib_lib_lang_string_bas();
/* global constants: */ const FILE =    1; const TEXT =    2; const MWARNING =    0; const MERROR =    1; const False =    0; const True =   ~ False; const LF =   (QB.func_Chr(  10)); const CR =   (QB.func_Chr(  13)); const CRLF =    CR +  LF; const PrintDataTypes =    True; const PrintLineMapping =    False; const PrintTokenizedLine =    False; 
/* shared variables: */ var moduleMap = QB.initArray([0], {name:'',path:'',source:'',exportMethods:{},exportConsts:{},imports:{},processed:0}); var modules = QB.initArray([0], {name:'',path:'',source:'',exportMethods:{},exportConsts:{},imports:{},processed:0}); var lines = QB.initArray([0], {line:0,text:'',mtype:0,moduleId:0,module:0}); var jsLines = QB.initArray([0], {line:0,text:'',mtype:0,moduleId:0,module:0}); var methods = QB.initArray([0], {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0}); var localMethods = QB.initArray([0], {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0}); var types = QB.initArray([0], {line:0,name:'',argc:0,args:''}); var typeVars = QB.initArray([0], {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0}); var globalVars = QB.initArray([0], {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0}); var localVars = QB.initArray([0], {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0}); var warnings = QB.initArray([0], {line:0,text:'',mtype:0,moduleId:0,module:0}); var importLines = QB.initArray([0], ''); var exportLines = QB.initArray([0], ''); var exportConsts = QB.initArray([0], {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0}); var exportMethods = QB.initArray([0], {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0}); var dataArray = QB.initArray([0], ''); var dataLabels = QB.initArray([0], {text:'',index:0}); var includeOnceMap = QB.initArray([0], 0); var jsReservedWords = QB.initArray([0], ''); var modLevel = 0; var currentMethod = ''; var activeModule = {name:'',path:'',source:'',exportMethods:{},exportConsts:{},imports:{},processed:0}; var currentModule = ''; var currentModuleId = 0; var programMethods = 0; var constVarLine = 0; var sharedVarLine = 0; var staticVarLine = 0; var implicitVarLine = 0; var condWords = QB.initArray([0], ''); var forceSelfConvert = 0; var optionExplicit = 0; var optionExplicitArray = 0; var codeLabels = QB.initArray([0], {text:'',index:0}); var errHandlers = QB.initArray([0], ''); var refLabels = QB.initArray([0], ''); var onErrorMode = 0; var errRegLine = 0; var errCopyMode = 0; var gotoMode = 0; var qbNames = 0; var debugMode = 0; var debugLastLine = 0; var debugScope = ''; var debugScopes = ''; var debugInfoLine = 0; var gotoIsMain = 0; var gotoOpenLine = 0; var gotoLabels = QB.initArray([0], ''); var gotoDefined = QB.initArray([0], 0); var gotoUseLine = QB.initArray([0], 0); var deferredJS = QB.initArray([0], {line:0,text:'',mtype:0,moduleId:0,module:0}); 
/* static method variables: */ 

async function main() {

/* implicit variables: */ 
   QB.resizeArray(moduleMap, [], {name:'',path:'',source:'',exportMethods:{},exportConsts:{},imports:{},processed:0}, false);  /* MODULE */ 
   QB.resizeArray(modules, [{l:0,u: 0}], {name:'',path:'',source:'',exportMethods:{},exportConsts:{},imports:{},processed:0}, false);  /* MODULE */ 
   QB.resizeArray(lines, [{l:0,u: 0}], {line:0,text:'',mtype:0,moduleId:0,module:0}, false);  /* CODELINE */ 
   QB.resizeArray(jsLines, [{l:0,u: 0}], {line:0,text:'',mtype:0,moduleId:0,module:0}, false);  /* CODELINE */ 
   QB.resizeArray(methods, [{l:0,u: 0}], {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0}, false);  /* METHOD */ 
   QB.resizeArray(localMethods, [{l:0,u: 0}], {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0}, false);  /* METHOD */ 
   QB.resizeArray(types, [{l:0,u: 0}], {line:0,name:'',argc:0,args:''}, false);  /* QBTYPE */ 
   QB.resizeArray(typeVars, [{l:0,u: 0}], {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0}, false);  /* VARIABLE */ 
   QB.resizeArray(globalVars, [{l:0,u: 0}], {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0}, false);  /* VARIABLE */ 
   QB.resizeArray(localVars, [{l:0,u: 0}], {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0}, false);  /* VARIABLE */ 
   QB.resizeArray(warnings, [{l:0,u: 0}], {line:0,text:'',mtype:0,moduleId:0,module:0}, false);  /* CODELINE */ 
   QB.resizeArray(importLines, [{l:0,u: 0}], '', false);  /* STRING */ 
   QB.resizeArray(exportLines, [{l:0,u: 0}], '', false);  /* STRING */ 
   QB.resizeArray(exportConsts, [{l:0,u: 0}], {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0}, false);  /* VARIABLE */ 
   QB.resizeArray(exportMethods, [{l:0,u: 0}], {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0}, false);  /* METHOD */ 
   QB.resizeArray(dataArray, [{l:0,u: 0}], '', false);  /* STRING */ 
   QB.resizeArray(dataLabels, [{l:0,u: 0}], {text:'',index:0}, false);  /* LABEL */ 
   QB.resizeArray(includeOnceMap, [], 0, false);  /* INTEGER */ 
   QB.resizeArray(jsReservedWords, [{l:0,u: 55}], '', false);  /* STRING */ 
   modLevel = 0;  /* INTEGER */ 
   currentMethod = '';  /* STRING */ 
   activeModule = {name:'',path:'',source:'',exportMethods:{},exportConsts:{},imports:{},processed:0};  /* MODULE */ 
   currentModule = '';  /* STRING */ 
   currentModuleId = 0;  /* INTEGER */ 
   programMethods = 0;  /* INTEGER */ 
   constVarLine = 0;  /* INTEGER */ 
   sharedVarLine = 0;  /* INTEGER */ 
   staticVarLine = 0;  /* INTEGER */ 
   implicitVarLine = 0;  /* INTEGER */ 
   QB.resizeArray(condWords, [{l:0,u: 4}], '', false);  /* STRING */ 
   forceSelfConvert = 0;  /* INTEGER */ 
   optionExplicit = 0;  /* INTEGER */ 
   optionExplicitArray = 0;  /* INTEGER */ 
   QB.resizeArray(codeLabels, [{l:0,u: 0}], {text:'',index:0}, false);  /* LABEL */ 
   QB.resizeArray(errHandlers, [{l:0,u: 0}], '', false);  /* STRING */ 
   QB.resizeArray(refLabels, [{l:0,u: 0}], '', false);  /* STRING */ 
   onErrorMode = 0;  /* INTEGER */ 
   errRegLine = 0;  /* INTEGER */ 
   errCopyMode = 0;  /* INTEGER */ 
   gotoMode = 0;  /* INTEGER */ 
   qbNames = 0;  /* INTEGER */ 
   debugMode = 0;  /* INTEGER */ 
   debugLastLine = 0;  /* INTEGER */ 
   debugScope = '';  /* STRING */ 
   debugScopes = '';  /* STRING */ 
   debugInfoLine = 0;  /* INTEGER */ 
   gotoIsMain = 0;  /* INTEGER */ 
   gotoOpenLine = 0;  /* INTEGER */ 
   QB.resizeArray(gotoLabels, [{l:0,u: 0}], '', false);  /* STRING */ 
   QB.resizeArray(gotoDefined, [{l:0,u: 0}], 0, false);  /* INTEGER */ 
   QB.resizeArray(gotoUseLine, [{l:0,u: 0}], 0, false);  /* INTEGER */ 
   QB.resizeArray(deferredJS, [{l:0,u: 0}], {line:0,text:'',mtype:0,moduleId:0,module:0}, false);  /* CODELINE */ 
/* implicit variables: */ 
} await main();

async function sub_QBToJS(source/*STRING*/,sourceType/*INTEGER*/,moduleName/*STRING*/) {
if (QB.halted()) { return; }; sourceType = Math.round(sourceType); 
/* implicit variables: */ 
   QB.arrayValue(condWords, [ 1]).value = "IF";
   QB.arrayValue(condWords, [ 2]).value = "ELSEIF";
   QB.arrayValue(condWords, [ 3]).value = "WHILE";
   QB.arrayValue(condWords, [ 4]).value = "UNTIL";
   QB.resizeArray(jsLines, [{l:0,u: 0}], {line:0,text:'',mtype:0,moduleId:0,module:0}, false);  /* CODELINE */ 
   QB.resizeArray(moduleMap, [], {name:'',path:'',source:'',exportMethods:{},exportConsts:{},imports:{},processed:0}, false);  /* MODULE */ 
   QB.resizeArray(includeOnceMap, [], 0, false);  /* INTEGER */ 
   QB.resizeArray(warnings, [{l:0,u: 0}], {line:0,text:'',mtype:0,moduleId:0,module:0}, false);  /* CODELINE */ 
   await sub_RegisterImports(  source);
   var i = 0;  /* INTEGER */ 
   var keys = QB.initArray([{l:0,u: 0}], {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0});  /* METHOD */ 
   var m = {name:'',path:'',source:'',exportMethods:{},exportConsts:{},imports:{},processed:0};  /* MODULE */ 
   keys = (await func_GetMapKeys( await func_SortModules()));
   var ___v5319874 = 0; ___l2269004: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  keys))) : ( i >= (QB.func_UBound(  keys)));  i+=1) { if (QB.halted()) { return; } ___v5319874++;   if (___v5319874 % 100 == 0) { await QB.autoLimit(); }
      m = QB.arrayValue(moduleMap, [QB.arrayValue(keys, [ i]).value]).value;
      activeModule =  m;
      await sub_Compile(  m.source,    m.name);
   } 
   activeModule =  undefined;
   await sub_Compile(  source,   "" ,    forceSelfConvert);
}
async function func_SortModules() {
if (QB.halted()) { return; }; 
var SortModules = null;
/* implicit variables: */ 
   var results = QB.initArray([], {});  /* OBJECT */ 
   var moduleNames = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   moduleNames = (await func_GetMapKeys(  moduleMap));
   var i = 0;  /* INTEGER */ var skipCount = 0;  /* INTEGER */ var lastSkipCount = 0;  /* INTEGER */ 
   skipCount = Math.round( (QB.func_UBound(  moduleNames)) );
   var ___v2788304 = 0; ___l209622: do { if (QB.halted()) { return; }___v2788304++;   if (___v2788304 % 100 == 0) { await QB.autoLimit(); }
      lastSkipCount = Math.round(  skipCount );
      skipCount = Math.round(  0 );
      var ___v1979270 = 0; ___l5183483: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  moduleNames))) : ( i >= (QB.func_UBound(  moduleNames)));  i+=1) { if (QB.halted()) { return; } ___v1979270++;   if (___v1979270 % 100 == 0) { await QB.autoLimit(); }
         var m = {name:'',path:'',source:'',exportMethods:{},exportConsts:{},imports:{},processed:0};  /* MODULE */ 
         m = QB.arrayValue(moduleMap, [QB.arrayValue(moduleNames, [ i]).value]).value;
         if ( m.processed) {
            continue;
         }
         var importCount = 0;  /* INTEGER */ 
         var ikeys = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
         ikeys = (await OBJ.func_Keys(  m.imports));
         importCount = Math.round( (QB.func_UBound(  ikeys)) );
         if ( importCount ==   0) {
            QB.arrayValue(results, [ m.path]).value =  m;
            m.processed = Math.round(  - 1 );
            var k = 0;  /* INTEGER */ 
            var mm = {name:'',path:'',source:'',exportMethods:{},exportConsts:{},imports:{},processed:0};  /* MODULE */ 
            var ___v7473842 = 0; ___l6522939: for ( k=  1; (1 > 0) ? ( k <= (QB.func_UBound(  moduleNames))) : ( k >= (QB.func_UBound(  moduleNames)));  k+=1) { if (QB.halted()) { return; } ___v7473842++;   if (___v7473842 % 100 == 0) { await QB.autoLimit(); }
               mm = QB.arrayValue(moduleMap, [QB.arrayValue(moduleNames, [ k]).value]).value;
               if (~ mm.processed) {
                  if ((await OBJ.func_HasProperty(  mm.imports,    m.path)) ) {
                     await OBJ.sub_RemoveProperty(  mm.imports,    m.path);
                  }
               }
            } 
         } else {
            skipCount = Math.round(  skipCount +  1 );
         }
      } 
   } while (( skipCount > 0 &  lastSkipCount > skipCount))
   if ( skipCount > 0) {
      await sub_AddError(  0,   "Circular import dependency");
   }
   SortModules =  results;
return SortModules;
}
async function sub_Compile(source/*STRING*/,moduleName/*STRING*/,selfConvert/*SINGLE*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   await sub_ResetDataStructures();
   if (~ selfConvert &&  moduleName ==  "" ) {
      qbNames = Math.round(  True );
   } else {
      qbNames = Math.round(  False );
   }
   await sub_ReadLinesFromText(  source);
   await sub_FindMethods();
   programMethods = Math.round( (QB.func_UBound(  methods)) );
   await sub_InitGX();
   await sub_InitQBMethods();
   await sub_InitJSReservedWords();
   var isGX = 0;  /* INTEGER */ 
   isGX = Math.round(  False );
   if ( selfConvert &  moduleName ==  "" ) {
      await sub_AddJSLine(  0,   "if (typeof QB == 'undefined' && module) { QB = require('./qb-console.js').QB(); }");
      await sub_AddJSLine(  0,   "async function _QBCompiler() {");
   }
   if ( moduleName !=  "" ) {
      await sub_AddJSLine(  0,   "async function __qblib_"  +  moduleName + "() {");
   }
   var i = 0;  /* INTEGER */ 
   var ___v6907899 = 0; ___l2750404: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  importLines))) : ( i >= (QB.func_UBound(  importLines)));  i+=1) { if (QB.halted()) { return; } ___v6907899++;   if (___v6907899 % 100 == 0) { await QB.autoLimit(); }
      await sub_AddJSLine(  i,   QB.arrayValue(importLines, [ i]).value);
   } 
   QB.resizeArray(importLines, [{l:0,u: 0}], '', false);  /* STRING */ 
   await sub_AddJSLine(  0,   "/* global constants: */ ");
   constVarLine = Math.round( (QB.func_UBound(  jsLines)) );
   await sub_AddJSLine(  0,   "/* shared variables: */ ");
   sharedVarLine = Math.round( (QB.func_UBound(  jsLines)) );
   await sub_AddJSLine(  0,   "/* static method variables: */ ");
   staticVarLine = Math.round( (QB.func_UBound(  jsLines)) );
   await sub_AddJSLine(  0,   "");
   debugInfoLine = Math.round( (QB.func_UBound(  jsLines)) );
   debugScopes = "";
   debugScope = "";
   await sub_AddJSLine(  0,   "async function main() {");
   if (~ selfConvert &  moduleName ==  "" ) {
      await sub_AddJSLine(  0,   "QB.start();");
   }
   if ( debugMode &&  qbNames) {
      await sub_AddJSLine(  0,   "QB.dbgMain((___x) => eval(___x));");
   }
   if (~ selfConvert &  moduleName ==  "" ) {
      var mtest = {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0};  /* METHOD */ 
      if ((await func_FindMethod( "GXOnGameEvent" ,    mtest,   "SUB" ,    True)) ) {
         await sub_AddJSLine(  0,   "    await GX.registerGameEvents(sub_GXOnGameEvent);");
         isGX = Math.round(  True );
      } else {
         await sub_AddJSLine(  0,   "    await GX.registerGameEvents(function(e){});");
         await sub_AddJSLine(  0,   "    QB.sub_Screen(0);");
      }
   }
   await sub_AddJSLine(  0,   "");
   if (~ selfConvert) {
      await sub_FindErrorHandlers();
   }
   errRegLine = Math.round( (QB.func_UBound(  jsLines)) );
   await sub_InitData();
   var segStart = QB.initArray([{l:0,u: 1}], 0);  /* INTEGER */ var segEnd = QB.initArray([{l:0,u: 1}], 0);  /* INTEGER */ 
   var segCount = 0;  /* INTEGER */ 
   QB.arrayValue(segStart, [ 1]).value = Math.round(  1 );
   QB.arrayValue(segEnd, [ 1]).value = Math.round( await func_MainEnd() );
   segCount = Math.round(  1 );
   var mlist = {};  /* OBJECT */ 
   mlist = await JSArray.func_Create();
   var i = 0;  /* INTEGER */ var j = 0;  /* INTEGER */ var startLine = 0;  /* INTEGER */ var endLine = 0;  /* INTEGER */ 
   var ___v6660608 = 0; ___l1348867: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  methods))) : ( i >= (QB.func_UBound(  methods)));  i+=1) { if (QB.halted()) { return; } ___v6660608++;   if (___v6660608 % 100 == 0) { await QB.autoLimit(); }
      if (QB.arrayValue(methods, [ i]).value .line !=   0) {
         await JSArray.sub_Push(  mlist,   QB.arrayValue(methods, [ i]).value);
      }
   } 
   var pm = {};  /* OBJECT */ var m = {};  /* OBJECT */ 
   var ___v3050709 = 0; ___l6696454: for ( i=  1; (1 > 0) ? ( i <=  mlist.length -  1) : ( i >=  mlist.length -  1);  i+=1) { if (QB.halted()) { return; } ___v3050709++;   if (___v3050709 % 100 == 0) { await QB.autoLimit(); }
      pm = (await JSArray.func_Item(  mlist,    i - 1));
      m = (await JSArray.func_Item(  mlist,    i));
      startLine = Math.round(  pm.lastLine +  1 );
      endLine = Math.round(  m.line -  1 );
      if ( endLine >=  startLine) {
         segCount = Math.round(  segCount +  1 );
         QB.resizeArray(segStart, [{l:0,u: segCount}], 0, true);  /* INTEGER */ QB.resizeArray(segEnd, [{l:0,u: segCount}], 0, true);  /* INTEGER */ 
         QB.arrayValue(segStart, [ segCount]).value = Math.round(  startLine );
         QB.arrayValue(segEnd, [ segCount]).value = Math.round(  endLine );
      }
   } 
   if ( mlist.length > 0) {
      m = (await JSArray.func_Item(  mlist,    mlist.length - 1));
      segCount = Math.round(  segCount +  1 );
      QB.resizeArray(segStart, [{l:0,u: segCount}], 0, true);  /* INTEGER */ QB.resizeArray(segEnd, [{l:0,u: segCount}], 0, true);  /* INTEGER */ 
      QB.arrayValue(segStart, [ segCount]).value = Math.round(  m.lastLine +  1 );
      QB.arrayValue(segEnd, [ segCount]).value = Math.round( (QB.func_UBound(  lines)) );
   }
   var mainGoto = 0;  /* INTEGER */ 
   mainGoto = Math.round(  False );
   if (~ selfConvert) {
      var ___v3103119 = 0; ___l1477568: for ( i=  1; (1 > 0) ? ( i <=  segCount) : ( i >=  segCount);  i+=1) { if (QB.halted()) { return; } ___v3103119++;   if (___v3103119 % 100 == 0) { await QB.autoLimit(); }
         if ((await func_LinesUseGoto( QB.arrayValue(segStart, [ i]).value ,   QB.arrayValue(segEnd, [ i]).value)) ) {
            mainGoto = Math.round(  True );
         }
      } 
   }
   if ( mainGoto) {
      await sub_BeginGotoScope(  True);
   }
   var ___v1448348 = 0; ___l9383081: for ( i=  1; (1 > 0) ? ( i <=  segCount) : ( i >=  segCount);  i+=1) { if (QB.halted()) { return; } ___v1448348++;   if (___v1448348 % 100 == 0) { await QB.autoLimit(); }
      await sub_ConvertLines( QB.arrayValue(segStart, [ i]).value ,   QB.arrayValue(segEnd, [ i]).value ,   "");
   } 
   if ( mainGoto) {
      await sub_EndGotoScope();
   }
   if ( onErrorMode) {
      await sub_AddErrorHandlers( segStart ,   segEnd ,    segCount);
   }
   await sub_FlushDeferredJS();
   if ( debugMode &&  qbNames) {
      debugScopes = (QB.func_Chr(  34))  + (QB.func_Chr(  34))  + ": { name: "  + (QB.func_Chr(  34))  + "Main program"  + (QB.func_Chr(  34))  + ", vars: [].concat("  + (await func_DebugVarList( globalVars))  + ", "  + (await func_DebugVarList( localVars))  + ") }";
   }
   if (~ selfConvert & ~ isGX &  moduleName ==  "" ) {
      await sub_AddJSLine(  0,   "QB.end();");
   }
   await sub_AddJSLine(  0,   "} await main();");
   await sub_ConvertMethods();
   if ( debugMode &&  qbNames) {
      QB.arrayValue(jsLines, [ debugInfoLine]).value .text = "QB.dbgScopes({ "  +  debugScopes + " });";
   }
   if (~ selfConvert &  moduleName ==  "" ) {
      await sub_InitTypes();
   }
   if ( selfConvert) {
      await sub_AddJSLine(  0,   "async function compile(src, debug) {");
      await sub_AddJSLine(  0,   "   await sub_SetDebugMode(debug ? -1 : 0);");
      await sub_AddJSLine(  0,   "   await sub_QBToJS(src, TEXT, '');");
      await sub_AddJSLine(  0,   "   var js = '';");
      await sub_AddJSLine(  0,   "   for (var i=1; i<= QB.func_UBound(jsLines); i++) {");
      if ( PrintLineMapping) {
         await sub_AddJSLine(  0,   "      js += '/* ' + i + ':' + this.getSourceLine(i) + ' */ ' + QB.arrayValue(jsLines, [i]).value.text + '\\n';");
      } else {
         await sub_AddJSLine(  0,   "      js += QB.arrayValue(jsLines, [i]).value.text + '\\n';");
      }
      await sub_AddJSLine(  0,   "   }");
      await sub_AddJSLine(  0,   "   return js;");
      await sub_AddJSLine(  0,   "}");
      await sub_AddJSLine(  0,   "function getWarnings() {");
      await sub_AddJSLine(  0,   "   var w = [];");
      await sub_AddJSLine(  0,   "   for (var i=1; i <= QB.func_UBound(warnings); i++) {");
      await sub_AddJSLine(  0,   "      w.push({");
      await sub_AddJSLine(  0,   "         line: QB.arrayValue(warnings, [i]).value.line,");
      await sub_AddJSLine(  0,   "         text: QB.arrayValue(warnings, [i]).value.text,");
      await sub_AddJSLine(  0,   "         mtype: QB.arrayValue(warnings, [i]).value.mtype,");
      await sub_AddJSLine(  0,   "         moduleId: QB.arrayValue(warnings, [i]).value.moduleId,");
      await sub_AddJSLine(  0,   "         module: QB.arrayValue(warnings, [i]).value.module,");
      await sub_AddJSLine(  0,   "      });");
      await sub_AddJSLine(  0,   "   }");
      await sub_AddJSLine(  0,   "   return w;");
      await sub_AddJSLine(  0,   "}");
      await sub_AddJSLine(  0,   "function _getMethods(methods) {");
      await sub_AddJSLine(  0,   "   var m = [];");
      await sub_AddJSLine(  0,   "   for (var i=1; i <= QB.func_UBound(methods); i++) {");
      await sub_AddJSLine(  0,   "      var lidx = QB.arrayValue(methods, [i]).value.line;");
      await sub_AddJSLine(  0,   "      m.push({");
      await sub_AddJSLine(  0,   "         line: QB.arrayValue(lines, [lidx]).value.line,");
      await sub_AddJSLine(  0,   "         type: QB.arrayValue(methods, [i]).value.type,");
      await sub_AddJSLine(  0,   "         returnType: QB.arrayValue(methods, [i]).value.returnType,");
      await sub_AddJSLine(  0,   "         name: QB.arrayValue(methods, [i]).value.name,");
      await sub_AddJSLine(  0,   "         uname: QB.arrayValue(methods, [i]).value.uname,");
      await sub_AddJSLine(  0,   "         jsname: QB.arrayValue(methods, [i]).value.jsname,");
      await sub_AddJSLine(  0,   "         argc: QB.arrayValue(methods, [i]).value.argc,");
      await sub_AddJSLine(  0,   "         args: QB.arrayValue(methods, [i]).value.args");
      await sub_AddJSLine(  0,   "      });");
      await sub_AddJSLine(  0,   "   }");
      await sub_AddJSLine(  0,   "   return m;");
      await sub_AddJSLine(  0,   "}");
      await sub_AddJSLine(  0,   "function getMethods() { return _getMethods(methods); }");
      await sub_AddJSLine(  0,   "function getExportMethods() { return _getMethods(exportMethods); }");
      await sub_AddJSLine(  0,   "function getExportConsts() {");
      await sub_AddJSLine(  0,   "   var c = [];");
      await sub_AddJSLine(  0,   "   for (var i=1; i <= QB.func_UBound(exportConsts); i++) {");
      await sub_AddJSLine(  0,   "      c.push({");
      await sub_AddJSLine(  0,   "         name: QB.arrayValue(exportConsts, [i]).value.name,");
      await sub_AddJSLine(  0,   "         jsname: QB.arrayValue(exportConsts, [i]).value.jsname");
      await sub_AddJSLine(  0,   "      });");
      await sub_AddJSLine(  0,   "   }");
      await sub_AddJSLine(  0,   "   return c;");
      await sub_AddJSLine(  0,   "}");
      await sub_AddJSLine(  0,   "function getSourceLine(jsLine) {");
      await sub_AddJSLine(  0,   "   if (jsLine == 0) { return 0; }");
      await sub_AddJSLine(  0,   "   var line = QB.arrayValue(jsLines, [jsLine]).value.line;");
      await sub_AddJSLine(  0,   "   line = QB.arrayValue(lines, [line]).value.line;");
      await sub_AddJSLine(  0,   "   return line;");
      await sub_AddJSLine(  0,   "}");
      await sub_AddJSLine(  0,   "function getModule(id) {");
      await sub_AddJSLine(  0,   "   return QB.arrayValue(modules, [id]).value;");
      await sub_AddJSLine(  0,   "}");
      await sub_AddJSLine(  0,   "function setSelfConvert() { sub_SetSelfConvert(); }");
      await sub_AddJSLine(  0,   "");
      await sub_AddJSLine(  0,   "return {");
      await sub_AddJSLine(  0,   "   compile: compile,");
      await sub_AddJSLine(  0,   "   getWarnings: getWarnings,");
      await sub_AddJSLine(  0,   "   getMethods: getMethods,");
      await sub_AddJSLine(  0,   "   getExportMethods: getExportMethods,");
      await sub_AddJSLine(  0,   "   getExportConsts: getExportConsts,");
      await sub_AddJSLine(  0,   "   getSourceLine: getSourceLine,");
      await sub_AddJSLine(  0,   "   getModule: getModule,");
      await sub_AddJSLine(  0,   "   setSelfConvert: setSelfConvert,");
      await sub_AddJSLine(  0,   "};");
      await sub_AddJSLine(  0,   "}");
      await sub_AddJSLine(  0,   "if (typeof module != 'undefined') { module.exports.QBCompiler = _QBCompiler; }");
   } else if ( moduleName !=  "" ) {
      await sub_AddJSLine(  0,   "}");
   }
}
async function sub_SetSelfConvert() {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   forceSelfConvert = Math.round(  True );
}
async function sub_InitTypes() {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   var i = 0;  /* INTEGER */ var j = 0;  /* INTEGER */ var jsidx = 0;  /* INTEGER */ 
   var typestr = '';  /* STRING */ 
   typestr = "{ ";
   var ___v2417220 = 0; ___l9412093: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  jsLines))) : ( i >= (QB.func_UBound(  jsLines)));  i+=1) { if (QB.halted()) { return; } ___v2417220++;   if (___v2417220 % 100 == 0) { await QB.autoLimit(); }
      if (QB.arrayValue(jsLines, [ i]).value .text ==  "QB.start();" ) {
         jsidx = Math.round(  i );
         break ___l9412093;
      }
   } 
   var ___v8893418 = 0; ___l4587751: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  types))) : ( i >= (QB.func_UBound(  types)));  i+=1) { if (QB.halted()) { return; } ___v8893418++;   if (___v8893418 % 100 == 0) { await QB.autoLimit(); }
      typestr =  typestr + QB.arrayValue(types, [ i]).value .name + ":[";
      var idx = 0;  /* INTEGER */ 
      idx = Math.round(  0 );
      var ___v1986333 = 0; ___l399634: for ( j=  1; (1 > 0) ? ( j <= (QB.func_UBound(  typeVars))) : ( j >= (QB.func_UBound(  typeVars)));  j+=1) { if (QB.halted()) { return; } ___v1986333++;   if (___v1986333 % 100 == 0) { await QB.autoLimit(); }
         if (QB.arrayValue(typeVars, [ j]).value .typeId ==   i) {
            if ( idx > 0) {
               typestr =  typestr + ", ";
            }
            typestr =  typestr + "{ name: '"  + QB.arrayValue(typeVars, [ j]).value .name + "', type: '"  + QB.arrayValue(typeVars, [ j]).value .type + "'";
            if (QB.arrayValue(typeVars, [ j]).value .fixedLen !=  "" ) {
               typestr =  typestr + ", len: "  + (await func_ConvertExpression( QB.arrayValue(typeVars, [ j]).value .fixedLen,    0));
            }
            typestr =  typestr + " }";
            idx = Math.round(  idx +  1 );
         }
      } 
      typestr =  typestr + "]";
      if ( i <(QB.func_UBound(  types)) ) {
         typestr =  typestr + ", ";
      }
   } 
   typestr =  typestr + "}";
   QB.arrayValue(jsLines, [ jsidx]).value .text = QB.arrayValue(jsLines, [ jsidx]).value .text + " QB.setTypeMap("  +  typestr + ");";
}
async function sub_ResetDataStructures() {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   QB.resizeArray(lines, [{l:0,u: 0}], {line:0,text:'',mtype:0,moduleId:0,module:0}, false);  /* CODELINE */ 
   QB.resizeArray(methods, [{l:0,u: 0}], {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0}, false);  /* METHOD */ 
   QB.resizeArray(types, [{l:0,u: 0}], {line:0,name:'',argc:0,args:''}, false);  /* QBTYPE */ 
   QB.resizeArray(typeVars, [{l:0,u: 0}], {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0}, false);  /* VARIABLE */ 
   QB.resizeArray(globalVars, [{l:0,u: 0}], {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0}, false);  /* VARIABLE */ 
   QB.resizeArray(localVars, [{l:0,u: 0}], {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0}, false);  /* VARIABLE */ 
   QB.resizeArray(dataArray, [{l:0,u: 0}], '', false);  /* STRING */ 
   QB.resizeArray(dataLabels, [{l:0,u: 0}], {text:'',index:0}, false);  /* LABEL */ 
   QB.resizeArray(modules, [{l:0,u: 0}], {name:'',path:'',source:'',exportMethods:{},exportConsts:{},imports:{},processed:0}, false);  /* MODULE */ 
   QB.resizeArray(exportMethods, [{l:0,u: 0}], {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0}, false);  /* METHOD */ 
   QB.resizeArray(exportConsts, [{l:0,u: 0}], {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0}, false);  /* VARIABLE */ 
   currentMethod = "";
   programMethods = Math.round(  0 );
   staticVarLine = Math.round(  0 );
   optionExplicit = Math.round(  False );
   optionExplicitArray = Math.round(  False );
   QB.resizeArray(codeLabels, [{l:0,u: 0}], {text:'',index:0}, false);  /* LABEL */ 
   QB.resizeArray(errHandlers, [{l:0,u: 0}], '', false);  /* STRING */ 
   QB.resizeArray(refLabels, [{l:0,u: 0}], '', false);  /* STRING */ 
   onErrorMode = Math.round(  False );
   errCopyMode = Math.round(  False );
   errRegLine = Math.round(  0 );
   gotoMode = Math.round(  False );
   QB.resizeArray(deferredJS, [{l:0,u: 0}], {line:0,text:'',mtype:0,moduleId:0,module:0}, false);  /* CODELINE */ 
}
async function sub_InitData() {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   if ((QB.func_UBound(  dataArray))  < 1) {
      return;
   }
   var ds = '';  /* STRING */ 
   ds = "["  + (await func_Join( dataArray ,    1,    - 1,   ","))  + "]";
   await sub_AddJSLine(  0,   "QB.setData("  +  ds + ");");
   var i = 0;  /* INTEGER */ 
   var ___v8086727 = 0; ___l785196: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  dataLabels))) : ( i >= (QB.func_UBound(  dataLabels)));  i+=1) { if (QB.halted()) { return; } ___v8086727++;   if (___v8086727 % 100 == 0) { await QB.autoLimit(); }
      await sub_AddJSLine(  0,   "QB.setDataLabel('"  + QB.arrayValue(dataLabels, [ i]).value .text + "', "  + (QB.func_Str( QB.arrayValue(dataLabels, [ i]).value .index))  + ");");
   } 
}
async function sub_PrintJS() {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   var i = 0;  /* INTEGER */ 
   var ___v2367710 = 0; ___l1962776: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  jsLines))) : ( i >= (QB.func_UBound(  jsLines)));  i+=1) { if (QB.halted()) { return; } ___v2367710++;   if (___v2367710 % 100 == 0) { await QB.autoLimit(); }
      await QB.sub_Print([QB.arrayValue(jsLines, [ i]).value .text]);
   } 
}
async function sub_ConvertLines(firstLine/*INTEGER*/,lastLine/*INTEGER*/,functionName/*STRING*/) {
if (QB.halted()) { return; }; firstLine = Math.round(firstLine); lastLine = Math.round(lastLine); 
/* implicit variables: */ 
   var typeMode = 0;  /* INTEGER */ 
   typeMode = Math.round(  False );
   var jsMode = 0;  /* INTEGER */ 
   jsMode = Math.round(  False );
   var ignoreMode = 0;  /* INTEGER */ 
   ignoreMode = Math.round(  False );
   var i = 0;  /* INTEGER */ var j = 0;  /* INTEGER */ 
   var indent = 0;  /* INTEGER */ 
   var tempIndent = 0;  /* INTEGER */ 
   var m = {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0};  /* METHOD */ 
   var totalIndent = 0;  /* INTEGER */ 
   totalIndent = Math.round(  1 );
   var containers = QB.initArray([{l:0,u: 10000}], {mode:0,type:'',label:'',line:0,caseCount:0,caseVar:'',everyCase:0,gTop:0,gEnd:0,gNext:0,gCont:0,gVar:'',gStep:''});  /* CONTAINER */ 
   var cindex = 0;  /* INTEGER */ 
   var caseVar = '';  /* STRING */ 
   var currType = 0;  /* INTEGER */ 
   var loopIndex = '';  /* STRING */ 
   var sfix = '';  /* STRING */ 
   var ctype = '';  /* STRING */ 
   debugLastLine = Math.round(  0 );
   await sub_AddJSLine(  firstLine,   "/* implicit variables: */ ");
   implicitVarLine = Math.round( (QB.func_UBound(  jsLines)) );
   var hli = 0;  /* INTEGER */ 
   var ___v293531 = 0; ___l6928664: for ( i=  firstLine; (1 > 0) ? ( i <=  lastLine) : ( i >=  lastLine);  i+=1) { if (QB.halted()) { return; } ___v293531++;   if (___v293531 % 100 == 0) { await QB.autoLimit(); }
      indent = Math.round(  0 );
      tempIndent = Math.round(  0 );
      if ( gotoMode) {
         var ___v1198679 = 0; ___l5930740: for ( hli=  1; (1 > 0) ? ( hli <= (QB.func_UBound(  codeLabels))) : ( hli >= (QB.func_UBound(  codeLabels)));  hli+=1) { if (QB.halted()) { return; } ___v1198679++;   if (___v1198679 % 100 == 0) { await QB.autoLimit(); }
            if (QB.arrayValue(codeLabels, [ hli]).value .index ==   i) {
               await sub_AddJSLine(  i,   (await func_DefineGotoLabel( QB.arrayValue(codeLabels, [ hli]).value .text,    i)));
            }
         } 
      }
      var l = '';  /* STRING */ 
      l = (await String.func_Trim( QB.arrayValue(lines, [ i]).value .text));
      if ((QB.func_Left(  l,    1))  ==  "?"  & (QB.func_Mid(  l,    2,    1))  !=  " " ) {
         l = "Print "  + (QB.func_Mid(  l,    2));
      }
      if ((QB.func_UCase( (QB.func_Left(  l,    5))))  ==  "MID$(" ) {
         l = (QB.func_Left(  l,    4))  + " "  + (QB.func_Mid(  l,    5));
      }
      var parts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
      var c = 0;  /* INTEGER */ 
      c = Math.round( (await func_SLSplit(  l,   parts ,    True)) );
      if ( c < 1) {
         continue;
      }
      if ( PrintTokenizedLine) {
         await sub_AddJSLine(  0,   "//// "  + (await func_Join( parts ,    1,    -  1,   "|")));
      }
      var js = '';  /* STRING */ 
      js = "";
      var first = '';  /* STRING */ 
      first = (QB.func_UCase( QB.arrayValue(parts, [ 1]).value));
      sfix = (await func_FixCondition(  first,   parts ,    1,   ""));
      if ( sfix !=  "" ) {
         first =  sfix;
      }
      if ( jsMode ==   True) {
         if ((QB.func_Left(  first,    4))  ==  "$END" ) {
            if ( jsMode) {
               jsMode = Math.round(  False );
               await sub_AddJSLine(  0,   "//-------- END JS native code block --------");
            }
         } else {
            await sub_AddJSLine(  i,   QB.arrayValue(lines, [ i]).value .text);
         }
      } else if ( ignoreMode ==   True) {
         if ((QB.func_Left(  first,    4))  ==  "$END" ) {
            ignoreMode = Math.round(  False );
         }
      } else if ((QB.func_Left(  first,    4))  ==  "$END" ) {
      } else if ( first ==  "$ELSE"  |  first ==  "$ELSEIF" ) {
         ignoreMode = Math.round(  True );
      } else if ( typeMode ==   True) {
         if ( first ==  "END" ) {
            var second = '';  /* STRING */ 
            second = (QB.func_UCase( QB.arrayValue(parts, [ 2]).value));
            if ( second ==  "TYPE" ) {
               typeMode = Math.round(  False );
            }
         } else if (~ errCopyMode) {
            await sub_DeclareTypeVar( parts ,    currType,    i);
         }
      } else {
         await sub_CheckParen( QB.arrayValue(lines, [ i]).value .text,    i);
         if ( first !=  "CASE"  &&  first !=  "END"  && QB.arrayValue(containers, [ cindex]).value .type ==  "SELECT" ) {
            await sub_AddError(  i,   "Expected CASE expression: "  +  first);
         }
         if ( first ==  "CONST"  &&  errCopyMode) {
         } else if ( first ==  "CONST" ) {
            var constParts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
            var constCount = 0;  /* INTEGER */ 
            constCount = Math.round( (await func_ListSplit( (await func_Join( parts ,    2,    - 1,   " ")) ,   constParts)) );
            var constIdx = 0;  /* INTEGER */ 
            var ___v499794 = 0; ___l731166: for ( constIdx=  1; (1 > 0) ? ( constIdx <=  constCount) : ( constIdx >=  constCount);  constIdx+=1) { if (QB.halted()) { return; } ___v499794++;   if (___v499794 % 100 == 0) { await QB.autoLimit(); }
               var eqi = 0;  /* INTEGER */ 
               eqi = Math.round( (QB.func_InStr( QB.arrayValue(constParts, [ constIdx]).value ,   "=")) );
               if ( eqi < 1) {
                  await sub_AddWarning(  i,   "Invalid Const syntax: ["  + QB.arrayValue(constParts, [ constIdx]).value  + "]");
               } else {
                  var cleft = '';  /* STRING */ var cright = '';  /* STRING */ 
                  cleft = (QB.func_Left( QB.arrayValue(constParts, [ constIdx]).value ,    eqi -  1));
                  cright = (QB.func_Mid( QB.arrayValue(constParts, [ constIdx]).value ,    eqi +  1));
                  if ( functionName ==  "" ) {
                     QB.arrayValue(jsLines, [ constVarLine]).value .text = QB.arrayValue(jsLines, [ constVarLine]).value .text + "const "  + (await func_ConstJSName( (await String.func_Trim(  cleft))))  + " = "  + (await func_ConvertExpression(  cright,    i))  + "; ";
                  } else {
                     js =  js + "const "  + (await func_ConstJSName( (await String.func_Trim(  cleft))))  + " = "  + (await func_ConvertExpression(  cright,    i))  + "; ";
                  }
                  await sub_AddConst( (await String.func_Trim(  cleft)) ,    functionName);
               }
            } 
         } else if ( first ==  "OPTION" ) {
            second = (QB.func_UCase( (await String.func_Trim( QB.arrayValue(parts, [ 2]).value))));
            if ( second ==  "_EXPLICIT"  |  second ==  "EXPLICIT" ) {
               optionExplicit = Math.round(  True );
            } else if ( second ==  "_EXPLICITARRAY"  |  second ==  "EXPLICITARRAY" ) {
               optionExplicitArray = Math.round(  True );
            }
         } else if ( first ==  "DIM"  |  first ==  "REDIM"  |  first ==  "STATIC"  |  first ==  "SHARED"  |  first ==  "COMMON" ) {
            js = (await func_DeclareVar( parts ,    i));
            if ( errCopyMode) {
               js = (await String.func_Replace(  js,   "var " ,   ""));
            }
         } else if ( gotoMode && (await func_IsGotoBlockLine(  first,   parts ,    c)) ) {
            var gti = 0;  /* INTEGER */ var gci = 0;  /* INTEGER */ var gsel = 0;  /* INTEGER */ var gfi = 0;  /* INTEGER */ var geq = 0;  /* INTEGER */ var gto = 0;  /* INTEGER */ var gstep = 0;  /* INTEGER */ var gcount = 0;  /* INTEGER */ var gk = 0;  /* INTEGER */ var gseg = 0;  /* INTEGER */ var gtoi = 0;  /* INTEGER */ 
            var gcond = '';  /* STRING */ var gvar = '';  /* STRING */ var gsval = '';  /* STRING */ var guval = '';  /* STRING */ var gfstep = '';  /* STRING */ var gsecond = '';  /* STRING */ 
            var gparts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
            var gsegs = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
            gsecond = "";
            if ( c > 1) {
               gsecond = (QB.func_UCase( QB.arrayValue(parts, [ 2]).value));
            }
            if ( first ==  "IF" ) {
               var ___v9602898 = 0; ___l2970642: for ( gti=  2; (1 > 0) ? ( gti <= (QB.func_UBound(  parts))) : ( gti >= (QB.func_UBound(  parts)));  gti+=1) { if (QB.halted()) { return; } ___v9602898++;   if (___v9602898 % 100 == 0) { await QB.autoLimit(); }
                  if ((QB.func_UCase( QB.arrayValue(parts, [ gti]).value))  ==  "THEN" ) {
                     break ___l2970642;
                  }
               } 
               cindex = Math.round(  cindex +  1 );
               QB.arrayValue(containers, [ cindex]).value .type = "IF";
               QB.arrayValue(containers, [ cindex]).value .line = Math.round(  i );
               QB.arrayValue(containers, [ cindex]).value .gNext = Math.round( await func_NewGotoTarget() );
               QB.arrayValue(containers, [ cindex]).value .gEnd = Math.round( await func_NewGotoTarget() );
               js = "if (!("  + (await func_ConvertExpression( (await func_Join( parts ,    2,    gti -  1,   " ")) ,    i))  + ")) { "  + (await func_GotoJs( QB.arrayValue(containers, [ cindex]).value .gNext))  + " }";
               indent = Math.round(  1 );
            } else if ( first ==  "ELSEIF"  |  first ==  "ELSE" ) {
               if (QB.arrayValue(containers, [ cindex]).value .type !=  "IF" ) {
                  await sub_AddError(  i,    first + " without IF");
               } else {
                  js = (await func_GotoJs( QB.arrayValue(containers, [ cindex]).value .gEnd))  + " "  + (await func_CaseJs( QB.arrayValue(containers, [ cindex]).value .gNext));
                  QB.arrayValue(containers, [ cindex]).value .gNext = Math.round(  0 );
                  if ( first ==  "ELSEIF" ) {
                     QB.arrayValue(containers, [ cindex]).value .gNext = Math.round( await func_NewGotoTarget() );
                     js =  js + " if (!("  + (await func_ConvertExpression( (await func_Join( parts ,    2,   (QB.func_UBound(  parts))  -  1,   " ")) ,    i))  + ")) { "  + (await func_GotoJs( QB.arrayValue(containers, [ cindex]).value .gNext))  + " }";
                  }
               }
               tempIndent = Math.round(  - 1 );
            } else if ( first ==  "ENDIF"  | ( first ==  "END"  &  gsecond ==  "IF") ) {
               if ((await func_CheckBlockEnd( containers ,    cindex,   "END IF" ,    i)) ) {
                  js = (await func_CaseJs( QB.arrayValue(containers, [ cindex]).value .gNext))  + " "  + (await func_CaseJs( QB.arrayValue(containers, [ cindex]).value .gEnd));
                  cindex = Math.round(  cindex -  1 );
                  indent = Math.round(  - 1 );
               }
            } else if ( first ==  "FOR" ) {
               gfstep = "1";
               geq = Math.round(  0 );
               gto = Math.round(  0 );
               gstep = Math.round(  0 );
               var ___v5068431 = 0; ___l9446731: for ( gfi=  2; (1 > 0) ? ( gfi <= (QB.func_UBound(  parts))) : ( gfi >= (QB.func_UBound(  parts)));  gfi+=1) { if (QB.halted()) { return; } ___v5068431++;   if (___v5068431 % 100 == 0) { await QB.autoLimit(); }
                  if (QB.arrayValue(parts, [ gfi]).value  ==  "="  &&  geq ==   0) {
                     geq = Math.round(  gfi );
                  } else if ((QB.func_UCase( QB.arrayValue(parts, [ gfi]).value))  ==  "TO" ) {
                     gto = Math.round(  gfi );
                  } else if ((QB.func_UCase( QB.arrayValue(parts, [ gfi]).value))  ==  "STEP" ) {
                     gstep = Math.round(  gfi );
                     gfstep = (await func_ConvertExpression( (await func_Join( parts ,    gfi +  1,    - 1,   " ")) ,    i));
                  }
               } 
               gvar = (await func_ConvertExpression( (await func_Join( parts ,    2,    geq -  1,   " ")) ,    i));
               gsval = (await func_ConvertExpression( (await func_Join( parts ,    geq +  1,    gto -  1,   " ")) ,    i));
               if ( gstep > 0) {
                  guval = (await func_ConvertExpression( (await func_Join( parts ,    gto +  1,    gstep -  1,   " ")) ,    i));
               } else {
                  guval = (await func_ConvertExpression( (await func_Join( parts ,    gto +  1,    - 1,   " ")) ,    i));
               }
               cindex = Math.round(  cindex +  1 );
               QB.arrayValue(containers, [ cindex]).value .type = "FOR";
               QB.arrayValue(containers, [ cindex]).value .line = Math.round(  i );
               QB.arrayValue(containers, [ cindex]).value .gTop = Math.round( await func_NewGotoTarget() );
               QB.arrayValue(containers, [ cindex]).value .gCont = Math.round( await func_NewGotoTarget() );
               QB.arrayValue(containers, [ cindex]).value .gEnd = Math.round( await func_NewGotoTarget() );
               QB.arrayValue(containers, [ cindex]).value .gVar =  gvar;
               QB.arrayValue(containers, [ cindex]).value .gStep =  gfstep;
               js =  gvar + " = "  +  gsval + "; "  + (await func_CaseJs( QB.arrayValue(containers, [ cindex]).value .gTop))  + " if (!(("  +  gfstep + " > 0) ? ("  +  gvar + " <= "  +  guval + ") : ("  +  gvar + " >= "  +  guval + "))) { "  + (await func_GotoJs( QB.arrayValue(containers, [ cindex]).value .gEnd))  + " }";
               indent = Math.round(  1 );
            } else if ( first ==  "NEXT" ) {
               gcount = Math.round(  1 );
               if ( c > 1) {
                  gcount = Math.round( (await func_ListSplit( (await func_Join( parts ,    2,    -  1,   " ")) ,   gparts)) );
               }
               var ___v1096603 = 0; ___l9618737: for ( gk=  1; (1 > 0) ? ( gk <=  gcount) : ( gk >=  gcount);  gk+=1) { if (QB.halted()) { return; } ___v1096603++;   if (___v1096603 % 100 == 0) { await QB.autoLimit(); }
                  if ((await func_CheckBlockEnd( containers ,    cindex,   "NEXT" ,    i)) ) {
                     js =  js + (await func_CaseJs( QB.arrayValue(containers, [ cindex]).value .gCont))  + " "  + QB.arrayValue(containers, [ cindex]).value .gVar + " += "  + QB.arrayValue(containers, [ cindex]).value .gStep + "; "  + (await func_GotoJs( QB.arrayValue(containers, [ cindex]).value .gTop))  + " "  + (await func_CaseJs( QB.arrayValue(containers, [ cindex]).value .gEnd))  + " ";
                     cindex = Math.round(  cindex -  1 );
                     indent = Math.round(  - 1 );
                  } else {
                     break ___l9618737;
                  }
               } 
            } else if ( first ==  "DO"  |  first ==  "WHILE" ) {
               cindex = Math.round(  cindex +  1 );
               QB.arrayValue(containers, [ cindex]).value .type =  first;
               QB.arrayValue(containers, [ cindex]).value .line = Math.round(  i );
               QB.arrayValue(containers, [ cindex]).value .gTop = Math.round( await func_NewGotoTarget() );
               QB.arrayValue(containers, [ cindex]).value .gCont = Math.round( await func_NewGotoTarget() );
               QB.arrayValue(containers, [ cindex]).value .gEnd = Math.round( await func_NewGotoTarget() );
               js = (await func_CaseJs( QB.arrayValue(containers, [ cindex]).value .gTop));
               QB.arrayValue(containers, [ cindex]).value .mode = Math.round(  2 );
               if ( first ==  "WHILE" ) {
                  js =  js + " if (!("  + (await func_ConvertExpression( (await func_Join( parts ,    2,    - 1,   " ")) ,    i))  + ")) { "  + (await func_GotoJs( QB.arrayValue(containers, [ cindex]).value .gEnd))  + " }";
                  QB.arrayValue(containers, [ cindex]).value .mode = Math.round(  1 );
               } else if ( c > 1) {
                  sfix = (await func_FixCondition( (QB.func_UCase( QB.arrayValue(parts, [ 2]).value)) ,   parts ,    2,   "DO "));
                  gcond = (await func_ConvertExpression( (await func_Join( parts ,    3,    - 1,   " ")) ,    i));
                  if ((QB.func_UCase( QB.arrayValue(parts, [ 2]).value))  ==  "WHILE" ) {
                     gcond = "!("  +  gcond + ")";
                  }
                  js =  js + " if ("  +  gcond + ") { "  + (await func_GotoJs( QB.arrayValue(containers, [ cindex]).value .gEnd))  + " }";
                  QB.arrayValue(containers, [ cindex]).value .mode = Math.round(  1 );
               }
               indent = Math.round(  1 );
            } else if ( first ==  "LOOP"  |  first ==  "WEND" ) {
               if ((await func_CheckBlockEnd( containers ,    cindex,    first,    i)) ) {
                  js = (await func_CaseJs( QB.arrayValue(containers, [ cindex]).value .gCont))  + " ";
                  if (QB.arrayValue(containers, [ cindex]).value .mode ==   1 |  c < 2) {
                     js =  js + (await func_GotoJs( QB.arrayValue(containers, [ cindex]).value .gTop));
                  } else {
                     sfix = (await func_FixCondition( (QB.func_UCase( QB.arrayValue(parts, [ 2]).value)) ,   parts ,    2,   "LOOP "));
                     gcond = (await func_ConvertExpression( (await func_Join( parts ,    3,   (QB.func_UBound(  parts)) ,   " ")) ,    i));
                     if ((QB.func_UCase( QB.arrayValue(parts, [ 2]).value))  ==  "UNTIL" ) {
                        gcond = "!("  +  gcond + ")";
                     }
                     js =  js + "if ("  +  gcond + ") { "  + (await func_GotoJs( QB.arrayValue(containers, [ cindex]).value .gTop))  + " }";
                  }
                  js =  js + " "  + (await func_CaseJs( QB.arrayValue(containers, [ cindex]).value .gEnd));
                  cindex = Math.round(  cindex -  1 );
                  indent = Math.round(  - 1 );
               }
            } else if ( first ==  "SELECT" ) {
               cindex = Math.round(  cindex +  1 );
               QB.arrayValue(containers, [ cindex]).value .type = "SELECT";
               QB.arrayValue(containers, [ cindex]).value .line = Math.round(  i );
               QB.arrayValue(containers, [ cindex]).value .caseVar = await func_GenJSVar();
               QB.arrayValue(containers, [ cindex]).value .caseCount = Math.round(  0 );
               if ( gsecond ==  "EVERYCASE" ) {
                  QB.arrayValue(containers, [ cindex]).value .everyCase = Math.round(  True );
               } else {
                  QB.arrayValue(containers, [ cindex]).value .everyCase = Math.round(  False );
               }
               QB.arrayValue(containers, [ cindex]).value .gEnd = Math.round( await func_NewGotoTarget() );
               QB.arrayValue(containers, [ cindex]).value .gNext = Math.round(  0 );
               js = "var "  + QB.arrayValue(containers, [ cindex]).value .caseVar + " = "  + (await func_ConvertExpression( (await func_Join( parts ,    3,    - 1,   " ")) ,    i))  + ";";
               indent = Math.round(  1 );
            } else if ( first ==  "CASE" ) {
               gsel = Math.round(  cindex );
               if (QB.arrayValue(containers, [ gsel]).value .type ==  "CASE" ) {
                  gsel = Math.round(  cindex -  1 );
               }
               if (QB.arrayValue(containers, [ gsel]).value .type !=  "SELECT" ) {
                  await sub_AddError(  i,   "CASE without SELECT CASE");
                  continue;
               }
               if (QB.arrayValue(containers, [ gsel]).value .caseCount ==   0) {
                  cindex = Math.round(  cindex +  1 );
                  QB.arrayValue(containers, [ cindex]).value .type = "CASE";
                  QB.arrayValue(containers, [ cindex]).value .line = Math.round(  i );
               } else if (~QB.arrayValue(containers, [ gsel]).value .everyCase) {
                  js = (await func_GotoJs( QB.arrayValue(containers, [ gsel]).value .gEnd))  + " ";
               }
               js =  js + (await func_CaseJs( QB.arrayValue(containers, [ gsel]).value .gNext));
               QB.arrayValue(containers, [ gsel]).value .gNext = Math.round(  0 );
               if ( gsecond !=  "ELSE" ) {
                  if ( gsecond ==  "IS" ) {
                     gcond = QB.arrayValue(containers, [ gsel]).value .caseVar + " "  + (await func_ConvertExpression( (await func_Join( parts ,    3,    - 1,   " ")) ,    i));
                  } else {
                     gcond = "";
                     gcount = Math.round( (await func_ListSplit( (await func_Join( parts ,    2,    - 1,   " ")) ,   gparts)) );
                     var ___v1895559 = 0; ___l3151653: for ( gk=  1; (1 > 0) ? ( gk <=  gcount) : ( gk >=  gcount);  gk+=1) { if (QB.halted()) { return; } ___v1895559++;   if (___v1895559 % 100 == 0) { await QB.autoLimit(); }
                        if ( gk > 1) {
                           gcond =  gcond + " || ";
                        }
                        gseg = Math.round( (await func_SLSplit2( QB.arrayValue(gparts, [ gk]).value ,   gsegs)) );
                        gtoi = Math.round(  0 );
                        var ___v2994856 = 0; ___l7811670: for ( gfi=  0; (1 > 0) ? ( gfi <=  gseg) : ( gfi >=  gseg);  gfi+=1) { if (QB.halted()) { return; } ___v2994856++;   if (___v2994856 % 100 == 0) { await QB.autoLimit(); }
                           if ((QB.func_UCase( QB.arrayValue(gsegs, [ gfi]).value))  ==  "TO" ) {
                              gtoi = Math.round(  gfi );
                              break ___l7811670;
                           }
                        } 
                        if ( gtoi ==   0) {
                           gcond =  gcond + QB.arrayValue(containers, [ gsel]).value .caseVar + " == "  + (await func_ConvertExpression( QB.arrayValue(gparts, [ gk]).value ,    i));
                        } else {
                           gcond =  gcond + "("  + QB.arrayValue(containers, [ gsel]).value .caseVar + " >= "  + (await func_ConvertExpression( (await func_Join( gsegs ,    1,    gtoi -  1,   " ")) ,    i))  + " && "  + QB.arrayValue(containers, [ gsel]).value .caseVar + " <= "  + (await func_ConvertExpression( (await func_Join( gsegs ,    gtoi +  1,    - 1,   " ")) ,    i))  + ")";
                        }
                     } 
                  }
                  QB.arrayValue(containers, [ gsel]).value .gNext = Math.round( await func_NewGotoTarget() );
                  js =  js + " if (!("  +  gcond + ")) { "  + (await func_GotoJs( QB.arrayValue(containers, [ gsel]).value .gNext))  + " }";
               }
               QB.arrayValue(containers, [ gsel]).value .caseCount = Math.round( QB.arrayValue(containers, [ gsel]).value .caseCount +  1 );
               tempIndent = Math.round(  - 1 );
            } else if ( first ==  "END"  &  gsecond ==  "SELECT" ) {
               if ((await func_CheckBlockEnd( containers ,    cindex,   "END SELECT" ,    i)) ) {
                  if (QB.arrayValue(containers, [ cindex]).value .type ==  "CASE" ) {
                     cindex = Math.round(  cindex -  1 );
                  } else {
                     await sub_AddWarning(  i,   "Empty SELECT CASE block");
                  }
                  js = (await func_CaseJs( QB.arrayValue(containers, [ cindex]).value .gNext))  + " "  + (await func_CaseJs( QB.arrayValue(containers, [ cindex]).value .gEnd));
                  cindex = Math.round(  cindex -  1 );
                  indent = Math.round(  - 1 );
               }
            } else if ( first ==  "EXIT"  |  first ==  "_CONTINUE"  |  first ==  "CONTINUE" ) {
               gci = Math.round(  0 );
               var ___v3066750 = 0; ___l525742: for ( gk=  cindex; ( - 1 > 0) ? ( gk <=  1) : ( gk >=  1);  gk+= - 1) { if (QB.halted()) { return; } ___v3066750++;   if (___v3066750 % 100 == 0) { await QB.autoLimit(); }
                  if ( first ==  "EXIT" ) {
                     if (QB.arrayValue(containers, [ gk]).value .type ==   gsecond | ( gsecond ==  "CASE"  & QB.arrayValue(containers, [ gk]).value .type ==  "SELECT") ) {
                        gci = Math.round(  gk );
                     }
                  } else if (QB.arrayValue(containers, [ gk]).value .type ==  "FOR"  | QB.arrayValue(containers, [ gk]).value .type ==  "DO"  | QB.arrayValue(containers, [ gk]).value .type ==  "WHILE" ) {
                     gci = Math.round(  gk );
                  }
                  if ( gci > 0) {
                     break ___l525742;
                  }
               } 
               if ( gci ==   0) {
                  await sub_AddError(  i,   (await func_Join( parts ,    1,    - 1,   " "))  + " outside of a matching block");
               } else if ( first !=  "EXIT" ) {
                  js = (await func_GotoJs( QB.arrayValue(containers, [ gci]).value .gCont));
               } else if ( gsecond ==  "CASE"  && QB.arrayValue(containers, [ gci]).value .everyCase && QB.arrayValue(containers, [ gci]).value .gNext > 0) {
                  js = (await func_GotoJs( QB.arrayValue(containers, [ gci]).value .gNext));
               } else {
                  js = (await func_GotoJs( QB.arrayValue(containers, [ gci]).value .gEnd));
               }
            }
         } else if ( first ==  "SELECT" ) {
            cindex = Math.round(  cindex +  1 );
            QB.arrayValue(containers, [ cindex]).value .type = "SELECT";
            QB.arrayValue(containers, [ cindex]).value .line = Math.round(  i );
            caseVar = await func_GenJSVar();
            QB.arrayValue(containers, [ cindex]).value .label = await func_GenJSVar();
            QB.arrayValue(containers, [ cindex]).value .caseVar =  caseVar;
            QB.arrayValue(containers, [ cindex]).value .caseCount = Math.round(  0 );
            js = QB.arrayValue(containers, [ cindex]).value .label + ": { ";
            if ((QB.func_UCase( QB.arrayValue(parts, [ 2]).value))  ==  "EVERYCASE" ) {
               QB.arrayValue(containers, [ cindex]).value .everyCase = Math.round(  True );
            }
            js =  js + "var "  +  caseVar + " = "  + (await func_ConvertExpression( (await func_Join( parts ,    3,    - 1,   " ")) ,    i))  + "; ";
            indent = Math.round(  1 );
         } else if ( first ==  "CASE" ) {
            var pcindex = 0;  /* INTEGER */ 
            pcindex = Math.round(  cindex );
            if (QB.arrayValue(containers, [ pcindex]).value .type ==  "CASE" ) {
               pcindex = Math.round(  cindex -  1 );
            }
            if (QB.arrayValue(containers, [ pcindex]).value .type !=  "SELECT" ) {
               await sub_AddError(  i,   "CASE without SELECT CASE");
               continue;
            }
            if (QB.arrayValue(containers, [ pcindex]).value .caseCount > 0) {
               js = "} } ";
            } else {
               cindex = Math.round(  cindex +  1 );
            }
            QB.arrayValue(containers, [ cindex]).value .type = "CASE";
            QB.arrayValue(containers, [ cindex]).value .line = Math.round(  i );
            QB.arrayValue(containers, [ cindex]).value .label = await func_GenJSVar();
            if ((QB.func_UCase( QB.arrayValue(parts, [ 2]).value))  ==  "ELSE" ) {
               if (~QB.arrayValue(containers, [ pcindex]).value .everyCase) {
                  js =  js + "else ";
               }
               js =  js + "{ "  + QB.arrayValue(containers, [ cindex]).value .label + ": { ";
            } else if ((QB.func_UCase( QB.arrayValue(parts, [ 2]).value))  ==  "IS" ) {
               if (QB.arrayValue(containers, [ pcindex]).value .caseCount > 0 & ~QB.arrayValue(containers, [ pcindex]).value .everyCase) {
                  js =  js + "else ";
               }
               js =  js + "if ( "  + QB.arrayValue(containers, [ pcindex]).value .caseVar + " "  + (await func_ConvertExpression( (await func_Join( parts ,    3,    - 1,   " ")) ,    i))  + " ) { ";
               js =  js + QB.arrayValue(containers, [ cindex]).value .label + ": { ";
            } else {
               var caseParts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
               var cscount = 0;  /* INTEGER */ 
               cscount = Math.round( (await func_ListSplit( (await func_Join( parts ,    2,    - 1,   " ")) ,   caseParts)) );
               if (QB.arrayValue(containers, [ pcindex]).value .caseCount > 0 & ~QB.arrayValue(containers, [ pcindex]).value .everyCase) {
                  js =  js + "else ";
               }
               js =  js + "if (";
               caseVar = QB.arrayValue(containers, [ pcindex]).value .caseVar;
               var ci = 0;  /* INTEGER */ 
               var ___v317799 = 0; ___l6917726: for ( ci=  1; (1 > 0) ? ( ci <=  cscount) : ( ci >=  cscount);  ci+=1) { if (QB.halted()) { return; } ___v317799++;   if (___v317799 % 100 == 0) { await QB.autoLimit(); }
                  if ( ci > 1) {
                     js =  js + " || ";
                  }
                  var caseSegments = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
                  var csegcount = 0;  /* INTEGER */ var toIndex = 0;  /* INTEGER */ var csi = 0;  /* INTEGER */ 
                  toIndex = Math.round(  0 );
                  csegcount = Math.round( (await func_SLSplit2( QB.arrayValue(caseParts, [ ci]).value ,   caseSegments)) );
                  var ___v13278 = 0; ___l7133573: for ( csi=  0; (1 > 0) ? ( csi <=  csegcount) : ( csi >=  csegcount);  csi+=1) { if (QB.halted()) { return; } ___v13278++;   if (___v13278 % 100 == 0) { await QB.autoLimit(); }
                     if ("TO"  ==  (QB.func_UCase( QB.arrayValue(caseSegments, [ csi]).value)) ) {
                        toIndex = Math.round(  csi );
                        break ___l7133573;
                     }
                  } 
                  if ( toIndex ==   0) {
                     js =  js +  caseVar + " == "  + (await func_ConvertExpression( QB.arrayValue(caseParts, [ ci]).value ,    i));
                  } else {
                     var lvalue = '';  /* STRING */ var rvalue = '';  /* STRING */ 
                     lvalue = (await func_ConvertExpression( (await func_Join( caseSegments ,    1,    toIndex -  1,   " ")) ,    i));
                     rvalue = (await func_ConvertExpression( (await func_Join( caseSegments ,    toIndex +  1,    - 1,   " ")) ,    i));
                     js =  js + "( "  +  caseVar + " >= "  +  lvalue + " && "  +  caseVar + " <= "  +  rvalue + ") ";
                  }
               } 
               js =  js + ") {"  + QB.arrayValue(containers, [ cindex]).value .label + ": { ";
            }
            QB.arrayValue(containers, [ pcindex]).value .caseCount = Math.round( QB.arrayValue(containers, [ pcindex]).value .caseCount +  1 );
         } else if ( first ==  "FOR" ) {
            var fstep = '';  /* STRING */ 
            fstep = "1";
            var eqIdx = 0;  /* INTEGER */ 
            var toIdx = 0;  /* INTEGER */ 
            var stepIdx = 0;  /* INTEGER */ 
            stepIdx = Math.round(  0 );
            var fi = 0;  /* INTEGER */ 
            var ___v2196902 = 0; ___l8268084: for ( fi=  2; (1 > 0) ? ( fi <= (QB.func_UBound(  parts))) : ( fi >= (QB.func_UBound(  parts)));  fi+=1) { if (QB.halted()) { return; } ___v2196902++;   if (___v2196902 % 100 == 0) { await QB.autoLimit(); }
               var fword = '';  /* STRING */ 
               fword = (QB.func_UCase( QB.arrayValue(parts, [ fi]).value));
               if ( fword ==  "=" ) {
                  eqIdx = Math.round(  fi );
               } else if ( fword ==  "TO" ) {
                  toIdx = Math.round(  fi );
               } else if ( fword ==  "STEP" ) {
                  stepIdx = Math.round(  fi );
                  fstep = (await func_ConvertExpression( (await func_Join( parts ,    fi +  1,    - 1,   " ")) ,    i));
               }
            } 
            var fvar = '';  /* STRING */ 
            fvar = (await func_ConvertExpression( (await func_Join( parts ,    2,    eqIdx -  1,   " ")) ,    i));
            var sval = '';  /* STRING */ 
            sval = (await func_ConvertExpression( (await func_Join( parts ,    eqIdx +  1,    toIdx -  1,   " ")) ,    i));
            var uval = '';  /* STRING */ 
            uval = (await func_ConvertExpression( (await func_Join( parts ,    toIdx +  1,    stepIdx -  1,   " ")) ,    i));
            cindex = Math.round(  cindex +  1 );
            QB.arrayValue(containers, [ cindex]).value .type = "FOR";
            QB.arrayValue(containers, [ cindex]).value .label = await func_GenJSLabel();
            QB.arrayValue(containers, [ cindex]).value .line = Math.round(  i );
            loopIndex = await func_GenJSVar();
            js = "var "  +  loopIndex + " = 0; "  + QB.arrayValue(containers, [ cindex]).value .label + ":";
            js =  js + " for ("  +  fvar + "="  +  sval + "; ("  +  fstep + " > 0) ? ("  +  fvar + " <= "  +  uval + ") : ("  +  fvar + " >= "  +  uval + "); "  +  fvar + "+="  +  fstep + ") {";
            js =  js + " if (QB.halted()) { return; } ";
            js =  js +  loopIndex + "++; ";
            js =  js + "  if ("  +  loopIndex + " % 100 == 0) { await QB.autoLimit(); }";
            indent = Math.round(  1 );
         } else if ( first ==  "IF" ) {
            cindex = Math.round(  cindex +  1 );
            QB.arrayValue(containers, [ cindex]).value .type = "IF";
            QB.arrayValue(containers, [ cindex]).value .line = Math.round(  i );
            var thenIndex = 0;  /* INTEGER */ 
            var ___v1168370 = 0; ___l6205736: for ( thenIndex=  2; (1 > 0) ? ( thenIndex <= (QB.func_UBound(  parts))) : ( thenIndex >= (QB.func_UBound(  parts)));  thenIndex+=1) { if (QB.halted()) { return; } ___v1168370++;   if (___v1168370 % 100 == 0) { await QB.autoLimit(); }
               if ((QB.func_UCase( QB.arrayValue(parts, [ thenIndex]).value))  ==  "THEN" ) {
                  break ___l6205736;
               }
            } 
            js = "if ("  + (await func_ConvertExpression( (await func_Join( parts ,    2,    thenIndex -  1,   " ")) ,    i))  + ") {";
            indent = Math.round(  1 );
         } else if ( first ==  "ELSEIF" ) {
            js = "} else if ("  + (await func_ConvertExpression( (await func_Join( parts ,    2,   (QB.func_UBound(  parts))  -  1,   " ")) ,    i))  + ") {";
            tempIndent = Math.round(  - 1 );
         } else if ( first ==  "ELSE" ) {
            js = "} else {";
            tempIndent = Math.round(  - 1 );
         } else if ( first ==  "NEXT" ) {
            if ( c > 1) {
               var nparts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
               var npcount = 0;  /* INTEGER */ 
               var npi = 0;  /* INTEGER */ 
               npcount = Math.round( (await func_ListSplit( (await func_Join( parts ,    2,    - 1,   " ")) ,   nparts)) );
               var ___v781213 = 0; ___l2188060: for ( npi=  1; (1 > 0) ? ( npi <=  npcount) : ( npi >=  npcount);  npi+=1) { if (QB.halted()) { return; } ___v781213++;   if (___v781213 % 100 == 0) { await QB.autoLimit(); }
                  if ((await func_CheckBlockEnd( containers ,    cindex,    first,    i)) ) {
                     js =  js + "} ";
                     indent = Math.round(  - 1 );
                     cindex = Math.round(  cindex -  1 );
                  } else {
                     break ___l2188060;
                  }
               } 
            } else {
               if ((await func_CheckBlockEnd( containers ,    cindex,    first,    i)) ) {
                  js =  js + "}";
                  indent = Math.round(  - 1 );
                  cindex = Math.round(  cindex -  1 );
               }
            }
         } else if ( first ==  "END"  |  first ==  "ENDIF" ) {
            if ((QB.func_UBound(  parts))  ==   1 &  first ==  "END" ) {
               js = "QB.halt(); return;";
            } else if ((QB.func_UBound(  parts))  ==   1 &  first ==  "ENDIF" ) {
               if ((await func_CheckBlockEnd( containers ,    cindex,   "ENDIF" ,    i)) ) {
                  js =  js + "}";
                  indent = Math.round(  - 1 );
                  cindex = Math.round(  cindex -  1 );
               }
            } else {
               second = (QB.func_UCase( QB.arrayValue(parts, [ 2]).value));
               if ( second ==  "IF" ) {
                  if ((await func_CheckBlockEnd( containers ,    cindex,   "END IF" ,    i)) ) {
                     js =  js + "}";
                     indent = Math.round(  - 1 );
                     cindex = Math.round(  cindex -  1 );
                  }
               } else if ( second ==  "SELECT" ) {
                  if ((await func_CheckBlockEnd( containers ,    cindex,   "END SELECT" ,    i)) ) {
                     js = " } ";
                     indent = Math.round(  - 1 );
                     if (QB.arrayValue(containers, [ cindex]).value .type ==  "CASE" ) {
                        cindex = Math.round(  cindex -  2 );
                        js =  js + " } } ";
                     } else {
                        cindex = Math.round(  cindex -  1 );
                        await sub_AddWarning(  i,   "Empty SELECT CASE block");
                     }
                  }
               } else {
                  await sub_AddError(  i,   "Syntax error after END");
               }
            }
         } else if ( first ==  "SYSTEM" ) {
            js = "QB.halt(); return;";
         } else if ( first ==  "DECLARE"  &&  c > 1 && ((QB.func_UCase( QB.arrayValue(parts, [ 2]).value))  ==  "SUB"  | (QB.func_UCase( QB.arrayValue(parts, [ 2]).value))  ==  "FUNCTION") ) {
         } else if ( first ==  "VIEW"  &&  c > 1 && (QB.func_UCase( QB.arrayValue(parts, [ 2]).value))  ==  "PRINT" ) {
            js = (await func_ConvertViewPrint( parts ,    c,    i));
         } else if ( first ==  "ON"  &&  c > 1 && (QB.func_UCase( QB.arrayValue(parts, [ 2]).value))  ==  "ERROR" ) {
            if ( c ==   4 && (QB.func_UCase( QB.arrayValue(parts, [ 3]).value))  ==  "GOTO" ) {
               if (QB.arrayValue(parts, [ 4]).value  ==  "0" ) {
                  js = "QB.setErrorHandler(null);";
               } else if ((await func_IsErrorHandler( (QB.func_UCase( QB.arrayValue(parts, [ 4]).value))))  && (await func_FindCodeLabel( (QB.func_UCase( QB.arrayValue(parts, [ 4]).value)))) ) {
                  js = "QB.setErrorHandler('"  + (QB.func_UCase( QB.arrayValue(parts, [ 4]).value))  + "');";
               } else {
                  await sub_AddError(  i,   "Label not defined: "  + QB.arrayValue(parts, [ 4]).value);
               }
            } else {
               await sub_AddWarning(  i,   "Only ON ERROR GOTO label and ON ERROR GOTO 0 are supported - ignoring line");
               js = "// "  +  l;
            }
         } else if ( first ==  "RESUME" ) {
            if (~ errCopyMode) {
               js = "QB.sub_Error(20);";
               if ( c > 1 && QB.arrayValue(parts, [ 2]).value  !=  "0"  && (QB.func_UCase( QB.arrayValue(parts, [ 2]).value))  !=  "NEXT"  && ~(await func_FindCodeLabel( (QB.func_UCase( QB.arrayValue(parts, [ 2]).value)))) ) {
                  await sub_AddError(  i,   "Label not defined: "  + QB.arrayValue(parts, [ 2]).value);
               }
            } else if ( c ==   1 || QB.arrayValue(parts, [ 2]).value  ==  "0" ) {
               js = "return 1;";
            } else if ((QB.func_UCase( QB.arrayValue(parts, [ 2]).value))  ==  "NEXT" ) {
               js = "return 2;";
            } else {
               js = "return '"  + (QB.func_UCase( QB.arrayValue(parts, [ 2]).value))  + "';";
            }
         } else if ( first ==  "GOTO"  ||  first ==  "GOSUB"  ||  first ==  "RETURN"  || ( c ==   1 && (await func_IsLineNumber(  first)))  || (await func_OnGotoIndex( parts ,    c))  > 0) {
            if (~ gotoMode) {
               await sub_AddError(  i,    first + " is not supported here");
            } else {
               js = (await func_ConvertGoto(  first,   parts ,    c,    i));
            }
         } else if ( first ==  "$NOPREFIX" ) {
         } else if ( first ==  "$IF" ) {
            if ((QB.func_UBound(  parts))  > 1) {
               if ((QB.func_UCase( QB.arrayValue(parts, [ 2]).value))  ==  "JAVASCRIPT" ) {
                  jsMode = Math.round(  True );
                  js = "//-------- BEGIN JS native code block --------";
               } else if ((QB.func_UCase( QB.arrayValue(parts, [ 2]).value))  !=  "WEB" ) {
                  ignoreMode = Math.round(  True );
               }
            }
         } else if ( first ==  "DO" ) {
            cindex = Math.round(  cindex +  1 );
            QB.arrayValue(containers, [ cindex]).value .label = await func_GenJSLabel();
            QB.arrayValue(containers, [ cindex]).value .type = "DO";
            QB.arrayValue(containers, [ cindex]).value .line = Math.round(  i );
            loopIndex = await func_GenJSVar();
            js = "var "  +  loopIndex + " = 0; "  + QB.arrayValue(containers, [ cindex]).value .label + ":";
            if ((QB.func_UBound(  parts))  > 1) {
               sfix = (await func_FixCondition( (QB.func_UCase( QB.arrayValue(parts, [ 2]).value)) ,   parts ,    2,   "DO "));
               if ((QB.func_UCase( QB.arrayValue(parts, [ 2]).value))  ==  "WHILE" ) {
                  js =  js + " while ("  + (await func_ConvertExpression( (await func_Join( parts ,    3,    - 1,   " ")) ,    i))  + ") {";
               } else {
                  js =  js + " while (!("  + (await func_ConvertExpression( (await func_Join( parts ,    3,    - 1,   " ")) ,    i))  + ")) {";
               }
               QB.arrayValue(containers, [ cindex]).value .mode = Math.round(  1 );
            } else {
               js =  js + " do {";
               QB.arrayValue(containers, [ cindex]).value .mode = Math.round(  2 );
            }
            indent = Math.round(  1 );
            js =  js + " if (QB.halted()) { return; }";
            js =  js +  loopIndex + "++; ";
            js =  js + "  if ("  +  loopIndex + " % 100 == 0) { await QB.autoLimit(); }";
         } else if ( first ==  "WHILE" ) {
            cindex = Math.round(  cindex +  1 );
            QB.arrayValue(containers, [ cindex]).value .label = await func_GenJSLabel();
            QB.arrayValue(containers, [ cindex]).value .type = "WHILE";
            QB.arrayValue(containers, [ cindex]).value .line = Math.round(  i );
            loopIndex = await func_GenJSVar();
            js = "var "  +  loopIndex + " = 0; "  + QB.arrayValue(containers, [ cindex]).value .label + ":";
            js =  js + " while ("  + (await func_ConvertExpression( (await func_Join( parts ,    2,    - 1,   " ")) ,    i))  + ") {";
            js =  js + " if (QB.halted()) { return; }";
            js =  js +  loopIndex + "++; ";
            js =  js + "  if ("  +  loopIndex + " % 100 == 0) { await QB.autoLimit(); }";
            indent = Math.round(  1 );
         } else if ( first ==  "WEND" ) {
            if ((await func_CheckBlockEnd( containers ,    cindex,    first,    i)) ) {
               js = "}";
               cindex = Math.round(  cindex -  1 );
               indent = Math.round(  - 1 );
            }
         } else if ( first ==  "LOOP" ) {
            if ((await func_CheckBlockEnd( containers ,    cindex,    first,    i)) ) {
               if (QB.arrayValue(containers, [ cindex]).value .mode ==   1) {
                  js = "}";
               } else {
                  sfix = (await func_FixCondition( (QB.func_UCase( QB.arrayValue(parts, [ 2]).value)) ,   parts ,    2,   "LOOP "));
                  js = "} while ((";
                  if ((QB.func_UBound(  parts))  < 2) {
                     js =  js + "1));";
                  } else {
                     if ((QB.func_UCase( QB.arrayValue(parts, [ 2]).value))  ==  "UNTIL" ) {
                        js = "} while (!(";
                     }
                     js =  js + (await func_ConvertExpression( (await func_Join( parts ,    3,   (QB.func_UBound(  parts)) ,   " ")) ,    i))  + "))";
                  }
               }
               cindex = Math.round(  cindex -  1 );
               indent = Math.round(  - 1 );
            }
         } else if ( first ==  "_CONTINUE"  |  first ==  "CONTINUE" ) {
            js = "continue;";
         } else if ( first ==  "EXIT" ) {
            second = "";
            if ((QB.func_UBound(  parts))  > 1) {
               second = (QB.func_UCase( QB.arrayValue(parts, [ 2]).value));
            }
            if ( second ==  "FUNCTION" ) {
               js = "return "  + (await func_RemoveSuffix(  functionName))  + ";";
            } else if ( second ==  "SUB" ) {
               js = "return;";
            } else if ( second ==  "DO"  |  second ==  "WHILE"  |  second ==  "FOR"  |  second ==  "SELECT"  |  second ==  "CASE" ) {
               var lli = 0;  /* INTEGER */ 
               var ___v2123458 = 0; ___l1920088: for ( lli=  cindex; ( - 1 > 0) ? ( lli <=  0) : ( lli >=  0);  lli+= - 1) { if (QB.halted()) { return; } ___v2123458++;   if (___v2123458 % 100 == 0) { await QB.autoLimit(); }
                  if ( lli > 0) {
                     if (QB.arrayValue(containers, [ lli]).value .type ==   second) {
                        break ___l1920088;
                     }
                  }
               } 
               if ( lli > 0) {
                  js = "break "  + QB.arrayValue(containers, [ lli]).value .label + ";";
               } else {
                  await sub_AddError(  i,   "EXIT "  +  second + " without "  +  second);
               }
            } else {
               await sub_AddError(  i,   "Syntax error after EXIT");
            }
         } else if ( first ==  "TYPE" ) {
            typeMode = Math.round(  True );
            if (~ errCopyMode) {
               var qbtype = {line:0,name:'',argc:0,args:''};  /* QBTYPE */ 
               qbtype.line = Math.round(  i );
               qbtype.name = (QB.func_UCase( QB.arrayValue(parts, [ 2]).value));
               await sub_AddType(  qbtype);
               currType = Math.round( (QB.func_UBound(  types)) );
            }
         } else if ( first ==  "EXPORT" ) {
            if ( c > 1) {
               var exparts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
               var excount = 0;  /* INTEGER */ 
               excount = Math.round( (await func_ListSplit( (await func_Join( parts ,    2,    - 1,   " ")) ,   exparts)) );
               var exi = 0;  /* INTEGER */ 
               var ___v2643608 = 0; ___l7528362: for ( exi=  1; (1 > 0) ? ( exi <=  excount) : ( exi >=  excount);  exi+=1) { if (QB.halted()) { return; } ___v2643608++;   if (___v2643608 % 100 == 0) { await QB.autoLimit(); }
                  await sub_ParseExport( QB.arrayValue(exparts, [ exi]).value ,    i);
               } 
               continue;
            } else {
            }
         } else if ( first ==  "CALL" ) {
            var subline = '';  /* STRING */ 
            subline = (await String.func_Trim( (await func_Join( parts ,    2,    - 1,   " "))));
            var subend = 0;  /* INTEGER */ 
            subend = Math.round( (QB.func_InStr(  subline,   "(")) );
            var subname = '';  /* STRING */ 
            if ( subend ==   0) {
               subname =  subline;
            } else {
               subname = (QB.func_Left(  subline,    subend -  1));
            }
            if ((await func_FindMethod(  subname,    m,   "SUB" ,    True)) ) {
               var subargs = '';  /* STRING */ 
               if ( subname ==   subline) {
                  subargs = "";
               } else {
                  subargs = (QB.func_Mid(  subline,   (QB.func_Len(  subname))  +  2,   (QB.func_Len(  subline))  - (QB.func_Len(  subname))  -  2));
               }
               js = (await func_ConvertSub(  m,    subargs,    i));
            } else {
               await sub_AddWarning(  i,   "Missing Sub ["  +  subname + "], ignoring Call command");
            }
         } else if ( c > 2 |  first ==  "LET" ) {
            var assignment = 0;  /* INTEGER */ 
            assignment = Math.round(  0 );
            var ___v8284426 = 0; ___l5183001: for ( j=  1; (1 > 0) ? ( j <= (QB.func_UBound(  parts))) : ( j >= (QB.func_UBound(  parts)));  j+=1) { if (QB.halted()) { return; } ___v8284426++;   if (___v8284426 % 100 == 0) { await QB.autoLimit(); }
               if (QB.arrayValue(parts, [ j]).value  ==  "=" ) {
                  if ( j > 1) {
                     if ((QB.func_UCase( QB.arrayValue(parts, [ j -  1]).value))  ==  "_CLIPBOARD$" ) {
                        break ___l5183001;
                     }
                     if ((QB.func_UCase( QB.arrayValue(parts, [ j -  1]).value))  ==  "_CLIPBOARDIMAGE" ) {
                        break ___l5183001;
                     }
                     if ((QB.func_UCase( QB.arrayValue(parts, [ 1]).value))  ==  "MID$" ) {
                        break ___l5183001;
                     }
                     if ((QB.func_UCase( QB.arrayValue(parts, [ 1]).value))  ==  "OPEN" ) {
                        break ___l5183001;
                     }
                  }
                  assignment = Math.round(  j );
                  break ___l5183001;
               }
            } 
            var asnVarIndex = 0;  /* SINGLE */ 
            asnVarIndex =  1;
            if ( first ==  "LET" ) {
               asnVarIndex =  2;
            }
            if ( assignment > 0 && (await func_GetParenDepth( (await func_Join( parts ,    asnVarIndex,    assignment))))  > 0) {
               assignment = Math.round(  0 );
            }
            if ( assignment > 0) {
               var leftSide = '';  /* STRING */ var rightSide = '';  /* STRING */ var leftConverted = '';  /* STRING */ var rightConverted = '';  /* STRING */ 
               leftSide = (await String.func_Trim( (await func_Join( parts ,    asnVarIndex,    assignment -  1,   " "))));
               rightSide = (await String.func_Trim( (await func_Join( parts ,    assignment +  1,    - 1,   " "))));
               leftConverted = (await func_ConvertExpression(  leftSide,    i));
               rightConverted = (await func_ConvertExpression(  rightSide,    i));
               if ((await func_IsIntegerVar(  leftSide)) ) {
                  rightConverted = "Math.round( "  +  rightConverted + " )";
               }
               rightConverted = (await func_AssignValue(  leftSide,    rightConverted,    i));
               js = (await func_RemoveSuffix(  leftConverted))  + " = "  +  rightConverted + ";";
            } else {
               var parendx = 0;  /* INTEGER */ 
               parendx = Math.round( (QB.func_InStr( QB.arrayValue(parts, [ 1]).value ,   "(")) );
               if ( parendx > 0) {
                  var sname = '';  /* STRING */ var arg1 = '';  /* STRING */ 
                  sname = (QB.func_Mid( QB.arrayValue(parts, [ 1]).value ,    1,    parendx -  1));
                  arg1 = (QB.func_Mid( QB.arrayValue(parts, [ 1]).value ,    parendx));
                  c = Math.round( (await func_SLSplit(  sname + " "  +  arg1 + (await func_Join( parts ,    2,    - 1,   " ")) ,   parts ,    True)) );
               }
               if ((await func_FindMethod( QB.arrayValue(parts, [ 1]).value ,    m,   "SUB" ,    True)) ) {
                  js = (await func_ConvertSub(  m,   (await func_Join( parts ,    2,    - 1,   " ")) ,    i));
               } else {
                  js = "// "  +  l;
                  await sub_AddWarning(  i,   "Missing or unsupported method: '"  + QB.arrayValue(parts, [ 1]).value  + "' - ignoring line");
               }
            }
         } else {
            if ((await func_FindMethod( QB.arrayValue(parts, [ 1]).value ,    m,   "SUB" ,    True)) ) {
               js = (await func_ConvertSub(  m,   (await func_Join( parts ,    2,    - 1,   " ")) ,    i));
            } else {
               js = "// "  +  l;
               await sub_AddWarning(  i,   "Missing or unsupported method: '"  + QB.arrayValue(parts, [ 1]).value  + "' - ignoring line");
            }
         }
         if (( indent < 0) ) {
            totalIndent = Math.round(  totalIndent +  indent );
         }
         if ( js ==   undefined) {
            js = "";
         }
         if ( js !=  ""  &&  onErrorMode && ~ errCopyMode) {
            js = (await func_WrapForErrors(  first,    js,   QB.arrayValue(lines, [ i]).value .line));
         }
         if ( js !=  ""  &&  debugMode &&  qbNames) {
            js = (await func_DebugHook(  first,    l,    js,    i))  +  js;
         }
         if ( js !=  "" ) {
            await sub_AddJSLine(  i,   (await String.func_PadStart( "" ,   ( totalIndent +  tempIndent)  *  3,   " "))  +  js);
         }
         if (( indent > 0) ) {
            totalIndent = Math.round(  totalIndent +  indent );
         }
      }
   } 
   if ( gotoMode) {
      var ___v2687041 = 0; ___l3696339: for ( hli=  1; (1 > 0) ? ( hli <= (QB.func_UBound(  codeLabels))) : ( hli >= (QB.func_UBound(  codeLabels)));  hli+=1) { if (QB.halted()) { return; } ___v2687041++;   if (___v2687041 % 100 == 0) { await QB.autoLimit(); }
         if (QB.arrayValue(codeLabels, [ hli]).value .index ==   lastLine +  1) {
            await sub_AddJSLine(  lastLine,   (await func_DefineGotoLabel( QB.arrayValue(codeLabels, [ hli]).value .text,    lastLine)));
         }
      } 
   }
   if ( cindex > 0) {
      await sub_AddError( QB.arrayValue(containers, [ cindex]).value .line,   QB.arrayValue(containers, [ cindex]).value .type + " without "  + (await func_EndPhraseFor( QB.arrayValue(containers, [ cindex]).value .type)));
   }
}
async function func_LinesUseGoto(firstLine/*INTEGER*/,lastLine/*INTEGER*/) {
if (QB.halted()) { return; }; firstLine = Math.round(firstLine); lastLine = Math.round(lastLine); 
var LinesUseGoto = null;
/* implicit variables: */ 
   var i = 0;  /* INTEGER */ var c = 0;  /* INTEGER */ var rawJS = 0;  /* INTEGER */ 
   var w = '';  /* STRING */ 
   var gparts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   LinesUseGoto =  False;
   rawJS = Math.round(  False );
   var ___v27859 = 0; ___l1910613: for ( i=  firstLine; (1 > 0) ? ( i <=  lastLine) : ( i >=  lastLine);  i+=1) { if (QB.halted()) { return; } ___v27859++;   if (___v27859 % 100 == 0) { await QB.autoLimit(); }
      c = Math.round( (await func_SLSplit( (await String.func_Trim( QB.arrayValue(lines, [ i]).value .text)) ,   gparts ,    False)) );
      if ( c < 1) {
         continue;
      }
      w = (QB.func_UCase( QB.arrayValue(gparts, [ 1]).value));
      if ( w ==  "$IF"  &&  c > 1) {
         if ((QB.func_UCase( QB.arrayValue(gparts, [ 2]).value))  ==  "JAVASCRIPT" ) {
            rawJS = Math.round(  True );
         }
      } else if ((QB.func_Left(  w,    4))  ==  "$END" ) {
         rawJS = Math.round(  False );
      } else if (~ rawJS) {
         if ( w ==  "GOTO"  |  w ==  "GOSUB"  |  w ==  "RETURN"  | ( c ==   1 && (await func_IsLineNumber(  w)))  | (await func_OnGotoIndex( gparts ,    c))  > 0) {
            LinesUseGoto =  True;
            return LinesUseGoto;
         }
         if ( w ==  "RESUME"  &&  c > 1) {
            if ((QB.func_UCase( QB.arrayValue(gparts, [ 2]).value))  !=  "NEXT"  && QB.arrayValue(gparts, [ 2]).value  !=  "0" ) {
               LinesUseGoto =  True;
               return LinesUseGoto;
            }
         }
      }
   } 
return LinesUseGoto;
}
async function func_OnGotoIndex(parts/*STRING*/,c/*INTEGER*/) {
if (QB.halted()) { return; }; c = Math.round(c); 
var OnGotoIndex = null;
/* implicit variables: */ 
   var k = 0;  /* INTEGER */ 
   var w = '';  /* STRING */ 
   OnGotoIndex =  0;
   if ( c < 4) {
      return OnGotoIndex;
   }
   if ((QB.func_UCase( QB.arrayValue(parts, [ 1]).value))  !=  "ON" ) {
      return OnGotoIndex;
   }
   w = (QB.func_UCase( QB.arrayValue(parts, [ 2]).value));
   if ( w ==  "ERROR"  | (QB.func_Left(  w,    5))  ==  "TIMER"  | (QB.func_Left(  w,    3))  ==  "KEY"  | (QB.func_Left(  w,    5))  ==  "STRIG"  | (QB.func_Left(  w,    4))  ==  "PLAY"  | (QB.func_Left(  w,    3))  ==  "COM"  | (QB.func_Left(  w,    3))  ==  "PEN"  | (QB.func_Left(  w,    6))  ==  "UEVENT" ) {
      return OnGotoIndex;
   }
   var ___v550793 = 0; ___l5187230: for ( k=  3; (1 > 0) ? ( k <=  c -  1) : ( k >=  c -  1);  k+=1) { if (QB.halted()) { return; } ___v550793++;   if (___v550793 % 100 == 0) { await QB.autoLimit(); }
      if ((QB.func_UCase( QB.arrayValue(parts, [ k]).value))  ==  "GOTO"  | (QB.func_UCase( QB.arrayValue(parts, [ k]).value))  ==  "GOSUB" ) {
         OnGotoIndex =  k;
         return OnGotoIndex;
      }
   } 
return OnGotoIndex;
}
async function func_ConvertViewPrint(parts/*STRING*/,c/*INTEGER*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; c = Math.round(c); lineNumber = Math.round(lineNumber); 
var ConvertViewPrint = null;
/* implicit variables: */ 
   var k = 0;  /* INTEGER */ 
   var toAt = 0;  /* INTEGER */ 
   ConvertViewPrint = "";
   if ( c < 3) {
      ConvertViewPrint = "QB.sub_ViewPrint();";
      return ConvertViewPrint;
   }
   toAt = Math.round(  0 );
   var ___v357299 = 0; ___l3810077: for ( k=  3; (1 > 0) ? ( k <=  c) : ( k >=  c);  k+=1) { if (QB.halted()) { return; } ___v357299++;   if (___v357299 % 100 == 0) { await QB.autoLimit(); }
      if ((QB.func_UCase( QB.arrayValue(parts, [ k]).value))  ==  "TO" ) {
         toAt = Math.round(  k );
         break ___l3810077;
      }
   } 
   if ( toAt < 4 |  toAt ==   c) {
      await sub_AddWarning(  lineNumber,   "Expected VIEW PRINT top TO bottom");
      return ConvertViewPrint;
   }
   ConvertViewPrint = "QB.sub_ViewPrint("  + (await func_ConvertExpression( (await func_Join( parts ,    3,    toAt -  1,   " ")) ,    lineNumber))  + ", "  + (await func_ConvertExpression( (await func_Join( parts ,    toAt +  1,    - 1,   " ")) ,    lineNumber))  + ");";
return ConvertViewPrint;
}
async function func_IsLineNumber(s/*STRING*/) {
if (QB.halted()) { return; }; 
var IsLineNumber = null;
/* implicit variables: */ 
   var i = 0;  /* INTEGER */ 
   var ch = '';  /* STRING */ 
   IsLineNumber =  False;
   if ((QB.func_Len(  s))  < 1) {
      return IsLineNumber;
   }
   var ___v9516727 = 0; ___l8615415: for ( i=  1; (1 > 0) ? ( i <= (QB.func_Len(  s))) : ( i >= (QB.func_Len(  s)));  i+=1) { if (QB.halted()) { return; } ___v9516727++;   if (___v9516727 % 100 == 0) { await QB.autoLimit(); }
      ch = (QB.func_Mid(  s,    i,    1));
      if ( ch <"0"  |  ch >"9" ) {
         return IsLineNumber;
      }
   } 
   IsLineNumber =  True;
return IsLineNumber;
}
async function sub_BeginGotoScope(isMain/*INTEGER*/) {
if (QB.halted()) { return; }; isMain = Math.round(isMain); 
/* implicit variables: */ 
   gotoMode = Math.round(  True );
   gotoIsMain = Math.round(  isMain );
   QB.resizeArray(gotoLabels, [{l:0,u: 0}], '', false);  /* STRING */ 
   QB.resizeArray(gotoDefined, [{l:0,u: 0}], 0, false);  /* INTEGER */ 
   QB.resizeArray(gotoUseLine, [{l:0,u: 0}], 0, false);  /* INTEGER */ 
   await sub_AddJSLine(  0,   "var ___pc = 0, ___gs = [], ___n = 0; ___d: for (;;) { if (QB.halted()) { return; } if (++___n % 100 == 0) { await QB.autoLimit(); } switch (___pc) { case 0:");
   gotoOpenLine = Math.round( (QB.func_UBound(  jsLines)) );
}
async function sub_EndGotoScope() {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   var k = 0;  /* INTEGER */ 
   var lbl = '';  /* STRING */ 
   await sub_AddJSLine(  0,   "break ___d; } }");
   var ___v5059488 = 0; ___l1660812: for ( k=  1; (1 > 0) ? ( k <= (QB.func_UBound(  gotoLabels))) : ( k >= (QB.func_UBound(  gotoLabels)));  k+=1) { if (QB.halted()) { return; } ___v5059488++;   if (___v5059488 % 100 == 0) { await QB.autoLimit(); }
      if (QB.arrayValue(gotoLabels, [ k]).value  !=  ""  && ~QB.arrayValue(gotoDefined, [ k]).value ) {
         await sub_AddError( QB.arrayValue(gotoUseLine, [ k]).value ,   "Label not defined: "  + QB.arrayValue(gotoLabels, [ k]).value);
      }
   } 
   if ( gotoIsMain) {
      lbl = "";
      var ___v7915529 = 0; ___l2245664: for ( k=  1; (1 > 0) ? ( k <= (QB.func_UBound(  gotoLabels))) : ( k >= (QB.func_UBound(  gotoLabels)));  k+=1) { if (QB.halted()) { return; } ___v7915529++;   if (___v7915529 % 100 == 0) { await QB.autoLimit(); }
         if (QB.arrayValue(gotoLabels, [ k]).value  !=  ""  && QB.arrayValue(gotoDefined, [ k]).value ) {
            if ( lbl !=  "" ) {
               lbl =  lbl + ", ";
            }
            lbl =  lbl + "'"  + QB.arrayValue(gotoLabels, [ k]).value  + "': "  + (QB.func__Trim( (QB.func_Str(  k))));
         }
      } 
      QB.arrayValue(jsLines, [ gotoOpenLine]).value .text = "var ___lbl = {"  +  lbl + "}; "  + QB.arrayValue(jsLines, [ gotoOpenLine]).value .text;
   }
   gotoMode = Math.round(  False );
}
async function func_NewGotoTarget() {
if (QB.halted()) { return; }; 
var NewGotoTarget = null;
/* implicit variables: */ 
   var n = 0;  /* INTEGER */ 
   n = Math.round( (QB.func_UBound(  gotoLabels))  +  1 );
   QB.resizeArray(gotoLabels, [{l:0,u: n}], '', true);  /* STRING */ 
   QB.resizeArray(gotoDefined, [{l:0,u: n}], 0, true);  /* INTEGER */ 
   QB.resizeArray(gotoUseLine, [{l:0,u: n}], 0, true);  /* INTEGER */ 
   QB.arrayValue(gotoLabels, [ n]).value = "";
   QB.arrayValue(gotoDefined, [ n]).value = Math.round(  False );
   QB.arrayValue(gotoUseLine, [ n]).value = Math.round(  0 );
   NewGotoTarget =  n;
return NewGotoTarget;
}
async function func_LabelGotoTarget(labelName/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var LabelGotoTarget = null;
/* implicit variables: */ 
   var k = 0;  /* INTEGER */ 
   var ___v5360622 = 0; ___l1095753: for ( k=  1; (1 > 0) ? ( k <= (QB.func_UBound(  gotoLabels))) : ( k >= (QB.func_UBound(  gotoLabels)));  k+=1) { if (QB.halted()) { return; } ___v5360622++;   if (___v5360622 % 100 == 0) { await QB.autoLimit(); }
      if (QB.arrayValue(gotoLabels, [ k]).value  ==   labelName) {
         LabelGotoTarget =  k;
         return LabelGotoTarget;
      }
   } 
   k = Math.round( await func_NewGotoTarget() );
   QB.arrayValue(gotoLabels, [ k]).value =  labelName;
   QB.arrayValue(gotoUseLine, [ k]).value = Math.round(  lineNumber );
   LabelGotoTarget =  k;
return LabelGotoTarget;
}
async function func_DefineGotoLabel(labelName/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var DefineGotoLabel = null;
/* implicit variables: */ 
   var k = 0;  /* INTEGER */ 
   k = Math.round( (await func_LabelGotoTarget(  labelName,    lineNumber)) );
   if (QB.arrayValue(gotoDefined, [ k]).value ) {
      await sub_AddError(  lineNumber,   "Duplicate label: "  +  labelName);
   }
   QB.arrayValue(gotoDefined, [ k]).value = Math.round(  True );
   DefineGotoLabel = (await func_CaseJs(  k));
return DefineGotoLabel;
}
async function func_GotoJs(target/*INTEGER*/) {
if (QB.halted()) { return; }; target = Math.round(target); 
var GotoJs = null;
/* implicit variables: */ 
   GotoJs = "___pc = "  + (QB.func__Trim( (QB.func_Str(  target))))  + "; continue ___d;";
return GotoJs;
}
async function func_CaseJs(target/*INTEGER*/) {
if (QB.halted()) { return; }; target = Math.round(target); 
var CaseJs = null;
/* implicit variables: */ 
   if ( target > 0) {
      CaseJs = "case "  + (QB.func__Trim( (QB.func_Str(  target))))  + ":";
   } else {
      CaseJs = "";
   }
return CaseJs;
}
async function func_IsGotoBlockLine(first/*STRING*/,parts/*STRING*/,c/*INTEGER*/) {
if (QB.halted()) { return; }; c = Math.round(c); 
var IsGotoBlockLine = null;
/* implicit variables: */ 
   var second = '';  /* STRING */ 
   IsGotoBlockLine =  False;
   second = "";
   if ( c > 1) {
      second = (QB.func_UCase( QB.arrayValue(parts, [ 2]).value));
   }
   if ( first ==  "IF"  |  first ==  "ELSEIF"  |  first ==  "ELSE"  |  first ==  "ENDIF"  |  first ==  "FOR"  |  first ==  "NEXT"  |  first ==  "DO"  |  first ==  "LOOP"  |  first ==  "WHILE"  |  first ==  "WEND"  |  first ==  "SELECT"  |  first ==  "CASE"  |  first ==  "_CONTINUE"  |  first ==  "CONTINUE" ) {
      IsGotoBlockLine =  True;
   } else if ( first ==  "END"  && ( second ==  "IF"  |  second ==  "SELECT") ) {
      IsGotoBlockLine =  True;
   } else if ( first ==  "EXIT"  && ( second ==  "DO"  |  second ==  "FOR"  |  second ==  "WHILE"  |  second ==  "SELECT"  |  second ==  "CASE") ) {
      IsGotoBlockLine =  True;
   }
return IsGotoBlockLine;
}
async function func_ConvertGoto(first/*STRING*/,parts/*STRING*/,c/*INTEGER*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; c = Math.round(c); lineNumber = Math.round(lineNumber); 
var ConvertGoto = null;
/* implicit variables: */ 
   var k = 0;  /* INTEGER */ var n = 0;  /* INTEGER */ var j = 0;  /* INTEGER */ var ret = 0;  /* INTEGER */ 
   var js = '';  /* STRING */ var tlist = '';  /* STRING */ var ov = '';  /* STRING */ 
   var targets = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   ConvertGoto = "";
   if ( first ==  "GOTO" ) {
      if ( c !=   2) {
         await sub_AddError(  lineNumber,   "Syntax error: GOTO label");
         return ConvertGoto;
      }
      ConvertGoto = (await func_GotoJs( (await func_LabelGotoTarget( (QB.func_UCase( QB.arrayValue(parts, [ 2]).value)) ,    lineNumber))));
   } else if ( first ==  "GOSUB" ) {
      if ( c !=   2) {
         await sub_AddError(  lineNumber,   "Syntax error: GOSUB label");
         return ConvertGoto;
      }
      ret = Math.round( await func_NewGotoTarget() );
      ConvertGoto = "___gs.push("  + (QB.func__Trim( (QB.func_Str(  ret))))  + "); "  + (await func_GotoJs( (await func_LabelGotoTarget( (QB.func_UCase( QB.arrayValue(parts, [ 2]).value)) ,    lineNumber))))  + " "  + (await func_CaseJs(  ret));
   } else if ( first ==  "RETURN" ) {
      js = "if (___gs.length < 1) { QB.sub_Error(3); } ";
      if ( c ==   1) {
         js =  js + "___pc = ___gs.pop(); continue ___d;";
      } else {
         js =  js + "___gs.pop(); "  + (await func_GotoJs( (await func_LabelGotoTarget( (QB.func_UCase( QB.arrayValue(parts, [ 2]).value)) ,    lineNumber))));
      }
      ConvertGoto =  js;
   } else if ( c ==   1 && (await func_IsLineNumber(  first)) ) {
      ConvertGoto = (await func_GotoJs( (await func_LabelGotoTarget(  first,    lineNumber))));
   } else {
      k = Math.round( (await func_OnGotoIndex( parts ,    c)) );
      n = Math.round( (await func_ListSplit( (await func_Join( parts ,    k +  1,    - 1,   " ")) ,   targets)) );
      tlist = "";
      var ___v3032967 = 0; ___l8024389: for ( j=  1; (1 > 0) ? ( j <=  n) : ( j >=  n);  j+=1) { if (QB.halted()) { return; } ___v3032967++;   if (___v3032967 % 100 == 0) { await QB.autoLimit(); }
         if ( j > 1) {
            tlist =  tlist + ",";
         }
         tlist =  tlist + (QB.func__Trim( (QB.func_Str( (await func_LabelGotoTarget( (QB.func_UCase( (await String.func_Trim( QB.arrayValue(targets, [ j]).value)))) ,    lineNumber))))));
      } 
      ov = await func_GenJSVar();
      js = "var "  +  ov + " = Math.round("  + (await func_ConvertExpression( (await func_Join( parts ,    2,    k -  1,   " ")) ,    lineNumber))  + "); ";
      js =  js + "if ("  +  ov + " >= 1 && "  +  ov + " <= "  + (QB.func__Trim( (QB.func_Str(  n))))  + ") { ";
      if ((QB.func_UCase( QB.arrayValue(parts, [ k]).value))  ==  "GOSUB" ) {
         ret = Math.round( await func_NewGotoTarget() );
         js =  js + "___gs.push("  + (QB.func__Trim( (QB.func_Str(  ret))))  + "); ";
      }
      js =  js + "___pc = ["  +  tlist + "]["  +  ov + " - 1]; continue ___d; }";
      if ((QB.func_UCase( QB.arrayValue(parts, [ k]).value))  ==  "GOSUB" ) {
         js =  js + " "  + (await func_CaseJs(  ret));
      }
      ConvertGoto =  js;
   }
return ConvertGoto;
}
async function sub_DeferJSLines(startIdx/*INTEGER*/) {
if (QB.halted()) { return; }; startIdx = Math.round(startIdx); 
/* implicit variables: */ 
   var k = 0;  /* INTEGER */ var n = 0;  /* INTEGER */ 
   var ___v3082602 = 0; ___l882600: for ( k=  startIdx; (1 > 0) ? ( k <= (QB.func_UBound(  jsLines))) : ( k >= (QB.func_UBound(  jsLines)));  k+=1) { if (QB.halted()) { return; } ___v3082602++;   if (___v3082602 % 100 == 0) { await QB.autoLimit(); }
      n = Math.round( (QB.func_UBound(  deferredJS))  +  1 );
      QB.resizeArray(deferredJS, [{l:0,u: n}], {line:0,text:'',mtype:0,moduleId:0,module:0}, true);  /* CODELINE */ 
      QB.arrayValue(deferredJS, [ n]).value .line = Math.round( QB.arrayValue(jsLines, [ k]).value .line );
      QB.arrayValue(deferredJS, [ n]).value .text = QB.arrayValue(jsLines, [ k]).value .text;
   } 
   QB.resizeArray(jsLines, [{l:0,u: startIdx -  1}], {line:0,text:'',mtype:0,moduleId:0,module:0}, true);  /* CODELINE */ 
}
async function sub_FlushDeferredJS() {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   var k = 0;  /* INTEGER */ 
   var ___v7516135 = 0; ___l6110892: for ( k=  1; (1 > 0) ? ( k <= (QB.func_UBound(  deferredJS))) : ( k >= (QB.func_UBound(  deferredJS)));  k+=1) { if (QB.halted()) { return; } ___v7516135++;   if (___v7516135 % 100 == 0) { await QB.autoLimit(); }
      await sub_AddJSLine( QB.arrayValue(deferredJS, [ k]).value .line,   QB.arrayValue(deferredJS, [ k]).value .text);
   } 
   QB.resizeArray(deferredJS, [{l:0,u: 0}], {line:0,text:'',mtype:0,moduleId:0,module:0}, false);  /* CODELINE */ 
}
async function sub_FindErrorHandlers() {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   var i = 0;  /* INTEGER */ var c = 0;  /* INTEGER */ var n = 0;  /* INTEGER */ 
   var hparts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var ___v8299279 = 0; ___l3705068: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  lines))) : ( i >= (QB.func_UBound(  lines)));  i+=1) { if (QB.halted()) { return; } ___v8299279++;   if (___v8299279 % 100 == 0) { await QB.autoLimit(); }
      c = Math.round( (await func_SLSplit( (await String.func_Trim( QB.arrayValue(lines, [ i]).value .text)) ,   hparts ,    False)) );
      if ( c > 1) {
         if ((QB.func_UCase( QB.arrayValue(hparts, [ 1]).value))  ==  "ON"  && (QB.func_UCase( QB.arrayValue(hparts, [ 2]).value))  ==  "ERROR" ) {
            onErrorMode = Math.round(  True );
            if ( c ==   4 && (QB.func_UCase( QB.arrayValue(hparts, [ 3]).value))  ==  "GOTO"  && QB.arrayValue(hparts, [ 4]).value  !=  "0" ) {
               if (~(await func_IsErrorHandler( (QB.func_UCase( QB.arrayValue(hparts, [ 4]).value)))) ) {
                  n = Math.round( (QB.func_UBound(  errHandlers))  +  1 );
                  QB.resizeArray(errHandlers, [{l:0,u: n}], '', true);  /* STRING */ 
                  QB.arrayValue(errHandlers, [ n]).value = (QB.func_UCase( QB.arrayValue(hparts, [ 4]).value));
               }
            }
         }
      }
   } 
}
async function sub_FindReferencedLabels(sourceLines/*STRING*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   var i = 0;  /* INTEGER */ var j = 0;  /* INTEGER */ var c = 0;  /* INTEGER */ var n = 0;  /* INTEGER */ 
   var rparts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var ___v8279706 = 0; ___l1908614: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  sourceLines))) : ( i >= (QB.func_UBound(  sourceLines)));  i+=1) { if (QB.halted()) { return; } ___v8279706++;   if (___v8279706 % 100 == 0) { await QB.autoLimit(); }
      if ((QB.func_InStr( (QB.func_UCase( QB.arrayValue(sourceLines, [ i]).value)) ,   "GOTO"))  > 0 | (QB.func_InStr( (QB.func_UCase( QB.arrayValue(sourceLines, [ i]).value)) ,   "GOSUB"))  > 0 | (QB.func_InStr( (QB.func_UCase( QB.arrayValue(sourceLines, [ i]).value)) ,   "RESTORE"))  > 0 | (QB.func_InStr( (QB.func_UCase( QB.arrayValue(sourceLines, [ i]).value)) ,   "RESUME"))  > 0) {
         c = Math.round( (await func_SLSplit( (await String.func_Replace( QB.arrayValue(sourceLines, [ i]).value ,   (QB.func_Chr(  13)) ,   "")) ,   rparts ,    False)) );
         var ___v9492710 = 0; ___l9444140: for ( j=  1; (1 > 0) ? ( j <=  c -  1) : ( j >=  c -  1);  j+=1) { if (QB.halted()) { return; } ___v9492710++;   if (___v9492710 % 100 == 0) { await QB.autoLimit(); }
            var rword = '';  /* STRING */ 
            rword = (QB.func_UCase( QB.arrayValue(rparts, [ j]).value));
            if ( rword ==  "GOTO"  |  rword ==  "GOSUB"  |  rword ==  "RESTORE"  |  rword ==  "RESUME" ) {
               var rrest = '';  /* STRING */ 
               rrest = (await func_Join( rparts ,    j +  1,    - 1,   " "));
               if ((QB.func_InStr(  rrest,   ":"))  > 0) {
                  rrest = (QB.func_Left(  rrest,   (QB.func_InStr(  rrest,   ":"))  -  1));
               }
               var rnames = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
               var rk = 0;  /* INTEGER */ var rcount = 0;  /* INTEGER */ 
               rcount = Math.round( (await func_Split(  rrest,   "," ,   rnames)) );
               var ___v7912182 = 0; ___l5596389: for ( rk=  1; (1 > 0) ? ( rk <=  rcount) : ( rk >=  rcount);  rk+=1) { if (QB.halted()) { return; } ___v7912182++;   if (___v7912182 % 100 == 0) { await QB.autoLimit(); }
                  var rname = '';  /* STRING */ 
                  rname = (QB.func_UCase( (await String.func_Trim( QB.arrayValue(rnames, [ rk]).value))));
                  if ( rname ==  "0"  || ( rword ==  "RESUME"  &&  rname ==  "NEXT") ) {
                     rname = "";
                  }
                  if ( rname !=  ""  && ~(await func_IsReferencedLabel(  rname)) ) {
                     n = Math.round( (QB.func_UBound(  refLabels))  +  1 );
                     QB.resizeArray(refLabels, [{l:0,u: n}], '', true);  /* STRING */ 
                     QB.arrayValue(refLabels, [ n]).value =  rname;
                  }
               } 
            }
         } 
      }
   } 
}
async function func_IsReferencedLabel(labelName/*STRING*/) {
if (QB.halted()) { return; }; 
var IsReferencedLabel = null;
/* implicit variables: */ 
   var i = 0;  /* INTEGER */ 
   IsReferencedLabel =  False;
   var ___v6209402 = 0; ___l959311: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  refLabels))) : ( i >= (QB.func_UBound(  refLabels)));  i+=1) { if (QB.halted()) { return; } ___v6209402++;   if (___v6209402 % 100 == 0) { await QB.autoLimit(); }
      if (QB.arrayValue(refLabels, [ i]).value  ==   labelName) {
         IsReferencedLabel =  True;
         return IsReferencedLabel;
      }
   } 
return IsReferencedLabel;
}
async function sub_AddErrorHandlers(segStart/*INTEGER*/,segEnd/*INTEGER*/,segCount/*INTEGER*/) {
if (QB.halted()) { return; }; segCount = Math.round(segCount); 
/* implicit variables: */ 
   var h = 0;  /* INTEGER */ var k = 0;  /* INTEGER */ var s = 0;  /* INTEGER */ var found = 0;  /* INTEGER */ var entry = 0;  /* INTEGER */ 
   var hname = '';  /* STRING */ 
   var ___v8582140 = 0; ___l4159691: for ( h=  1; (1 > 0) ? ( h <= (QB.func_UBound(  errHandlers))) : ( h >= (QB.func_UBound(  errHandlers)));  h+=1) { if (QB.halted()) { return; } ___v8582140++;   if (___v8582140 % 100 == 0) { await QB.autoLimit(); }
      found = Math.round(  False );
      var ___v4216568 = 0; ___l2369846: for ( k=  1; (1 > 0) ? ( k <= (QB.func_UBound(  codeLabels))) : ( k >= (QB.func_UBound(  codeLabels)));  k+=1) { if (QB.halted()) { return; } ___v4216568++;   if (___v4216568 % 100 == 0) { await QB.autoLimit(); }
         if (QB.arrayValue(codeLabels, [ k]).value .text ==  QB.arrayValue(errHandlers, [ h]).value ) {
            var ___v8444489 = 0; ___l5921883: for ( s=  1; (1 > 0) ? ( s <=  segCount) : ( s >=  segCount);  s+=1) { if (QB.halted()) { return; } ___v8444489++;   if (___v8444489 % 100 == 0) { await QB.autoLimit(); }
               if (QB.arrayValue(codeLabels, [ k]).value .index >= QB.arrayValue(segStart, [ s]).value  && QB.arrayValue(codeLabels, [ k]).value .index <= QB.arrayValue(segEnd, [ s]).value  +  1) {
                  found = Math.round(  True );
               }
            } 
         }
      } 
      if (~ found) {
         if ((await func_FindCodeLabel( QB.arrayValue(errHandlers, [ h]).value)) ) {
            await sub_AddWarning(  0,   "ON ERROR handler '"  + QB.arrayValue(errHandlers, [ h]).value  + "' must be in the main program, not in a SUB or FUNCTION");
         }
         continue;
      }
      hname = (await func_ErrorHandlerJSName( QB.arrayValue(errHandlers, [ h]).value));
      await sub_AddJSLine(  0,   "async function "  +  hname + "() {");
      QB.arrayValue(jsLines, [ errRegLine]).value .text = QB.arrayValue(jsLines, [ errRegLine]).value .text + "QB.defineErrorHandler('"  + QB.arrayValue(errHandlers, [ h]).value  + "', "  +  hname + "); ";
      errCopyMode = Math.round(  True );
      await sub_BeginGotoScope(  False);
      var ___v3158374 = 0; ___l9836021: for ( s=  1; (1 > 0) ? ( s <=  segCount) : ( s >=  segCount);  s+=1) { if (QB.halted()) { return; } ___v3158374++;   if (___v3158374 % 100 == 0) { await QB.autoLimit(); }
         await sub_ConvertLines( QB.arrayValue(segStart, [ s]).value ,   QB.arrayValue(segEnd, [ s]).value ,   "");
      } 
      entry = Math.round( (await func_LabelGotoTarget( QB.arrayValue(errHandlers, [ h]).value ,    0)) );
      await sub_EndGotoScope();
      QB.arrayValue(jsLines, [ gotoOpenLine]).value .text = (await String.func_Replace( QB.arrayValue(jsLines, [ gotoOpenLine]).value .text,   "var ___pc = 0," ,   "var ___pc = "  + (QB.func__Trim( (QB.func_Str(  entry))))  + ","));
      errCopyMode = Math.round(  False );
      await sub_AddJSLine(  0,   "return -1; }");
   } 
}
async function func_IsErrorHandler(labelName/*STRING*/) {
if (QB.halted()) { return; }; 
var IsErrorHandler = null;
/* implicit variables: */ 
   var i = 0;  /* INTEGER */ 
   IsErrorHandler =  False;
   var ___v546714 = 0; ___l7575471: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  errHandlers))) : ( i >= (QB.func_UBound(  errHandlers)));  i+=1) { if (QB.halted()) { return; } ___v546714++;   if (___v546714 % 100 == 0) { await QB.autoLimit(); }
      if (QB.arrayValue(errHandlers, [ i]).value  ==   labelName) {
         IsErrorHandler =  True;
         return IsErrorHandler;
      }
   } 
return IsErrorHandler;
}
async function func_FindCodeLabel(labelName/*STRING*/) {
if (QB.halted()) { return; }; 
var FindCodeLabel = null;
/* implicit variables: */ 
   var i = 0;  /* INTEGER */ 
   FindCodeLabel =  False;
   var ___v6712186 = 0; ___l4840382: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  codeLabels))) : ( i >= (QB.func_UBound(  codeLabels)));  i+=1) { if (QB.halted()) { return; } ___v6712186++;   if (___v6712186 % 100 == 0) { await QB.autoLimit(); }
      if (QB.arrayValue(codeLabels, [ i]).value .text ==   labelName) {
         FindCodeLabel =  True;
         return FindCodeLabel;
      }
   } 
return FindCodeLabel;
}
async function func_ErrorHandlerJSName(labelName/*STRING*/) {
if (QB.halted()) { return; }; 
var ErrorHandlerJSName = null;
/* implicit variables: */ 
   ErrorHandlerJSName = "___err_"  + (await String.func_Replace(  labelName,   "." ,   "_"));
return ErrorHandlerJSName;
}
async function func_WrapForErrors(first/*STRING*/,js/*STRING*/,sourceLine/*INTEGER*/) {
if (QB.halted()) { return; }; sourceLine = Math.round(sourceLine); 
var WrapForErrors = null;
/* implicit variables: */ 
   WrapForErrors =  js;
   if ( js ==   undefined ||  js ==  "" ) {
      return WrapForErrors;
   }
   if ( first ==  "IF"  |  first ==  "ELSEIF"  |  first ==  "ELSE"  |  first ==  "END"  |  first ==  "ENDIF"  |  first ==  "FOR"  |  first ==  "NEXT"  |  first ==  "DO"  |  first ==  "LOOP"  |  first ==  "WHILE"  |  first ==  "WEND"  |  first ==  "SELECT"  |  first ==  "CASE"  |  first ==  "EXIT"  |  first ==  "_CONTINUE"  |  first ==  "CONTINUE"  |  first ==  "CONST"  |  first ==  "SYSTEM"  |  first ==  "ON"  |  first ==  "RESUME"  |  first ==  "TYPE"  |  first ==  "OPTION"  |  first ==  "EXPORT"  | (QB.func_Left(  first,    1))  ==  "$"  |  first ==  "GOTO"  |  first ==  "GOSUB"  |  first ==  "RETURN"  | (await func_IsLineNumber(  first)) ) {
      return WrapForErrors;
   }
   if ((QB.func_Left(  js,    2))  ==  "//" ) {
      return WrapForErrors;
   }
   if ((QB.func_InStr(  js,   "break;"))  > 0 | (QB.func_InStr(  js,   "continue;"))  > 0) {
      return WrapForErrors;
   }
   if ( gotoMode &&  gotoIsMain) {
      WrapForErrors = "for(;;) { try { "  +  js + " } catch(___e) { var ___r = await QB.handleError(___e, "  + (QB.func__Trim( (QB.func_Str(  sourceLine))))  + ", true); if (___r == 1) { continue; } if (___r == 3) { ___pc = ___lbl[QB.resumeLabel()]; continue ___d; } if (___r != 2) { return; } } break; }";
   } else {
      WrapForErrors = "for(;;) { try { "  +  js + " } catch(___e) { var ___r = await QB.handleError(___e, "  + (QB.func__Trim( (QB.func_Str(  sourceLine))))  + ", false); if (___r == 1) { continue; } if (___r != 2) { return; } } break; }";
   }
return WrapForErrors;
}
async function func_DebugHook(first/*STRING*/,l/*STRING*/,js/*STRING*/,i/*INTEGER*/) {
if (QB.halted()) { return; }; i = Math.round(i); 
var DebugHook = null;
/* implicit variables: */ 
   DebugHook = "";
   var t = '';  /* STRING */ 
   t = (QB.func_LTrim(  js));
   if ((QB.func_Left(  t,    1))  ==  "}"  | (QB.func_Left(  t,    2))  ==  "//"  | (QB.func_Left(  t,    2))  ==  "/*"  | (QB.func_Left(  t,    5))  ==  "case "  | (QB.func_Left(  t,    8))  ==  "default:" ) {
      return DebugHook;
   }
   if ( first ==  "CASE"  |  first ==  "ELSE"  |  first ==  "ELSEIF"  |  first ==  "NEXT"  |  first ==  "LOOP"  |  first ==  "WEND"  |  first ==  "ENDIF"  |  first ==  "DECLARE"  |  first ==  "TYPE"  | (QB.func_Left(  first,    1))  ==  "$" ) {
      return DebugHook;
   }
   if ( first ==  "END"  && (await String.func_Trim( (QB.func_Mid(  l,    4))))  !=  "" ) {
      return DebugHook;
   }
   if ( debugLastLine > 0) {
      if (QB.arrayValue(lines, [ debugLastLine]).value .line ==  QB.arrayValue(lines, [ i]).value .line && QB.arrayValue(lines, [ debugLastLine]).value .module ==  QB.arrayValue(lines, [ i]).value .module) {
         return DebugHook;
      }
   }
   debugLastLine = Math.round(  i );
   var f = '';  /* STRING */ var ln = '';  /* STRING */ 
   f = "";
   if (QB.arrayValue(lines, [ i]).value .module !=   undefined) {
      f = QB.arrayValue(lines, [ i]).value .module.path;
   }
   f = (await func_JSStringLiteral(  f));
   ln = (QB.func__Trim( (QB.func_Str( QB.arrayValue(lines, [ i]).value .line))));
   DebugHook = "if (QB.dbgHit("  +  ln + ", "  +  f + ")) { await QB.dbgPause("  +  ln + ", "  +  f + ", (___x) => eval(___x), "  + (await func_JSStringLiteral(  debugScope))  + "); } ";
return DebugHook;
}
async function func_DebugVarList(vlist/*VARIABLE*/) {
if (QB.halted()) { return; }; 
var DebugVarList = null;
/* implicit variables: */ 
   var r = '';  /* STRING */ var j = '';  /* STRING */ 
   var i = 0;  /* INTEGER */ 
   r = "[";
   var ___v4235128 = 0; ___l3713350: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  vlist))) : ( i >= (QB.func_UBound(  vlist)));  i+=1) { if (QB.halted()) { return; } ___v4235128++;   if (___v4235128 % 100 == 0) { await QB.autoLimit(); }
      j = QB.arrayValue(vlist, [ i]).value .jsname;
      if ( j ==  "" ) {
         j = QB.arrayValue(vlist, [ i]).value .name;
      }
      if (~QB.arrayValue(vlist, [ i]).value .isConst && QB.arrayValue(vlist, [ i]).value .type !=  "CONST"  && (QB.func_InStr(  j,   "."))  ==   0 && QB.arrayValue(vlist, [ i]).value .type !=  "SUB"  && QB.arrayValue(vlist, [ i]).value .type !=  "FUNCTION"  &&  j !=  "" ) {
         if ( r !=  "[" ) {
            r =  r + ", ";
         }
         r =  r + "{ n: "  + (await func_JSStringLiteral( (await func_SpelledName( QB.arrayValue(vlist, [ i]).value))))  + ", j: "  + (await func_JSStringLiteral(  j))  + ", t: "  + (await func_JSStringLiteral( QB.arrayValue(vlist, [ i]).value .type));
         if (QB.arrayValue(vlist, [ i]).value .isArray) {
            r =  r + ", a: 1";
         }
         r =  r + " }";
      }
   } 
   DebugVarList =  r + "]";
return DebugVarList;
}
async function func_SourceLocation(i/*INTEGER*/) {
if (QB.halted()) { return; }; i = Math.round(i); 
var SourceLocation = null;
/* implicit variables: */ 
   var f = '';  /* STRING */ 
   f = "";
   if ( i > 0) {
      if (QB.arrayValue(lines, [ i]).value .module !=   undefined) {
         f = QB.arrayValue(lines, [ i]).value .module.path;
      }
      SourceLocation = (QB.func__Trim( (QB.func_Str( QB.arrayValue(lines, [ i]).value .line))))  + ", "  + (await func_JSStringLiteral(  f));
   } else {
      SourceLocation = "0, "  + (QB.func_Chr(  34))  + (QB.func_Chr(  34));
   }
return SourceLocation;
}
async function sub_SetDebugMode(d/*INTEGER*/) {
if (QB.halted()) { return; }; d = Math.round(d); 
/* implicit variables: */ 
   debugMode = Math.round(  d );
}
async function func_GetParenDepth(text/*STRING*/) {
if (QB.halted()) { return; }; 
var GetParenDepth = null;
/* implicit variables: */ 
   var p = 0;  /* LONG */ var curpos = 0;  /* LONG */ var arrpos = 0;  /* LONG */ var dpos = 0;  /* LONG */ 
   var cstr = '';  /* STRING */ 
   cstr = (await String.func_Trim(  text));
   var quoteMode = 0;  /* INTEGER */ 
   var paren = 0;  /* INTEGER */ 
   var i = 0;  /* INTEGER */ 
   var ___v5244827 = 0; ___l9968987: for ( i=  1; (1 > 0) ? ( i <= (QB.func_Len(  cstr))) : ( i >= (QB.func_Len(  cstr)));  i+=1) { if (QB.halted()) { return; } ___v5244827++;   if (___v5244827 % 100 == 0) { await QB.autoLimit(); }
      var c = '';  /* STRING */ 
      c = (QB.func_Mid(  cstr,    i,    1));
      if ( c ==  (QB.func_Chr(  34)) ) {
         quoteMode = Math.round( ~ quoteMode );
      } else if ( quoteMode) {
      } else if ( c ==  "(" ) {
         paren = Math.round(  paren +  1 );
      } else if ( c ==  ")" ) {
         paren = Math.round(  paren -  1 );
      }
   } 
   GetParenDepth =  paren;
return GetParenDepth;
}
async function func_IsIntegerVar(text/*STRING*/) {
if (QB.halted()) { return; }; 
var IsIntegerVar = null;
/* implicit variables: */ 
   var typeName = '';  /* STRING */ 
   typeName = (await func_GetVarType(  text));
   if ( typeName ==  "_BIT"  |  typeName ==  "_UNSIGNED _BIT"  |  typeName ==  "_BYTE"  |  typeName ==  "_UNSIGNED _BYTE"  |  typeName ==  "INTEGER"  |  typeName ==  "_UNSIGNED INTEGER"  |  typeName ==  "LONG"  |  typeName ==  "_UNSIGNED LONG"  |  typeName ==  "_INTEGER64"  |  typeName ==  "_UNSIGNED _INTEGER64" ) {
      IsIntegerVar =  True;
   }
return IsIntegerVar;
}
async function func_IsValidVarname(varname/*STRING*/) {
if (QB.halted()) { return; }; 
var IsValidVarname = null;
/* implicit variables: */ 
   var vname = '';  /* STRING */ var s = '';  /* STRING */ 
   var i = 0;  /* INTEGER */ var c = 0;  /* INTEGER */ var valid = 0;  /* INTEGER */ 
   valid = Math.round(  True );
   vname = (await String.func_Trim(  varname));
   if ( vname ==  "true"  |  vname ==  "false" ) {
      IsValidVarname =  False;
      return IsValidVarname;
   }
   vname = (QB.func_UCase( (await func_RemoveSuffix(  vname))));
   if ( vname ==  "TO"  |  vname ==  "UNDEFINED" ) {
      IsValidVarname =  False;
      return IsValidVarname;
   }
   if ((QB.func_Mid(  vname,    1,    4))  ==  "SUB_"  | (QB.func_Mid(  vname,    1,    5))  ==  "FUNC_" ) {
      IsValidVarname =  False;
      return IsValidVarname;
   }
   c = Math.round( (QB.func_Asc( (QB.func_Mid(  vname,    1,    1)))) );
   if (( c >=  65 &  c <=  90)  |  c ==   95) {
      var ___v9061123 = 0; ___l8860056: for ( i=  2; (1 > 0) ? ( i <= (QB.func_Len(  vname))) : ( i >= (QB.func_Len(  vname)));  i+=1) { if (QB.halted()) { return; } ___v9061123++;   if (___v9061123 % 100 == 0) { await QB.autoLimit(); }
         c = Math.round( (QB.func_Asc( (QB.func_Mid(  vname,    i,    1)))) );
         if (( c >=  65 &  c <=  90)  | ( c >=  48 &  c <=  57)  |  c ==   95) {
         } else {
            valid = Math.round(  False );
            break ___l8860056;
         }
      } 
   } else {
      valid = Math.round(  False );
   }
   IsValidVarname =  valid;
return IsValidVarname;
}
async function func_BeginPhraseFor(endPhrase/*STRING*/) {
if (QB.halted()) { return; }; 
var BeginPhraseFor = null;
/* implicit variables: */ 
   var bp = '';  /* STRING */ 
   ___v968821: { var ___v7192662 =  endPhrase; 
      if (___v7192662 == "NEXT") {___v2003016: { 
      bp = "FOR";
      } } else if (___v7192662 == "LOOP") {___v1187419: { 
      bp = "DO";
      } } else if (___v7192662 == "WEND") {___v8648248: { 
      bp = "WHILE";
      } } else if (___v7192662 == "END IF"  || ___v7192662 ==   "ENDIF") {___v5598645: { 
      bp = "IF";
      } } else if (___v7192662 == "END SELECT") {___v3623797: { 
      bp = "SELECT";
    }  } } 
   BeginPhraseFor =  bp;
return BeginPhraseFor;
}
async function func_EndPhraseFor(beginPhrase/*STRING*/) {
if (QB.halted()) { return; }; 
var EndPhraseFor = null;
/* implicit variables: */ 
   var ep = '';  /* STRING */ 
   ___v9919851: { var ___v2294313 =  beginPhrase; 
      if (___v2294313 == "FOR") {___v506980: { 
      ep = "NEXT";
      } } else if (___v2294313 == "DO") {___v5229358: { 
      ep = "LOOP";
      } } else if (___v2294313 == "WHILE") {___v985931: { 
      ep = "WEND";
      } } else if (___v2294313 == "IF") {___v5820094: { 
      ep = "END IF";
      } } else if (___v2294313 == "SELECT") {___v9380960: { 
      ep = "END SELECT";
    }  } } 
   EndPhraseFor =  ep;
return EndPhraseFor;
}
async function func_CheckBlockEnd(cstack/*CONTAINER*/,cindex/*INTEGER*/,endPhrase/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; cindex = Math.round(cindex); lineNumber = Math.round(lineNumber); 
var CheckBlockEnd = null;
/* implicit variables: */ 
   var ctype = '';  /* STRING */ var beginPhrase = '';  /* STRING */ 
   var success = 0;  /* INTEGER */ 
   success = Math.round(  True );
   beginPhrase = (await func_BeginPhraseFor(  endPhrase));
   if ( cindex > 0) {
      ctype = QB.arrayValue(cstack, [ cindex]).value .type;
   }
   if ( ctype ==  "CASE"  &  beginPhrase ==  "SELECT" ) {
      ctype = QB.arrayValue(cstack, [ cindex -  1]).value .type;
   }
   if ( ctype !=   beginPhrase) {
      await sub_AddError(  lineNumber,    endPhrase + " without "  +  beginPhrase);
      success = Math.round(  False );
   }
   CheckBlockEnd =  success;
return CheckBlockEnd;
}
async function func_FixCondition(word/*STRING*/,parts/*STRING*/,idx/*INTEGER*/,prefix/*STRING*/) {
if (QB.halted()) { return; }; idx = Math.round(idx); 
var FixCondition = null;
/* implicit variables: */ 
   FixCondition = "";
   var c = 0;  /* INTEGER */ var j = 0;  /* INTEGER */ 
   var ___v6696478 = 0; ___l1383297: for ( j=  0; (1 > 0) ? ( j <= (QB.func_UBound(  condWords))) : ( j >= (QB.func_UBound(  condWords)));  j+=1) { if (QB.halted()) { return; } ___v6696478++;   if (___v6696478 % 100 == 0) { await QB.autoLimit(); }
      if ((QB.func_InStr(  word,   QB.arrayValue(condWords, [ j]).value  + "("))  ==   1) {
         var a1 = '';  /* STRING */ 
         a1 = (QB.func_Mid( QB.arrayValue(parts, [ idx]).value ,   (QB.func_Len( QB.arrayValue(condWords, [ j]).value))  +  1));
         c = Math.round( (await func_SLSplit(  prefix + QB.arrayValue(condWords, [ j]).value  + " "  +  a1 + (await func_Join( parts ,    idx +  1,    - 1,   " ")) ,   parts ,    True)) );
         FixCondition = QB.arrayValue(condWords, [ j]).value;
         break ___l1383297;
      }
   } 
return FixCondition;
}
async function sub_ParseExport(s/*STRING*/,lineIndex/*INTEGER*/) {
if (QB.halted()) { return; }; lineIndex = Math.round(lineIndex); 
/* implicit variables: */ 
   var exportedItem = '';  /* STRING */ 
   var ef = {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0};  /* METHOD */ 
   var es = {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0};  /* METHOD */ 
   var ev = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
   var exportName = '';  /* STRING */ 
   var parts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var found = 0;  /* INTEGER */ 
   found = Math.round(  False );
   var c = 0;  /* INTEGER */ 
   c = Math.round( (await func_SLSplit(  s,   parts ,    False)) );
   if ((await func_FindMethod( QB.arrayValue(parts, [ 1]).value ,    es,   "SUB" ,    False)) ) {
      if ( c > 2) {
         exportName = QB.arrayValue(parts, [ 3]).value;
      } else {
         exportName = QB.arrayValue(parts, [ 1]).value;
      }
      exportedItem =  es.jsname;
      es.name =  exportName;
      await sub_AddLibMethod(  es);
      exportName = "sub_"  +  exportName;
      await sub_RegisterExport(  exportName,    exportedItem);
      found = Math.round(  True );
   }
   if ((await func_FindMethod( QB.arrayValue(parts, [ 1]).value ,    ef,   "FUNCTION" ,    False)) ) {
      if ( c > 2) {
         exportName = QB.arrayValue(parts, [ 3]).value;
      } else {
         exportName = QB.arrayValue(parts, [ 1]).value;
      }
      exportedItem =  ef.jsname;
      ef.name =  exportName;
      await sub_AddLibMethod(  ef);
      exportName = "func_"  +  exportName;
      await sub_RegisterExport(  exportName,    exportedItem);
      found = Math.round(  True );
   }
   if ((await func_FindVariable( QB.arrayValue(parts, [ 1]).value ,    ev,    False)) ) {
      if ( ev.isConst ==   True) {
         if ( c > 2) {
            exportName = QB.arrayValue(parts, [ 3]).value;
         } else {
            exportName = QB.arrayValue(parts, [ 1]).value;
         }
         exportedItem =  ev.jsname;
         ev.name =  exportName;
         exportedItem =  ev.jsname;
         if ( exportName ==  "" ) {
            exportName = QB.arrayValue(parts, [ 1]).value;
         }
         ev.name =  exportName;
         await sub_AddLibConst(  exportName);
         await sub_RegisterExport(  exportName,    exportedItem);
         found = Math.round(  True );
      }
   }
   if (~ found) {
      await sub_AddWarning(  lineIndex,   "Invalid export ["  + QB.arrayValue(parts, [ 1]).value  + "].  Exported items must be a Sub, Function or Const in the current module.");
   }
}
async function sub_RegisterExport(exportName/*STRING*/,exportedItem/*STRING*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   var esize = 0;  /* SINGLE */ 
   esize = (QB.func_UBound(  exportLines))  +  1;
   QB.resizeArray(exportLines, [{l:0,u: esize}], '', true);  /* STRING */ 
   QB.arrayValue(exportLines, [ esize]).value =  exportName + ": "  +  exportedItem + ",";
}
async function func_ConvertSub(m/*METHOD*/,args/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertSub = null;
/* implicit variables: */ 
   var js = '';  /* STRING */ 
   if ( m.name ==  "Line"  |  m.name ==  "_Clipboard$"  |  m.name ==  "_ClipboardImage" ) {
      var parts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
      var plen = 0;  /* INTEGER */ 
      plen = Math.round( (await func_SLSplit(  args,   parts ,    False)) );
      if ( plen > 0) {
         if ((QB.func_UCase( QB.arrayValue(parts, [ 1]).value))  ==  "INPUT" ) {
            m.name = "Line Input";
            m.jsname = "QB.sub_LineInput";
            args = (await func_Join( parts ,    2,    - 1,   " "));
            m.sync = Math.round(  True );
         } else if (QB.arrayValue(parts, [ 1]).value  ==  "=" ) {
            ___v3378422: { var ___v8671363 =  m.name; 
               if (___v8671363 == "_Clipboard$") {___v4237103: { 
               m.jsname = "QB.sub__Clipboard";
               } } else if (___v8671363 == "_ClipboardImage") {___v6096486: { 
               m.jsname = "QB.sub__ClipboardImage";
             }  } } 
            args = (await func_Join( parts ,    2,    - 1,   " "));
         }
      }
   }
   if ( m.name ==  "Line" ) {
      js = (await func_CallMethod(  m))  + "("  + (await func_ConvertLine(  args,    lineNumber))  + ");";
   } else if ( m.name ==  "Cls" ) {
      js = (await func_CallMethod(  m))  + "("  + (await func_ConvertCls(  args,    lineNumber))  + ");";
   } else if ( m.name ==  "Open" ) {
      js = (await func_CallMethod(  m))  + "("  + (await func_ConvertOpen(  args,    lineNumber))  + ");";
   } else if ( m.name ==  "Close" ) {
      js = (await func_CallMethod(  m))  + "("  + (await String.func_Replace(  args,   "#" ,   ""))  + ");";
   } else if ( m.name ==  "Seek" ) {
      js = (await func_CallMethod(  m))  + "("  + (await func_ConvertMethodParams( (await String.func_Replace(  args,   "#" ,   "")) ,    lineNumber))  + ");";
   } else if ( m.name ==  "Input" ) {
      if ((await String.func_StartsWith( (await String.func_Trim(  args)) ,   "#")) ) {
         m.jsname = "QB.sub_InputFromFile";
         js = (await func_ConvertFileInput(  m,    args,    lineNumber));
      } else {
         m.jsname = "QB.sub_Input";
         js = (await func_ConvertInput(  m,    args,    lineNumber));
      }
   } else if ( m.name ==  "Line Input" ) {
      if ((await String.func_StartsWith( (await String.func_Trim(  args)) ,   "#")) ) {
         m.jsname = "QB.sub_LineInputFromFile";
         js = (await func_ConvertFileLineInput(  m,    args,    lineNumber));
         m.name = "Line";
         m.jsname = "QB.sub_Line";
      } else {
         js = (await func_ConvertInput(  m,    args,    lineNumber));
         m.name = "Line";
         m.jsname = "QB.sub_Line";
         m.sync = Math.round(  False );
      }
   } else if ( m.name ==  "Mid$" ) {
      js = (await func_ConvertSubMid(  m,    args,    lineNumber));
   } else if ( m.name ==  "Name" ) {
      js = (await func_CallMethod(  m))  + "("  + (await func_ConvertSubName(  args,    lineNumber))  + ");";
   } else if ( m.name ==  "PSet"  |  m.name ==  "Circle"  |  m.name ==  "PReset"  |  m.name ==  "Paint" ) {
      js = (await func_CallMethod(  m))  + "("  + (await func_ConvertPSet(  args,    lineNumber))  + ");";
   } else if ( m.name ==  "?"  |  m.name ==  "Print" ) {
      m.name = "Print";
      js = (await func_ConvertPrint(  m,    args,    lineNumber));
   } else if ( m.name ==  "Put"  |  m.name ==  "Get" ) {
      js = (await func_ConvertPut(  m,    args,    lineNumber));
   } else if ( m.name ==  "Randomize" ) {
      js = (await func_ConvertRandomize(  m,    args,    lineNumber));
   } else if ( m.name ==  "Read" ) {
      js = (await func_ConvertRead(  m,    args,    lineNumber));
   } else if ( m.name ==  "Restore" ) {
      js = (await func_CallMethod(  m))  + "('"  + (QB.func_UCase(  args))  + "');";
   } else if ( m.name ==  "Swap" ) {
      js = (await func_ConvertSwap(  m,    args,    lineNumber));
   } else if ( m.name ==  "Window" ) {
      js = (await func_CallMethod(  m))  + "("  + (await func_ConvertWindow(  args,    lineNumber))  + ");";
   } else if ( m.name ==  "Write" ) {
      js = (await func_ConvertWrite(  m,    args,    lineNumber));
   } else if ( m.name ==  "_PrintString"  |  m.name ==  "PrintString" ) {
      js = (await func_CallMethod(  m))  + "("  + (await func_ConvertPrintString(  args,    lineNumber))  + ");";
   } else if ( m.name ==  "_PutImage"  |  m.name ==  "PutImage" ) {
      js = (await func_CallMethod(  m))  + "("  + (await func_ConvertPutImage(  args,    lineNumber))  + ");";
   } else if ( m.name ==  "_FullScreen"  |  m.name ==  "FullScreen" ) {
      js = (await func_CallMethod(  m))  + "("  + (await func_ConvertFullScreen(  args))  + ");";
   } else if ( m.name ==  "_Echo"  |  m.name ==  "Echo"  |  m.name ==  "_LogTrace"  |  m.name ==  "LogTrace"  |  m.name ==  "_LogInfo"  |  m.name ==  "LogInfo"  |  m.name ==  "_LogWarn"  |  m.name ==  "LogWarn"  |  m.name ==  "_LogError"  |  m.name ==  "LogError" ) {
      var msgArg = '';  /* STRING */ 
      msgArg = (await func_ConvertMethodParams(  args,    lineNumber));
      if ((await String.func_Trim(  msgArg))  ==  "" ) {
         msgArg = "''";
      }
      js = (await func_CallMethod(  m))  + "("  +  msgArg + ", "  + (await func_SourceLocation(  lineNumber))  + ");";
   } else {
      js = (await func_CallMethod(  m))  + "("  + (await func_ConvertMethodParams(  args,    lineNumber))  + ");";
   }
   ConvertSub =  js;
return ConvertSub;
}
async function func_ConvertPut(m/*METHOD*/,args/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertPut = null;
/* implicit variables: */ 
   var parts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var argc = 0;  /* INTEGER */ 
   ConvertPut = "";
   if ((QB.func_Left( (await String.func_Trim(  args)) ,    1))  ==  "("  | (QB.func_UCase( (QB.func_Left( (await String.func_Trim(  args)) ,    4))))  ==  "STEP" ) {
      await sub_AddWarning(  lineNumber,   "Screen "  + (QB.func_UCase(  m.name))  + " (graphics) is not supported - ignoring line");
      return ConvertPut;
   }
   argc = Math.round( (await func_ListSplit(  args,   parts)) );
   if ( argc < 3) {
      await sub_AddWarning(  lineNumber,   (QB.func_UCase(  m.name))  + " without a variable (FIELD buffer) is not supported - ignoring line");
      return ConvertPut;
   }
   var fh = '';  /* STRING */ var position = '';  /* STRING */ var vname = '';  /* STRING */ 
   fh = (await String.func_Trim( QB.arrayValue(parts, [ 1]).value));
   position = (await String.func_Trim( QB.arrayValue(parts, [ 2]).value));
   vname = (await String.func_Trim( QB.arrayValue(parts, [ 3]).value));
   vname = (await String.func_Replace(  vname,   "()" ,   ""));
   fh = (await String.func_Replace(  fh,   "#" ,   ""));
   if ( position ==  "" ) {
      position = "undefined";
   }
   var v = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
   var target = '';  /* STRING */ var flen = '';  /* STRING */ 
   var pidx = 0;  /* INTEGER */ 
   pidx = Math.round( (QB.func_InStr(  vname,   "(")) );
   if ((await func_FindVariable(  vname,    v,    False)) ) {
      target =  v.jsname;
   } else if ((QB.func_InStr(  vname,   "."))  > 0 && (await func_ResolveFieldVar(  vname,    v)) ) {
      target = (await func_ConvertExpression(  vname,    lineNumber));
   } else if ( pidx > 1 & (QB.func_Right(  vname,    1))  ==  ")" ) {
      if (~(await func_FindVariable( (QB.func_Left(  vname,    pidx -  1)) ,    v,    True)) ) {
         await sub_AddWarning(  lineNumber,   "Invalid variable '"  +  vname + "'");
         return ConvertPut;
      }
      target = (await func_ConvertExpression(  vname,    lineNumber));
   } else if ((await func_FindVariable(  vname,    v,    True)) ) {
      target =  v.jsname;
   } else {
      if (~ optionExplicit && (await func_IsValidVarname(  vname)) ) {
         await sub_RegisterImplicitVar(  vname,   (await func_DataTypeFromName(  vname)) ,   "" ,    lineNumber);
      }
      if (~(await func_FindVariable(  vname,    v,    False)) ) {
         await sub_AddWarning(  lineNumber,   "Invalid variable '"  +  vname + "'");
         return ConvertPut;
      }
      target =  v.jsname;
   }
   if ( position !=  "undefined" ) {
      position = (await func_ConvertExpression(  position,    lineNumber));
   }
   flen = "";
   if ( v.fixedLen !=  "" ) {
      flen = ", "  + (await func_ConvertExpression(  v.fixedLen,    lineNumber));
   }
   if ( m.name ==  "Put" ) {
      ConvertPut = (await func_CallMethod(  m))  + "("  + (await func_ConvertExpression(  fh,    lineNumber))  + ", "  +  position + ", '"  +  v.type + "', "  +  target +  flen + ");";
   } else {
      var js = '';  /* STRING */ var varobj = '';  /* STRING */ 
      varobj = await func_GenJSVar();
      js = "var "  +  varobj + " = { value: "  +  target + " }; ";
      js =  js + (await func_CallMethod(  m))  + "("  + (await func_ConvertExpression(  fh,    lineNumber))  + ", "  +  position + ", '"  +  v.type + "', "  +  varobj +  flen + "); ";
      js =  js +  target + " = "  +  varobj + ".value;";
      ConvertPut =  js;
   }
return ConvertPut;
}
async function func_ConvertFullScreen(args/*STRING*/) {
if (QB.halted()) { return; }; 
var ConvertFullScreen = null;
/* implicit variables: */ 
   var parts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var argc = 0;  /* INTEGER */ 
   var mode = '';  /* STRING */ 
   mode = "QB.STRETCH";
   var doSmooth = '';  /* STRING */ 
   doSmooth = "false";
   argc = Math.round( (await func_ListSplit(  args,   parts)) );
   if ( argc > 0) {
      var arg = '';  /* STRING */ 
      arg = (QB.func_UCase( QB.arrayValue(parts, [ 1]).value));
      if ( arg ==  "_OFF"  |  arg ==  "OFF" ) {
         mode = "QB.OFF";
      } else if ( arg ==  "_STRETCH"  |  arg ==  "STRETCH" ) {
         mode = "QB.STRETCH";
      } else if ( arg ==  "_SQUAREPIXELS"  |  arg ==  "SQUAREPIXELS" ) {
         mode = "QB.SQUAREPIXELS";
      }
   }
   if ( argc > 1) {
      if ((QB.func_UCase( QB.arrayValue(parts, [ 2]).value))  ==  "_SMOOTH"  | (QB.func_UCase( QB.arrayValue(parts, [ 2]).value))  ==  "SMOOTH" ) {
         doSmooth = "true";
      }
   }
   ConvertFullScreen =  mode + ", "  +  doSmooth;
return ConvertFullScreen;
}
async function func_ResolveFieldVar(vname/*STRING*/,v/*VARIABLE*/) {
if (QB.halted()) { return; }; 
var ResolveFieldVar = null;
/* implicit variables: */ 
   var fparts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var n = 0;  /* INTEGER */ var i = 0;  /* INTEGER */ var j = 0;  /* INTEGER */ var pidx = 0;  /* INTEGER */ var typeId = 0;  /* INTEGER */ var found = 0;  /* INTEGER */ 
   var base = '';  /* STRING */ 
   ResolveFieldVar =  False;
   n = Math.round( (await func_Split(  vname,   "." ,   fparts)) );
   if ( n < 2) {
      return ResolveFieldVar;
   }
   base = (await String.func_Trim( QB.arrayValue(fparts, [ 1]).value));
   pidx = Math.round( (QB.func_InStr(  base,   "(")) );
   if ( pidx > 1) {
      if (~(await func_FindVariable( (QB.func_Left(  base,    pidx -  1)) ,    v,    True)) ) {
         return ResolveFieldVar;
      }
   } else {
      if (~(await func_FindVariable(  base,    v,    False)) ) {
         return ResolveFieldVar;
      }
   }
   var ___v8784156 = 0; ___l9087062: for ( i=  2; (1 > 0) ? ( i <=  n) : ( i >=  n);  i+=1) { if (QB.halted()) { return; } ___v8784156++;   if (___v8784156 % 100 == 0) { await QB.autoLimit(); }
      typeId = Math.round( (await func_FindTypeId(  v.type)) );
      if ( typeId < 1) {
         return ResolveFieldVar;
      }
      found = Math.round(  False );
      var ___v1999065 = 0; ___l561406: for ( j=  1; (1 > 0) ? ( j <= (QB.func_UBound(  typeVars))) : ( j >= (QB.func_UBound(  typeVars)));  j+=1) { if (QB.halted()) { return; } ___v1999065++;   if (___v1999065 % 100 == 0) { await QB.autoLimit(); }
         if (QB.arrayValue(typeVars, [ j]).value .typeId ==   typeId && (QB.func_UCase( QB.arrayValue(typeVars, [ j]).value .name))  ==  (QB.func_UCase( (await String.func_Trim( QB.arrayValue(fparts, [ i]).value)))) ) {
            v.type = QB.arrayValue(typeVars, [ j]).value .type;
            v.fixedLen = QB.arrayValue(typeVars, [ j]).value .fixedLen;
            found = Math.round(  True );
            break ___l561406;
         }
      } 
      if (~ found) {
         return ResolveFieldVar;
      }
   } 
   ResolveFieldVar =  True;
return ResolveFieldVar;
}
async function func_ResolveVarRef(ref/*STRING*/,v/*VARIABLE*/) {
if (QB.halted()) { return; }; 
var ResolveVarRef = null;
/* implicit variables: */ 
   var vname = '';  /* STRING */ var c = '';  /* STRING */ 
   var pidx = 0;  /* INTEGER */ var depth = 0;  /* INTEGER */ var i = 0;  /* INTEGER */ var found = 0;  /* INTEGER */ 
   ResolveVarRef =  False;
   vname = (await String.func_Trim(  ref));
   found = Math.round(  False );
   pidx = Math.round( (QB.func_InStr(  vname,   "(")) );
   if ((QB.func_InStr(  vname,   "."))  > 0 && ~(await func_FindVariable(  vname,    v,    False)) ) {
      found = Math.round( (await func_ResolveFieldVar(  vname,    v)) );
   } else if ( pidx > 1 & (QB.func_Right(  vname,    1))  ==  ")" ) {
      depth = Math.round(  0 );
      var ___v7166154 = 0; ___l9252861: for ( i=  pidx; (1 > 0) ? ( i <= (QB.func_Len(  vname))) : ( i >= (QB.func_Len(  vname)));  i+=1) { if (QB.halted()) { return; } ___v7166154++;   if (___v7166154 % 100 == 0) { await QB.autoLimit(); }
         c = (QB.func_Mid(  vname,    i,    1));
         if ( c ==  "(" ) {
            depth = Math.round(  depth +  1 );
         }
         if ( c ==  ")" ) {
            depth = Math.round(  depth -  1 );
            if ( depth ==   0 &  i <(QB.func_Len(  vname)) ) {
               return ResolveVarRef;
            }
         }
      } 
      found = Math.round( (await func_FindVariable( (QB.func_Left(  vname,    pidx -  1)) ,    v,    True)) );
   } else if ( pidx ==   0) {
      if ((await func_IsValidVarname(  vname)) ) {
         found = Math.round( (await func_FindVariable(  vname,    v,    False)) );
      }
   }
   ResolveVarRef =  found;
return ResolveVarRef;
}
async function func_ConvertLenOf(arg/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertLenOf = null;
/* implicit variables: */ 
   var v = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
   ConvertLenOf = "";
   if (~(await func_ResolveVarRef(  arg,    v)) ) {
      return ConvertLenOf;
   }
   if ( v.fixedLen !=  "" ) {
      ConvertLenOf = (await func_ConvertExpression(  v.fixedLen,    lineNumber));
   } else if ((await func_FindTypeId(  v.type))  > 0) {
      ConvertLenOf = "QB.typeSize('"  +  v.type + "')";
   }
return ConvertLenOf;
}
async function func_AssignValue(target/*STRING*/,valueJs/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var AssignValue = null;
/* implicit variables: */ 
   var v = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
   AssignValue =  valueJs;
   if (~(await func_ResolveVarRef(  target,    v)) ) {
      return AssignValue;
   }
   if ( v.fixedLen !=  "" ) {
      AssignValue = "QB.fixStr("  +  valueJs + ", "  + (await func_ConvertExpression(  v.fixedLen,    lineNumber))  + ")";
   } else if ((await func_FindTypeId(  v.type))  > 0 & ~ forceSelfConvert) {
      AssignValue = "QB.copyRec("  +  valueJs + ")";
   }
return AssignValue;
}
async function func_InitVarValue(bvar/*VARIABLE*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var InitVarValue = null;
/* implicit variables: */ 
   if ( bvar.fixedLen !=  "" ) {
      InitVarValue = "QB.initFixStr("  + (await func_ConvertExpression(  bvar.fixedLen,    lineNumber))  + ")";
   } else {
      InitVarValue = (await func_InitTypeValue(  bvar.type,    lineNumber));
   }
return InitVarValue;
}
async function func_ConvertOpen(args/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertOpen = null;
/* implicit variables: */ 
   var argc = 0;  /* INTEGER */ var i = 0;  /* INTEGER */ var forIdx = 0;  /* INTEGER */ var asIdx = 0;  /* INTEGER */ var eqIdx = 0;  /* INTEGER */ 
   var parts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var filename = '';  /* STRING */ var mode = '';  /* STRING */ var handle = '';  /* STRING */ var reclen = '';  /* STRING */ var p = '';  /* STRING */ var rest = '';  /* STRING */ 
   ConvertOpen = "";
   argc = Math.round( (await func_SLSplit(  args,   parts ,    False)) );
   forIdx = Math.round(  0 );
   asIdx = Math.round(  0 );
   var ___v4766153 = 0; ___l1277227: for ( i=  1; (1 > 0) ? ( i <=  argc) : ( i >=  argc);  i+=1) { if (QB.halted()) { return; } ___v4766153++;   if (___v4766153 % 100 == 0) { await QB.autoLimit(); }
      p = (QB.func_UCase( QB.arrayValue(parts, [ i]).value));
      if ( p ==  "FOR"  &  forIdx ==   0 &  asIdx ==   0) {
         forIdx = Math.round(  i );
      }
      if ( p ==  "AS"  &  asIdx ==   0) {
         asIdx = Math.round(  i );
      }
   } 
   if ( asIdx < 2 |  asIdx ==   argc |  forIdx ==   1) {
      await sub_AddWarning(  lineNumber,   "Syntax Error in Open statement");
      return ConvertOpen;
   }
   if ( forIdx > 0) {
      filename = (await func_Join( parts ,    1,    forIdx -  1,   " "));
      mode = (QB.func_UCase( QB.arrayValue(parts, [ forIdx +  1]).value));
   } else {
      filename = (await func_Join( parts ,    1,    asIdx -  1,   " "));
      mode = "RANDOM";
   }
   if ( mode !=  "INPUT"  &  mode !=  "OUTPUT"  &  mode !=  "APPEND"  &  mode !=  "BINARY"  &  mode !=  "RANDOM" ) {
      await sub_AddWarning(  lineNumber,   "Unsupported Open mode: "  +  mode);
      return ConvertOpen;
   }
   handle = (await String.func_Replace( QB.arrayValue(parts, [ asIdx +  1]).value ,   "#" ,   ""));
   reclen = "undefined";
   if ( argc > asIdx +  1) {
      rest = (await String.func_Trim( (await func_Join( parts ,    asIdx +  2,    - 1,   " "))));
      eqIdx = Math.round( (QB.func_InStr(  rest,   "=")) );
      if ((QB.func_UCase( (QB.func_Left(  rest,    3))))  ==  "LEN"  &  eqIdx > 0) {
         reclen = (await func_ConvertExpression( (QB.func_Mid(  rest,    eqIdx +  1)) ,    lineNumber));
      } else {
         await sub_AddWarning(  lineNumber,   "Syntax Error in Open statement");
         return ConvertOpen;
      }
   }
   ConvertOpen = (await func_ConvertExpression(  filename,    lineNumber))  + ", QB."  +  mode + ", "  + (await func_ConvertExpression(  handle,    lineNumber))  + ", "  +  reclen;
return ConvertOpen;
}
async function func_ConvertLine(args/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertLine = null;
/* implicit variables: */ 
   var argc = 0;  /* INTEGER */ 
   var parts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var coord = '';  /* STRING */ var lcolor = '';  /* STRING */ var mode = '';  /* STRING */ var style = '';  /* STRING */ 
   coord = (await func_ConvertCoordParam( "" ,    True,    lineNumber));
   lcolor = "undefined";
   mode = "undefined";
   style = "undefined";
   argc = Math.round( (await func_ListSplit(  args,   parts)) );
   if ( argc >=  1) {
      coord = (await func_ConvertCoordParam( QB.arrayValue(parts, [ 1]).value ,    True,    lineNumber));
   }
   if ( argc >=  2 & (await String.func_Trim( QB.arrayValue(parts, [ 2]).value))  !=  "" ) {
      lcolor = (await func_ConvertExpression( QB.arrayValue(parts, [ 2]).value ,    lineNumber));
   }
   if ( argc >=  3 & (await String.func_Trim( QB.arrayValue(parts, [ 3]).value))  !=  "" ) {
      mode = "'"  + (QB.func_UCase( (await String.func_Trim( QB.arrayValue(parts, [ 3]).value))))  + "'";
   }
   if ( argc >=  4 & (await String.func_Trim( QB.arrayValue(parts, [ 4]).value))  !=  "" ) {
      style = (await func_ConvertExpression( QB.arrayValue(parts, [ 4]).value ,    lineNumber));
   }
   ConvertLine =  coord + ", "  +  lcolor + ", "  +  mode + ", "  +  style;
return ConvertLine;
}
async function func_ConvertPutImage(args/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertPutImage = null;
/* implicit variables: */ 
   var argc = 0;  /* INTEGER */ 
   var parts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var startCoord = '';  /* STRING */ var sourceImage = '';  /* STRING */ var destImage = '';  /* STRING */ var destCoord = '';  /* STRING */ var doSmooth = '';  /* STRING */ 
   startCoord = (await func_ConvertCoordParam( "" ,    True,    lineNumber));
   destCoord = (await func_ConvertCoordParam( "" ,    True,    lineNumber));
   sourceImage = "undefined";
   destImage = "undefined";
   doSmooth = "false";
   if ((await String.func_EndsWith( (await String.func_Trim( (QB.func_UCase(  args)))) ,   "_SMOOTH"))  | (await String.func_EndsWith( (await String.func_Trim( (QB.func_UCase(  args)))) ,   "SMOOTH")) ) {
      doSmooth = "true";
      args = (QB.func_Left( (await String.func_Trim(  args)) ,   (QB.func_Len( (await String.func_Trim(  args))))  -  7));
   }
   argc = Math.round( (await func_ListSplit(  args,   parts)) );
   if ( argc >=  1) {
      startCoord = (await func_ConvertCoordParam( QB.arrayValue(parts, [ 1]).value ,    True,    lineNumber));
   }
   if ( argc >=  2) {
      sourceImage = (await func_ConvertExpression( QB.arrayValue(parts, [ 2]).value ,    lineNumber));
   }
   if ( argc >=  3) {
      if ((await String.func_Trim( QB.arrayValue(parts, [ 3]).value))  !=  "" ) {
         destImage = (await func_ConvertExpression( QB.arrayValue(parts, [ 3]).value ,    lineNumber));
      }
   }
   if ( argc >=  4) {
      destCoord = (await func_ConvertCoordParam( QB.arrayValue(parts, [ 4]).value ,    True,    lineNumber));
   }
   if ( argc >=  5) {
      if ((await String.func_Trim( (QB.func_UCase( QB.arrayValue(parts, [ 5]).value))))  ==  "_SMOOTH"  | (await String.func_Trim( (QB.func_UCase( QB.arrayValue(parts, [ 5]).value))))  ==  "SMOOTH" ) {
         doSmooth = "true";
      }
   }
   ConvertPutImage =  startCoord + ", "  +  sourceImage + ", "  +  destImage + ", "  +  destCoord + ", "  +  doSmooth;
return ConvertPutImage;
}
async function func_ConvertWindow(args/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertWindow = null;
/* implicit variables: */ 
   var invertFlag = '';  /* STRING */ 
   var firstParam = '';  /* STRING */ 
   var theRest = '';  /* STRING */ 
   var idx = 0;  /* INTEGER */ 
   var sstep = '';  /* STRING */ 
   var estep = '';  /* STRING */ 
   invertFlag = "false";
   var kwd = '';  /* STRING */ 
   kwd = "SCREEN";
   if (((QB.func_UCase( (QB.func_Left(  args,   (QB.func_Len(  kwd))))))  ==   kwd) ) {
      args = (QB.func_Right(  args,   (QB.func_Len(  args))  - (QB.func_Len(  kwd))));
      invertFlag = "true";
   }
   args = (await String.func_Trim(  args));
   sstep = "false";
   estep = "false";
   idx = Math.round( (await func_FindParamChar(  args,   ",")) );
   if ( idx ==   - 1) {
      firstParam =  args;
      theRest = "";
   } else {
      firstParam = (QB.func_Left(  args,    idx -  1));
      theRest = (QB.func_Right(  args,   (QB.func_Len(  args))  -  idx));
   }
   idx = Math.round( (await func_FindParamChar(  firstParam,   "-")) );
   var startCord = '';  /* STRING */ 
   var endCord = '';  /* STRING */ 
   if ( idx ==   - 1) {
      endCord =  firstParam;
   } else {
      startCord = (QB.func_Left(  firstParam,    idx -  1));
      endCord = (QB.func_Right(  firstParam,   (QB.func_Len(  firstParam))  -  idx));
   }
   idx = Math.round( (QB.func_InStr(  startCord,   "(")) );
   startCord = (QB.func_Right(  startCord,   (QB.func_Len(  startCord))  -  idx));
   idx = Math.round( (QB.func__InStrRev(  startCord,   ")")) );
   startCord = (QB.func_Left(  startCord,    idx -  1));
   startCord = (await func_ConvertExpression(  startCord,    lineNumber));
   if (((await String.func_Trim(  startCord))  ==  "") ) {
      startCord = "undefined, undefined";
   }
   idx = Math.round( (QB.func_InStr(  endCord,   "(")) );
   endCord = (QB.func_Right(  endCord,   (QB.func_Len(  endCord))  -  idx));
   idx = Math.round( (QB.func__InStrRev(  endCord,   ")")) );
   endCord = (QB.func_Left(  endCord,    idx -  1));
   endCord = (await func_ConvertExpression(  endCord,    lineNumber));
   ConvertWindow =  invertFlag + ", "  +  startCord + ", "  +  endCord;
return ConvertWindow;
}
async function func_ConvertCls(args/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertCls = null;
/* implicit variables: */ 
   var argc = 0;  /* INTEGER */ 
   var parts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   argc = Math.round( (await func_ListSplit(  args,   parts)) );
   var method = '';  /* STRING */ var bgcolor = '';  /* STRING */ 
   method = "undefined";
   bgcolor = "undefined";
   if ( argc >=  1) {
      if ((await String.func_Trim( QB.arrayValue(parts, [ 1]).value))  !=  "" ) {
         method = (await func_ConvertExpression( QB.arrayValue(parts, [ 1]).value ,    lineNumber));
      }
   }
   if ( argc >=  2) {
      bgcolor = (await func_ConvertExpression( QB.arrayValue(parts, [ 2]).value ,    lineNumber));
   }
   ConvertCls =  method + ", "  +  bgcolor;
return ConvertCls;
}
async function func_ConvertSubMid(m/*METHOD*/,args/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertSubMid = null;
/* implicit variables: */ 
   var js = '';  /* STRING */ 
   var midArgs = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var idx = 0;  /* INTEGER */ 
   idx = Math.round( (QB.func_InStr(  args,   "(")) );
   args = (QB.func_Right(  args,   (QB.func_Len(  args))  -  idx));
   idx = Math.round( (QB.func__InStrRev(  args,   ")")) );
   args = (QB.func_Left(  args,    idx - 1))  + (QB.func_Right(  args,   (QB.func_Len(  args))  -  idx));
   args = (await String.func_Replace(  args,   "=" ,   ","));
   var argc = 0;  /* INTEGER */ 
   argc = Math.round( (await func_ListSplit(  args,   midArgs)) );
   var var1 = '';  /* STRING */ 
   var var2 = '';  /* STRING */ 
   var startPosition = '';  /* STRING */ 
   var length = '';  /* STRING */ 
   if ( argc ==   4) {
      var1 = (await func_ConvertExpression( QB.arrayValue(midArgs, [ 1]).value ,    lineNumber));
      startPosition = (await func_ConvertExpression( QB.arrayValue(midArgs, [ 2]).value ,    lineNumber));
      length = (await func_ConvertExpression( QB.arrayValue(midArgs, [ 3]).value ,    lineNumber));
      var2 = (await func_ConvertExpression( QB.arrayValue(midArgs, [ 4]).value ,    lineNumber));
   } else if ( argc ==   3) {
      var1 = (await func_ConvertExpression( QB.arrayValue(midArgs, [ 1]).value ,    lineNumber));
      startPosition = (await func_ConvertExpression( QB.arrayValue(midArgs, [ 2]).value ,    lineNumber));
      length = "undefined";
      var2 = (await func_ConvertExpression( QB.arrayValue(midArgs, [ 3]).value ,    lineNumber));
   } else {
      await sub_AddError(  lineNumber,   "Syntax error; expected MID$(var1$, start%[, length%]) = var2$");
      return ConvertSubMid;
   }
   js =  var1 + " = "  + (await func_CallMethod(  m))  + "("  +  var1 + ","  +  startPosition + ","  +  length + ","  +  var2 + "); ";
   ConvertSubMid =  js;
return ConvertSubMid;
}
async function func_ConvertSubName(args/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertSubName = null;
/* implicit variables: */ 
   var argc = 0;  /* INTEGER */ 
   var parts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var asIndex = 0;  /* INTEGER */ 
   argc = Math.round( (await func_SLSplit2(  args,   parts)) );
   var i = 0;  /* INTEGER */ 
   var ___v8031864 = 0; ___l8707944: for ( i=  1; (1 > 0) ? ( i <=  argc) : ( i >=  argc);  i+=1) { if (QB.halted()) { return; } ___v8031864++;   if (___v8031864 % 100 == 0) { await QB.autoLimit(); }
      if ((QB.func_UCase( QB.arrayValue(parts, [ i]).value))  ==  "AS" ) {
         asIndex = Math.round(  i );
      }
   } 
   if ( asIndex ==   0 |  asIndex ==   argc) {
      await sub_AddWarning(  lineNumber,   "Syntax Error");
      ConvertSubName = "undefined, undefined";
   } else {
      var oldname = '';  /* STRING */ var newname = '';  /* STRING */ 
      oldname = (await func_Join( parts ,    1,    asIndex -  1,   " "));
      newname = (await func_Join( parts ,    asIndex +  1,    - 1,   " "));
      ConvertSubName = (await func_ConvertExpression(  oldname,    lineNumber))  + ", "  + (await func_ConvertExpression(  newname,    lineNumber));
   }
return ConvertSubName;
}
async function func_ConvertRandomize(m/*METHOD*/,args/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertRandomize = null;
/* implicit variables: */ 
   var uusing = '';  /* STRING */ 
   var theseed = '';  /* STRING */ 
   uusing = "false";
   theseed =  args;
   if ((await String.func_Trim(  args))  ==  "" ) {
      theseed = "undefined";
   } else {
      if (((QB.func_UCase( (await String.func_Trim( (QB.func_Left(  args,    5))))))  ==  "USING") ) {
         uusing = "true";
         theseed = (await String.func_Trim( (QB.func_Right(  args,   (QB.func_Len(  args))  -  5))));
      }
      theseed = (await func_ConvertExpression(  theseed,    lineNumber));
   }
   ConvertRandomize = (await func_CallMethod(  m))  + "("  +  uusing + ", "  +  theseed + ")";
return ConvertRandomize;
}
async function func_ConvertRead(m/*METHOD*/,args/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertRead = null;
/* implicit variables: */ 
   var js = '';  /* STRING */ 
   var vname = '';  /* STRING */ 
   var pcount = 0;  /* INTEGER */ 
   var parts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var vars = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var vcount = 0;  /* INTEGER */ 
   var p = '';  /* STRING */ 
   pcount = Math.round( (await func_ListSplit(  args,   parts)) );
   var i = 0;  /* INTEGER */ 
   var ___v6214768 = 0; ___l3487226: for ( i=  1; (1 > 0) ? ( i <=  pcount) : ( i >=  pcount);  i+=1) { if (QB.halted()) { return; } ___v6214768++;   if (___v6214768 % 100 == 0) { await QB.autoLimit(); }
      p = (await String.func_Trim( QB.arrayValue(parts, [ i]).value));
      vcount = Math.round( (QB.func_UBound(  vars))  +  1 );
      QB.resizeArray(vars, [{l:0,u: vcount}], '', true);  /* STRING */ 
      QB.arrayValue(vars, [ vcount]).value =  p;
   } 
   vname = await func_GenJSVar();
   js = "var "  +  vname + " = new Array(1); ";
   var rtarget = '';  /* STRING */ var rkind = '';  /* STRING */ 
   var ___v3984435 = 0; ___l2626260: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  vars))) : ( i >= (QB.func_UBound(  vars)));  i+=1) { if (QB.halted()) { return; } ___v3984435++;   if (___v3984435 % 100 == 0) { await QB.autoLimit(); }
      js =  js + (await func_CallMethod(  m))  + "("  +  vname + "); ";
      rtarget = (await func_ConvertExpression( QB.arrayValue(vars, [ i]).value ,    lineNumber));
      if ( qbNames) {
         rkind = (await func_ReadKind( (await func_GetVarType( QB.arrayValue(vars, [ i]).value))));
         js =  js +  rtarget + " = "  + (await func_AssignValue( QB.arrayValue(vars, [ i]).value ,   "QB.readValue("  +  vname + "[0], '"  +  rkind + "')" ,    lineNumber))  + "; ";
      } else {
         js =  js +  rtarget + " = "  + (await func_AssignValue( QB.arrayValue(vars, [ i]).value ,    vname + "[0]" ,    lineNumber))  + "; ";
      }
   } 
   ConvertRead =  js;
return ConvertRead;
}
async function func_ReadKind(vartype/*STRING*/) {
if (QB.halted()) { return; }; 
var ReadKind = null;
/* implicit variables: */ 
   var t = '';  /* STRING */ 
   t = (await func_NormalizeType(  vartype));
   if ( t ==  "STRING" ) {
      ReadKind = "S";
   } else if ( t ==  "_BIT"  |  t ==  "_UNSIGNED _BIT"  |  t ==  "_BYTE"  |  t ==  "_UNSIGNED _BYTE"  |  t ==  "INTEGER"  |  t ==  "_UNSIGNED INTEGER"  |  t ==  "LONG"  |  t ==  "_UNSIGNED LONG"  |  t ==  "_INTEGER64"  |  t ==  "_UNSIGNED _INTEGER64"  |  t ==  "_OFFSET"  |  t ==  "_UNSIGNED _OFFSET" ) {
      ReadKind = "I";
   } else if ( t ==  "SINGLE"  |  t ==  "DOUBLE"  |  t ==  "_FLOAT" ) {
      ReadKind = "N";
   } else {
      ReadKind = "";
   }
return ReadKind;
}
async function func_ConvertCoordParam(param/*STRING*/,hasEndCoord/*INTEGER*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; hasEndCoord = Math.round(hasEndCoord); lineNumber = Math.round(lineNumber); 
var ConvertCoordParam = null;
/* implicit variables: */ 
   if ((await String.func_Trim(  param))  ==  "" ) {
      if ( hasEndCoord) {
         ConvertCoordParam = "false, undefined, undefined, false, undefined, undefined";
      } else {
         ConvertCoordParam = "false, undefined, undefined";
      }
   } else {
      var js = '';  /* STRING */ var startCoord = '';  /* STRING */ var endCoord = '';  /* STRING */ var sstep = '';  /* STRING */ var estep = '';  /* STRING */ 
      var idx = 0;  /* INTEGER */ 
      sstep = "false";
      estep = "false";
      idx = Math.round( (await func_FindParamChar(  param,   "-")) );
      if ( idx ==   - 1) {
         startCoord =  param;
         endCoord = "";
      } else {
         startCoord = (QB.func_Left(  param,    idx -  1));
         endCoord = (QB.func_Right(  param,   (QB.func_Len(  param))  -  idx));
      }
      if ((QB.func_UCase( (QB.func_Left( (await String.func_Trim(  startCoord)) ,    4))))  ==  "STEP" ) {
         sstep = "true";
      }
      if ((QB.func_UCase( (QB.func_Left( (await String.func_Trim(  endCoord)) ,    4))))  ==  "STEP" ) {
         estep = "true";
      }
      idx = Math.round( (QB.func_InStr(  startCoord,   "(")) );
      startCoord = (QB.func_Right(  startCoord,   (QB.func_Len(  startCoord))  -  idx));
      idx = Math.round( (QB.func__InStrRev(  startCoord,   ")")) );
      startCoord = (QB.func_Left(  startCoord,    idx -  1));
      startCoord = (await func_ConvertExpression(  startCoord,    lineNumber));
      if (((await String.func_Trim(  startCoord))  ==  "") ) {
         startCoord = "undefined, undefined";
      }
      if ( hasEndCoord) {
         idx = Math.round( (QB.func_InStr(  endCoord,   "(")) );
         endCoord = (QB.func_Right(  endCoord,   (QB.func_Len(  endCoord))  -  idx));
         idx = Math.round( (QB.func__InStrRev(  endCoord,   ")")) );
         endCoord = (QB.func_Left(  endCoord,    idx -  1));
         endCoord = (await func_ConvertExpression(  endCoord,    lineNumber));
         if (((await String.func_Trim(  endCoord))  ==  "") ) {
            endCoord = "undefined, undefined";
         }
         ConvertCoordParam =  sstep + ", "  +  startCoord + ", "  +  estep + ", "  +  endCoord;
      } else {
         ConvertCoordParam =  sstep + ", "  +  startCoord;
      }
   }
return ConvertCoordParam;
}
async function func_ConvertPSet(args/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertPSet = null;
/* implicit variables: */ 
   var firstParam = '';  /* STRING */ 
   var theRest = '';  /* STRING */ 
   var idx = 0;  /* INTEGER */ 
   var sstep = '';  /* STRING */ 
   sstep = "false";
   idx = Math.round( (await func_FindParamChar(  args,   ",")) );
   if ( idx ==   - 1) {
      firstParam =  args;
      theRest = "";
   } else {
      firstParam = (QB.func_Left(  args,    idx -  1));
      theRest = (QB.func_Right(  args,   (QB.func_Len(  args))  -  idx));
   }
   if ((QB.func_UCase( (await String.func_Trim( (QB.func_Left(  firstParam,    4))))))  ==  "STEP" ) {
      sstep = "true";
   }
   idx = Math.round( (QB.func_InStr(  firstParam,   "(")) );
   firstParam = (QB.func_Right(  firstParam,   (QB.func_Len(  firstParam))  -  idx));
   idx = Math.round( (QB.func__InStrRev(  firstParam,   ")")) );
   firstParam = (QB.func_Left(  firstParam,    idx -  1));
   firstParam = (await func_ConvertExpression(  firstParam,    lineNumber));
   if (((await String.func_Trim(  firstParam))  ==  "") ) {
      firstParam = "undefined, undefined";
   }
   theRest = (await func_ConvertOptionalParams(  theRest,    lineNumber));
   ConvertPSet =  sstep + ", "  +  firstParam + ", "  +  theRest;
return ConvertPSet;
}
async function func_ConvertOptionalParams(args/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertOptionalParams = null;
/* implicit variables: */ 
   var rest = '';  /* STRING */ var item = '';  /* STRING */ var js = '';  /* STRING */ 
   var idx = 0;  /* INTEGER */ var hasEmpty = 0;  /* INTEGER */ 
   var items = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var n = 0;  /* INTEGER */ 
   rest =  args;
   n = Math.round(  0 );
   hasEmpty = Math.round(  False );
   var ___v6023253 = 0; ___l5006956: do { if (QB.halted()) { return; }___v6023253++;   if (___v6023253 % 100 == 0) { await QB.autoLimit(); }
      idx = Math.round( (await func_FindParamChar(  rest,   ",")) );
      if ( idx ==   - 1) {
         item =  rest;
      } else {
         item = (QB.func_Left(  rest,    idx -  1));
         rest = (QB.func_Mid(  rest,    idx +  1));
      }
      n = Math.round(  n +  1 );
      QB.resizeArray(items, [{l:0,u: n}], '', true);  /* STRING */ 
      QB.arrayValue(items, [ n]).value =  item;
      if ((await String.func_Trim(  item))  ==  "" ) {
         hasEmpty = Math.round(  True );
      }
   } while (( idx !=   - 1))
   if (~ hasEmpty) {
      ConvertOptionalParams = (await func_ConvertExpression(  args,    lineNumber));
      return ConvertOptionalParams;
   }
   var ___v8378968 = 0; ___l2597776: while ( n > 0 && (await String.func_Trim( QB.arrayValue(items, [ n]).value))  ==  "") { if (QB.halted()) { return; }___v8378968++;   if (___v8378968 % 100 == 0) { await QB.autoLimit(); }
      n = Math.round(  n -  1 );
   }
   js = "";
   var ___v637532 = 0; ___l1396109: for ( idx=  1; (1 > 0) ? ( idx <=  n) : ( idx >=  n);  idx+=1) { if (QB.halted()) { return; } ___v637532++;   if (___v637532 % 100 == 0) { await QB.autoLimit(); }
      if ( idx > 1) {
         js =  js + ", ";
      }
      if ((await String.func_Trim( QB.arrayValue(items, [ idx]).value))  ==  "" ) {
         js =  js + "undefined";
      } else {
         js =  js + (await func_ConvertExpression( QB.arrayValue(items, [ idx]).value ,    lineNumber));
      }
   } 
   ConvertOptionalParams =  js;
return ConvertOptionalParams;
}
async function func_ConvertPrintItems(item/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertPrintItems = null;
/* implicit variables: */ 
   var rest = '';  /* STRING */ var piece = '';  /* STRING */ var js = '';  /* STRING */ var u = '';  /* STRING */ 
   var cut = 0;  /* INTEGER */ 
   js = "";
   rest = (await String.func_Trim(  item));
   var ___v5478771 = 0; ___l9909723: while ( rest !=  "") { if (QB.halted()) { return; }___v5478771++;   if (___v5478771 % 100 == 0) { await QB.autoLimit(); }
      cut = Math.round( (await func_PrintItemEnd(  rest)) );
      piece = (await String.func_Trim( (QB.func_Left(  rest,    cut))));
      rest = (await String.func_Trim( (QB.func_Mid(  rest,    cut +  1))));
      if ( js !=  "" ) {
         js =  js + ", QB.PREVENT_NEWLINE, ";
      }
      u = (QB.func_UCase(  piece));
      if (((QB.func_Left(  u,    3))  ==  "SPC"  | (QB.func_Left(  u,    3))  ==  "TAB")  && (QB.func_Left( (QB.func_LTrim( (QB.func_Mid(  u,    4)))) ,    1))  ==  "("  && (QB.func_Right(  u,    1))  ==  ")" ) {
         var inner = '';  /* STRING */ 
         inner = (QB.func_LTrim( (QB.func_Mid(  piece,    4))));
         inner = (QB.func_Mid(  inner,    2,   (QB.func_Len(  inner))  -  2));
         if ((QB.func_Left(  u,    3))  ==  "SPC" ) {
            js =  js + "QB.printSpc("  + (await func_ConvertExpression(  inner,    lineNumber))  + ")";
         } else {
            js =  js + "QB.printTab("  + (await func_ConvertExpression(  inner,    lineNumber))  + ")";
         }
      } else {
         js =  js + (await func_ConvertExpression(  piece,    lineNumber));
      }
   }
   ConvertPrintItems =  js;
return ConvertPrintItems;
}
async function func_PrintItemEnd(text/*STRING*/) {
if (QB.halted()) { return; }; 
var PrintItemEnd = null;
/* implicit variables: */ 
   var k = 0;  /* INTEGER */ var depth = 0;  /* INTEGER */ var inQuote = 0;  /* INTEGER */ var n = 0;  /* INTEGER */ 
   var ch = '';  /* STRING */ var u = '';  /* STRING */ var after = '';  /* STRING */ var before = '';  /* STRING */ 
   n = Math.round( (QB.func_Len(  text)) );
   PrintItemEnd =  n;
   u = (QB.func_UCase(  text));
   if (((QB.func_Left(  u,    3))  ==  "SPC"  | (QB.func_Left(  u,    3))  ==  "TAB")  && (QB.func_Left( (QB.func_LTrim( (QB.func_Mid(  u,    4)))) ,    1))  ==  "(" ) {
      depth = Math.round(  0 );
      var ___v4677356 = 0; ___l5489768: for ( k=  4; (1 > 0) ? ( k <=  n) : ( k >=  n);  k+=1) { if (QB.halted()) { return; } ___v4677356++;   if (___v4677356 % 100 == 0) { await QB.autoLimit(); }
         ch = (QB.func_Mid(  text,    k,    1));
         if ( ch ==  (QB.func_Chr(  34)) ) {
            if ( inQuote) {
               inQuote = Math.round(  False );
            } else {
               inQuote = Math.round(  True );
            }
         } else if (~ inQuote) {
            if ( ch ==  "(" ) {
               depth = Math.round(  depth +  1 );
            }
            if ( ch ==  ")" ) {
               depth = Math.round(  depth -  1 );
               if ( depth ==   0) {
                  PrintItemEnd =  k;
                  return PrintItemEnd;
               }
            }
         }
      } 
      return PrintItemEnd;
   }
   depth = Math.round(  0 );
   inQuote = Math.round(  False );
   var ___v3111601 = 0; ___l1327849: for ( k=  1; (1 > 0) ? ( k <=  n) : ( k >=  n);  k+=1) { if (QB.halted()) { return; } ___v3111601++;   if (___v3111601 % 100 == 0) { await QB.autoLimit(); }
      ch = (QB.func_Mid(  text,    k,    1));
      if ( ch ==  (QB.func_Chr(  34)) ) {
         if (~ inQuote) {
            before = (QB.func_RTrim( (QB.func_Left(  text,    k -  1))));
            if ( depth ==   0 &&  before !=  ""  && (await func_EndsWithOperand(  before)) ) {
               PrintItemEnd = (QB.func_Len(  before));
               return PrintItemEnd;
            }
            inQuote = Math.round(  True );
         } else {
            inQuote = Math.round(  False );
            after = (QB.func_LTrim( (QB.func_Mid(  text,    k +  1))));
            if ( depth ==   0 &&  after !=  ""  && ~(await func_StartsWithOperator(  after)) ) {
               PrintItemEnd =  k;
               return PrintItemEnd;
            }
         }
      } else if (~ inQuote) {
         if ( ch ==  "(" ) {
            depth = Math.round(  depth +  1 );
         }
         if ( ch ==  ")" ) {
            depth = Math.round(  depth -  1 );
         }
      }
   } 
return PrintItemEnd;
}
async function func_EndsWithOperand(text/*STRING*/) {
if (QB.halted()) { return; }; 
var EndsWithOperand = null;
/* implicit variables: */ 
   var ch = '';  /* STRING */ var w = '';  /* STRING */ 
   var k = 0;  /* INTEGER */ 
   EndsWithOperand =  False;
   ch = (QB.func_Right(  text,    1));
   if ( ch ==  ")"  |  ch ==  (QB.func_Chr(  34)) ) {
      EndsWithOperand =  True;
      return EndsWithOperand;
   }
   if (~(await func_IsWordChar(  ch)) ) {
      return EndsWithOperand;
   }
   k = Math.round( (QB.func_Len(  text)) );
   var ___v4842554 = 0; ___l9429657: while ( k > 0 && (await func_IsWordChar( (QB.func_Mid(  text,    k,    1))))) { if (QB.halted()) { return; }___v4842554++;   if (___v4842554 % 100 == 0) { await QB.autoLimit(); }
      k = Math.round(  k -  1 );
   }
   w = (QB.func_UCase( (QB.func_Mid(  text,    k +  1))));
   if ( w ==  "AND"  |  w ==  "OR"  |  w ==  "NOT"  |  w ==  "XOR"  |  w ==  "MOD"  |  w ==  "EQV"  |  w ==  "IMP" ) {
      return EndsWithOperand;
   }
   EndsWithOperand =  True;
return EndsWithOperand;
}
async function func_StartsWithOperator(text/*STRING*/) {
if (QB.halted()) { return; }; 
var StartsWithOperator = null;
/* implicit variables: */ 
   var ch = '';  /* STRING */ var u = '';  /* STRING */ 
   ch = (QB.func_Left(  text,    1));
   StartsWithOperator =  True;
   if ((QB.func_InStr( "+-*/\\^=<>)," ,    ch))  > 0) {
      return StartsWithOperator;
   }
   u = (QB.func_UCase(  text));
   if ((await func_StatementWordAt(  u,    1,   "AND"))  | (await func_StatementWordAt(  u,    1,   "OR"))  | (await func_StatementWordAt(  u,    1,   "XOR"))  | (await func_StatementWordAt(  u,    1,   "MOD"))  | (await func_StatementWordAt(  u,    1,   "EQV"))  | (await func_StatementWordAt(  u,    1,   "IMP")) ) {
      return StartsWithOperator;
   }
   StartsWithOperator =  False;
return StartsWithOperator;
}
async function func_ConvertPrintItems(item/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertPrintItems = null;
/* implicit variables: */ 
   var rest = '';  /* STRING */ var piece = '';  /* STRING */ var js = '';  /* STRING */ var u = '';  /* STRING */ 
   var cut = 0;  /* INTEGER */ 
   js = "";
   rest = (await String.func_Trim(  item));
   var ___v7825921 = 0; ___l7377666: while ( rest !=  "") { if (QB.halted()) { return; }___v7825921++;   if (___v7825921 % 100 == 0) { await QB.autoLimit(); }
      cut = Math.round( (await func_PrintItemEnd(  rest)) );
      piece = (await String.func_Trim( (QB.func_Left(  rest,    cut))));
      rest = (await String.func_Trim( (QB.func_Mid(  rest,    cut +  1))));
      if ( js !=  "" ) {
         js =  js + ", QB.PREVENT_NEWLINE, ";
      }
      u = (QB.func_UCase(  piece));
      if (((QB.func_Left(  u,    3))  ==  "SPC"  | (QB.func_Left(  u,    3))  ==  "TAB")  && (QB.func_Left( (QB.func_LTrim( (QB.func_Mid(  u,    4)))) ,    1))  ==  "("  && (QB.func_Right(  u,    1))  ==  ")" ) {
         var inner = '';  /* STRING */ 
         inner = (QB.func_LTrim( (QB.func_Mid(  piece,    4))));
         inner = (QB.func_Mid(  inner,    2,   (QB.func_Len(  inner))  -  2));
         if ((QB.func_Left(  u,    3))  ==  "SPC" ) {
            js =  js + "QB.printSpc("  + (await func_ConvertExpression(  inner,    lineNumber))  + ")";
         } else {
            js =  js + "QB.printTab("  + (await func_ConvertExpression(  inner,    lineNumber))  + ")";
         }
      } else {
         js =  js + (await func_ConvertExpression(  piece,    lineNumber));
      }
   }
   ConvertPrintItems =  js;
return ConvertPrintItems;
}
async function func_PrintItemEnd(text/*STRING*/) {
if (QB.halted()) { return; }; 
var PrintItemEnd = null;
/* implicit variables: */ 
   var k = 0;  /* INTEGER */ var depth = 0;  /* INTEGER */ var inQuote = 0;  /* INTEGER */ var n = 0;  /* INTEGER */ 
   var ch = '';  /* STRING */ var u = '';  /* STRING */ var after = '';  /* STRING */ var before = '';  /* STRING */ 
   n = Math.round( (QB.func_Len(  text)) );
   PrintItemEnd =  n;
   u = (QB.func_UCase(  text));
   if (((QB.func_Left(  u,    3))  ==  "SPC"  | (QB.func_Left(  u,    3))  ==  "TAB")  && (QB.func_Left( (QB.func_LTrim( (QB.func_Mid(  u,    4)))) ,    1))  ==  "(" ) {
      depth = Math.round(  0 );
      var ___v6319283 = 0; ___l9195389: for ( k=  4; (1 > 0) ? ( k <=  n) : ( k >=  n);  k+=1) { if (QB.halted()) { return; } ___v6319283++;   if (___v6319283 % 100 == 0) { await QB.autoLimit(); }
         ch = (QB.func_Mid(  text,    k,    1));
         if ( ch ==  (QB.func_Chr(  34)) ) {
            if ( inQuote) {
               inQuote = Math.round(  False );
            } else {
               inQuote = Math.round(  True );
            }
         } else if (~ inQuote) {
            if ( ch ==  "(" ) {
               depth = Math.round(  depth +  1 );
            }
            if ( ch ==  ")" ) {
               depth = Math.round(  depth -  1 );
               if ( depth ==   0) {
                  PrintItemEnd =  k;
                  return PrintItemEnd;
               }
            }
         }
      } 
      return PrintItemEnd;
   }
   depth = Math.round(  0 );
   inQuote = Math.round(  False );
   var ___v2547145 = 0; ___l3125702: for ( k=  1; (1 > 0) ? ( k <=  n) : ( k >=  n);  k+=1) { if (QB.halted()) { return; } ___v2547145++;   if (___v2547145 % 100 == 0) { await QB.autoLimit(); }
      ch = (QB.func_Mid(  text,    k,    1));
      if ( ch ==  (QB.func_Chr(  34)) ) {
         if (~ inQuote) {
            before = (QB.func_RTrim( (QB.func_Left(  text,    k -  1))));
            if ( depth ==   0 &&  before !=  ""  && (await func_EndsWithOperand(  before)) ) {
               PrintItemEnd = (QB.func_Len(  before));
               return PrintItemEnd;
            }
            inQuote = Math.round(  True );
         } else {
            inQuote = Math.round(  False );
            after = (QB.func_LTrim( (QB.func_Mid(  text,    k +  1))));
            if ( depth ==   0 &&  after !=  ""  && ~(await func_StartsWithOperator(  after)) ) {
               PrintItemEnd =  k;
               return PrintItemEnd;
            }
         }
      } else if (~ inQuote) {
         if ( ch ==  "(" ) {
            depth = Math.round(  depth +  1 );
         }
         if ( ch ==  ")" ) {
            depth = Math.round(  depth -  1 );
         }
      }
   } 
return PrintItemEnd;
}
async function func_EndsWithOperand(text/*STRING*/) {
if (QB.halted()) { return; }; 
var EndsWithOperand = null;
/* implicit variables: */ 
   var ch = '';  /* STRING */ var w = '';  /* STRING */ 
   var k = 0;  /* INTEGER */ 
   EndsWithOperand =  False;
   ch = (QB.func_Right(  text,    1));
   if ( ch ==  ")"  |  ch ==  (QB.func_Chr(  34)) ) {
      EndsWithOperand =  True;
      return EndsWithOperand;
   }
   if (~(await func_IsWordChar(  ch)) ) {
      return EndsWithOperand;
   }
   k = Math.round( (QB.func_Len(  text)) );
   var ___v1686279 = 0; ___l1635720: while ( k > 0 && (await func_IsWordChar( (QB.func_Mid(  text,    k,    1))))) { if (QB.halted()) { return; }___v1686279++;   if (___v1686279 % 100 == 0) { await QB.autoLimit(); }
      k = Math.round(  k -  1 );
   }
   w = (QB.func_UCase( (QB.func_Mid(  text,    k +  1))));
   if ( w ==  "AND"  |  w ==  "OR"  |  w ==  "NOT"  |  w ==  "XOR"  |  w ==  "MOD"  |  w ==  "EQV"  |  w ==  "IMP" ) {
      return EndsWithOperand;
   }
   EndsWithOperand =  True;
return EndsWithOperand;
}
async function func_StartsWithOperator(text/*STRING*/) {
if (QB.halted()) { return; }; 
var StartsWithOperator = null;
/* implicit variables: */ 
   var ch = '';  /* STRING */ var u = '';  /* STRING */ 
   ch = (QB.func_Left(  text,    1));
   StartsWithOperator =  True;
   if ((QB.func_InStr( "+-*/\\^=<>)," ,    ch))  > 0) {
      return StartsWithOperator;
   }
   u = (QB.func_UCase(  text));
   if ((await func_StatementWordAt(  u,    1,   "AND"))  | (await func_StatementWordAt(  u,    1,   "OR"))  | (await func_StatementWordAt(  u,    1,   "XOR"))  | (await func_StatementWordAt(  u,    1,   "MOD"))  | (await func_StatementWordAt(  u,    1,   "EQV"))  | (await func_StatementWordAt(  u,    1,   "IMP")) ) {
      return StartsWithOperator;
   }
   StartsWithOperator =  False;
return StartsWithOperator;
}
async function func_ConvertPrint(m/*METHOD*/,args/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertPrint = null;
/* implicit variables: */ 
   var fh = '';  /* STRING */ 
   var pcount = 0;  /* INTEGER */ 
   var startIdx = 0;  /* INTEGER */ 
   var parts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   pcount = Math.round( (await func_PrintSplit(  args,   parts)) );
   startIdx = Math.round(  1 );
   m.jsname = "QB.sub_Print";
   if ( pcount > 0) {
      if ((await String.func_StartsWith( (await String.func_Trim( QB.arrayValue(parts, [ 1]).value)) ,   "#")) ) {
         fh = (await String.func_Replace( (await String.func_Trim( QB.arrayValue(parts, [ 1]).value)) ,   "#" ,   ""));
         m.jsname = "QB.sub_PrintToFile";
         startIdx = Math.round(  3 );
         if ((await String.func_Trim( QB.arrayValue(parts, [ 2]).value))  !=  "," ) {
            await sub_AddWarning(  lineNumber,   "Syntax error, missing expected ','");
            startIdx = Math.round(  2 );
         }
      }
   }
   var js = '';  /* STRING */ 
   js = (await func_CallMethod(  m))  + "(";
   if ( fh !=  "" ) {
      js =  js +  fh + ", ";
   }
   js =  js + "[";
   var i = 0;  /* INTEGER */ var usingMode = 0;  /* INTEGER */ 
   var ___v6733892 = 0; ___l1460751: for ( i=  startIdx; (1 > 0) ? ( i <=  pcount) : ( i >=  pcount);  i+=1) { if (QB.halted()) { return; } ___v6733892++;   if (___v6733892 % 100 == 0) { await QB.autoLimit(); }
      if ( i > startIdx && ~ usingMode) {
         js =  js + ",";
      }
      if ((QB.func_UCase( QB.arrayValue(parts, [ i]).value))  ==  "USING" ) {
         usingMode = Math.round(  True );
         js =  js + " QB.formatUsing(";
         continue;
      }
      if (QB.arrayValue(parts, [ i]).value  ==  "," ) {
         if ( usingMode) {
            if ( i ==  (QB.func_UBound(  parts)) ) {
               usingMode = Math.round(  False );
               js =  js + "), QB.COLUMN_ADVANCE, QB.PREVENT_NEWLINE";
            } else {
               js =  js + ",";
            }
         } else {
            js =  js + "QB.COLUMN_ADVANCE";
         }
      } else if (QB.arrayValue(parts, [ i]).value  ==  ";" ) {
         if ( usingMode) {
            if ( i ==  (QB.func_UBound(  parts)) ) {
               usingMode = Math.round(  False );
               js =  js + "), QB.PREVENT_NEWLINE";
            } else {
               js =  js + ",";
            }
         } else {
            js =  js + "QB.PREVENT_NEWLINE";
         }
      } else if ( qbNames && ~ usingMode) {
         js =  js + (await func_ConvertPrintItems( QB.arrayValue(parts, [ i]).value ,    lineNumber));
      } else if ( qbNames && ~ usingMode) {
         js =  js + (await func_ConvertPrintItems( QB.arrayValue(parts, [ i]).value ,    lineNumber));
      } else {
         js =  js + (await func_ConvertExpression( QB.arrayValue(parts, [ i]).value ,    lineNumber));
      }
   } 
   if ( usingMode) {
      js =  js + ")";
   }
   ConvertPrint =  js + "]);";
return ConvertPrint;
}
async function func_ConvertWrite(m/*METHOD*/,args/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertWrite = null;
/* implicit variables: */ 
   var fh = '';  /* STRING */ 
   var pcount = 0;  /* INTEGER */ 
   var startIdx = 0;  /* INTEGER */ 
   var parts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   pcount = Math.round( (await func_ListSplit(  args,   parts)) );
   startIdx = Math.round(  1 );
   m.jsname = "QB.sub_Write";
   if ( pcount > 0) {
      if ((await String.func_StartsWith( (await String.func_Trim( QB.arrayValue(parts, [ 1]).value)) ,   "#")) ) {
         fh = (await String.func_Replace( (await String.func_Trim( QB.arrayValue(parts, [ 1]).value)) ,   "#" ,   ""));
         m.jsname = "QB.sub_WriteToFile";
         startIdx = Math.round(  2 );
      }
   }
   var js = '';  /* STRING */ 
   js = (await func_CallMethod(  m))  + "(";
   if ( fh !=  "" ) {
      js =  js +  fh + ", ";
   }
   js =  js + "[";
   var i = 0;  /* INTEGER */ 
   var ___v2321104 = 0; ___l3999795: for ( i=  startIdx; (1 > 0) ? ( i <=  pcount) : ( i >=  pcount);  i+=1) { if (QB.halted()) { return; } ___v2321104++;   if (___v2321104 % 100 == 0) { await QB.autoLimit(); }
      if ( i > startIdx) {
         js =  js + ",";
      }
      var t = '';  /* STRING */ 
      t = "UNKNOWN";
      var v = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
      var isVar = 0;  /* INTEGER */ 
      isVar = Math.round( (await func_FindVariable( QB.arrayValue(parts, [ i]).value ,    v,    False)) );
      if ( isVar) {
         t =  v.type;
      } else if ((await String.func_StartsWith( QB.arrayValue(parts, [ i]).value ,   (QB.func_Chr(  34)))) ) {
         t = "STRING";
      }
      if ( qbNames) {
         js =  js + "{ qb:1, type:'"  +  t + "', value:"  + (await String.func_Trim( (await func_ConvertExpression( QB.arrayValue(parts, [ i]).value ,    lineNumber))))  + "}";
      } else if ( isVar) {
         js =  js + "{ type:'"  +  t + "', value:"  + (await String.func_Trim( (await func_ConvertExpression( QB.arrayValue(parts, [ i]).value ,    lineNumber))))  + "}";
      } else {
         js =  js + "{ type:'"  +  t + "', value:'"  + (await String.func_Replace( (await String.func_Trim( (await func_ConvertExpression( QB.arrayValue(parts, [ i]).value ,    lineNumber)))) ,   "'" ,   "\\'"))  + "'}";
      }
   } 
   ConvertWrite =  js + "]);";
return ConvertWrite;
}
async function func_ConvertPrintString(args/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertPrintString = null;
/* implicit variables: */ 
   var firstParam = '';  /* STRING */ 
   var theRest = '';  /* STRING */ 
   var idx = 0;  /* INTEGER */ 
   idx = Math.round( (await func_FindParamChar(  args,   ",")) );
   if ( idx ==   - 1) {
      firstParam =  args;
      theRest = "";
   } else {
      firstParam = (QB.func_Left(  args,    idx -  1));
      theRest = (QB.func_Right(  args,   (QB.func_Len(  args))  -  idx));
   }
   idx = Math.round( (QB.func_InStr(  firstParam,   "(")) );
   firstParam = (QB.func_Right(  firstParam,   (QB.func_Len(  firstParam))  -  idx));
   idx = Math.round( (QB.func__InStrRev(  firstParam,   ")")) );
   firstParam = (QB.func_Left(  firstParam,    idx -  1));
   ConvertPrintString = (await func_ConvertExpression(  firstParam,    lineNumber))  + ", "  + (await func_ConvertExpression(  theRest,    lineNumber));
return ConvertPrintString;
}
async function func_ConvertFileLineInput(m/*METHOD*/,args/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertFileLineInput = null;
/* implicit variables: */ 
   var js = '';  /* STRING */ 
   var fh = '';  /* STRING */ 
   var vname = '';  /* STRING */ 
   var retvar = '';  /* STRING */ 
   var pcount = 0;  /* INTEGER */ 
   var parts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   pcount = Math.round( (await func_ListSplit(  args,   parts)) );
   if ( pcount !=   2) {
      await sub_AddWarning(  lineNumber,   "Syntax error");
      ConvertFileLineInput = "";
      return ConvertFileLineInput;
   }
   fh = (await String.func_Replace( (await String.func_Trim( QB.arrayValue(parts, [ 1]).value)) ,   "#" ,   ""));
   retvar = (await String.func_Trim( QB.arrayValue(parts, [ 2]).value));
   vname = await func_GenJSVar();
   js = "var "  +  vname + " = new Array(1); ";
   js =  js + (await func_CallMethod(  m))  + "("  +  fh + ", "  +  vname + "); ";
   js =  js + (await func_ConvertExpression(  retvar,    lineNumber))  + " = "  + (await func_AssignValue(  retvar,    vname + "[0]" ,    lineNumber))  + "; ";
   ConvertFileLineInput =  js;
return ConvertFileLineInput;
}
async function func_ConvertInput(m/*METHOD*/,args/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertInput = null;
/* implicit variables: */ 
   var js = '';  /* STRING */ 
   var vname = '';  /* STRING */ 
   var pcount = 0;  /* INTEGER */ 
   var parts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var vars = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var varIndex = 0;  /* INTEGER */ 
   varIndex = Math.round(  1 );
   var preventNewline = '';  /* STRING */ 
   preventNewline = "false";
   var addQuestionPrompt = '';  /* STRING */ 
   addQuestionPrompt = "false";
   var promptStr = '';  /* STRING */ 
   promptStr = "undefined";
   var vcount = 0;  /* INTEGER */ 
   var p = '';  /* STRING */ 
   pcount = Math.round( (await func_PrintSplit(  args,   parts)) );
   var i = 0;  /* INTEGER */ 
   var ___v9034233 = 0; ___l8875123: for ( i=  1; (1 > 0) ? ( i <=  pcount) : ( i >=  pcount);  i+=1) { if (QB.halted()) { return; } ___v9034233++;   if (___v9034233 % 100 == 0) { await QB.autoLimit(); }
      p = (await String.func_Trim( QB.arrayValue(parts, [ i]).value));
      if ( p ==  ";" ) {
         if ( i ==   1) {
            preventNewline = "true";
         } else {
            addQuestionPrompt = "true";
         }
      } else if ((await String.func_StartsWith(  p,   (QB.func_Chr(  34)))) ) {
         promptStr =  p;
      } else if ( p !=  "," ) {
         vcount = Math.round( (QB.func_UBound(  vars))  +  1 );
         QB.resizeArray(vars, [{l:0,u: vcount}], '', true);  /* STRING */ 
         QB.arrayValue(vars, [ vcount]).value =  p;
      }
   } 
   vname = await func_GenJSVar();
   js = "var "  +  vname + " = new Array("  + (QB.func_Str( (QB.func_UBound(  vars))))  + "); ";
   js =  js + (await func_CallMethod(  m))  + "("  +  vname + ", "  +  preventNewline + ", "  +  addQuestionPrompt + ", "  +  promptStr + "); ";
   var ___v2306401 = 0; ___l5968401: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  vars))) : ( i >= (QB.func_UBound(  vars)));  i+=1) { if (QB.halted()) { return; } ___v2306401++;   if (___v2306401 % 100 == 0) { await QB.autoLimit(); }
      var vartype = '';  /* STRING */ 
      vartype = (await func_GetVarType( QB.arrayValue(vars, [ i]).value));
      if ( vartype ==  "_BIT"  |  vartype ==  "_BYTE"  |  vartype ==  "INTEGER"  |  vartype ==  "LONG"  |  vartype ==  "_INTEGER64"  |  vartype ==  "_OFFSET"  |  vartype ==  "_UNSIGNED _BIT"  |  vartype ==  "_UNSIGNED _BYTE"  |  vartype ==  "_UNSIGNED INTEGER"  |  vartype ==  "_UNSIGNED LONG"  |  vartype ==  "_UNSIGNED _INTEGER64"  |  vartype ==  "_UNSIGNED _OFFSET" ) {
         js =  js + (await func_ConvertExpression( QB.arrayValue(vars, [ i]).value ,    lineNumber))  + " = QB.toInteger("  +  vname + "["  + (QB.func_Str(  i -  1))  + "]); ";
      } else if ( vartype ==  "SINGLE"  |  vartype ==  "DOUBLE"  |  vartype ==  "_FLOAT" ) {
         js =  js + (await func_ConvertExpression( QB.arrayValue(vars, [ i]).value ,    lineNumber))  + " = QB.toFloat("  +  vname + "["  + (QB.func_Str(  i -  1))  + "]); ";
      } else {
         js =  js + (await func_ConvertExpression( QB.arrayValue(vars, [ i]).value ,    lineNumber))  + " = "  + (await func_AssignValue( QB.arrayValue(vars, [ i]).value ,    vname + "["  + (QB.func_Str(  i -  1))  + "]" ,    lineNumber))  + "; ";
      }
   } 
   ConvertInput =  js;
return ConvertInput;
}
async function func_ConvertFileInput(m/*METHOD*/,args/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertFileInput = null;
/* implicit variables: */ 
   var js = '';  /* STRING */ 
   var fh = '';  /* STRING */ 
   var vname = '';  /* STRING */ 
   var retvar = '';  /* STRING */ 
   var pcount = 0;  /* INTEGER */ 
   var parts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   pcount = Math.round( (await func_ListSplit(  args,   parts)) );
   if ( pcount < 2) {
      await sub_AddWarning(  lineNumber,   "Syntax error");
      ConvertFileInput = "";
      return ConvertFileInput;
   }
   fh = (await String.func_Replace( (await String.func_Trim( QB.arrayValue(parts, [ 1]).value)) ,   "#" ,   ""));
   retvar = (await String.func_Trim( QB.arrayValue(parts, [ 2]).value));
   vname = await func_GenJSVar();
   js = "var "  +  vname + " = new Array("  + (QB.func_Str( (QB.func_UBound(  parts))  -  1))  + "); ";
   var i = 0;  /* INTEGER */ 
   if ( qbNames) {
      var ikinds = '';  /* STRING */ var itargets = '';  /* STRING */ var ikind = '';  /* STRING */ 
      ikinds = "";
      itargets = "";
      var ___v2441943 = 0; ___l3745893: for ( i=  2; (1 > 0) ? ( i <= (QB.func_UBound(  parts))) : ( i >= (QB.func_UBound(  parts)));  i+=1) { if (QB.halted()) { return; } ___v2441943++;   if (___v2441943 % 100 == 0) { await QB.autoLimit(); }
         var itarget = '';  /* STRING */ 
         itarget = (await func_ConvertExpression( QB.arrayValue(parts, [ i]).value ,    lineNumber));
         ikind = (await func_ReadKind( (await func_GetVarType( QB.arrayValue(parts, [ i]).value))));
         if ( ikind ==  "" ) {
            ikind = "U";
         }
         ikinds =  ikinds +  ikind;
         itargets =  itargets +  itarget + " = "  + (await func_AssignValue( QB.arrayValue(parts, [ i]).value ,   "QB.readValue("  +  vname + "["  + (QB.func_Str(  i -  2))  + "], '"  +  ikind + "')" ,    lineNumber))  + "; ";
      } 
      js =  js + (await func_CallMethod(  m))  + "("  +  fh + ", "  +  vname + ", '"  +  ikinds + "'); "  +  itargets;
      ConvertFileInput =  js;
      return ConvertFileInput;
   }
   js =  js + (await func_CallMethod(  m))  + "("  +  fh + ", "  +  vname + "); ";
   var ___v4836138 = 0; ___l4185213: for ( i=  2; (1 > 0) ? ( i <= (QB.func_UBound(  parts))) : ( i >= (QB.func_UBound(  parts)));  i+=1) { if (QB.halted()) { return; } ___v4836138++;   if (___v4836138 % 100 == 0) { await QB.autoLimit(); }
      var vartype = '';  /* STRING */ 
      vartype = (await func_GetVarType( QB.arrayValue(parts, [ i]).value));
      if ( vartype ==  "_BIT"  |  vartype ==  "_BYTE"  |  vartype ==  "INTEGER"  |  vartype ==  "LONG"  |  vartype ==  "_INTEGER64"  |  vartype ==  "_OFFSET"  |  vartype ==  "_UNSIGNED _BIT"  |  vartype ==  "_UNSIGNED _BYTE"  |  vartype ==  "_UNSIGNED INTEGER"  |  vartype ==  "_UNSIGNED LONG"  |  vartype ==  "_UNSIGNED _INTEGER64"  |  vartype ==  "_UNSIGNED _OFFSET" ) {
         js =  js + (await func_ConvertExpression( QB.arrayValue(parts, [ i]).value ,    lineNumber))  + " = QB.toInteger("  +  vname + "["  + (QB.func_Str(  i -  2))  + "]); ";
      } else if ( vartype ==  "SINGLE"  |  vartype ==  "DOUBLE"  |  vartype ==  "_FLOAT" ) {
         js =  js + (await func_ConvertExpression( QB.arrayValue(parts, [ i]).value ,    lineNumber))  + " = QB.toFloat("  +  vname + "["  + (QB.func_Str(  i -  2))  + "]); ";
      } else {
         js =  js + (await func_ConvertExpression( QB.arrayValue(parts, [ i]).value ,    lineNumber))  + " = "  + (await func_AssignValue( QB.arrayValue(parts, [ i]).value ,    vname + "["  + (QB.func_Str(  i -  2))  + "]" ,    lineNumber))  + "; ";
      }
   } 
   ConvertFileInput =  js;
return ConvertFileInput;
}
async function func_GetVarType(vname/*STRING*/) {
if (QB.halted()) { return; }; 
var GetVarType = null;
/* implicit variables: */ 
   var vartype = '';  /* STRING */ 
   vartype = "UNKNOWN";
   var parts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var pcount = 0;  /* INTEGER */ 
   var found = 0;  /* INTEGER */ 
   var v = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
   var pidx = 0;  /* INTEGER */ 
   pcount = Math.round( (await func_Split(  vname,   "." ,   parts)) );
   if ( pcount ==   1) {
      pidx = Math.round( (QB.func_InStr(  vname,   "(")) );
      if ( pidx) {
         vname = (QB.func_Left(  vname,    pidx -  1));
      }
      found = Math.round( (await func_FindVariable(  vname,    v,    False)) );
      if (~ found) {
         found = Math.round( (await func_FindVariable(  vname,    v,    True)) );
      }
      if ( found) {
         vartype =  v.type;
      }
   } else {
      vname = QB.arrayValue(parts, [ 1]).value;
      pidx = Math.round( (QB.func_InStr(  vname,   "(")) );
      if ( pidx) {
         vname = (QB.func_Left(  vname,    pidx -  1));
      }
      found = Math.round( (await func_FindVariable(  vname,    v,    False)) );
      if (~ found) {
         found = Math.round( (await func_FindVariable(  vname,    v,    True)) );
      }
      if ( found) {
         var typeId = 0;  /* INTEGER */ 
         typeId = Math.round( (await func_FindTypeId(  v.type)) );
         var i = 0;  /* INTEGER */ 
         var j = 0;  /* INTEGER */ 
         var ___v1952748 = 0; ___l7116151: for ( i=  2; (1 > 0) ? ( i <=  pcount) : ( i >=  pcount);  i+=1) { if (QB.halted()) { return; } ___v1952748++;   if (___v1952748 % 100 == 0) { await QB.autoLimit(); }
            var ___v1121866 = 0; ___l9288051: for ( j=  1; (1 > 0) ? ( j <= (QB.func_UBound(  typeVars))) : ( j >= (QB.func_UBound(  typeVars)));  j+=1) { if (QB.halted()) { return; } ___v1121866++;   if (___v1121866 % 100 == 0) { await QB.autoLimit(); }
               if (QB.arrayValue(typeVars, [ j]).value .typeId ==   typeId & QB.arrayValue(typeVars, [ j]).value .name ==  QB.arrayValue(parts, [ i]).value ) {
                  vartype = QB.arrayValue(typeVars, [ j]).value .type;
                  typeId = Math.round( (await func_FindTypeId(  vartype)) );
               }
            } 
         } 
      }
   }
   GetVarType =  vartype;
return GetVarType;
}
async function func_ConvertSwap(m/*METHOD*/,args/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertSwap = null;
/* implicit variables: */ 
   var js = '';  /* STRING */ 
   var swapArray = '';  /* STRING */ 
   swapArray = await func_GenJSVar();
   var swapArgs = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var swapCount = 0;  /* INTEGER */ 
   swapCount = Math.round( (await func_ListSplit(  args,   swapArgs)) );
   var var1 = '';  /* STRING */ 
   var var2 = '';  /* STRING */ 
   var1 = (await func_ConvertExpression( QB.arrayValue(swapArgs, [ 1]).value ,    lineNumber));
   var2 = (await func_ConvertExpression( QB.arrayValue(swapArgs, [ 2]).value ,    lineNumber));
   js = "var "  +  swapArray + " = ["  +  var1 + ","  +  var2 + "]; ";
   js =  js + (await func_CallMethod(  m))  + "("  +  swapArray + "); ";
   js =  js +  var1 + " = "  +  swapArray + "[0]; ";
   js =  js +  var2 + " = "  +  swapArray + "[1];";
   ConvertSwap =  js;
return ConvertSwap;
}
async function func_GenJSVar() {
if (QB.halted()) { return; }; 
var GenJSVar = null;
/* implicit variables: */ 
   GenJSVar = "___v"  + await func_GenJSName();
return GenJSVar;
}
async function func_GenJSLabel() {
if (QB.halted()) { return; }; 
var GenJSLabel = null;
/* implicit variables: */ 
   GenJSLabel = "___l"  + await func_GenJSName();
return GenJSLabel;
}
async function func_GenJSName() {
if (QB.halted()) { return; }; 
var GenJSName = null;
/* implicit variables: */ 
   GenJSName = (await String.func_Trim( (QB.func_Str( (QB.func__Round( QB.func_Rnd() *  10000000))))));
return GenJSName;
}
async function func_FindParamChar(s/*STRING*/,ch/*STRING*/) {
if (QB.halted()) { return; }; 
var FindParamChar = null;
/* implicit variables: */ 
   var idx = 0;  /* INTEGER */ 
   idx = Math.round(  - 1 );
   var c = '';  /* STRING */ 
   var quote = 0;  /* INTEGER */ 
   var paren = 0;  /* INTEGER */ 
   var i = 0;  /* INTEGER */ 
   var ___v4720581 = 0; ___l5976256: for ( i=  1; (1 > 0) ? ( i <= (QB.func_Len(  s))) : ( i >= (QB.func_Len(  s)));  i+=1) { if (QB.halted()) { return; } ___v4720581++;   if (___v4720581 % 100 == 0) { await QB.autoLimit(); }
      c = (QB.func_Mid(  s,    i,    1));
      if ( c ==  (QB.func_Chr(  34)) ) {
         quote = Math.round( ~ quote );
      } else if (~ quote &  c ==  "(" ) {
         paren = Math.round(  paren +  1 );
      } else if (~ quote &  c ==  ")" ) {
         paren = Math.round(  paren -  1 );
      } else if (~ quote &  paren ==   0 &  c ==   ch) {
         idx = Math.round(  i );
         break ___l5976256;
      }
   } 
   FindParamChar =  idx;
return FindParamChar;
}
async function sub_DeclareTypeVar(parts/*STRING*/,typeId/*INTEGER*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; typeId = Math.round(typeId); lineNumber = Math.round(lineNumber); 
/* implicit variables: */ 
   var vname = '';  /* STRING */ 
   var vtype = '';  /* STRING */ 
   vtype = "";
   var vtypeIndex = 0;  /* INTEGER */ 
   vtypeIndex = Math.round(  4 );
   var isGlobal = 0;  /* INTEGER */ 
   isGlobal = Math.round(  False );
   var isArray = 0;  /* INTEGER */ 
   isArray = Math.round(  False );
   var isStatic = 0;  /* INTEGER */ 
   isStatic = Math.round(  False );
   var arraySize = '';  /* STRING */ 
   var pstart = 0;  /* INTEGER */ 
   var bvar = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
   var varnames = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var vnamecount = 0;  /* INTEGER */ 
   var findVar = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
   var asIdx = 0;  /* INTEGER */ 
   asIdx = Math.round(  0 );
   bvar.typeId = Math.round(  typeId );
   var i = 0;  /* INTEGER */ 
   var ___v1798958 = 0; ___l5440120: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  parts))) : ( i >= (QB.func_UBound(  parts)));  i+=1) { if (QB.halted()) { return; } ___v1798958++;   if (___v1798958 % 100 == 0) { await QB.autoLimit(); }
      if ((QB.func_UCase( QB.arrayValue(parts, [ i]).value))  ==  "AS" ) {
         asIdx = Math.round(  i );
      }
   } 
   if ( asIdx ==   1) {
      bvar.type = (QB.func_UCase( QB.arrayValue(parts, [ asIdx +  1]).value));
      var nextIdx = 0;  /* INTEGER */ 
      nextIdx = Math.round(  asIdx +  2 );
      if ( bvar.type ==  "_UNSIGNED"  |  bvar.type ==  "UNSIGNED" ) {
         bvar.type = (await func_NormalizeType( "_UNSIGNED "  + (QB.func_UCase( QB.arrayValue(parts, [ asIdx +  2]).value))));
         nextIdx = Math.round(  asIdx +  3 );
      }
      bvar.fixedLen = "";
      if ( nextIdx <(QB.func_UBound(  parts)) ) {
         if (QB.arrayValue(parts, [ nextIdx]).value  ==  "*" ) {
            bvar.fixedLen = QB.arrayValue(parts, [ nextIdx +  1]).value;
            nextIdx = Math.round(  nextIdx +  2 );
            if ( bvar.fixedLen ==  ""  &&  nextIdx <= (QB.func_UBound(  parts)) ) {
               bvar.fixedLen = QB.arrayValue(parts, [ nextIdx]).value;
               nextIdx = Math.round(  nextIdx +  1 );
            }
         }
      }
      vnamecount = Math.round( (await func_ListSplit( (await func_Join( parts ,    nextIdx,    - 1,   " ")) ,   varnames)) );
      var ___v2713823 = 0; ___l9045077: for ( i=  1; (1 > 0) ? ( i <=  vnamecount) : ( i >=  vnamecount);  i+=1) { if (QB.halted()) { return; } ___v2713823++;   if (___v2713823 % 100 == 0) { await QB.autoLimit(); }
         vname = (await String.func_Trim( QB.arrayValue(varnames, [ i]).value));
         pstart = Math.round( (QB.func_InStr(  vname,   "(")) );
         if ( pstart > 0) {
            bvar.isArray = Math.round(  True );
            arraySize = (await func_ConvertExpression( (QB.func_Mid(  vname,    pstart +  1,   (QB.func_Len(  vname))  -  pstart -  1)) ,    lineNumber));
            bvar.name = (await func_RemoveSuffix( (QB.func_Left(  vname,    pstart -  1))));
         } else {
            bvar.isArray = Math.round(  False );
            arraySize = "";
            bvar.name =  vname;
         }
         await sub_AddVariable(  bvar,   typeVars);
      } 
   } else {
      bvar.name = QB.arrayValue(parts, [ 1]).value;
      bvar.type = (QB.func_UCase( QB.arrayValue(parts, [ 3]).value));
      if ( bvar.type ==  "_UNSIGNED"  |  bvar.type ==  "UNSIGNED" ) {
         bvar.type = (await func_NormalizeType( "_UNSIGNED "  + (QB.func_UCase( QB.arrayValue(parts, [ 4]).value))));
      }
      bvar.fixedLen = "";
      if ((QB.func_UBound(  parts))  >=  5) {
         if (QB.arrayValue(parts, [ 4]).value  ==  "*" ) {
            bvar.fixedLen = QB.arrayValue(parts, [ 5]).value;
         }
         if ( bvar.fixedLen ==  ""  && QB.arrayValue(parts, [ 4]).value  ==  "*"  && (QB.func_UBound(  parts))  >=  6) {
            bvar.fixedLen = QB.arrayValue(parts, [ 6]).value;
         }
      }
      await sub_AddVariable(  bvar,   typeVars);
   }
}
async function func_DeclareVar(parts/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var DeclareVar = null;
/* implicit variables: */ 
   var vname = '';  /* STRING */ 
   var vtype = '';  /* STRING */ 
   vtype = "";
   var vtypeIndex = 0;  /* INTEGER */ 
   vtypeIndex = Math.round(  4 );
   var isGlobal = 0;  /* INTEGER */ 
   isGlobal = Math.round(  False );
   var isShared = 0;  /* INTEGER */ 
   isShared = Math.round(  False );
   var isArray = 0;  /* INTEGER */ 
   isArray = Math.round(  False );
   var isStatic = 0;  /* INTEGER */ 
   isStatic = Math.round(  False );
   var arraySize = '';  /* STRING */ 
   var pstart = 0;  /* INTEGER */ 
   var bvar = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
   var varnames = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var vnamecount = 0;  /* INTEGER */ 
   var findVar = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
   var asIdx = 0;  /* INTEGER */ 
   asIdx = Math.round(  0 );
   var js = '';  /* STRING */ 
   js = "";
   var bPreserve = '';  /* STRING */ 
   bPreserve = "false";
   if ((QB.func_UCase( QB.arrayValue(parts, [ 1]).value))  ==  "STATIC" ) {
      if ( currentMethod ==  "" ) {
         await sub_AddWarning(  lineNumber,   "STATIC must be used within a SUB/FUNCTION");
         DeclareVar = "";
         return DeclareVar;
      } else {
         isStatic = Math.round(  True );
      }
   } else if ((QB.func_UCase( QB.arrayValue(parts, [ 1]).value))  ==  "SHARED" ) {
      if ( currentMethod ==  "" ) {
         await sub_AddWarning(  lineNumber,   "SHARED must be used within a SUB/FUNCTION");
         DeclareVar = "";
         return DeclareVar;
      } else {
         isShared = Math.round(  True );
      }
   }
   var i = 0;  /* INTEGER */ 
   var ___v832869 = 0; ___l2361271: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  parts))) : ( i >= (QB.func_UBound(  parts)));  i+=1) { if (QB.halted()) { return; } ___v832869++;   if (___v832869 % 100 == 0) { await QB.autoLimit(); }
      if ((QB.func_UCase( QB.arrayValue(parts, [ i]).value))  ==  "AS" ) {
         asIdx = Math.round(  i );
      }
      if ((QB.func_UCase( QB.arrayValue(parts, [ i]).value))  ==  "_PRESERVE"  | (QB.func_UCase( QB.arrayValue(parts, [ i]).value))  ==  "PRESERVE" ) {
         bPreserve = "true";
      }
      if ((QB.func_UCase( QB.arrayValue(parts, [ i]).value))  ==  "SHARED" ) {
         isGlobal = Math.round(  True );
      }
   } 
   if ( asIdx ==   2 | ( asIdx ==   3 & ( isGlobal |  bPreserve ==  "true")  & ~ isShared)  | ( asIdx ==   4 &  isGlobal &  bPreserve ==  "true") ) {
      bvar.type = (QB.func_UCase( QB.arrayValue(parts, [ asIdx +  1]).value));
      var nextIdx = 0;  /* INTEGER */ 
      nextIdx = Math.round(  asIdx +  2 );
      if ( bvar.type ==  "_UNSIGNED"  |  bvar.type ==  "UNSIGNED" ) {
         bvar.type =  bvar.type + " "  + (QB.func_UCase( QB.arrayValue(parts, [ asIdx +  2]).value));
         nextIdx = Math.round(  asIdx +  3 );
      }
      bvar.typeId = Math.round( (await func_FindTypeId(  bvar.type)) );
      bvar.fixedLen = "";
      if ( nextIdx <(QB.func_UBound(  parts)) ) {
         if (QB.arrayValue(parts, [ nextIdx]).value  ==  "*" ) {
            bvar.fixedLen = QB.arrayValue(parts, [ nextIdx +  1]).value;
            nextIdx = Math.round(  nextIdx +  2 );
            if ( bvar.fixedLen ==  ""  &&  nextIdx <= (QB.func_UBound(  parts)) ) {
               bvar.fixedLen = QB.arrayValue(parts, [ nextIdx]).value;
               nextIdx = Math.round(  nextIdx +  1 );
            }
         }
      }
      vnamecount = Math.round( (await func_ListSplit( (await func_Join( parts ,    nextIdx,    - 1,   " ")) ,   varnames)) );
      var ___v7871563 = 0; ___l5051253: for ( i=  1; (1 > 0) ? ( i <=  vnamecount) : ( i >=  vnamecount);  i+=1) { if (QB.halted()) { return; } ___v7871563++;   if (___v7871563 % 100 == 0) { await QB.autoLimit(); }
         vname = (await String.func_Trim( QB.arrayValue(varnames, [ i]).value));
         bvar.suffixed = Math.round(  False );
         pstart = Math.round( (QB.func_InStr(  vname,   "(")) );
         if ( pstart > 0) {
            bvar.isArray = Math.round(  True );
            arraySize = (QB.func_Mid(  vname,    pstart +  1,   (QB.func_Len(  vname))  -  pstart -  1));
            bvar.name = (await func_RemoveSuffix( (QB.func_Left(  vname,    pstart -  1))));
         } else {
            bvar.isArray = Math.round(  False );
            arraySize = "";
            bvar.name =  vname;
         }
         js = (await func_RegisterVar(  bvar,    js,    isGlobal,    isStatic,    bPreserve,    arraySize,    lineNumber));
      } 
   } else {
      var vpartcount = 0;  /* INTEGER */ 
      var vparts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
      nextIdx = Math.round(  0 );
      var ___v1925381 = 0; ___l9859242: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  parts))) : ( i >= (QB.func_UBound(  parts)));  i+=1) { if (QB.halted()) { return; } ___v1925381++;   if (___v1925381 % 100 == 0) { await QB.autoLimit(); }
         var p = '';  /* STRING */ 
         p = (QB.func_UCase( QB.arrayValue(parts, [ i]).value));
         if ( p ==  "DIM"  |  p ==  "REDIM"  |  p ==  "SHARED"  |  p ==  "_PRESERVE"  |  p ==  "PRESERVE"  |  p ==  "STATIC"  |  p ==  "COMMON" ) {
            nextIdx = Math.round(  i +  1 );
         }
      } 
      vnamecount = Math.round( (await func_ListSplit( (await func_Join( parts ,    nextIdx,    - 1,   " ")) ,   varnames)) );
      var ___v9759841 = 0; ___l3514438: for ( i=  1; (1 > 0) ? ( i <=  vnamecount) : ( i >=  vnamecount);  i+=1) { if (QB.halted()) { return; } ___v9759841++;   if (___v9759841 % 100 == 0) { await QB.autoLimit(); }
         vpartcount = Math.round( (await func_SLSplit2( QB.arrayValue(varnames, [ i]).value ,   vparts)) );
         bvar.fixedLen = "";
         if ( vpartcount ==   5 |  vpartcount ==   6) {
            if (QB.arrayValue(vparts, [ 4]).value  ==  "*" ) {
               bvar.fixedLen = QB.arrayValue(vparts, [ 5]).value;
               if ( bvar.fixedLen ==  ""  &&  vpartcount ==   6) {
                  bvar.fixedLen = QB.arrayValue(vparts, [ 6]).value;
               }
               vpartcount = Math.round(  3 );
            }
         }
         var vbase = '';  /* STRING */ 
         vbase = QB.arrayValue(vparts, [ 1]).value;
         if ( qbNames && (QB.func_InStr(  vbase,   "("))  > 0) {
            vbase = (QB.func_Left(  vbase,   (QB.func_InStr(  vbase,   "("))  -  1));
         }
         bvar.suffixed = Math.round(  False );
         if ( vpartcount ==   1) {
            bvar.type = (await func_DataTypeFromName(  vbase));
            if ( qbNames) {
               bvar.suffixed = Math.round( ((await func_RemoveSuffix(  vbase))  !=  (await String.func_Trim(  vbase))) );
            }
         } else if ( vpartcount ==   3) {
            bvar.type = (QB.func_UCase( QB.arrayValue(vparts, [ 3]).value));
         } else if ( vpartcount ==   4) {
            bvar.type = (QB.func_UCase( (await func_Join( vparts ,    3,    - 1,   " "))));
         } else {
            await sub_AddError(  lineNumber,   "Syntax Error");
         }
         bvar.name = (await func_RemoveSuffix( QB.arrayValue(vparts, [ 1]).value));
         bvar.typeId = Math.round( (await func_FindTypeId(  bvar.type)) );
         pstart = Math.round( (QB.func_InStr(  bvar.name,   "(")) );
         if ( pstart > 0) {
            bvar.isArray = Math.round(  True );
            arraySize = (QB.func_Mid(  bvar.name,    pstart +  1,   (QB.func_Len(  bvar.name))  -  pstart -  1));
            bvar.name = (await func_RemoveSuffix( (QB.func_Left(  bvar.name,    pstart -  1))));
         } else {
            bvar.isArray = Math.round(  False );
            arraySize = "";
         }
         js = (await func_RegisterVar(  bvar,    js,    isGlobal,    isStatic,    bPreserve,    arraySize,    lineNumber));
      } 
   }
   if ( isStatic) {
      QB.arrayValue(jsLines, [ staticVarLine]).value .text = QB.arrayValue(jsLines, [ staticVarLine]).value .text +  js;
      DeclareVar = "/* static variable(s): "  + (await func_Join( parts ,    1,    - 1,   " "))  + " */";
   } else if ( isShared) {
      DeclareVar = "/* shared variable(s): "  + (await func_Join( parts ,    1,    - 1,   " "))  + " */";
   } else {
      DeclareVar =  js;
   }
return DeclareVar;
}
async function func_RegisterVar(bvar/*VARIABLE*/,js/*STRING*/,isGlobal/*INTEGER*/,isStatic/*INTEGER*/,bPreserve/*STRING*/,arraySize/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; isGlobal = Math.round(isGlobal); isStatic = Math.round(isStatic); lineNumber = Math.round(lineNumber); 
var RegisterVar = null;
/* implicit variables: */ 
   var findVar = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
   var varExists = 0;  /* INTEGER */ 
   bvar.type = (await func_NormalizeType(  bvar.type));
   varExists = Math.round( (await func_FindVariable( (await func_SpelledName(  bvar)) ,    findVar,    bvar.isArray)) );
   if ( qbNames &&  varExists && ~ isStatic) {
      bvar.jsname =  findVar.jsname;
   } else {
      bvar.jsname = (await func_VarJSName(  bvar));
      if ( isStatic) {
         bvar.jsname = "$"  +  currentMethod + "__"  +  bvar.jsname;
      }
   }
   if ( isGlobal) {
      await sub_AddVariable(  bvar,   globalVars);
   } else {
      await sub_AddVariable(  bvar,   localVars);
   }
   if (~ bvar.isArray) {
      var v = '';  /* STRING */ 
      v = "var ";
      if ( isGlobal) {
         if (~ varExists) {
            QB.arrayValue(jsLines, [ sharedVarLine]).value .text = QB.arrayValue(jsLines, [ sharedVarLine]).value .text + "var "  +  bvar.jsname + " = "  + (await func_InitVarValue(  bvar,    lineNumber))  + "; ";
         }
         v = "";
      }
      js =  js +  v +  bvar.jsname + " = "  + (await func_InitVarValue(  bvar,    lineNumber))  + "; ";
      if ( bvar.type ==  "SUB"  |  bvar.type ==  "FUNCTION" ) {
         var m = {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0};  /* METHOD */ 
         if ((await func_FindMethod(  bvar.name,    m,    bvar.type,    False))  < 1) {
            m.name =  bvar.name;
            m.type =  bvar.type;
            if ( isGlobal) {
               m.dynamic = Math.round(  True );
               await sub_AddMethod(  m,   "" ,    True);
            } else {
               await sub_AddLocalMethod(  m);
            }
         }
      }
   } else {
      if ( isGlobal & ~ varExists) {
         QB.arrayValue(jsLines, [ sharedVarLine]).value .text = QB.arrayValue(jsLines, [ sharedVarLine]).value .text + "var "  +  bvar.jsname + " = QB.initArray([0], "  + (await func_InitVarValue(  bvar,    lineNumber))  + "); ";
         varExists = Math.round(  True );
      }
      if ( varExists) {
         js =  js + "QB.resizeArray("  +  bvar.jsname + ", ["  + (await func_FormatArraySize(  arraySize,    lineNumber))  + "], "  + (await func_InitVarValue(  bvar,    lineNumber))  + ", "  +  bPreserve + "); ";
      } else {
         js =  js + "var "  +  bvar.jsname + " = QB.initArray(["  + (await func_FormatArraySize(  arraySize,    lineNumber))  + "], "  + (await func_InitVarValue(  bvar,    lineNumber))  + "); ";
      }
   }
   if ( PrintDataTypes) {
      js =  js + " /* "  +  bvar.type + " */ ";
   }
   RegisterVar =  js;
return RegisterVar;
}
async function sub_RegisterImplicitVar(varname/*STRING*/,dataType/*STRING*/,arraySize/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
/* implicit variables: */ 
   var ivar = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
   ivar.name = (await func_RemoveSuffix(  varname));
   ivar.suffixed = Math.round( ((await func_RemoveSuffix(  varname))  !=  (await String.func_Trim(  varname))) );
   ivar.type =  dataType;
   if ( arraySize !=  "" ) {
      ivar.isArray = Math.round(  True );
   }
   QB.arrayValue(jsLines, [ implicitVarLine]).value .text = QB.arrayValue(jsLines, [ implicitVarLine]).value .text + (await func_RegisterVar(  ivar,   "" ,    False,    False,   "" ,    arraySize,    lineNumber));
}
async function func_FormatArraySize(sizeString/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var FormatArraySize = null;
/* implicit variables: */ 
   var sizeParams = '';  /* STRING */ 
   sizeParams = "";
   var parts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var pcount = 0;  /* INTEGER */ 
   pcount = Math.round( (await func_ListSplit(  sizeString,   parts)) );
   var i = 0;  /* INTEGER */ 
   var ___v7420856 = 0; ___l4860913: for ( i=  1; (1 > 0) ? ( i <=  pcount) : ( i >=  pcount);  i+=1) { if (QB.halted()) { return; } ___v7420856++;   if (___v7420856 % 100 == 0) { await QB.autoLimit(); }
      var subparts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
      var scount = 0;  /* INTEGER */ 
      scount = Math.round( (await func_SLSplit2( QB.arrayValue(parts, [ i]).value ,   subparts)) );
      if ( i > 1) {
         sizeParams =  sizeParams + ",";
      }
      var j = 0;  /* INTEGER */ var toIndex = 0;  /* INTEGER */ 
      toIndex = Math.round(  0 );
      var ___v5727899 = 0; ___l8026550: for ( j=  0; (1 > 0) ? ( j <=  scount) : ( j >=  scount);  j+=1) { if (QB.halted()) { return; } ___v5727899++;   if (___v5727899 % 100 == 0) { await QB.autoLimit(); }
         if ("TO"  ==  (QB.func_UCase( QB.arrayValue(subparts, [ j]).value)) ) {
            toIndex = Math.round(  j );
            break ___l8026550;
         }
      } 
      if ( toIndex ==   0) {
         sizeParams =  sizeParams + "{l:0,u:"  + (await func_ConvertExpression( QB.arrayValue(parts, [ i]).value ,    lineNumber))  + "}";
      } else {
         var lb = '';  /* STRING */ var ub = '';  /* STRING */ 
         lb = (await func_ConvertExpression( (await func_Join( subparts ,    1,    toIndex -  1,   " ")) ,    lineNumber));
         ub = (await func_ConvertExpression( (await func_Join( subparts ,    toIndex +  1,    - 1,   " ")) ,    lineNumber));
         sizeParams =  sizeParams + "{l:"  +  lb + ",u:"  +  ub + "}";
      }
   } 
   FormatArraySize =  sizeParams;
return FormatArraySize;
}
async function func_InitTypeValue(vtype/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var InitTypeValue = null;
/* implicit variables: */ 
   var value = '';  /* STRING */ 
   if ( vtype ==  "STRING" ) {
      value = "''";
   } else if ( vtype ==  "OBJECT" ) {
      value = "{}";
   } else if ( vtype ==  "_BIT"  |  vtype ==  "_UNSIGNED _BIT"  |  vtype ==  "_BYTE"  |  vtype ==  "_UNSIGNED _BYTE"  |  vtype ==  "INTEGER"  |  vtype ==  "_UNSIGNED INTEGER"  |  vtype ==  "LONG"  |  vtype ==  "_UNSIGNED LONG"  |  vtype ==  "_INTEGER64"  |  vtype ==  "_UNSIGNED INTEGER64"  |  vtype ==  "SINGLE"  |  vtype ==  "DOUBLE"  |  vtype ==  "_FLOAT"  |  vtype ==  "_OFFSET"  |  vtype ==  "_UNSIGNED _OFFSET" ) {
      value = "0";
   } else if ( vtype ==  "FUNCTION"  |  vtype ==  "SUB" ) {
      value = "function() { return 0; }";
   } else {
      var typeId = 0;  /* INTEGER */ 
      typeId = Math.round( (await func_FindTypeId(  vtype)) );
      if ( typeId ==   - 1) {
         await sub_AddError(  lineNumber,   "Unknown type: "  +  vtype);
         value = "''";
      } else {
         value = "{";
         var i = 0;  /* INTEGER */ 
         var ___v9712480 = 0; ___l943555: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  typeVars))) : ( i >= (QB.func_UBound(  typeVars)));  i+=1) { if (QB.halted()) { return; } ___v9712480++;   if (___v9712480 % 100 == 0) { await QB.autoLimit(); }
            if ( typeId ==  QB.arrayValue(typeVars, [ i]).value .typeId) {
               value =  value + QB.arrayValue(typeVars, [ i]).value .name + ":"  + (await func_InitVarValue( QB.arrayValue(typeVars, [ i]).value ,    lineNumber))  + ",";
            }
         } 
         value = (QB.func_Left(  value,   (QB.func_Len(  value))  -  1))  + "}";
      }
   }
   InitTypeValue =  value;
return InitTypeValue;
}
async function func_FindTypeId(typeName/*STRING*/) {
if (QB.halted()) { return; }; 
var FindTypeId = null;
/* implicit variables: */ 
   var id = 0;  /* INTEGER */ 
   id = Math.round(  - 1 );
   var i = 0;  /* INTEGER */ 
   var ___v3564434 = 0; ___l2033024: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  types))) : ( i >= (QB.func_UBound(  types)));  i+=1) { if (QB.halted()) { return; } ___v3564434++;   if (___v3564434 % 100 == 0) { await QB.autoLimit(); }
      if (QB.arrayValue(types, [ i]).value .name ==   typeName) {
         id = Math.round(  i );
         break ___l2033024;
      }
   } 
   FindTypeId =  id;
return FindTypeId;
}
async function func_ConvertExpression(ex/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertExpression = null;
/* implicit variables: */ 
   var c = '';  /* STRING */ 
   var js = '';  /* STRING */ 
   js = "";
   var word = '';  /* STRING */ 
   word = "";
   var bvar = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
   var m = {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0};  /* METHOD */ 
   var intdiv = 0;  /* INTEGER */ 
   var stringLiteral = 0;  /* INTEGER */ 
   var i = 0;  /* INTEGER */ 
   i = Math.round(  1 );
   var ___v5148522 = 0; ___l366079: while ( i <= (QB.func_Len(  ex))) { if (QB.halted()) { return; }___v5148522++;   if (___v5148522 % 100 == 0) { await QB.autoLimit(); }
      c = (QB.func_Mid(  ex,    i,    1));
      if ( c ==  (QB.func_Chr(  34)) ) {
         js =  js +  c;
         stringLiteral = Math.round( ~ stringLiteral );
      } else if ( stringLiteral) {
         js =  js +  c;
      } else {
         if ( c ==  " "  |  c ==  ","  |  i ==  (QB.func_Len(  ex)) ) {
            if ( i ==  (QB.func_Len(  ex)) ) {
               word =  word +  c;
            }
            var uword = '';  /* STRING */ 
            uword = (QB.func_UCase( (await String.func_Trim(  word))));
            if ( uword ==  "NOT" ) {
               js =  js + "~";
            } else if ( uword ==  "NEGATE"  |  uword ==  "_NEGATE" ) {
               js =  js + "!";
            } else if ( uword ==  "AND" ) {
               js =  js + " & ";
            } else if ( uword ==  "OR" ) {
               js =  js + " | ";
            } else if ( uword ==  "ANDALSO"  |  uword ==  "_ANDALSO" ) {
               js =  js + " && ";
            } else if ( uword ==  "ORELSE"  |  uword ==  "_ORELSE" ) {
               js =  js + " || ";
            } else if ( uword ==  "MOD" ) {
               js =  js + " % ";
            } else if ( uword ==  "XOR" ) {
               js =  js + " ^ ";
            } else if ( uword ==  "EQV" ) {
               js =  js + " === ";
               await sub_AddWarning(  lineNumber,   "EQV bitwise operator is unsupported, replaced with boolean equivalence '==='");
            } else if ( uword ==  "IMP" ) {
               js =  js + " | ";
               await sub_AddError(  lineNumber,   "IMP operator is unsupported");
            } else if ( uword ==  "=" ) {
               js =  js + " == ";
            } else if ( uword ==  "<>" ) {
               js =  js + " != ";
            } else if ( uword ==  "^" ) {
               js =  js + " ** ";
            } else if ( uword ==  "\\" ) {
               js =  js + " \\ ";
               intdiv = Math.round(  True );
            } else if ((await String.func_StartsWith(  uword,   "&H"))  | (await String.func_StartsWith(  uword,   "&O"))  | (await String.func_StartsWith(  uword,   "&B")) ) {
               js =  js + " QB.func_Val('"  +  uword + "') ";
            } else if ((await String.func_StartsWith(  uword,   "@")) ) {
               var mref = '';  /* STRING */ 
               var fres = 0;  /* INTEGER */ 
               mref = (QB.func_Mid( (await String.func_Trim(  word)) ,    2));
               fres = Math.round( (await func_FindMethod(  mref,    m,   "FUNCTION" ,    False)) );
               if ( fres < 1) {
                  fres = Math.round( (await func_FindMethod(  mref,    m,   "SUB" ,    False)) );
               }
               if ( fres) {
                  js =  js + " "  +  m.jsname;
               } else {
                  await sub_AddError(  lineNumber,   "Missing or invalid method reference ("  +  mref + ")");
               }
            } else {
               if ((await func_FindVariable(  word,    bvar,    False)) ) {
                  js =  js + " "  +  bvar.jsname;
               } else {
                  if ((await func_FindMethod(  word,    m,   "FUNCTION" ,    True)) ) {
                     if ( m.name !=   currentMethod) {
                        js =  js + (await func_CallMethod(  m))  + "()";
                     } else {
                        js =  js + " "  +  word;
                     }
                  } else {
                     if (~ qbNames && (await func_FindVariable(  word,    bvar,    True)) ) {
                        js =  js + " "  +  bvar.jsname;
                     } else {
                        var varname = '';  /* STRING */ 
                        varname = (await String.func_Trim(  word));
                        if ((await func_IsValidVarname(  varname)) ) {
                           var dt = '';  /* STRING */ 
                           dt = (await func_DataTypeFromName(  varname));
                           if ( optionExplicit) {
                              await sub_AddError(  lineNumber,   "Variable '"  + (await func_RemoveSuffix(  varname))  + "' ("  +  dt + ") not defined");
                           } else {
                              await sub_RegisterImplicitVar(  varname,    dt,   "" ,    lineNumber);
                              if ((await func_FindVariable(  varname,    bvar,    False)) ) {
                                 js =  js + " "  +  bvar.jsname;
                              } else {
                                 await sub_AddError(  i,   "Implicit variable declaration error");
                              }
                           }
                        } else {
                           js =  js + " "  + (await func_RemoveSuffix(  word));
                        }
                     }
                  }
               }
            }
            if ( c ==  ","  &  i !=  (QB.func_Len(  ex)) ) {
               js =  js + ",";
            }
            word = "";
         } else if ( c ==  "(" ) {
            var done = 0;  /* INTEGER */ 
            done = Math.round(  False );
            var pcount = 0;  /* INTEGER */ 
            pcount = Math.round(  0 );
            var c2 = '';  /* STRING */ 
            var ex2 = '';  /* STRING */ 
            ex2 = "";
            var stringLiteral2 = 0;  /* INTEGER */ 
            stringLiteral2 = Math.round(  False );
            i = Math.round(  i +  1 );
            var ___v6653845 = 0; ___l7114061: while (~ done &  i <= (QB.func_Len(  ex))) { if (QB.halted()) { return; }___v6653845++;   if (___v6653845 % 100 == 0) { await QB.autoLimit(); }
               c2 = (QB.func_Mid(  ex,    i,    1));
               if ( c2 ==  (QB.func_Chr(  34)) ) {
                  stringLiteral2 = Math.round( ~ stringLiteral2 );
               } else if (~ stringLiteral2 &  c2 ==  "(" ) {
                  pcount = Math.round(  pcount +  1 );
               } else if (~ stringLiteral2 &  c2 ==  ")" ) {
                  if ( pcount ==   0) {
                     done = Math.round(  True );
                  } else {
                     pcount = Math.round(  pcount -  1 );
                  }
               }
               if (~ done) {
                  ex2 =  ex2 +  c2;
                  i = Math.round(  i +  1 );
               }
            }
            var fneg = '';  /* STRING */ 
            fneg = "";
            if ((QB.func_Len(  word))  > 0) {
               if ((QB.func_Left(  word,    1))  ==  "-" ) {
                  fneg = "-";
                  word = (QB.func_Mid(  word,    2));
               }
            }
            if ((await func_FindVariable(  word,    bvar,    True)) ) {
               if ((await String.func_Trim(  ex2))  ==  "" ) {
                  js =  js +  fneg +  bvar.jsname;
               } else {
                  js =  js +  fneg + "QB.arrayValue("  +  bvar.jsname + ", ["  + (await func_ConvertExpression(  ex2,    lineNumber))  + "]).value";
               }
            } else if ((QB.func_UCase( (await String.func_Trim(  word))))  ==  "LEN"  && (await func_ConvertLenOf(  ex2,    lineNumber))  !=  "" ) {
               js =  js +  fneg + "("  + (await func_ConvertLenOf(  ex2,    lineNumber))  + ")";
            } else if ((await func_FindMethod(  word,    m,   "FUNCTION" ,    True)) ) {
               if ( qbNames && ((QB.func_UCase( (await String.func_Trim(  word))))  ==  "UBOUND"  | (QB.func_UCase( (await String.func_Trim(  word))))  ==  "LBOUND") ) {
                  ex2 = (await func_ArrayArgument(  ex2));
               }
               js =  js +  fneg + "("  + (await func_CallMethod(  m))  + "("  + (await func_ConvertMethodParams(  ex2,    lineNumber))  + "))";
            } else {
               varname = (await String.func_Trim(  word));
               if ( varname !=  "" ) {
                  if ( optionExplicit |  optionExplicitArray) {
                     await sub_AddError(  lineNumber,   "Missing function or array ["  +  word + "]");
                     js =  js +  fneg + "("  + (await func_ConvertExpression(  ex2,    lineNumber))  + ")";
                  } else {
                     var params = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
                     var arraySize = '';  /* STRING */ 
                     var argc = 0;  /* INTEGER */ var ai = 0;  /* INTEGER */ 
                     argc = Math.round( (await func_ListSplit(  ex2,   params)) );
                     arraySize = "10";
                     var ___v438575 = 0; ___l8600287: for ( ai=  2; (1 > 0) ? ( ai <=  argc) : ( ai >=  argc);  ai+=1) { if (QB.halted()) { return; } ___v438575++;   if (___v438575 % 100 == 0) { await QB.autoLimit(); }
                        arraySize =  arraySize + ", 10";
                     } 
                     dt = (await func_DataTypeFromName(  varname));
                     await sub_RegisterImplicitVar(  varname,    dt,    arraySize,    lineNumber);
                     if ((await func_FindVariable(  varname,    bvar,    True)) ) {
                        if ((await String.func_Trim(  ex2))  ==  "" ) {
                           js =  js +  fneg +  bvar.jsname;
                        } else {
                           js =  js +  fneg + "QB.arrayValue("  +  bvar.jsname + ", ["  + (await func_ConvertExpression(  ex2,    lineNumber))  + "]).value";
                        }
                     } else {
                        await sub_AddError(  i,   "Implicit variable declaration error");
                     }
                  }
               } else {
                  js =  js +  fneg + "("  + (await func_ConvertExpression(  ex2,    lineNumber))  + ")";
               }
            }
            word = "";
         } else {
            word =  word +  c;
         }
      }
      i = Math.round(  i +  1 );
   }
   if ( intdiv) {
      js = (await func_ConvertIntDiv(  js));
   }
   ConvertExpression =  js;
return ConvertExpression;
}
async function func_ConvertIntDiv(s/*STRING*/) {
if (QB.halted()) { return; }; 
var ConvertIntDiv = null;
/* implicit variables: */ 
   var idx = 0;  /* INTEGER */ var sidx = 0;  /* INTEGER */ var eidx = 0;  /* INTEGER */ var smode = 0;  /* INTEGER */ var qmode = 0;  /* INTEGER */ var pcount = 0;  /* INTEGER */ var ci = 0;  /* INTEGER */ 
   var c = '';  /* STRING */ 
   idx = Math.round( (QB.func_InStr(  s,   "\\")) );
   var ___v1632485 = 0; ___l3765875: while ( idx > 0) { if (QB.halted()) { return; }___v1632485++;   if (___v1632485 % 100 == 0) { await QB.autoLimit(); }
      smode = Math.round(  0 );
      qmode = Math.round(  0 );
      pcount = Math.round(  0 );
      var ___v1559812 = 0; ___l1362121: for ( sidx=  idx -  1; ( - 1 > 0) ? ( sidx <=  1) : ( sidx >=  1);  sidx+= - 1) { if (QB.halted()) { return; } ___v1559812++;   if (___v1559812 % 100 == 0) { await QB.autoLimit(); }
         c = (QB.func_Mid(  s,    sidx,    1));
         if ( c ==  " " ) {
            if ( smode ==   0) {
            } else if ( smode ==   1) {
               if ( pcount <=  0) {
                  var ___v8544910 = 0; ___l4681948: for ( ci=  sidx -  1; ( - 1 > 0) ? ( ci <=  1) : ( ci >=  1);  ci+= - 1) { if (QB.halted()) { return; } ___v8544910++;   if (___v8544910 % 100 == 0) { await QB.autoLimit(); }
                     c = (QB.func_Mid(  s,    ci,    1));
                     if ( c !=  " " ) {
                        if ( c ==  "-" ) {
                           sidx = Math.round(  ci );
                        }
                        break ___l4681948;
                     }
                  } 
                  break ___l1362121;
               }
               smode = Math.round(  0 );
            }
         } else {
            if ( smode ==   0) {
               smode = Math.round(  1 );
            }
            if ( c ==  (QB.func_Chr(  34)) ) {
               qmode = Math.round( ~ qmode );
            } else if ( c ==  ")"  & ~ qmode) {
               pcount = Math.round(  pcount +  1 );
            } else if ( c ==  "("  & ~ qmode) {
               pcount = Math.round(  pcount -  1 );
            }
         }
      } 
      pcount = Math.round( (QB.func_Abs(  pcount)) );
      smode = Math.round(  0 );
      qmode = Math.round(  0 );
      var ___v5163234 = 0; ___l4142913: for ( eidx=  idx +  1; (1 > 0) ? ( eidx <= (QB.func_Len(  s))) : ( eidx >= (QB.func_Len(  s)));  eidx+=1) { if (QB.halted()) { return; } ___v5163234++;   if (___v5163234 % 100 == 0) { await QB.autoLimit(); }
         c = (QB.func_Mid(  s,    eidx,    1));
         if ( c ==  " "  |  c ==  "-" ) {
            if ( smode ==   0) {
            } else if ( smode ==   1) {
               if ( pcount ==   0) {
                  break ___l4142913;
               }
               smode = Math.round(  0 );
            }
         } else {
            if ( smode ==   0) {
               smode = Math.round(  1 );
            }
            if ( c ==  (QB.func_Chr(  34)) ) {
               qmode = Math.round( ~ qmode );
            } else if ( c ==  ")"  & ~ qmode) {
               pcount = Math.round(  pcount -  1 );
            } else if ( c ==  "("  & ~ qmode) {
               pcount = Math.round(  pcount +  1 );
            }
         }
      } 
      s = (QB.func_Left(  s,    sidx))  + " QB.func_Fix(QB.func_Cint("  + (QB.func_Mid(  s,    sidx +  1,    idx -  sidx -  1))  + ") / QB.func_Cint("  + (QB.func_Mid(  s,    idx +  1,    eidx -  idx -  1))  + "))"  + (QB.func_Mid(  s,    eidx));
      idx = Math.round( (QB.func_InStr(  s,   "\\")) );
   }
   ConvertIntDiv =  s;
return ConvertIntDiv;
}
async function func_ConvertMethodParams(args/*STRING*/,lineNumber/*INTEGER*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
var ConvertMethodParams = null;
/* implicit variables: */ 
   var js = '';  /* STRING */ 
   var params = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var argc = 0;  /* INTEGER */ 
   argc = Math.round( (await func_ListSplit(  args,   params)) );
   var i = 0;  /* INTEGER */ 
   var ___v3500128 = 0; ___l534278: for ( i=  1; (1 > 0) ? ( i <=  argc) : ( i >=  argc);  i+=1) { if (QB.halted()) { return; } ___v3500128++;   if (___v3500128 % 100 == 0) { await QB.autoLimit(); }
      if ( i > 1) {
         js =  js + ",";
      }
      if ((await String.func_Trim( QB.arrayValue(params, [ i]).value))  ==  "" ) {
         js =  js + " undefined";
      } else {
         js =  js + " "  + (await func_ConvertExpression( QB.arrayValue(params, [ i]).value ,    lineNumber));
      }
   } 
   ConvertMethodParams =  js;
return ConvertMethodParams;
}
async function func_CallMethod(m/*METHOD*/) {
if (QB.halted()) { return; }; 
var CallMethod = null;
/* implicit variables: */ 
   var js = '';  /* STRING */ 
   if ( m.sync) {
      js = "await ";
   }
   js =  js +  m.jsname;
   CallMethod =  js;
return CallMethod;
}
async function func_FindVariable(varname/*STRING*/,bvar/*VARIABLE*/,isArray/*INTEGER*/) {
if (QB.halted()) { return; }; isArray = Math.round(isArray); 
var FindVariable = null;
/* implicit variables: */ 
   var found = 0;  /* INTEGER */ 
   found = Math.round(  False );
   var fvarname = '';  /* STRING */ var wantType = '';  /* STRING */ 
   var hasSuffix = 0;  /* INTEGER */ 
   hasSuffix = Math.round(  False );
   fvarname = (await String.func_Trim( (QB.func_UCase( (await func_RemoveSuffix(  varname))))));
   if ( qbNames) {
      hasSuffix = Math.round( ( fvarname !=  (await String.func_Trim( (QB.func_UCase(  varname))))) );
      wantType = (await func_NormalizeType( (await func_DataTypeFromName( (await String.func_Trim(  varname))))));
   }
   found = Math.round( (await func_FindVariableIn( localVars ,    fvarname,    isArray,    hasSuffix,    wantType,    bvar)) );
   if (~ found) {
      found = Math.round( (await func_FindVariableIn( globalVars ,    fvarname,    isArray,    hasSuffix,    wantType,    bvar)) );
   }
   FindVariable =  found;
return FindVariable;
}
async function func_FindVariableIn(vlist/*VARIABLE*/,fvarname/*STRING*/,isArray/*INTEGER*/,hasSuffix/*INTEGER*/,wantType/*STRING*/,bvar/*VARIABLE*/) {
if (QB.halted()) { return; }; isArray = Math.round(isArray); hasSuffix = Math.round(hasSuffix); 
var FindVariableIn = null;
/* implicit variables: */ 
   var i = 0;  /* INTEGER */ var pass = 0;  /* INTEGER */ var ok = 0;  /* INTEGER */ 
   FindVariableIn =  False;
   var ___v2479922 = 0; ___l4240639: for ( pass=  1; (1 > 0) ? ( pass <=  2) : ( pass >=  2);  pass+=1) { if (QB.halted()) { return; } ___v2479922++;   if (___v2479922 % 100 == 0) { await QB.autoLimit(); }
      var ___v3827851 = 0; ___l8254626: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  vlist))) : ( i >= (QB.func_UBound(  vlist)));  i+=1) { if (QB.halted()) { return; } ___v3827851++;   if (___v3827851 % 100 == 0) { await QB.autoLimit(); }
         if (QB.arrayValue(vlist, [ i]).value .isArray ==   isArray & (QB.func_UCase( QB.arrayValue(vlist, [ i]).value .name))  ==   fvarname) {
            ok = Math.round(  False );
            if (~ qbNames) {
               ok = Math.round( ( pass ==   1) );
            } else if ( hasSuffix) {
               ok = Math.round( ( pass ==   1)  && (QB.arrayValue(vlist, [ i]).value .isConst || QB.arrayValue(vlist, [ i]).value .type ==   wantType) );
            } else if ( pass ==   1) {
               if (QB.arrayValue(vlist, [ i]).value .suffixed) {
                  ok = Math.round(  False );
               } else {
                  ok = Math.round(  True );
               }
            } else {
               ok = Math.round( QB.arrayValue(vlist, [ i]).value .suffixed && QB.arrayValue(vlist, [ i]).value .type ==  "SINGLE" );
            }
            if ( ok) {
               bvar.type = QB.arrayValue(vlist, [ i]).value .type;
               bvar.name = QB.arrayValue(vlist, [ i]).value .name;
               bvar.jsname = QB.arrayValue(vlist, [ i]).value .jsname;
               bvar.isConst = Math.round( QB.arrayValue(vlist, [ i]).value .isConst );
               bvar.isArray = Math.round( QB.arrayValue(vlist, [ i]).value .isArray );
               bvar.arraySize = Math.round( QB.arrayValue(vlist, [ i]).value .arraySize );
               bvar.typeId = Math.round( QB.arrayValue(vlist, [ i]).value .typeId );
               bvar.fixedLen = QB.arrayValue(vlist, [ i]).value .fixedLen;
               bvar.suffixed = Math.round( QB.arrayValue(vlist, [ i]).value .suffixed );
               FindVariableIn =  True;
               return FindVariableIn;
            }
         }
      } 
   } 
return FindVariableIn;
}
async function func_ArrayArgument(args/*STRING*/) {
if (QB.halted()) { return; }; 
var ArrayArgument = null;
/* implicit variables: */ 
   var aparts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var n = 0;  /* INTEGER */ var k = 0;  /* INTEGER */ 
   var av = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
   var first = '';  /* STRING */ 
   ArrayArgument =  args;
   n = Math.round( (await func_ListSplit(  args,   aparts)) );
   if ( n < 1) {
      return ArrayArgument;
   }
   first = (await String.func_Trim( QB.arrayValue(aparts, [ 1]).value));
   if (~(await func_IsValidVarname(  first)) ) {
      return ArrayArgument;
   }
   if (~(await func_FindVariable(  first,    av,    True)) ) {
      return ArrayArgument;
   }
   first =  first + "()";
   var ___v5727280 = 0; ___l5291161: for ( k=  2; (1 > 0) ? ( k <=  n) : ( k >=  n);  k+=1) { if (QB.halted()) { return; } ___v5727280++;   if (___v5727280 % 100 == 0) { await QB.autoLimit(); }
      first =  first + ", "  + QB.arrayValue(aparts, [ k]).value;
   } 
   ArrayArgument =  first;
return ArrayArgument;
}
async function func_SpelledName(bvar/*VARIABLE*/) {
if (QB.halted()) { return; }; 
var SpelledName = null;
/* implicit variables: */ 
   if ( qbNames &&  bvar.suffixed) {
      SpelledName = (await func_RemoveSuffix(  bvar.name))  + (await func_SuffixForType( (await func_NormalizeType(  bvar.type))));
   } else {
      SpelledName =  bvar.name;
   }
return SpelledName;
}
async function func_VarJSName(bvar/*VARIABLE*/) {
if (QB.halted()) { return; }; 
var VarJSName = null;
/* implicit variables: */ 
   var js = '';  /* STRING */ 
   js = (await func_RemoveSuffix(  bvar.name));
   if ( qbNames) {
      if ( bvar.suffixed) {
         js =  js + "$"  + (await func_TypeTag( (await func_NormalizeType(  bvar.type))));
      }
      var ___v5734744 = 0; ___l1815773: while ((await func_JSNameInUse(  js))) { if (QB.halted()) { return; }___v5734744++;   if (___v5734744 % 100 == 0) { await QB.autoLimit(); }
         if ( bvar.isArray) {
            js =  js + "$a";
         } else {
            js =  js + "$v";
         }
      }
   }
   VarJSName =  js;
return VarJSName;
}
async function func_JSNameInUse(jsname/*STRING*/) {
if (QB.halted()) { return; }; 
var JSNameInUse = null;
/* implicit variables: */ 
   var i = 0;  /* INTEGER */ 
   JSNameInUse =  True;
   var ___v7015296 = 0; ___l4299485: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  localVars))) : ( i >= (QB.func_UBound(  localVars)));  i+=1) { if (QB.halted()) { return; } ___v7015296++;   if (___v7015296 % 100 == 0) { await QB.autoLimit(); }
      if (QB.arrayValue(localVars, [ i]).value .jsname ==   jsname) {
         return JSNameInUse;
      }
   } 
   var ___v4460676 = 0; ___l5512760: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  globalVars))) : ( i >= (QB.func_UBound(  globalVars)));  i+=1) { if (QB.halted()) { return; } ___v4460676++;   if (___v4460676 % 100 == 0) { await QB.autoLimit(); }
      if (QB.arrayValue(globalVars, [ i]).value .jsname ==   jsname) {
         return JSNameInUse;
      }
   } 
   JSNameInUse =  False;
return JSNameInUse;
}
async function func_TypeTag(vtype/*STRING*/) {
if (QB.halted()) { return; }; 
var TypeTag = null;
/* implicit variables: */ 
   var t = '';  /* STRING */ 
   ___v9752783: { var ___v1171007 =  vtype; 
      if (___v1171007 == "STRING") {___v9744149: { 
      t = "s";
      } } else if (___v1171007 == "INTEGER") {___v6934967: { 
      t = "i";
      } } else if (___v1171007 == "LONG") {___v742761: { 
      t = "l";
      } } else if (___v1171007 == "SINGLE") {___v2553631: { 
      t = "f";
      } } else if (___v1171007 == "DOUBLE") {___v9293264: { 
      t = "d";
      } } else if (___v1171007 == "_INTEGER64") {___v6932642: { 
      t = "ll";
      } } else if (___v1171007 == "_BYTE") {___v7314677: { 
      t = "b";
      } } else if (___v1171007 == "_UNSIGNED INTEGER") {___v5643061: { 
      t = "ui";
      } } else if (___v1171007 == "_UNSIGNED LONG") {___v4109445: { 
      t = "ul";
      } } else if (___v1171007 == "_UNSIGNED _INTEGER64") {___v2730680: { 
      t = "ull";
      } } else if (___v1171007 == "_UNSIGNED _BYTE") {___v1680819: { 
      t = "ub";
      } } else if (___v1171007 == "_FLOAT") {___v9763871: { 
      t = "x";
      } } else if (___v1171007 == "_BIT") {___v2589300: { 
      t = "bit";
      } } else if (___v1171007 == "_UNSIGNED _BIT") {___v7264259: { 
      t = "ubit";
      } } else if (___v1171007 == "_OFFSET") {___v660648: { 
      t = "o";
      } } else if (___v1171007 == "_UNSIGNED _OFFSET") {___v7582687: { 
      t = "uo";
      } } else { ___v7357951: { 
      t = "t";
    }  } } 
   TypeTag =  t;
return TypeTag;
}
async function func_SuffixForType(vtype/*STRING*/) {
if (QB.halted()) { return; }; 
var SuffixForType = null;
/* implicit variables: */ 
   var t = '';  /* STRING */ 
   ___v9130260: { var ___v783014 =  vtype; 
      if (___v783014 == "STRING") {___v7596213: { 
      t = "$";
      } } else if (___v783014 == "INTEGER") {___v3550285: { 
      t = "%";
      } } else if (___v783014 == "LONG") {___v6007283: { 
      t = "&";
      } } else if (___v783014 == "SINGLE") {___v4553646: { 
      t = "!";
      } } else if (___v783014 == "DOUBLE") {___v537480: { 
      t = "#";
      } } else if (___v783014 == "_INTEGER64") {___v9592205: { 
      t = "&&";
      } } else if (___v783014 == "_BYTE") {___v5784354: { 
      t = "%%";
      } } else if (___v783014 == "_UNSIGNED INTEGER") {___v4013936: { 
      t = "~%";
      } } else if (___v783014 == "_UNSIGNED LONG") {___v8282100: { 
      t = "~&";
      } } else if (___v783014 == "_UNSIGNED _INTEGER64") {___v481880: { 
      t = "~&&";
      } } else if (___v783014 == "_FLOAT") {___v3244722: { 
      t = "##";
      } } else if (___v783014 == "_BIT") {___v3744649: { 
      t = "`";
      } } else if (___v783014 == "_OFFSET") {___v5254511: { 
      t = "%&";
      } } else if (___v783014 == "_UNSIGNED _OFFSET") {___v3570996: { 
      t = "~%&";
      } } else { ___v4458332: { 
      t = "";
    }  } } 
   SuffixForType =  t;
return SuffixForType;
}
async function func_FindMethod(mname/*STRING*/,m/*METHOD*/,t/*STRING*/,includeBuiltIn/*INTEGER*/) {
if (QB.halted()) { return; }; includeBuiltIn = Math.round(includeBuiltIn); 
var FindMethod = null;
/* implicit variables: */ 
   var umname = '';  /* STRING */ 
   umname = (await String.func_Trim( (QB.func_UCase( (await func_RemoveSuffix(  mname))))));
   var found = 0;  /* INTEGER */ 
   found = Math.round(  0 );
   var i = 0;  /* INTEGER */ 
   var ___v2334229 = 0; ___l1160948: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  localMethods))) : ( i >= (QB.func_UBound(  localMethods)));  i+=1) { if (QB.halted()) { return; } ___v2334229++;   if (___v2334229 % 100 == 0) { await QB.autoLimit(); }
      if (QB.arrayValue(localMethods, [ i]).value .uname ==   umname) {
         found = Math.round(  True );
         m.line = Math.round( QB.arrayValue(localMethods, [ i]).value .line );
         m.type = QB.arrayValue(localMethods, [ i]).value .type;
         m.returnType = QB.arrayValue(localMethods, [ i]).value .returnType;
         m.name = QB.arrayValue(localMethods, [ i]).value .name;
         m.jsname = QB.arrayValue(localMethods, [ i]).value .jsname;
         m.uname = QB.arrayValue(localMethods, [ i]).value .uname;
         m.argc = Math.round( QB.arrayValue(localMethods, [ i]).value .argc );
         m.args = QB.arrayValue(localMethods, [ i]).value .args;
         m.sync = Math.round( QB.arrayValue(localMethods, [ i]).value .sync );
         found = Math.round(  i );
         break ___l1160948;
      }
   } 
   if (~ found) {
      var ___v3590834 = 0; ___l6846002: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  methods))) : ( i >= (QB.func_UBound(  methods)));  i+=1) { if (QB.halted()) { return; } ___v3590834++;   if (___v3590834 % 100 == 0) { await QB.autoLimit(); }
         if ((~ includeBuiltIn)  & QB.arrayValue(methods, [ i]).value .builtin) {
         } else if (QB.arrayValue(methods, [ i]).value .uname ==   umname & QB.arrayValue(methods, [ i]).value .type ==   t) {
            found = Math.round(  True );
            m.line = Math.round( QB.arrayValue(methods, [ i]).value .line );
            m.type = QB.arrayValue(methods, [ i]).value .type;
            m.returnType = QB.arrayValue(methods, [ i]).value .returnType;
            m.name = QB.arrayValue(methods, [ i]).value .name;
            m.jsname = QB.arrayValue(methods, [ i]).value .jsname;
            m.uname = QB.arrayValue(methods, [ i]).value .uname;
            m.argc = Math.round( QB.arrayValue(methods, [ i]).value .argc );
            m.args = QB.arrayValue(methods, [ i]).value .args;
            m.sync = Math.round( QB.arrayValue(methods, [ i]).value .sync );
            found = Math.round(  i );
            break ___l6846002;
         }
      } 
      if (~ found) {
         var ___v3262099 = 0; ___l9390883: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  exportMethods))) : ( i >= (QB.func_UBound(  exportMethods)));  i+=1) { if (QB.halted()) { return; } ___v3262099++;   if (___v3262099 % 100 == 0) { await QB.autoLimit(); }
            if (QB.arrayValue(exportMethods, [ i]).value .uname ==   umname & QB.arrayValue(exportMethods, [ i]).value .type ==   t) {
               found = Math.round(  True );
               m.line = Math.round( QB.arrayValue(exportMethods, [ i]).value .line );
               m.type = QB.arrayValue(exportMethods, [ i]).value .type;
               m.returnType = QB.arrayValue(exportMethods, [ i]).value .returnType;
               m.name = QB.arrayValue(exportMethods, [ i]).value .name;
               m.jsname = QB.arrayValue(exportMethods, [ i]).value .jsname;
               m.uname = QB.arrayValue(exportMethods, [ i]).value .uname;
               m.argc = Math.round( QB.arrayValue(exportMethods, [ i]).value .argc );
               m.args = QB.arrayValue(exportMethods, [ i]).value .args;
               m.sync = Math.round( QB.arrayValue(exportMethods, [ i]).value .sync );
               found = Math.round(  i );
               break ___l9390883;
            }
         } 
      }
   }
   FindMethod =  found;
return FindMethod;
}
async function sub_ConvertMethods() {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   await sub_AddJSLine(  0,   "");
   var i = 0;  /* INTEGER */ 
   var ___v559831 = 0; ___l9709364: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  methods))) : ( i >= (QB.func_UBound(  methods)));  i+=1) { if (QB.halted()) { return; } ___v559831++;   if (___v559831 % 100 == 0) { await QB.autoLimit(); }
      if ((QB.arrayValue(methods, [ i]).value .line !=   0) ) {
         var lastLine = 0;  /* INTEGER */ 
         lastLine = Math.round( QB.arrayValue(methods, [ i]).value .lastLine );
         if ( lastLine ==   - 1) {
            lastLine = Math.round( QB.arrayValue(methods, [ i +  1]).value .line -  1 );
            if ( lastLine < 0) {
               lastLine = Math.round( (QB.func_UBound(  lines)) );
            }
         }
         QB.resizeArray(localMethods, [{l:0,u: 0}], {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0}, false);  /* METHOD */ 
         QB.resizeArray(localVars, [{l:0,u: 0}], {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0}, false);  /* VARIABLE */ 
         var intConv = '';  /* STRING */ 
         intConv = "";
         var methodDec = '';  /* STRING */ 
         methodDec = "async function "  + QB.arrayValue(methods, [ i]).value .jsname + "(";
         if (QB.arrayValue(methods, [ i]).value .argc > 0) {
            var args = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
            var c = 0;  /* INTEGER */ 
            c = Math.round( (await func_Split( QB.arrayValue(methods, [ i]).value .args,   "," ,   args)) );
            var a = 0;  /* INTEGER */ 
            var ___v3546544 = 0; ___l4306647: for ( a=  1; (1 > 0) ? ( a <=  c) : ( a >=  c);  a+=1) { if (QB.halted()) { return; } ___v3546544++;   if (___v3546544 % 100 == 0) { await QB.autoLimit(); }
               var v = 0;  /* INTEGER */ 
               var parts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
               v = Math.round( (await func_Split( QB.arrayValue(args, [ a]).value ,   ":" ,   parts)) );
               var bvar = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
               bvar.name = (await func_RemoveSuffix( QB.arrayValue(parts, [ 1]).value));
               bvar.type = (await func_NormalizeType( QB.arrayValue(parts, [ 2]).value));
               bvar.typeId = Math.round( (await func_FindTypeId(  bvar.type)) );
               if (QB.arrayValue(parts, [ 3]).value  ==  "true" ) {
                  bvar.isArray = Math.round(  True );
               }
               bvar.suffixed = Math.round(  qbNames && ((await func_RemoveSuffix( QB.arrayValue(parts, [ 1]).value))  !=  (await String.func_Trim( QB.arrayValue(parts, [ 1]).value))) );
               bvar.jsname = (await func_VarJSName(  bvar));
               await sub_AddVariable(  bvar,   localVars);
               methodDec =  methodDec +  bvar.jsname + "/*"  + QB.arrayValue(parts, [ 2]).value  + "*/";
               if ( a < c) {
                  methodDec =  methodDec + ",";
               }
               if (~ bvar.isArray) {
                  var typeName = '';  /* STRING */ 
                  typeName = (QB.func_UCase(  bvar.type));
                  if ( typeName ==  "_BIT"  |  typeName ==  "_UNSIGNED _BIT"  |  typeName ==  "_BYTE"  |  typeName ==  "_UNSIGNED _BYTE"  |  typeName ==  "INTEGER"  |  typeName ==  "_UNSIGNED INTEGER"  |  typeName ==  "LONG"  |  typeName ==  "_UNSIGNED LONG"  |  typeName ==  "_INTEGER64"  |  typeName ==  "_UNSIGNED _INTEGER64" ) {
                     intConv =  intConv +  bvar.jsname + " = Math.round("  +  bvar.jsname + "); ";
                  } else if ( typeName ==  "FUNCTION"  |  typeName ==  "SUB" ) {
                     var m = {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0};  /* METHOD */ 
                     m.name =  bvar.name;
                     m.type =  bvar.type;
                     await sub_AddLocalMethod(  m);
                  }
               }
            } 
         }
         methodDec =  methodDec + ") {";
         await sub_AddJSLine( QB.arrayValue(methods, [ i]).value .line,    methodDec);
         await sub_AddJSLine( QB.arrayValue(methods, [ i]).value .line,   "if (QB.halted()) { return; }; "  +  intConv);
         if (QB.arrayValue(methods, [ i]).value .type ==  "FUNCTION" ) {
            var fvar = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
            fvar.name = (await func_RemoveSuffix( QB.arrayValue(methods, [ i]).value .name));
            fvar.type = (await func_DataTypeFromName( QB.arrayValue(methods, [ i]).value .name));
            fvar.fixedLen = "";
            if ((await func_FindTypeId( QB.arrayValue(methods, [ i]).value .returnType))  > 0) {
               fvar.type = QB.arrayValue(methods, [ i]).value .returnType;
               await sub_AddJSLine( QB.arrayValue(methods, [ i]).value .line,   "var "  + (await func_RemoveSuffix( QB.arrayValue(methods, [ i]).value .name))  + " = "  + (await func_InitTypeValue(  fvar.type,   QB.arrayValue(methods, [ i]).value .line))  + ";");
            } else {
               await sub_AddJSLine( QB.arrayValue(methods, [ i]).value .line,   "var "  + (await func_RemoveSuffix( QB.arrayValue(methods, [ i]).value .name))  + " = null;");
            }
            await sub_AddVariable(  fvar,   localVars);
         }
         currentMethod = (await func_RemoveSuffix( QB.arrayValue(methods, [ i]).value .name));
         var methodGoto = 0;  /* INTEGER */ 
         methodGoto = Math.round( (await func_LinesUseGoto( QB.arrayValue(methods, [ i]).value .line +  1,    lastLine -  1)) );
         if ( methodGoto) {
            await sub_BeginGotoScope(  False);
         }
         debugScope = QB.arrayValue(methods, [ i]).value .jsname;
         await sub_ConvertLines( QB.arrayValue(methods, [ i]).value .line +  1,    lastLine -  1,   QB.arrayValue(methods, [ i]).value .name);
         if ( methodGoto) {
            await sub_EndGotoScope();
         }
         if ( debugMode &&  qbNames) {
            debugScopes =  debugScopes + ", "  + (await func_JSStringLiteral( QB.arrayValue(methods, [ i]).value .jsname))  + ": { name: "  + (await func_JSStringLiteral( QB.arrayValue(methods, [ i]).value .type + " "  + QB.arrayValue(methods, [ i]).value .name))  + ", vars: "  + (await func_DebugVarList( localVars))  + " }";
         }
         if (QB.arrayValue(methods, [ i]).value .type ==  "FUNCTION" ) {
            await sub_AddJSLine(  lastLine,   "return "  + (await func_RemoveSuffix( QB.arrayValue(methods, [ i]).value .name))  + ";");
         }
         await sub_AddJSLine(  lastLine,   "}");
      }
   } 
   if ((QB.func_UBound(  exportLines))  > 0) {
      await sub_AddJSLine(  0,   "return {");
      var ___v1191127 = 0; ___l6260813: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  exportLines))) : ( i >= (QB.func_UBound(  exportLines)));  i+=1) { if (QB.halted()) { return; } ___v1191127++;   if (___v1191127 % 100 == 0) { await QB.autoLimit(); }
         await sub_AddJSLine(  i,   QB.arrayValue(exportLines, [ i]).value);
      } 
      await sub_AddJSLine(  0,   "};");
      QB.resizeArray(exportLines, [{l:0,u: 0}], '', false);  /* STRING */ 
   }
}
async function sub_RegisterImports(sourceText/*STRING*/,parentModule/*OBJECT*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   var sourceLines = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var rawJS = 0;  /* SINGLE */ 
   var lcount = 0;  /* INTEGER */ 
   var i = 0;  /* INTEGER */ 
   lcount = Math.round( (await func_Split(  sourceText,    LF,   sourceLines)) );
   var ___v1869816 = 0; ___l4055824: for ( i=  1; (1 > 0) ? ( i <=  lcount) : ( i >=  lcount);  i+=1) { if (QB.halted()) { return; } ___v1869816++;   if (___v1869816 % 100 == 0) { await QB.autoLimit(); }
      var fline = '';  /* STRING */ 
      fline = QB.arrayValue(sourceLines, [ i]).value;
      if ((await String.func_StartsWith( (QB.func_LTrim( (QB.func_UCase(  fline)))) ,   "IMPORT ")) ) {
         var parts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
         var pcount = 0;  /* INTEGER */ 
         pcount = Math.round( (await func_SLSplit(  fline,   parts ,    False)) );
         if ( pcount ==   4) {
            var sourceUrl = '';  /* STRING */ 
            var importRes = {ok:0,status:0,statusText:'',text:''};  /* FETCHRESPONSE */ 
            sourceUrl = (await func_NormalizeImportPath( (QB.func_Mid( QB.arrayValue(parts, [ 4]).value ,    2,   (QB.func_Len( QB.arrayValue(parts, [ 4]).value))  -  2)) ,    parentModule));
            var m = {name:'',path:'',source:'',exportMethods:{},exportConsts:{},imports:{},processed:0};  /* MODULE */ 
            m.path =  sourceUrl;
            m.name = (await String.func_Replace( (QB.func_LCase(  sourceUrl)) ,   "://" ,   "_"));
            m.name = (await String.func_Replace(  m.name,   "/" ,   "_"));
            m.name = (await String.func_Replace(  m.name,   "\\" ,   "_"));
            m.name = (await String.func_Replace(  m.name,   "." ,   "_"));
            m.name = (await String.func_Replace(  m.name,   "-" ,   "_"));
            var mm = {name:'',path:'',source:'',exportMethods:{},exportConsts:{},imports:{},processed:0};  /* MODULE */ 
            mm = QB.arrayValue(moduleMap, [ m.path]).value;
            if ( mm.name ==  "" ) {
               var mmethods = QB.initArray([{l:0,u: 0}], {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0});  /* METHOD */ 
               var mconsts = QB.initArray([{l:0,u: 0}], {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0});  /* VARIABLE */ 
               m.exportMethods =  mmethods;
               m.exportConsts =  mconsts;
               QB.arrayValue(moduleMap, [ m.path]).value =  m;
               var importRes = {ok:0,status:0,statusText:'',text:''};  /* FETCHRESPONSE */ 
               await QB.sub_Fetch(  sourceUrl,    importRes);
               if ( importRes.status !=   200) {
                  await sub_AddError(  i,   "File not found: "  +  sourceUrl);
                  continue;
               }
               m.source =  importRes.text;
               await sub_RegisterImports(  m.source,    m);
            }
            if ( parentModule !=   undefined) {
               await OBJ.sub_SetProperty(  parentModule.imports,    m.path,    m.path);
            }
         }
      } else if ((QB.func_InStr( (QB.func_UCase(  fline)) ,   "$INCLUDE")) ) {
         var cparts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
         var ccount = 0;  /* INTEGER */ 
         ccount = Math.round( (await func_Split(  fline,   ":" ,    cparts)) );
         if ((QB.func_UBound(  cparts))  ==   2) {
            var includePath = '';  /* STRING */ var includeFilename = '';  /* STRING */ 
            includePath = (await func_NormalizeImportPath( (await String.func_Replace( (await String.func_Trim( QB.arrayValue(cparts, [ 2]).value)) ,   "'" ,   ""))));
            includeFilename = (QB.func_LCase( (await FS.func_GetFilename(  includePath))));
            if ( includeFilename ==  "gx.bi"  |  includeFilename ==  "gx.bm" ) {
               continue;
            }
            var importRes = {ok:0,status:0,statusText:'',text:''};  /* FETCHRESPONSE */ 
            await QB.sub_Fetch(  includePath,    importRes);
            if ( importRes.status !=   200) {
               continue;
            }
            await sub_RegisterImports(  importRes.text,    parentModule);
         }
      }
   } 
}
async function func_NormalizeImportPath(sourceUrl/*SINGLE*/,parentModule/*SINGLE*/) {
if (QB.halted()) { return; }; 
var NormalizeImportPath = null;
/* implicit variables: */ 
   if ((QB.func_Left(  sourceUrl,    1))  ==  "." ) {
      var ppath = '';  /* STRING */ 
      if ( parentModule !=   undefined) {
         ppath = (await FS.func_GetParentPath(  parentModule.path));
         if ((QB.func_Mid(  parentModule.path,    1,    1))  !=  "/" ) {
            ppath = (QB.func_Mid(  ppath,    2));
         }
      }
      if ( ppath !=  "" ) {
         ppath =  ppath + "/";
      }
      sourceUrl = (await FS.func_NormalizePath(  ppath +  sourceUrl));
   }
   NormalizeImportPath =  sourceUrl;
return NormalizeImportPath;
}
async function sub_ReadLinesFromText(sourceText/*STRING*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   var sourceLines = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var rawJS = 0;  /* SINGLE */ 
   var lcount = 0;  /* INTEGER */ 
   var i = 0;  /* INTEGER */ 
   lcount = Math.round( (await func_Split(  sourceText,    LF,   sourceLines)) );
   await sub_FindReferencedLabels( sourceLines);
   var ___v9874983 = 0; ___l1078597: for ( i=  1; (1 > 0) ? ( i <=  lcount) : ( i >=  lcount);  i+=1) { if (QB.halted()) { return; } ___v9874983++;   if (___v9874983 % 100 == 0) { await QB.autoLimit(); }
      var fline = '';  /* STRING */ 
      fline = QB.arrayValue(sourceLines, [ i]).value;
      if ((await String.func_Trim(  fline))  !=  "" ) {
         var lineIndex = 0;  /* INTEGER */ 
         lineIndex = Math.round(  i );
         if ((await String.func_StartsWith( (QB.func_LTrim( (QB.func_UCase(  fline)))) ,   "IMPORT ")) ) {
            var parts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
            var pcount = 0;  /* INTEGER */ 
            pcount = Math.round( (await func_SLSplit(  fline,   parts ,    False)) );
            if ( pcount ==   4) {
               var moduleName = '';  /* STRING */ 
               var sourceUrl = '';  /* STRING */ 
               var importRes = {ok:0,status:0,statusText:'',text:''};  /* FETCHRESPONSE */ 
               sourceUrl = (await func_NormalizeImportPath( (QB.func_Mid( QB.arrayValue(parts, [ 4]).value ,    2,   (QB.func_Len( QB.arrayValue(parts, [ 4]).value))  -  2)) ,    activeModule));
               moduleName = QB.arrayValue(parts, [ 2]).value;
               modLevel = Math.round(  modLevel +  1 );
               var m = {name:'',path:'',source:'',exportMethods:{},exportConsts:{},imports:{},processed:0};  /* MODULE */ 
               m = QB.arrayValue(moduleMap, [ sourceUrl]).value;
               var il = 0;  /* INTEGER */ 
               il = Math.round( (QB.func_UBound(  importLines))  +  1 );
               QB.resizeArray(importLines, [{l:0,u: il}], '', true);  /* STRING */ 
               QB.arrayValue(importLines, [ il]).value = "var "  +  moduleName + " = await __qblib_"  +  m.name + "();";
               var mcount = 0;  /* INTEGER */ 
               mcount = Math.round( (QB.func_UBound(  modules))  +  1 );
               QB.resizeArray(modules, [{l:0,u: mcount}], {name:'',path:'',source:'',exportMethods:{},exportConsts:{},imports:{},processed:0}, true);  /* MODULE */ 
               QB.arrayValue(modules, [ mcount]).value .name =  moduleName;
               QB.arrayValue(modules, [ mcount]).value .path =  sourceUrl;
               var j = 0;  /* INTEGER */ 
               var moduleMethods = QB.initArray([{l:0,u: 0}], {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0});  /* METHOD */ 
               moduleMethods =  m.exportMethods;
               var ___v3994242 = 0; ___l1092636: for ( j=  1; (1 > 0) ? ( j <= (QB.func_UBound(  moduleMethods))) : ( j >= (QB.func_UBound(  moduleMethods)));  j+=1) { if (QB.halted()) { return; } ___v3994242++;   if (___v3994242 % 100 == 0) { await QB.autoLimit(); }
                  await sub_AddExportMethod( QB.arrayValue(moduleMethods, [ j]).value ,    moduleName + ".");
               } 
               var moduleConsts = QB.initArray([{l:0,u: 0}], {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0});  /* METHOD */ 
               moduleConsts =  m.exportConsts;
               var ___v4722359 = 0; ___l7500728: for ( j=  1; (1 > 0) ? ( j <= (QB.func_UBound(  moduleConsts))) : ( j >= (QB.func_UBound(  moduleConsts)));  j+=1) { if (QB.halted()) { return; } ___v4722359++;   if (___v4722359 % 100 == 0) { await QB.autoLimit(); }
                  await sub_AddExportConst( QB.arrayValue(moduleConsts, [ j]).value ,    moduleName + ".");
               } 
               continue;
            } else {
               await sub_AddError(  i,   "Syntax Error:  Import [Alias] From "  + (QB.func_Chr(  34))  + "[filename]"  + (QB.func_Chr(  34)));
               continue;
            }
         }
         fline = (await String.func_Replace(  fline,    CR,   ""));
         var ___v9168481 = 0; ___l6709198: while ((await String.func_EndsWith(  fline,   " _"))) { if (QB.halted()) { return; }___v9168481++;   if (___v9168481 % 100 == 0) { await QB.autoLimit(); }
            i = Math.round(  i +  1 );
            var nextLine = '';  /* STRING */ 
            nextLine = (await String.func_Replace( QB.arrayValue(sourceLines, [ i]).value ,    CR,   ""));
            fline = (QB.func_Left(  fline,   (QB.func_Len(  fline))  -  1))  +  nextLine;
         }
         rawJS = (await func_ReadLine(  i,    fline,    rawJS));
      }
   } 
}
async function func_ReadLine(lineIndex/*INTEGER*/,fline/*STRING*/,rawJS/*INTEGER*/) {
if (QB.halted()) { return; }; lineIndex = Math.round(lineIndex); rawJS = Math.round(rawJS); 
var ReadLine = null;
/* implicit variables: */ 
   if ((await String.func_Trim( (QB.func_UCase(  fline))))  ==  "$INCLUDEONCE" ) {
      if ( activeModule !=   undefined) {
         QB.arrayValue(includeOnceMap, [ activeModule.path]).value =  1;
      }
      return ReadLine;
   }
   var quoteDepth = 0;  /* INTEGER */ 
   quoteDepth = Math.round(  0 );
   var includeExit = 0;  /* INTEGER */ 
   var i = 0;  /* INTEGER */ 
   var isData = 0;  /* INTEGER */ 
   isData = Math.round(  False );
   if ( qbNames && ~ rawJS) {
      isData = Math.round( (await func_IsDataLine(  fline)) );
   }
   var ___v5221171 = 0; ___l8406234: for ( i=  1; (1 > 0) ? ( i <= (QB.func_Len(  fline))) : ( i >= (QB.func_Len(  fline)));  i+=1) { if (QB.halted()) { return; } ___v5221171++;   if (___v5221171 % 100 == 0) { await QB.autoLimit(); }
      var c = '';  /* STRING */ var c4 = '';  /* STRING */ var comment = '';  /* STRING */ 
      c = (QB.func_Mid(  fline,    i,    1));
      c4 = (QB.func_UCase( (QB.func_Mid(  fline,    i,    4))));
      if ( c ==  (QB.func_Chr(  34)) ) {
         if ( quoteDepth ==   0) {
            quoteDepth = Math.round(  1 );
         } else {
            quoteDepth = Math.round(  0 );
         }
      }
      if ( quoteDepth ==   0 & ~ isData & ( c ==  "'"  |  c4 ==  "REM ") ) {
         if ( c ==  "'" ) {
            comment = (QB.func_Mid(  fline,    i +  1));
         } else {
            comment = (QB.func_Mid(  fline,    i +  4));
         }
         var cidx = 0;  /* INTEGER */ 
         cidx = Math.round( (QB.func_InStr( (QB.func_UCase(  comment)) ,   "$INCLUDE")) );
         if ( cidx) {
            var cparts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
            var ccount = 0;  /* INTEGER */ 
            ccount = Math.round( (await func_Split(  comment,   ":" ,    cparts)) );
            if ((QB.func_UBound(  cparts))  ==   2) {
               if ((QB.func_UCase( (await String.func_Trim( QB.arrayValue(cparts, [ 1]).value))))  ==  "$INCLUDE" ) {
                  var includePath = '';  /* STRING */ var includeFilename = '';  /* STRING */ 
                  includePath = (await func_NormalizeImportPath( (await String.func_Replace( (await String.func_Trim( QB.arrayValue(cparts, [ 2]).value)) ,   "'" ,   ""))));
                  includeFilename = (QB.func_LCase( (await FS.func_GetFilename(  includePath))));
                  if (QB.arrayValue(includeOnceMap, [ includePath]).value ) {
                     return ReadLine;
                  }
                  if ( includeFilename ==  "gx.bi"  ||  includeFilename ==  "gx.bm" ) {
                     await sub_AddWarning(  lineIndex,   "Skipping GX $Include '"  +  includePath + "', using built-in version.");
                     return ReadLine;
                  }
                  var importRes = {ok:0,status:0,statusText:'',text:''};  /* FETCHRESPONSE */ 
                  await QB.sub_Fetch(  includePath,    importRes);
                  if ( importRes.status !=   200) {
                     await sub_AddError(  lineIndex,   "File not found: "  +  includePath);
                     return ReadLine;
                  }
                  var savedModule = {};  /* OBJECT */ 
                  var incModule = {name:'',path:'',source:'',exportMethods:{},exportConsts:{},imports:{},processed:0};  /* MODULE */ 
                  savedModule =  activeModule;
                  if ( activeModule !=   undefined) {
                     await OBJ.sub_Assign(  incModule,    activeModule);
                  }
                  incModule.path =  includePath;
                  activeModule =  incModule;
                  await sub_ReadLinesFromText(  importRes.text);
                  activeModule =  savedModule;
               }
            }
         }
         fline = (QB.func_Left(  fline,    i -  1));
         break ___l8406234;
      }
   } 
   ReadLine =  rawJS;
   if ((await String.func_Trim(  fline))  ==  "" ) {
      return ReadLine;
   }
   var word = '';  /* STRING */ 
   var words = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var wcount = 0;  /* INTEGER */ 
   wcount = Math.round( (await func_SLSplit(  fline,   words ,    False)) );
   if ((QB.func_Left( (QB.func_UCase( QB.arrayValue(words, [ 1]).value)) ,    4))  ==  "$END" ) {
      if ( rawJS) {
         rawJS = Math.round( ~ rawJS );
      }
      await sub_AddLine(  lineIndex,    fline);
      ReadLine =  rawJS;
      return ReadLine;
   }
   if ( rawJS) {
      await sub_AddLine(  lineIndex,    fline);
      return ReadLine;
   }
   if ((QB.func_UCase( QB.arrayValue(words, [ 1]).value))  ==  "$IF"  &  wcount > 1) {
      if ((QB.func_UCase( QB.arrayValue(words, [ 2]).value))  ==  "JAVASCRIPT" ) {
         rawJS = Math.round(  True );
         await sub_AddLine(  lineIndex,    fline);
         ReadLine =  rawJS;
         return ReadLine;
      }
   }
   var index = 0;  /* INTEGER */ 
   if ((await func_IsLineNumber( QB.arrayValue(words, [ 1]).value)) ) {
      index = Math.round( (QB.func_UBound(  dataLabels))  +  1 );
      QB.resizeArray(dataLabels, [{l:0,u: index}], {text:'',index:0}, true);  /* LABEL */ 
      QB.arrayValue(dataLabels, [ index]).value .text = QB.arrayValue(words, [ 1]).value;
      QB.arrayValue(dataLabels, [ index]).value .index = Math.round( (QB.func_UBound(  dataArray)) );
      index = Math.round( (QB.func_UBound(  codeLabels))  +  1 );
      QB.resizeArray(codeLabels, [{l:0,u: index}], {text:'',index:0}, true);  /* LABEL */ 
      QB.arrayValue(codeLabels, [ index]).value .text = QB.arrayValue(words, [ 1]).value;
      QB.arrayValue(codeLabels, [ index]).value .index = Math.round( (QB.func_UBound(  lines))  +  1 );
      if ( wcount ==   1) {
         return ReadLine;
      }
      fline = (QB.func_Mid( (QB.func_LTrim(  fline)) ,   (QB.func_Len( QB.arrayValue(words, [ 1]).value))  +  1));
      wcount = Math.round( (await func_SLSplit(  fline,   words ,    False)) );
   }
   if ( wcount > 1 && (await String.func_EndsWith( QB.arrayValue(words, [ 1]).value ,   ":"))  && (await func_IsReferencedLabel( (QB.func_UCase( (QB.func_Left( QB.arrayValue(words, [ 1]).value ,   (QB.func_Len( QB.arrayValue(words, [ 1]).value))  -  1)))))) ) {
      rawJS = Math.round( (await func_ReadLine(  lineIndex,   QB.arrayValue(words, [ 1]).value ,    rawJS)) );
      fline = (QB.func_Mid( (QB.func_LTrim(  fline)) ,   (QB.func_Len( QB.arrayValue(words, [ 1]).value))  +  1));
      wcount = Math.round( (await func_SLSplit(  fline,   words ,    False)) );
   }
   if ( wcount ==   1) {
      if ((await String.func_EndsWith( QB.arrayValue(words, [ 1]).value ,   ":")) ) {
         index = Math.round( (QB.func_UBound(  dataLabels))  +  1 );
         QB.resizeArray(dataLabels, [{l:0,u: index}], {text:'',index:0}, true);  /* LABEL */ 
         QB.arrayValue(dataLabels, [ index]).value .text = (QB.func_Left( (QB.func_UCase( QB.arrayValue(words, [ 1]).value)) ,   (QB.func_Len( QB.arrayValue(words, [ 1]).value))  -  1));
         QB.arrayValue(dataLabels, [ index]).value .index = Math.round( (QB.func_UBound(  dataArray)) );
         index = Math.round( (QB.func_UBound(  codeLabels))  +  1 );
         QB.resizeArray(codeLabels, [{l:0,u: index}], {text:'',index:0}, true);  /* LABEL */ 
         QB.arrayValue(codeLabels, [ index]).value .text = QB.arrayValue(dataLabels, [(QB.func_UBound(  dataLabels))]).value .text;
         QB.arrayValue(codeLabels, [ index]).value .index = Math.round( (QB.func_UBound(  lines))  +  1 );
         return ReadLine;
      }
   }
   if ((QB.func_UCase( QB.arrayValue(words, [ 1]).value))  ==  "DATA" ) {
      var dstr = '';  /* STRING */ 
      var dcount = 0;  /* INTEGER */ 
      var de = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
      if ( qbNames) {
         dstr = (QB.func_Mid( (QB.func_LTrim(  fline)) ,    5));
         dcount = Math.round( (await func_SplitDataItems(  dstr,   de)) );
      } else {
         dstr = (await func_Join( words ,    2,    - 1,   " "));
         dcount = Math.round( (await func_ListSplit(  dstr,   de)) );
      }
      var ___v9033767 = 0; ___l8066766: for ( i=  1; (1 > 0) ? ( i <=  dcount) : ( i >=  dcount);  i+=1) { if (QB.halted()) { return; } ___v9033767++;   if (___v9033767 % 100 == 0) { await QB.autoLimit(); }
         index = Math.round( (QB.func_UBound(  dataArray))  +  1 );
         QB.resizeArray(dataArray, [{l:0,u: index}], '', true);  /* STRING */ 
         QB.arrayValue(dataArray, [ index]).value = QB.arrayValue(de, [ i]).value;
      } 
      return ReadLine;
   }
   if ( qbNames) {
      await sub_AddStatements(  lineIndex,    fline);
      if ( quoteDepth !=   0) {
         await sub_AddError( (QB.func_UBound(  lines)) ,   "Unterminated string constant");
      }
      return ReadLine;
   }
   var ifIdx = 0;  /* INTEGER */ var thenIdx = 0;  /* INTEGER */ var elseIdx = 0;  /* INTEGER */ var gotoIdx = 0;  /* INTEGER */ 
   var ___v2392538 = 0; ___l9496410: for ( i=  1; (1 > 0) ? ( i <=  wcount) : ( i >=  wcount);  i+=1) { if (QB.halted()) { return; } ___v2392538++;   if (___v2392538 % 100 == 0) { await QB.autoLimit(); }
      word = (QB.func_UCase( QB.arrayValue(words, [ i]).value));
      if ( word ==  "IF" ) {
         ifIdx = Math.round(  i );
      } else if ( word ==  "THEN" ) {
         thenIdx = Math.round(  i );
      } else if ( word ==  "ELSE" ) {
         elseIdx = Math.round(  i );
      } else if ( word ==  "GOTO"  &&  gotoIdx ==   0) {
         gotoIdx = Math.round(  i );
      }
   } 
   if ( ifIdx ==   1 &&  thenIdx ==   0 &&  gotoIdx > 2) {
      await sub_AddLine(  lineIndex,   (await func_Join( words ,    1,    gotoIdx -  1,   " "))  + " Then");
      await sub_AddSubLines(  lineIndex,   (await func_Join( words ,    gotoIdx,    - 1,   " ")));
      await sub_AddLine(  lineIndex,   "End If");
      return ReadLine;
   }
   if ( ifIdx > 1) {
      if ((QB.func_UCase( QB.arrayValue(words, [ ifIdx -  1]).value))  !=  "END" ) {
         await sub_AddSubLines(  lineIndex,   (await func_Join( words ,    1,    ifIdx -  1,   " ")));
      }
   }
   if ( thenIdx > 0 &  thenIdx < wcount) {
      await sub_AddLine(  lineIndex,   (await func_Join( words ,    ifIdx,    thenIdx,   " ")));
      if ( elseIdx > 0) {
         await sub_AddSubLines(  lineIndex,   (await func_Join( words ,    thenIdx +  1,    elseIdx -  1,   " ")));
         await sub_AddLine(  lineIndex,   "Else");
         await sub_AddSubLines(  lineIndex,   (await func_Join( words ,    elseIdx +  1,    - 1,   " ")));
      } else {
         await sub_AddSubLines(  lineIndex,   (await func_Join( words ,    thenIdx +  1,    - 1,   " ")));
      }
      await sub_AddLine(  lineIndex,   "End If");
   } else {
      await sub_AddSubLines(  lineIndex,    fline);
   }
   if ( quoteDepth !=   0) {
      await sub_AddError( (QB.func_UBound(  lines)) ,   "Unterminated string constant");
   }
return ReadLine;
}
async function sub_AddStatements(lineIndex/*INTEGER*/,text/*STRING*/) {
if (QB.halted()) { return; }; lineIndex = Math.round(lineIndex); 
/* implicit variables: */ 
   var rest = '';  /* STRING */ var stmt = '';  /* STRING */ var body = '';  /* STRING */ 
   var thenPos = 0;  /* INTEGER */ var gotoPos = 0;  /* INTEGER */ var elsePos = 0;  /* INTEGER */ var colonPos = 0;  /* INTEGER */ 
   rest =  text;
   var ___v9030164 = 0; ___l7726983: while ((await String.func_Trim(  rest))  !=  "") { if (QB.halted()) { return; }___v9030164++;   if (___v9030164 % 100 == 0) { await QB.autoLimit(); }
      rest = (QB.func_LTrim(  rest));
      if ((await func_StatementWordAt(  rest,    1,   "IF")) ) {
         thenPos = Math.round( (await func_FindStatementWord(  rest,   "THEN" ,    3)) );
         gotoPos = Math.round(  0 );
         if ( thenPos ==   0) {
            gotoPos = Math.round( (await func_FindStatementWord(  rest,   "GOTO" ,    3)) );
         }
         if ( thenPos > 0) {
            body = (QB.func_Mid(  rest,    thenPos +  4));
            if ((await String.func_Trim(  body))  ==  "" ) {
               await sub_AddLine(  lineIndex,   (await String.func_Trim(  rest)));
               return;
            }
            await sub_AddLine(  lineIndex,   (await String.func_Trim( (QB.func_Left(  rest,    thenPos -  1))))  + " Then");
         } else if ( gotoPos > 0) {
            body = (QB.func_Mid(  rest,    gotoPos));
            await sub_AddLine(  lineIndex,   (await String.func_Trim( (QB.func_Left(  rest,    gotoPos -  1))))  + " Then");
         } else {
            await sub_AddLine(  lineIndex,   (await String.func_Trim(  rest)));
            return;
         }
         elsePos = Math.round( (await func_FindOwnElse(  body)) );
         if ( elsePos > 0) {
            await sub_AddStatements(  lineIndex,   (QB.func_Left(  body,    elsePos -  1)));
            await sub_AddLine(  lineIndex,   "Else");
            await sub_AddStatements(  lineIndex,   (QB.func_Mid(  body,    elsePos +  4)));
         } else {
            await sub_AddStatements(  lineIndex,    body);
         }
         await sub_AddLine(  lineIndex,   "End If");
         return;
      }
      colonPos = Math.round( (await func_FindStatementColon(  rest)) );
      if ( colonPos ==   0) {
         stmt =  rest;
         rest = "";
      } else {
         stmt = (QB.func_Left(  rest,    colonPos -  1));
         rest = (QB.func_Mid(  rest,    colonPos +  1));
      }
      if ((await String.func_Trim(  stmt))  !=  "" ) {
         await sub_AddLine(  lineIndex,   (await String.func_Trim(  stmt)));
      }
   }
}
async function func_IsWordChar(ch/*STRING*/) {
if (QB.halted()) { return; }; 
var IsWordChar = null;
/* implicit variables: */ 
   var a = 0;  /* INTEGER */ 
   IsWordChar =  False;
   if ( ch ==  "" ) {
      return IsWordChar;
   }
   a = Math.round( (QB.func_Asc( (QB.func_UCase(  ch)))) );
   if (( a >=  65 &  a <=  90)  | ( a >=  48 &  a <=  57)  |  ch ==  "_"  |  ch ==  "."  |  ch ==  "$"  |  ch ==  "%"  |  ch ==  "&"  |  ch ==  "!"  |  ch ==  "#"  |  ch ==  "~"  |  ch ==  "`" ) {
      IsWordChar =  True;
   }
return IsWordChar;
}
async function func_StatementWordAt(text/*STRING*/,wpos/*INTEGER*/,word/*STRING*/) {
if (QB.halted()) { return; }; wpos = Math.round(wpos); 
var StatementWordAt = null;
/* implicit variables: */ 
   StatementWordAt =  False;
   if ((QB.func_UCase( (QB.func_Mid(  text,    wpos,   (QB.func_Len(  word))))))  !=   word) {
      return StatementWordAt;
   }
   if ( wpos > 1) {
      if ((await func_IsWordChar( (QB.func_Mid(  text,    wpos -  1,    1)))) ) {
         return StatementWordAt;
      }
   }
   if ((await func_IsWordChar( (QB.func_Mid(  text,    wpos + (QB.func_Len(  word)) ,    1)))) ) {
      return StatementWordAt;
   }
   StatementWordAt =  True;
return StatementWordAt;
}
async function func_FindStatementWord(text/*STRING*/,word/*STRING*/,startPos/*INTEGER*/) {
if (QB.halted()) { return; }; startPos = Math.round(startPos); 
var FindStatementWord = null;
/* implicit variables: */ 
   var k = 0;  /* INTEGER */ var inQuote = 0;  /* INTEGER */ 
   inQuote = Math.round(  False );
   FindStatementWord =  0;
   var ___v1447029 = 0; ___l5076066: for ( k=  1; (1 > 0) ? ( k <= (QB.func_Len(  text))) : ( k >= (QB.func_Len(  text)));  k+=1) { if (QB.halted()) { return; } ___v1447029++;   if (___v1447029 % 100 == 0) { await QB.autoLimit(); }
      if ((QB.func_Mid(  text,    k,    1))  ==  (QB.func_Chr(  34)) ) {
         if ( inQuote) {
            inQuote = Math.round(  False );
         } else {
            inQuote = Math.round(  True );
         }
      } else if (~ inQuote &&  k >=  startPos) {
         if ((await func_StatementWordAt(  text,    k,    word)) ) {
            FindStatementWord =  k;
            return FindStatementWord;
         }
      }
   } 
return FindStatementWord;
}
async function func_FindOwnElse(body/*STRING*/) {
if (QB.halted()) { return; }; 
var FindOwnElse = null;
/* implicit variables: */ 
   var k = 0;  /* INTEGER */ var inQuote = 0;  /* INTEGER */ var depth = 0;  /* INTEGER */ 
   inQuote = Math.round(  False );
   depth = Math.round(  0 );
   FindOwnElse =  0;
   var ___v2302815 = 0; ___l5683138: for ( k=  1; (1 > 0) ? ( k <= (QB.func_Len(  body))) : ( k >= (QB.func_Len(  body)));  k+=1) { if (QB.halted()) { return; } ___v2302815++;   if (___v2302815 % 100 == 0) { await QB.autoLimit(); }
      if ((QB.func_Mid(  body,    k,    1))  ==  (QB.func_Chr(  34)) ) {
         if ( inQuote) {
            inQuote = Math.round(  False );
         } else {
            inQuote = Math.round(  True );
         }
      } else if (~ inQuote) {
         if ((await func_StatementWordAt(  body,    k,   "IF")) ) {
            depth = Math.round(  depth +  1 );
         } else if ((await func_StatementWordAt(  body,    k,   "ELSE")) ) {
            if ( depth ==   0) {
               FindOwnElse =  k;
               return FindOwnElse;
            }
            depth = Math.round(  depth -  1 );
         }
      }
   } 
return FindOwnElse;
}
async function func_FindStatementColon(text/*STRING*/) {
if (QB.halted()) { return; }; 
var FindStatementColon = null;
/* implicit variables: */ 
   var k = 0;  /* INTEGER */ var inQuote = 0;  /* INTEGER */ 
   inQuote = Math.round(  False );
   FindStatementColon =  0;
   var ___v6940920 = 0; ___l6334775: for ( k=  1; (1 > 0) ? ( k <= (QB.func_Len(  text))) : ( k >= (QB.func_Len(  text)));  k+=1) { if (QB.halted()) { return; } ___v6940920++;   if (___v6940920 % 100 == 0) { await QB.autoLimit(); }
      if ((QB.func_Mid(  text,    k,    1))  ==  (QB.func_Chr(  34)) ) {
         if ( inQuote) {
            inQuote = Math.round(  False );
         } else {
            inQuote = Math.round(  True );
         }
      } else if (~ inQuote && (QB.func_Mid(  text,    k,    1))  ==  ":" ) {
         FindStatementColon =  k;
         return FindStatementColon;
      }
   } 
return FindStatementColon;
}
async function func_IsDataLine(fline/*STRING*/) {
if (QB.halted()) { return; }; 
var IsDataLine = null;
/* implicit variables: */ 
   var t = '';  /* STRING */ 
   var k = 0;  /* INTEGER */ 
   IsDataLine =  False;
   t = (QB.func_UCase( (QB.func_LTrim(  fline))));
   k = Math.round(  1 );
   var ___v6108187 = 0; ___l3891405: while ( k <= (QB.func_Len(  t))  && (QB.func_Mid(  t,    k,    1))  >= "0"  && (QB.func_Mid(  t,    k,    1))  <= "9") { if (QB.halted()) { return; }___v6108187++;   if (___v6108187 % 100 == 0) { await QB.autoLimit(); }
      k = Math.round(  k +  1 );
   }
   if ( k > 1) {
      t = (QB.func_LTrim( (QB.func_Mid(  t,    k))));
   }
   if ((QB.func_Left(  t,    4))  !=  "DATA" ) {
      return IsDataLine;
   }
   if ((QB.func_Len(  t))  ==   4 || (QB.func_Mid(  t,    5,    1))  ==  " "  || (QB.func_Mid(  t,    5,    1))  ==  (QB.func_Chr(  9)) ) {
      IsDataLine =  True;
   }
return IsDataLine;
}
async function func_SplitDataItems(dstr/*STRING*/,items/*STRING*/) {
if (QB.halted()) { return; }; 
var SplitDataItems = null;
/* implicit variables: */ 
   var k = 0;  /* INTEGER */ var n = 0;  /* INTEGER */ var inQuote = 0;  /* INTEGER */ var quoted = 0;  /* INTEGER */ var atEnd = 0;  /* INTEGER */ 
   var ch = '';  /* STRING */ var cur = '';  /* STRING */ var qtext = '';  /* STRING */ 
   n = Math.round(  0 );
   cur = "";
   qtext = "";
   inQuote = Math.round(  False );
   quoted = Math.round(  False );
   atEnd = Math.round(  False );
   QB.resizeArray(items, [{l:0,u: 0}], '', false);  /* STRING */ 
   var ___v432439 = 0; ___l2128130: for ( k=  1; (1 > 0) ? ( k <= (QB.func_Len(  dstr))  +  1) : ( k >= (QB.func_Len(  dstr))  +  1);  k+=1) { if (QB.halted()) { return; } ___v432439++;   if (___v432439 % 100 == 0) { await QB.autoLimit(); }
      if ( k >(QB.func_Len(  dstr)) ) {
         ch = ",";
         atEnd = Math.round(  True );
      } else {
         ch = (QB.func_Mid(  dstr,    k,    1));
      }
      if ( inQuote && ~ atEnd) {
         if ( ch ==  (QB.func_Chr(  34)) ) {
            inQuote = Math.round(  False );
         } else {
            qtext =  qtext +  ch;
         }
      } else if ( ch ==  (QB.func_Chr(  34)) ) {
         inQuote = Math.round(  True );
         quoted = Math.round(  True );
         qtext = "";
      } else if ( ch ==  ","  |  ch ==  ":" ) {
         n = Math.round(  n +  1 );
         QB.resizeArray(items, [{l:0,u: n}], '', true);  /* STRING */ 
         if ( quoted) {
            QB.arrayValue(items, [ n]).value = (await func_JSStringLiteral(  qtext));
         } else {
            QB.arrayValue(items, [ n]).value = (await func_JSStringLiteral( (await String.func_Trim(  cur))));
         }
         cur = "";
         qtext = "";
         quoted = Math.round(  False );
         if ( ch ==  ":" ) {
            break ___l2128130;
         }
      } else if (~ quoted) {
         cur =  cur +  ch;
      }
   } 
   SplitDataItems =  n;
return SplitDataItems;
}
async function func_JSStringLiteral(text/*STRING*/) {
if (QB.halted()) { return; }; 
var JSStringLiteral = null;
/* implicit variables: */ 
   JSStringLiteral = (QB.func_Chr(  34))  + (await String.func_Replace( (await String.func_Replace(  text,   "\\" ,   "\\\\")) ,   (QB.func_Chr(  34)) ,   "\\"  + (QB.func_Chr(  34))))  + (QB.func_Chr(  34));
return JSStringLiteral;
}
async function sub_AddSubLines(lineIndex/*INTEGER*/,fline/*STRING*/) {
if (QB.halted()) { return; }; lineIndex = Math.round(lineIndex); 
/* implicit variables: */ 
   var quoteDepth = 0;  /* INTEGER */ 
   quoteDepth = Math.round(  0 );
   var i = 0;  /* INTEGER */ 
   var ___v720330 = 0; ___l3302104: for ( i=  1; (1 > 0) ? ( i <= (QB.func_Len(  fline))) : ( i >= (QB.func_Len(  fline)));  i+=1) { if (QB.halted()) { return; } ___v720330++;   if (___v720330 % 100 == 0) { await QB.autoLimit(); }
      var c = '';  /* STRING */ 
      c = (QB.func_Mid(  fline,    i,    1));
      if ( c ==  (QB.func_Chr(  34)) ) {
         if ( quoteDepth ==   0) {
            quoteDepth = Math.round(  1 );
         } else {
            quoteDepth = Math.round(  0 );
         }
      }
      if ( quoteDepth ==   0 &  c ==  ":" ) {
         await sub_AddLine(  lineIndex,   (QB.func_Left(  fline,    i -  1)));
         fline = (QB.func_Right(  fline,   (QB.func_Len(  fline))  -  i));
         i = Math.round(  0 );
      }
   } 
   await sub_AddLine(  lineIndex,    fline);
}
async function sub_FindMethods() {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   var i = 0;  /* INTEGER */ 
   var pcount = 0;  /* INTEGER */ 
   var rawJS = 0;  /* INTEGER */ 
   var parts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   var ___v638015 = 0; ___l2258986: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  lines))) : ( i >= (QB.func_UBound(  lines)));  i+=1) { if (QB.halted()) { return; } ___v638015++;   if (___v638015 % 100 == 0) { await QB.autoLimit(); }
      pcount = Math.round( (await func_Split( QB.arrayValue(lines, [ i]).value .text,   " " ,   parts)) );
      var word = '';  /* STRING */ 
      word = (QB.func_UCase( QB.arrayValue(parts, [ 1]).value));
      if ( word ==  "$IF"  &  pcount > 1) {
         if ((QB.func_UCase( QB.arrayValue(parts, [ 2]).value))  ==  "JAVASCRIPT" ) {
            rawJS = Math.round(  True );
         }
      }
      if ((QB.func_Left(  word,    4))  ==  "$END"  &  rawJS) {
         rawJS = Math.round(  False );
      }
      if ( rawJS) {
         continue;
      }
      if ( word ==  "FUNCTION"  |  word ==  "SUB" ) {
         var mstr = '';  /* STRING */ 
         var argstr = '';  /* STRING */ 
         var pstart = 0;  /* INTEGER */ 
         var mname = '';  /* STRING */ 
         var pend = 0;  /* SINGLE */ 
         var mrtype = '';  /* STRING */ 
         var mrest = '';  /* STRING */ 
         mrtype = "";
         mstr = (await func_Join( parts ,    2,    - 1,   " "));
         pstart = Math.round( (QB.func_InStr(  mstr,   "(")) );
         if ( pstart ==   0) {
            argstr = "";
            mname =  mstr;
            if ( pcount >=  4) {
               if ((QB.func_UCase( QB.arrayValue(parts, [ 3]).value))  ==  "AS" ) {
                  mname = QB.arrayValue(parts, [ 2]).value;
                  mrtype = (await func_Join( parts ,    4,    - 1,   " "));
               }
            }
         } else {
            mname = (await String.func_Trim( (QB.func_Left(  mstr,    pstart -  1))));
            mstr = (QB.func_Mid(  mstr,    pstart +  1));
            pend = (QB.func__InStrRev(  mstr,   ")"));
            argstr = (QB.func_Left(  mstr,    pend -  1));
            mrest = (await String.func_Trim( (QB.func_Mid(  mstr,    pend +  1))));
            if ((QB.func_UCase( (QB.func_Left(  mrest,    3))))  ==  "AS " ) {
               mrtype = (await String.func_Trim( (QB.func_Mid(  mrest,    4))));
            }
         }
         if ( mrtype !=  "" ) {
            mrtype = (QB.func_UCase(  mrtype));
            if ((QB.func_Left(  mrtype,    9))  ==  "UNSIGNED "  | (QB.func_Left(  mrtype,    10))  ==  "_UNSIGNED " ) {
               mrtype = (await func_NormalizeType( "_UNSIGNED "  + (await String.func_Trim( (QB.func_Mid(  mrtype,   (QB.func_InStr(  mrtype,   " "))  +  1))))));
            } else {
               mrtype = (await func_NormalizeType(  mrtype));
            }
         }
         var arga = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
         var m = {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0};  /* METHOD */ 
         m.line = Math.round(  i );
         m.lastLine = Math.round(  - 1 );
         m.type =  word;
         m.name =  mname;
         m.argc = Math.round( (await func_ListSplit(  argstr,   arga)) );
         m.args = "";
         var args = QB.initArray([{l:0,u: 0}], {name:'',type:''});  /* ARGUMENT */ 
         if ((QB.func_UBound(  arga))  > 0) {
            var a = 0;  /* INTEGER */ 
            var args = '';  /* STRING */ 
            args = "";
            var ___v837120 = 0; ___l3390941: for ( a=  1; (1 > 0) ? ( a <=  m.argc) : ( a >=  m.argc);  a+=1) { if (QB.halted()) { return; } ___v837120++;   if (___v837120 % 100 == 0) { await QB.autoLimit(); }
               var aparts = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
               var apcount = 0;  /* INTEGER */ 
               var argname = '';  /* STRING */ 
               var isArray = '';  /* STRING */ 
               isArray = "false";
               apcount = Math.round( (await func_Split( QB.arrayValue(arga, [ a]).value ,   " " ,   aparts)) );
               argname = QB.arrayValue(aparts, [ 1]).value;
               if ((await String.func_EndsWith(  argname,   "()")) ) {
                  isArray = "true";
                  argname = (QB.func_Left(  argname,   (QB.func_Len(  argname))  -  2));
               }
               if ( apcount > 2) {
                  var typeName = '';  /* STRING */ 
                  typeName = (QB.func_UCase( QB.arrayValue(aparts, [ 3]).value));
                  if ( apcount > 3) {
                     if ( typeName ==  "UNSIGNED"  |  typeName ==  "_UNSIGNED" ) {
                        typeName = (await func_NormalizeType( "_UNSIGNED "  + (QB.func_UCase( QB.arrayValue(aparts, [ 4]).value))));
                     }
                  }
                  args =  args +  argname + ":"  +  typeName + ":"  +  isArray;
               } else {
                  if ( qbNames) {
                     args =  args +  argname + ":"  + (await func_DataTypeFromName(  argname))  + ":"  +  isArray;
                  } else {
                     args =  args +  argname + ":"  + (await func_DataTypeFromName( QB.arrayValue(aparts, [ 1]).value))  + ":"  +  isArray;
                  }
               }
               if ( a !=   m.argc) {
                  args =  args + ",";
               }
            } 
            m.args =  args;
         }
         await sub_AddMethod(  m,   "" ,    True);
         if ( word ==  "FUNCTION"  &&  mrtype !=  "" ) {
            QB.arrayValue(methods, [(QB.func_UBound(  methods))]).value .returnType =  mrtype;
         }
      } else if ( word ==  "END"  && (QB.func_UBound(  parts))  > 1) {
         word = (QB.func_UCase( QB.arrayValue(parts, [ 2]).value));
         if ( word ==  "FUNCTION"  |  word ==  "SUB" ) {
            if ((QB.func_UBound(  methods))  > 0) {
               QB.arrayValue(methods, [(QB.func_UBound(  methods))]).value .lastLine = Math.round(  i );
            }
         }
      }
   } 
}
async function func_Split(sourceString/*STRING*/,delimiter/*STRING*/,results/*STRING*/) {
if (QB.halted()) { return; }; 
var Split = null;
/* implicit variables: */ 
   var cstr = '';  /* STRING */ 
   var p = 0;  /* LONG */ var curpos = 0;  /* LONG */ var arrpos = 0;  /* LONG */ var dpos = 0;  /* LONG */ 
   cstr =  sourceString;
   if ( delimiter ==  " " ) {
      cstr = (QB.func_RTrim( (QB.func_LTrim(  cstr))));
      p = Math.round( (QB.func_InStr(  cstr,   "  ")) );
      var ___v6088533 = 0; ___l3258715: while ( p > 0) { if (QB.halted()) { return; }___v6088533++;   if (___v6088533 % 100 == 0) { await QB.autoLimit(); }
         cstr = (QB.func_Mid(  cstr,    1,    p -  1))  + (QB.func_Mid(  cstr,    p +  1));
         p = Math.round( (QB.func_InStr(  cstr,   "  ")) );
      }
   }
   curpos = Math.round(  1 );
   arrpos = Math.round(  0 );
   dpos = Math.round( (QB.func_InStr(  curpos,    cstr,    delimiter)) );
   var ___v9486510 = 0; ___l4190266: while (!( dpos ==   0)) { if (QB.halted()) { return; }___v9486510++;   if (___v9486510 % 100 == 0) { await QB.autoLimit(); }
      arrpos = Math.round(  arrpos +  1 );
      QB.resizeArray(results, [{l:0,u: arrpos}], '', true);  /* STRING */ 
      QB.arrayValue(results, [ arrpos]).value = (QB.func_Mid(  cstr,    curpos,    dpos -  curpos));
      curpos = Math.round(  dpos + (QB.func_Len(  delimiter)) );
      dpos = Math.round( (QB.func_InStr(  curpos,    cstr,    delimiter)) );
   }
   arrpos = Math.round(  arrpos +  1 );
   QB.resizeArray(results, [{l:0,u: arrpos}], '', true);  /* STRING */ 
   QB.arrayValue(results, [ arrpos]).value = (QB.func_Mid(  cstr,    curpos));
   Split =  arrpos;
return Split;
}
async function func_SLSplit(sourceString/*STRING*/,results/*STRING*/,escapeStrings/*INTEGER*/) {
if (QB.halted()) { return; }; escapeStrings = Math.round(escapeStrings); 
var SLSplit = null;
/* implicit variables: */ 
   var cstr = '';  /* STRING */ 
   var p = 0;  /* LONG */ var curpos = 0;  /* LONG */ var arrpos = 0;  /* LONG */ var dpos = 0;  /* LONG */ 
   cstr = (await String.func_Trim(  sourceString));
   QB.resizeArray(results, [{l:0,u: 0}], '', false);  /* STRING */ 
   var lastChar = '';  /* STRING */ 
   var quoteMode = 0;  /* INTEGER */ 
   var result = '';  /* STRING */ 
   var count = 0;  /* INTEGER */ 
   var i = 0;  /* INTEGER */ 
   var ___v285580 = 0; ___l6668456: for ( i=  1; (1 > 0) ? ( i <= (QB.func_Len(  cstr))) : ( i >= (QB.func_Len(  cstr)));  i+=1) { if (QB.halted()) { return; } ___v285580++;   if (___v285580 % 100 == 0) { await QB.autoLimit(); }
      var c = '';  /* STRING */ var c2 = '';  /* STRING */ 
      c = (QB.func_Mid(  cstr,    i,    1));
      c2 = (QB.func_Mid(  cstr,    i,    2));
      var oplen = 0;  /* INTEGER */ 
      oplen = Math.round( (await func_FindOperator(  c,    c2)) );
      if ( c ==  (QB.func_Chr(  34)) ) {
         quoteMode = Math.round( ~ quoteMode );
         result =  result +  c;
         if (~ quoteMode &  escapeStrings) {
            result = (await String.func_Replace(  result,   "\\" ,   "\\\\"));
         }
      } else if ( c ==  " " ) {
         if ( quoteMode) {
            result =  result +  c;
         } else if ( lastChar ==  " " ) {
         } else {
            count = Math.round( (QB.func_UBound(  results))  +  1 );
            QB.resizeArray(results, [{l:0,u: count}], '', true);  /* STRING */ 
            QB.arrayValue(results, [ count]).value =  result;
            result = "";
         }
      } else if ( oplen) {
         if ( quoteMode) {
            if ( oplen ==   2) {
               result =  result +  c2;
               i = Math.round(  i +  1 );
            } else {
               result =  result +  c;
            }
         } else {
            if ( result !=  "" ) {
               count = Math.round( (QB.func_UBound(  results))  +  1 );
               QB.resizeArray(results, [{l:0,u: count}], '', true);  /* STRING */ 
               QB.arrayValue(results, [ count]).value =  result;
            }
            count = Math.round( (QB.func_UBound(  results))  +  1 );
            QB.resizeArray(results, [{l:0,u: count}], '', true);  /* STRING */ 
            if ( oplen ==   2) {
               QB.arrayValue(results, [ count]).value =  c2;
               i = Math.round(  i +  1 );
            } else {
               QB.arrayValue(results, [ count]).value =  c;
            }
            result = "";
         }
      } else {
         result =  result +  c;
      }
      lastChar =  c;
   } 
   if ( result !=  "" ) {
      count = Math.round( (QB.func_UBound(  results))  +  1 );
      QB.resizeArray(results, [{l:0,u: count}], '', true);  /* STRING */ 
      QB.arrayValue(results, [ count]).value =  result;
   }
   SLSplit = (QB.func_UBound(  results));
return SLSplit;
}
async function func_FindOperator(c/*STRING*/,c2/*STRING*/) {
if (QB.halted()) { return; }; 
var FindOperator = null;
/* implicit variables: */ 
   if ( c2 ==  ">=" ) {
      FindOperator =  2;
   } else if ( c2 ==  "<=" ) {
      FindOperator =  2;
   } else if ( c2 ==  "<>" ) {
      FindOperator =  2;
   } else if ( c ==  "=" ) {
      FindOperator =  1;
   } else if ( c ==  "+" ) {
      FindOperator =  1;
   } else if ( c ==  "-" ) {
      FindOperator =  1;
   } else if ( c ==  "/" ) {
      FindOperator =  1;
   } else if ( c ==  "\\" ) {
      FindOperator =  1;
   } else if ( c ==  "*" ) {
      FindOperator =  1;
   } else if ( c ==  "^" ) {
      FindOperator =  1;
   } else if ( c ==  "," ) {
      FindOperator =  1;
   } else {
      FindOperator =  0;
   }
return FindOperator;
}
async function sub_CheckParen(sourceString/*STRING*/,lineNumber/*LONG*/) {
if (QB.halted()) { return; }; lineNumber = Math.round(lineNumber); 
/* implicit variables: */ 
   var i = 0;  /* INTEGER */ 
   var quoteMode = 0;  /* INTEGER */ 
   var paren = 0;  /* INTEGER */ 
   var ___v4432782 = 0; ___l820317: for ( i=  1; (1 > 0) ? ( i <= (QB.func_Len(  sourceString))) : ( i >= (QB.func_Len(  sourceString)));  i+=1) { if (QB.halted()) { return; } ___v4432782++;   if (___v4432782 % 100 == 0) { await QB.autoLimit(); }
      var c = '';  /* STRING */ 
      c = (QB.func_Mid(  sourceString,    i,    1));
      if ( c ==  (QB.func_Chr(  34)) ) {
         quoteMode = Math.round( ~ quoteMode );
      } else if ( quoteMode) {
      } else if ( c ==  "(" ) {
         paren = Math.round(  paren +  1 );
      } else if ( c ==  ")" ) {
         paren = Math.round(  paren -  1 );
      }
   } 
   if ( paren < 0) {
      await sub_AddError(  lineNumber,   "Missing (");
   } else if ( paren > 0) {
      await sub_AddError(  lineNumber,   "Missing )");
   }
}
async function func_SLSplit2(sourceString/*STRING*/,results/*STRING*/) {
if (QB.halted()) { return; }; 
var SLSplit2 = null;
/* implicit variables: */ 
   var cstr = '';  /* STRING */ 
   var p = 0;  /* LONG */ var curpos = 0;  /* LONG */ var arrpos = 0;  /* LONG */ var dpos = 0;  /* LONG */ 
   cstr = (await String.func_Trim(  sourceString));
   QB.resizeArray(results, [{l:0,u: 0}], '', false);  /* STRING */ 
   var lastChar = '';  /* STRING */ 
   var quoteMode = 0;  /* INTEGER */ 
   var result = '';  /* STRING */ 
   var paren = 0;  /* INTEGER */ 
   var count = 0;  /* INTEGER */ 
   var i = 0;  /* INTEGER */ 
   var ___v9357696 = 0; ___l9820362: for ( i=  1; (1 > 0) ? ( i <= (QB.func_Len(  cstr))) : ( i >= (QB.func_Len(  cstr)));  i+=1) { if (QB.halted()) { return; } ___v9357696++;   if (___v9357696 % 100 == 0) { await QB.autoLimit(); }
      var c = '';  /* STRING */ 
      c = (QB.func_Mid(  cstr,    i,    1));
      if ( c ==  (QB.func_Chr(  34)) ) {
         quoteMode = Math.round( ~ quoteMode );
         result =  result +  c;
      } else if ( quoteMode) {
         result =  result +  c;
      } else if ( c ==  "(" ) {
         paren = Math.round(  paren +  1 );
         result =  result +  c;
      } else if ( c ==  ")" ) {
         paren = Math.round(  paren -  1 );
         result =  result +  c;
      } else if ( paren > 0) {
         result =  result +  c;
      } else if ( c ==  " " ) {
         if ( lastChar ==  " " ) {
         } else {
            count = Math.round( (QB.func_UBound(  results))  +  1 );
            QB.resizeArray(results, [{l:0,u: count}], '', true);  /* STRING */ 
            QB.arrayValue(results, [ count]).value =  result;
            result = "";
         }
      } else {
         result =  result +  c;
      }
      lastChar =  c;
   } 
   if ( result !=  "" ) {
      count = Math.round( (QB.func_UBound(  results))  +  1 );
      QB.resizeArray(results, [{l:0,u: count}], '', true);  /* STRING */ 
      QB.arrayValue(results, [ count]).value =  result;
   }
   SLSplit2 = (QB.func_UBound(  results));
return SLSplit2;
}
async function func_ListSplit(sourceString/*STRING*/,results/*STRING*/) {
if (QB.halted()) { return; }; 
var ListSplit = null;
/* implicit variables: */ 
   var cstr = '';  /* STRING */ 
   var p = 0;  /* LONG */ var curpos = 0;  /* LONG */ var arrpos = 0;  /* LONG */ var dpos = 0;  /* LONG */ 
   cstr = (await String.func_Trim(  sourceString));
   QB.resizeArray(results, [{l:0,u: 0}], '', false);  /* STRING */ 
   var quoteMode = 0;  /* INTEGER */ 
   var result = '';  /* STRING */ 
   var count = 0;  /* INTEGER */ 
   var paren = 0;  /* INTEGER */ 
   var i = 0;  /* INTEGER */ 
   var ___v7082797 = 0; ___l520474: for ( i=  1; (1 > 0) ? ( i <= (QB.func_Len(  cstr))) : ( i >= (QB.func_Len(  cstr)));  i+=1) { if (QB.halted()) { return; } ___v7082797++;   if (___v7082797 % 100 == 0) { await QB.autoLimit(); }
      var c = '';  /* STRING */ 
      c = (QB.func_Mid(  cstr,    i,    1));
      if ( c ==  (QB.func_Chr(  34)) ) {
         quoteMode = Math.round( ~ quoteMode );
         result =  result +  c;
      } else if ( quoteMode) {
         result =  result +  c;
      } else if ( c ==  "(" ) {
         paren = Math.round(  paren +  1 );
         result =  result +  c;
      } else if ( c ==  ")" ) {
         paren = Math.round(  paren -  1 );
         result =  result +  c;
      } else if ( paren > 0) {
         result =  result +  c;
      } else if ( c ==  "," ) {
         count = Math.round( (QB.func_UBound(  results))  +  1 );
         QB.resizeArray(results, [{l:0,u: count}], '', true);  /* STRING */ 
         QB.arrayValue(results, [ count]).value =  result;
         result = "";
      } else {
         result =  result +  c;
      }
   } 
   if ( result !=  "" ) {
      count = Math.round( (QB.func_UBound(  results))  +  1 );
      QB.resizeArray(results, [{l:0,u: count}], '', true);  /* STRING */ 
      QB.arrayValue(results, [ count]).value =  result;
   }
   ListSplit = (QB.func_UBound(  results));
return ListSplit;
}
async function func_PrintSplit(sourceString/*STRING*/,results/*STRING*/) {
if (QB.halted()) { return; }; 
var PrintSplit = null;
/* implicit variables: */ 
   var cstr = '';  /* STRING */ 
   var p = 0;  /* LONG */ var curpos = 0;  /* LONG */ var arrpos = 0;  /* LONG */ var dpos = 0;  /* LONG */ 
   cstr = (await String.func_Trim(  sourceString));
   QB.resizeArray(results, [{l:0,u: 0}], '', false);  /* STRING */ 
   var quoteMode = 0;  /* INTEGER */ 
   var result = '';  /* STRING */ 
   var count = 0;  /* INTEGER */ 
   var paren = 0;  /* INTEGER */ 
   var i = 0;  /* INTEGER */ 
   var ___v2216623 = 0; ___l9118851: for ( i=  1; (1 > 0) ? ( i <= (QB.func_Len(  cstr))) : ( i >= (QB.func_Len(  cstr)));  i+=1) { if (QB.halted()) { return; } ___v2216623++;   if (___v2216623 % 100 == 0) { await QB.autoLimit(); }
      var c = '';  /* STRING */ 
      c = (QB.func_Mid(  cstr,    i,    1));
      if ( c ==  (QB.func_Chr(  34)) ) {
         quoteMode = Math.round( ~ quoteMode );
         result =  result +  c;
      } else if ( quoteMode) {
         result =  result +  c;
      } else if ( c ==  "(" ) {
         paren = Math.round(  paren +  1 );
         result =  result +  c;
      } else if ( c ==  ")" ) {
         paren = Math.round(  paren -  1 );
         result =  result +  c;
      } else if ( paren > 0) {
         result =  result +  c;
      } else if ( c ==  ","  |  c ==  ";" ) {
         if ( result !=  "" ) {
            count = Math.round( (QB.func_UBound(  results))  +  1 );
            QB.resizeArray(results, [{l:0,u: count}], '', true);  /* STRING */ 
            QB.arrayValue(results, [ count]).value =  result;
            result = "";
         }
         count = Math.round( (QB.func_UBound(  results))  +  1 );
         QB.resizeArray(results, [{l:0,u: count}], '', true);  /* STRING */ 
         QB.arrayValue(results, [ count]).value =  c;
      } else {
         result =  result +  c;
         if ((QB.func_UCase( (QB.func__Trim(  result))))  ==  "USING" ) {
            count = Math.round( (QB.func_UBound(  results))  +  1 );
            QB.resizeArray(results, [{l:0,u: count}], '', true);  /* STRING */ 
            QB.arrayValue(results, [ count]).value = "USING";
            result = "";
         }
      }
   } 
   if ( result !=  "" ) {
      count = Math.round( (QB.func_UBound(  results))  +  1 );
      QB.resizeArray(results, [{l:0,u: count}], '', true);  /* STRING */ 
      QB.arrayValue(results, [ count]).value =  result;
   }
   PrintSplit = (QB.func_UBound(  results));
return PrintSplit;
}
async function sub_PrintMethods() {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   await QB.sub_Print([""]);
   await QB.sub_Print(["Methods"]);
   await QB.sub_Print(["------------------------------------------------------------"]);
   var i = 0;  /* INTEGER */ 
   var ___v3892244 = 0; ___l2180509: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  methods))) : ( i >= (QB.func_UBound(  methods)));  i+=1) { if (QB.halted()) { return; } ___v3892244++;   if (___v3892244 % 100 == 0) { await QB.autoLimit(); }
      var m = {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0};  /* METHOD */ 
      m = QB.arrayValue(methods, [ i]).value;
      await QB.sub_Print([(QB.func_Str(  m.line))  + ": "  +  m.type + " - "  +  m.name + " ["  +  m.jsname + "] - "  +  m.returnType + " - "  +  m.args]);
   } 
}
async function sub_PrintTypes() {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   await QB.sub_Print([""]);
   await QB.sub_Print(["Types"]);
   await QB.sub_Print(["------------------------------------------------------------"]);
   var i = 0;  /* INTEGER */ 
   var ___v3213558 = 0; ___l5821858: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  types))) : ( i >= (QB.func_UBound(  types)));  i+=1) { if (QB.halted()) { return; } ___v3213558++;   if (___v3213558 % 100 == 0) { await QB.autoLimit(); }
      var t = {line:0,name:'',argc:0,args:''};  /* QBTYPE */ 
      t = QB.arrayValue(types, [ i]).value;
      await QB.sub_Print([(QB.func_Str(  t.line))  + ": "  +  t.name]);
      var v = 0;  /* INTEGER */ 
      var ___v271889 = 0; ___l8371832: for ( v=  1; (1 > 0) ? ( v <= (QB.func_UBound(  typeVars))) : ( v >= (QB.func_UBound(  typeVars)));  v+=1) { if (QB.halted()) { return; } ___v271889++;   if (___v271889 % 100 == 0) { await QB.autoLimit(); }
         if (QB.arrayValue(typeVars, [ i]).value .typeId ==   i) {
            await QB.sub_Print(["  -> "  + QB.arrayValue(typeVars, [ v]).value .name + ": "  + QB.arrayValue(typeVars, [ v]).value .type]);
         }
      } 
   } 
}
async function sub_CopyMethod(fromMethod/*METHOD*/,toMethod/*METHOD*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   toMethod.type =  fromMethod.type;
   toMethod.name =  fromMethod.name;
   toMethod.returnType =  fromMethod.returnType;
   toMethod.name =  fromMethod.name;
   toMethod.uname =  fromMethod.uname;
   toMethod.argc = Math.round(  fromMethod.argc );
   toMethod.args =  fromMethod.args;
   toMethod.jsname =  fromMethod.jsname;
   toMethod.sync = Math.round(  fromMethod.sync );
}
async function sub_AddMethod(m/*METHOD*/,prefix/*STRING*/,sync/*INTEGER*/) {
if (QB.halted()) { return; }; sync = Math.round(sync); 
/* implicit variables: */ 
   var mcount = 0;  /* SINGLE */ 
   mcount = (QB.func_UBound(  methods))  +  1;
   QB.resizeArray(methods, [{l:0,u: mcount}], {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0}, true);  /* METHOD */ 
   if ( m.type ==  "FUNCTION" ) {
      m.returnType = (await func_DataTypeFromName(  m.name));
   }
   m.uname = (QB.func_UCase( (await func_RemoveSuffix(  m.name))));
   m.jsname = (await func_MethodJS(  m,    prefix));
   m.sync = Math.round(  sync );
   QB.arrayValue(methods, [ mcount]).value =  m;
}
async function sub_AddLocalMethod(m/*METHOD*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   var mcount = 0;  /* SINGLE */ 
   mcount = (QB.func_UBound(  localMethods))  +  1;
   QB.resizeArray(localMethods, [{l:0,u: mcount}], {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0}, true);  /* METHOD */ 
   m.uname = (QB.func_UCase( (await func_RemoveSuffix(  m.name))));
   m.jsname =  m.name;
   m.sync = Math.round(  True );
   QB.arrayValue(localMethods, [ mcount]).value =  m;
}
async function sub_AddExportMethod(om/*METHOD*/,prefix/*STRING*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   var m = {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0};  /* METHOD */ 
   await OBJ.sub_Assign(  m,    om);
   var mcount = 0;  /* SINGLE */ 
   mcount = (QB.func_UBound(  exportMethods))  +  1;
   QB.resizeArray(exportMethods, [{l:0,u: mcount}], {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0}, true);  /* METHOD */ 
   if ( m.type ==  "FUNCTION" ) {
      m.returnType = (await func_DataTypeFromName(  m.name));
   }
   m.uname = (QB.func_UCase( (await func_RemoveSuffix(  m.name))));
   m.jsname = (await func_MethodJS(  m,    prefix));
   m.uname = (QB.func_UCase(  prefix))  +  m.uname;
   m.name =  prefix +  m.name;
   m.sync = Math.round(  True );
   QB.arrayValue(exportMethods, [ mcount]).value =  m;
}
async function sub_AddLibMethod(m/*METHOD*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   if ( activeModule ==   undefined) {
      return;
   }
   var libMethods = QB.initArray([{l:0,u: 0}], {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0});  /* METHOD */ 
   libMethods =  activeModule.exportMethods;
   var mcount = 0;  /* SINGLE */ 
   mcount = (QB.func_UBound(  libMethods))  +  1;
   QB.resizeArray(libMethods, [{l:0,u: mcount}], {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0}, true);  /* METHOD */ 
   if ( m.type ==  "FUNCTION" ) {
      m.returnType = (await func_DataTypeFromName(  m.name));
   }
   m.uname = (QB.func_UCase( (await func_RemoveSuffix(  m.name))));
   m.sync = Math.round(  True );
   QB.arrayValue(libMethods, [ mcount]).value =  m;
}
async function sub_AddExportConst(ov/*VARIABLE*/,prefix/*STRING*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   var v = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
   await OBJ.sub_Assign(  v,    ov);
   v.uname = (QB.func_UCase(  prefix))  +  v.uname;
   v.name =  prefix +  v.name;
   await sub_AddVariable(  v,   exportConsts);
}
async function sub_AddLibConst(vname/*STRING*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   if ( activeModule ==   undefined) {
      return;
   }
   var v = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
   v.type = "CONST";
   v.name =  vname;
   v.isConst = Math.round(  True );
   await sub_AddVariable(  v,    activeModule.exportConsts);
}
async function sub_AddGXMethod(mtype/*STRING*/,mname/*STRING*/,sync/*INTEGER*/) {
if (QB.halted()) { return; }; sync = Math.round(sync); 
/* implicit variables: */ 
   var mcount = 0;  /* SINGLE */ 
   mcount = (QB.func_UBound(  methods))  +  1;
   QB.resizeArray(methods, [{l:0,u: mcount}], {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0}, true);  /* METHOD */ 
   var m = {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0};  /* METHOD */ 
   m.type =  mtype;
   m.name =  mname;
   m.uname = (QB.func_UCase(  m.name));
   m.sync = Math.round(  sync );
   m.builtin = Math.round(  True );
   m.jsname = (await func_GXMethodJS( (await func_RemoveSuffix(  mname))));
   if ( mtype ==  "FUNCTION" ) {
      m.returnType = (await func_DataTypeFromName(  mname));
   }
   QB.arrayValue(methods, [ mcount]).value =  m;
}
async function sub_AddQBMethod(mtype/*STRING*/,mname/*STRING*/,sync/*INTEGER*/) {
if (QB.halted()) { return; }; sync = Math.round(sync); 
/* implicit variables: */ 
   var m = {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0};  /* METHOD */ 
   m.type =  mtype;
   m.name =  mname;
   m.builtin = Math.round(  True );
   await sub_AddMethod(  m,   "QB." ,    sync);
   if ((QB.func_InStr(  mname,   "_"))  ==   1) {
      var m2 = {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0};  /* METHOD */ 
      await sub_CopyMethod( QB.arrayValue(methods, [(QB.func_UBound(  methods))]).value ,    m2);
      m2.name = (QB.func_Mid(  mname,    2));
      m2.uname = (QB.func_UCase( (await func_RemoveSuffix(  m2.name))));
      m2.builtin = Math.round(  True );
      var mcount = 0;  /* SINGLE */ 
      mcount = (QB.func_UBound(  methods))  +  1;
      QB.resizeArray(methods, [{l:0,u: mcount}], {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0}, true);  /* METHOD */ 
      QB.arrayValue(methods, [ mcount]).value =  m2;
   }
}
async function sub_AddNativeMethod(mtype/*STRING*/,mname/*STRING*/,jsname/*STRING*/,sync/*INTEGER*/) {
if (QB.halted()) { return; }; sync = Math.round(sync); 
/* implicit variables: */ 
   var m = {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0};  /* METHOD */ 
   m.type =  mtype;
   m.name =  mname;
   m.uname = (QB.func_UCase(  m.name));
   m.jsname =  jsname;
   m.sync = Math.round(  sync );
   m.builtin = Math.round(  True );
   var mcount = 0;  /* SINGLE */ 
   mcount = (QB.func_UBound(  methods))  +  1;
   QB.resizeArray(methods, [{l:0,u: mcount}], {line:0,lastLine:0,type:'',returnType:'',name:'',uname:'',argc:0,args:'',jsname:'',sync:0,builtin:0,dynamic:0}, true);  /* METHOD */ 
   QB.arrayValue(methods, [ mcount]).value =  m;
}
async function sub_AddLine(lineIndex/*INTEGER*/,fline/*STRING*/) {
if (QB.halted()) { return; }; lineIndex = Math.round(lineIndex); 
/* implicit variables: */ 
   await sub___AddLine(  lineIndex,    fline);
}
async function sub___AddLine(lineIndex/*INTEGER*/,fline/*STRING*/) {
if (QB.halted()) { return; }; lineIndex = Math.round(lineIndex); 
/* implicit variables: */ 
   var lcount = 0;  /* INTEGER */ 
   lcount = Math.round( (QB.func_UBound(  lines))  +  1 );
   QB.resizeArray(lines, [{l:0,u: lcount}], {line:0,text:'',mtype:0,moduleId:0,module:0}, true);  /* CODELINE */ 
   QB.arrayValue(lines, [ lcount]).value .line = Math.round(  lineIndex );
   QB.arrayValue(lines, [ lcount]).value .text =  fline;
   QB.arrayValue(lines, [ lcount]).value .module =  activeModule;
}
async function sub_AddJSLine(sourceLine/*INTEGER*/,jsline/*STRING*/) {
if (QB.halted()) { return; }; sourceLine = Math.round(sourceLine); 
/* implicit variables: */ 
   var lcount = 0;  /* INTEGER */ 
   lcount = Math.round( (QB.func_UBound(  jsLines))  +  1 );
   QB.resizeArray(jsLines, [{l:0,u: lcount}], {line:0,text:'',mtype:0,moduleId:0,module:0}, true);  /* CODELINE */ 
   QB.arrayValue(jsLines, [ lcount]).value .line = Math.round(  sourceLine );
   QB.arrayValue(jsLines, [ lcount]).value .text =  jsline;
}
async function sub_AddWarning(sourceLine/*INTEGER*/,msgText/*STRING*/) {
if (QB.halted()) { return; }; sourceLine = Math.round(sourceLine); 
/* implicit variables: */ 
   if ( errCopyMode) {
      return;
   }
   var lcount = 0;  /* INTEGER */ 
   lcount = Math.round( (QB.func_UBound(  warnings))  +  1 );
   QB.resizeArray(warnings, [{l:0,u: lcount}], {line:0,text:'',mtype:0,moduleId:0,module:0}, true);  /* CODELINE */ 
   var l = 0;  /* INTEGER */ 
   if (( sourceLine > 0) ) {
      l = Math.round( QB.arrayValue(lines, [ sourceLine]).value .line );
   }
   QB.arrayValue(warnings, [ lcount]).value .line = Math.round(  l );
   QB.arrayValue(warnings, [ lcount]).value .text =  msgText;
   QB.arrayValue(warnings, [ lcount]).value .moduleId = Math.round(  currentModuleId );
   QB.arrayValue(warnings, [ lcount]).value .module = QB.arrayValue(lines, [ sourceLine]).value .module;
}
async function sub_AddError(sourceLine/*INTEGER*/,msgText/*STRING*/) {
if (QB.halted()) { return; }; sourceLine = Math.round(sourceLine); 
/* implicit variables: */ 
   if ( errCopyMode) {
      return;
   }
   await sub_AddWarning(  sourceLine,    msgText);
   QB.arrayValue(warnings, [(QB.func_UBound(  warnings))]).value .mtype = Math.round(  MERROR );
}
async function sub_AddConst(vname/*STRING*/,methodName/*STRING*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   var v = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
   v.type = "CONST";
   v.name =  vname;
   v.isConst = Math.round(  True );
   if ( qbNames && (await func_RemoveSuffix(  vname))  !=   vname) {
      v.name = (await func_RemoveSuffix(  vname));
      v.jsname = (await func_ConstJSName(  vname));
      v.suffixed = Math.round(  True );
   }
   if ( methodName ==  "" ) {
      await sub_AddVariable(  v,   globalVars);
   } else {
      await sub_AddVariable(  v,   localVars);
   }
}
async function func_ConstJSName(cname/*STRING*/) {
if (QB.halted()) { return; }; 
var ConstJSName = null;
/* implicit variables: */ 
   ConstJSName =  cname;
   if ( qbNames && (await func_RemoveSuffix(  cname))  !=   cname) {
      ConstJSName = (await func_RemoveSuffix(  cname))  + "$c"  + (await func_TypeTag( (await func_NormalizeType( (await func_DataTypeFromName(  cname))))));
   }
return ConstJSName;
}
async function sub_AddGXConst(vname/*STRING*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   var v = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
   v.type = "CONST";
   v.name =  vname;
   if ( vname ==  "GX_TRUE" ) {
      v.jsname = "GX.TRUE";
   } else if ( vname ==  "GX_FALSE" ) {
      v.jsname = "GX.FALSE";
   } else {
      var jsname = '';  /* STRING */ 
      jsname = (QB.func_Mid(  vname,    3,   (QB.func_Len(  vname))  -  2));
      if ((QB.func_Left(  jsname,    1))  ==  "_" ) {
         jsname = (QB.func_Right(  jsname,   (QB.func_Len(  jsname))  -  1));
      }
      v.jsname = "GX."  +  jsname;
   }
   v.isConst = Math.round(  True );
   await sub_AddVariable(  v,   globalVars);
}
async function sub_AddQBConst(vname/*STRING*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   var v = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
   v.type = "CONST";
   v.name =  vname;
   v.jsname = "QB."  +  vname;
   v.isConst = Math.round(  True );
   await sub_AddVariable(  v,   globalVars);
   if ((QB.func_InStr(  vname,   "_"))  ==   1) {
      var v2 = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
      v2.type =  v.type;
      v2.name = (QB.func_Mid(  v.name,    2));
      v2.jsname =  v.jsname;
      v2.isConst = Math.round(  v.isConst );
      await sub_AddVariable(  v2,   globalVars);
   }
}
async function sub_AddGlobal(vname/*STRING*/,vtype/*STRING*/,arraySize/*INTEGER*/) {
if (QB.halted()) { return; }; arraySize = Math.round(arraySize); 
/* implicit variables: */ 
   var v = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
   v.type =  vtype;
   v.name =  vname;
   v.isArray = Math.round(  arraySize > - 1 );
   v.arraySize = Math.round(  arraySize );
   await sub_AddVariable(  v,   globalVars);
}
async function sub_AddLocal(vname/*STRING*/,vtype/*STRING*/,arraySize/*INTEGER*/) {
if (QB.halted()) { return; }; arraySize = Math.round(arraySize); 
/* implicit variables: */ 
   var v = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
   v.type =  vtype;
   v.name =  vname;
   v.isArray = Math.round(  arraySize > - 1 );
   v.arraySize = Math.round(  arraySize );
   await sub_AddVariable(  v,   localVars);
}
async function sub_AddVariable(bvar/*VARIABLE*/,vlist/*VARIABLE*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   var vcount = 0;  /* SINGLE */ 
   vcount = (QB.func_UBound(  vlist))  +  1;
   QB.resizeArray(vlist, [{l:0,u: vcount}], {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0}, true);  /* VARIABLE */ 
   var nvar = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
   nvar.type = (await func_NormalizeType(  bvar.type));
   nvar.name =  bvar.name;
   nvar.jsname =  bvar.jsname;
   nvar.isConst = Math.round(  bvar.isConst );
   nvar.isArray = Math.round(  bvar.isArray );
   nvar.arraySize = Math.round(  bvar.arraySize );
   nvar.typeId = Math.round(  bvar.typeId );
   nvar.fixedLen =  bvar.fixedLen;
   nvar.suffixed = Math.round(  bvar.suffixed );
   if ( nvar.jsname ==  "" ) {
      nvar.jsname = (await func_RemoveSuffix(  nvar.name));
      bvar.jsname =  nvar.jsname;
   }
   if ((await func_IsJSReservedWord(  nvar.jsname)) ) {
      nvar.jsname =  nvar.jsname + "_"  + await func_GenJSName();
      bvar.jsname =  nvar.jsname;
   }
   QB.arrayValue(vlist, [ vcount]).value =  nvar;
}
async function func_NormalizeType(itype/*STRING*/) {
if (QB.halted()) { return; }; 
var NormalizeType = null;
/* implicit variables: */ 
   var otype = '';  /* STRING */ 
   if ( itype ==  "BIT" ) {
      otype = "_BIT";
   } else if ( itype ==  "_UNSIGNED BIT" ) {
      otype = "_UNSIGNED _BIT";
   } else if ( itype ==  "UNSIGNED _BIT" ) {
      otype = "_UNSIGNED _BIT";
   } else if ( itype ==  "UNSIGNED BIT" ) {
      otype = "_UNSIGNED _BIT";
   } else if ( itype ==  "BYTE" ) {
      otype = "_BYTE";
   } else if ( itype ==  "_UNSIGNED BYTE" ) {
      otype = "_UNSIGNED _BYTE";
   } else if ( itype ==  "UNSIGNED _BYTE" ) {
      otype = "_UNSIGNED _BYTE";
   } else if ( itype ==  "UNSIGNED BYTE" ) {
      otype = "_UNSIGNED _BYTE";
   } else if ( itype ==  "UNSIGNED INTEGER" ) {
      otype = "_UNSIGNED INTEGER";
   } else if ( itype ==  "UNSIGNED LONG" ) {
      otype = "_UNSIGNED LONG";
   } else if ( itype ==  "INTEGER64" ) {
      otype = "_INTEGER64";
   } else if ( itype ==  "_UNSIGNED INTEGER64" ) {
      otype = "_UNSIGNED _INTEGER64";
   } else if ( itype ==  "UNSIGNED _INTEGER64" ) {
      otype = "_UNSIGNED _INTEGER64";
   } else if ( itype ==  "UNSIGNED INTEGER64" ) {
      otype = "_UNSIGNED _INTEGER64";
   } else if ( itype ==  "FLOAT" ) {
      otype = "_FLOAT";
   } else if ( itype ==  "OFFSET" ) {
      otype = "_OFFSET";
   } else if ( itype ==  "_UNSIGNED OFFSET" ) {
      otype = "_UNSIGNED _OFFSET";
   } else if ( itype ==  "UNSIGNED _OFFSET" ) {
      otype = "_UNSIGNED _OFFSET";
   } else if ( itype ==  "UNSIGNED OFFSET" ) {
      otype = "_UNSIGNED _OFFSET";
   } else {
      otype =  itype;
   }
   NormalizeType =  otype;
return NormalizeType;
}
async function sub_AddType(t/*QBTYPE*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   var tcount = 0;  /* SINGLE */ 
   tcount = (QB.func_UBound(  types))  +  1;
   QB.resizeArray(types, [{l:0,u: tcount}], {line:0,name:'',argc:0,args:''}, true);  /* QBTYPE */ 
   QB.arrayValue(types, [ tcount]).value =  t;
}
async function sub_AddSystemType(tname/*STRING*/,args/*STRING*/) {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   var t = {line:0,name:'',argc:0,args:''};  /* QBTYPE */ 
   t.name =  tname;
   await sub_AddType(  t);
   var typeId = 0;  /* INTEGER */ 
   typeId = Math.round( (QB.func_UBound(  types)) );
   var count = 0;  /* INTEGER */ 
   var pairs = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
   count = Math.round( (await func_Split(  args,   "," ,   pairs)) );
   var i = 0;  /* INTEGER */ 
   var ___v7295401 = 0; ___l4322084: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  pairs))) : ( i >= (QB.func_UBound(  pairs)));  i+=1) { if (QB.halted()) { return; } ___v7295401++;   if (___v7295401 % 100 == 0) { await QB.autoLimit(); }
      var nv = QB.initArray([{l:0,u: 0}], '');  /* STRING */ 
      count = Math.round( (await func_Split( QB.arrayValue(pairs, [ i]).value ,   ":" ,   nv)) );
      var tvar = {type:'',name:'',jsname:'',isConst:0,isArray:0,arraySize:0,typeId:0,fixedLen:'',suffixed:0};  /* VARIABLE */ 
      tvar.typeId = Math.round(  typeId );
      tvar.name = QB.arrayValue(nv, [ 1]).value;
      tvar.type = (QB.func_UCase( QB.arrayValue(nv, [ 2]).value));
      await sub_AddVariable(  tvar,   typeVars);
   } 
}
async function func_MainEnd() {
if (QB.halted()) { return; }; 
var MainEnd = null;
/* implicit variables: */ 
   if ( programMethods ==   0) {
      MainEnd = (QB.func_UBound(  lines));
   } else {
      MainEnd = QB.arrayValue(methods, [ 1]).value .line -  1;
   }
return MainEnd;
}
async function func_RemoveSuffix(vname/*STRING*/) {
if (QB.halted()) { return; }; 
var RemoveSuffix = null;
/* implicit variables: */ 
   var i = 0;  /* INTEGER */ 
   var done = 0;  /* INTEGER */ 
   var c = '';  /* STRING */ 
   vname = (await String.func_Trim(  vname));
   i = Math.round( (QB.func_Len(  vname)) );
   var ___v6993827 = 0; ___l9878744: while (~ done) { if (QB.halted()) { return; }___v6993827++;   if (___v6993827 % 100 == 0) { await QB.autoLimit(); }
      c = (QB.func_Mid(  vname,    i,    1));
      if ( c ==  "`"  |  c ==  "%"  |  c ==  "&"  |  c ==  "$"  |  c ==  "~"  |  c ==  "!"  |  c ==  "#" ) {
         i = Math.round(  i -  1 );
      } else {
         done = Math.round(  True );
      }
   }
   RemoveSuffix = (QB.func_Left(  vname,    i));
return RemoveSuffix;
}
async function func_IsJSReservedWord(vname/*STRING*/) {
if (QB.halted()) { return; }; 
var IsJSReservedWord = null;
/* implicit variables: */ 
   var found = 0;  /* INTEGER */ var i = 0;  /* INTEGER */ 
   var ___v7661004 = 0; ___l2928243: for ( i=  1; (1 > 0) ? ( i <= (QB.func_UBound(  jsReservedWords))) : ( i >= (QB.func_UBound(  jsReservedWords)));  i+=1) { if (QB.halted()) { return; } ___v7661004++;   if (___v7661004 % 100 == 0) { await QB.autoLimit(); }
      if (QB.arrayValue(jsReservedWords, [ i]).value  ==   vname) {
         found = Math.round(  True );
         break ___l2928243;
      }
   } 
   IsJSReservedWord =  found;
return IsJSReservedWord;
}
async function func_DataTypeFromName(vname/*STRING*/) {
if (QB.halted()) { return; }; 
var DataTypeFromName = null;
/* implicit variables: */ 
   var dt = '';  /* STRING */ 
   if ((await String.func_EndsWith(  vname,   "$")) ) {
      dt = "STRING";
   } else if ((await String.func_EndsWith(  vname,   "`")) ) {
      dt = "_BIT";
   } else if ((await String.func_EndsWith(  vname,   "%%")) ) {
      dt = "_BYTE";
   } else if ((await String.func_EndsWith(  vname,   "~%")) ) {
      dt = "_UNSIGNED INTEGER";
   } else if ((await String.func_EndsWith(  vname,   "%")) ) {
      dt = "INTEGER";
   } else if ((await String.func_EndsWith(  vname,   "~&&")) ) {
      dt = "_UNSIGNED INTEGER64";
   } else if ((await String.func_EndsWith(  vname,   "&&")) ) {
      dt = "_INTEGER64";
   } else if ((await String.func_EndsWith(  vname,   "~&")) ) {
      dt = "_UNSIGNED LONG";
   } else if ((await String.func_EndsWith(  vname,   "##")) ) {
      dt = "_FLOAT";
   } else if ((await String.func_EndsWith(  vname,   "#")) ) {
      dt = "DOUBLE";
   } else if ((await String.func_EndsWith(  vname,   "~%&")) ) {
      dt = "_UNSIGNED _OFFSET";
   } else if ((await String.func_EndsWith(  vname,   "%&")) ) {
      dt = "_OFFSET";
   } else if ((await String.func_EndsWith(  vname,   "&")) ) {
      dt = "LONG";
   } else if ((await String.func_EndsWith(  vname,   "!")) ) {
      dt = "SINGLE";
   } else {
      dt = "SINGLE";
   }
   DataTypeFromName =  dt;
return DataTypeFromName;
}
async function func_Join(parts/*STRING*/,startIndex/*INTEGER*/,endIndex/*INTEGER*/,delimiter/*STRING*/) {
if (QB.halted()) { return; }; startIndex = Math.round(startIndex); endIndex = Math.round(endIndex); 
var Join = null;
/* implicit variables: */ 
   if ( endIndex ==   -  1) {
      endIndex = Math.round( (QB.func_UBound(  parts)) );
   }
   var s = '';  /* STRING */ 
   var i = 0;  /* INTEGER */ 
   var ___v9097730 = 0; ___l2729689: for ( i=  startIndex; (1 > 0) ? ( i <=  endIndex) : ( i >=  endIndex);  i+=1) { if (QB.halted()) { return; } ___v9097730++;   if (___v9097730 % 100 == 0) { await QB.autoLimit(); }
      s =  s + QB.arrayValue(parts, [ i]).value;
      if ( i !=  (QB.func_UBound(  parts)) ) {
         s =  s +  delimiter;
      }
   } 
   Join =  s;
return Join;
}
async function func_GetMapKeys(map/*SINGLE*/) {
if (QB.halted()) { return; }; 
var GetMapKeys = null;
/* implicit variables: */ 
   var keys = QB.initArray([{l:0,u: 0}], {});  /* OBJECT */ 
   keys = (await OBJ.func_Keys(  map));
   var size = 0;  /* INTEGER */ 
   size = Math.round( (QB.func_UBound(  keys))  -  2 );
   var results = QB.initArray([{l:0,u: size}], '');  /* STRING */ 
   var i = 0;  /* INTEGER */ 
   var ___v5917423 = 0; ___l7146319: for ( i=  3; (1 > 0) ? ( i <= (QB.func_UBound(  keys))) : ( i >= (QB.func_UBound(  keys)));  i+=1) { if (QB.halted()) { return; } ___v5917423++;   if (___v5917423 % 100 == 0) { await QB.autoLimit(); }
      QB.arrayValue(results, [ i - 2]).value = QB.arrayValue(keys, [ i]).value;
   } 
   GetMapKeys =  results;
return GetMapKeys;
}
async function func_MethodJS(m/*METHOD*/,prefix/*STRING*/) {
if (QB.halted()) { return; }; 
var MethodJS = null;
/* implicit variables: */ 
   var jsname = '';  /* STRING */ 
   jsname =  prefix;
   if ( m.dynamic !=   True) {
      if ( m.type ==  "FUNCTION" ) {
         jsname =  jsname + "func_";
      } else {
         jsname =  jsname + "sub_";
      }
   }
   var i = 0;  /* INTEGER */ 
   var c = '';  /* STRING */ 
   var a = 0;  /* INTEGER */ 
   var ___v7297100 = 0; ___l7728500: for ( i=  1; (1 > 0) ? ( i <= (QB.func_Len(  m.name))) : ( i >= (QB.func_Len(  m.name)));  i+=1) { if (QB.halted()) { return; } ___v7297100++;   if (___v7297100 % 100 == 0) { await QB.autoLimit(); }
      c = (QB.func_Mid(  m.name,    i,    1));
      a = Math.round( (QB.func_Asc(  c)) );
      if ( a ==   46) {
         jsname =  jsname + "_";
      } else if (( a >=  65 &  a <=  90)  | ( a >=  97 &  a <=  122)  | ( a >=  48 &  a <=  57)  |  a ==   95) {
         jsname =  jsname +  c;
      }
   } 
   MethodJS =  jsname;
return MethodJS;
}
async function func_GXMethodJS(mname/*STRING*/) {
if (QB.halted()) { return; }; 
var GXMethodJS = null;
/* implicit variables: */ 
   var jsname = '';  /* STRING */ 
   var startIdx = 0;  /* INTEGER */ 
   if ((QB.func_InStr(  mname,   "GXSTR"))  ==   1) {
      jsname = "GXSTR.";
      startIdx = Math.round(  7 );
   } else {
      jsname = "GX.";
      startIdx = Math.round(  3 );
   }
   jsname =  jsname + (QB.func_LCase( (QB.func_Mid(  mname,    startIdx,    1))));
   var i = 0;  /* INTEGER */ 
   var c = '';  /* STRING */ 
   var a = 0;  /* INTEGER */ 
   var ___v4736166 = 0; ___l5460806: for ( i=  startIdx +  1; (1 > 0) ? ( i <= (QB.func_Len(  mname))) : ( i >= (QB.func_Len(  mname)));  i+=1) { if (QB.halted()) { return; } ___v4736166++;   if (___v4736166 % 100 == 0) { await QB.autoLimit(); }
      c = (QB.func_Mid(  mname,    i,    1));
      a = Math.round( (QB.func_Asc(  c)) );
      if (( a >=  65 &  a <=  90)  | ( a >=  97 &  a <=  122)  | ( a >=  48 &  a <=  57)  |  a ==   95 |  a ==   46) {
         jsname =  jsname +  c;
      }
   } 
   GXMethodJS =  jsname;
return GXMethodJS;
}
async function sub_InitJSReservedWords() {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   QB.arrayValue(jsReservedWords, [ 1]).value = "abstract";
   QB.arrayValue(jsReservedWords, [ 2]).value = "arguments";
   QB.arrayValue(jsReservedWords, [ 3]).value = "await";
   QB.arrayValue(jsReservedWords, [ 4]).value = "boolean";
   QB.arrayValue(jsReservedWords, [ 5]).value = "break";
   QB.arrayValue(jsReservedWords, [ 6]).value = "catch";
   QB.arrayValue(jsReservedWords, [ 7]).value = "char";
   QB.arrayValue(jsReservedWords, [ 8]).value = "class";
   QB.arrayValue(jsReservedWords, [ 9]).value = "debugger";
   QB.arrayValue(jsReservedWords, [ 10]).value = "default";
   QB.arrayValue(jsReservedWords, [ 11]).value = "delete";
   QB.arrayValue(jsReservedWords, [ 12]).value = "enum";
   QB.arrayValue(jsReservedWords, [ 13]).value = "eval";
   QB.arrayValue(jsReservedWords, [ 14]).value = "extends";
   QB.arrayValue(jsReservedWords, [ 15]).value = "false";
   QB.arrayValue(jsReservedWords, [ 16]).value = "final";
   QB.arrayValue(jsReservedWords, [ 17]).value = "finally";
   QB.arrayValue(jsReservedWords, [ 18]).value = "implements";
   QB.arrayValue(jsReservedWords, [ 19]).value = "instanceof";
   QB.arrayValue(jsReservedWords, [ 20]).value = "interface";
   QB.arrayValue(jsReservedWords, [ 21]).value = "native";
   QB.arrayValue(jsReservedWords, [ 22]).value = "new";
   QB.arrayValue(jsReservedWords, [ 23]).value = "null";
   QB.arrayValue(jsReservedWords, [ 24]).value = "package";
   QB.arrayValue(jsReservedWords, [ 25]).value = "private";
   QB.arrayValue(jsReservedWords, [ 26]).value = "protected";
   QB.arrayValue(jsReservedWords, [ 27]).value = "public";
   QB.arrayValue(jsReservedWords, [ 28]).value = "super";
   QB.arrayValue(jsReservedWords, [ 29]).value = "switch";
   QB.arrayValue(jsReservedWords, [ 30]).value = "synchronized";
   QB.arrayValue(jsReservedWords, [ 31]).value = "this";
   QB.arrayValue(jsReservedWords, [ 32]).value = "throw";
   QB.arrayValue(jsReservedWords, [ 33]).value = "throws";
   QB.arrayValue(jsReservedWords, [ 34]).value = "transient";
   QB.arrayValue(jsReservedWords, [ 35]).value = "true";
   QB.arrayValue(jsReservedWords, [ 36]).value = "try";
   QB.arrayValue(jsReservedWords, [ 37]).value = "typeof";
   QB.arrayValue(jsReservedWords, [ 38]).value = "var";
   QB.arrayValue(jsReservedWords, [ 39]).value = "void";
   QB.arrayValue(jsReservedWords, [ 40]).value = "volitile";
   QB.arrayValue(jsReservedWords, [ 41]).value = "with";
   QB.arrayValue(jsReservedWords, [ 42]).value = "yield";
   QB.arrayValue(jsReservedWords, [ 43]).value = "window";
   QB.arrayValue(jsReservedWords, [ 44]).value = "document";
   QB.arrayValue(jsReservedWords, [ 45]).value = "location";
   QB.arrayValue(jsReservedWords, [ 46]).value = "global";
   QB.arrayValue(jsReservedWords, [ 47]).value = "history";
   QB.arrayValue(jsReservedWords, [ 48]).value = "setTimeout";
   QB.arrayValue(jsReservedWords, [ 49]).value = "setInterval";
   QB.arrayValue(jsReservedWords, [ 50]).value = "alert";
   QB.arrayValue(jsReservedWords, [ 51]).value = "confirm";
   QB.arrayValue(jsReservedWords, [ 52]).value = "prompt";
   QB.arrayValue(jsReservedWords, [ 53]).value = "require";
   QB.arrayValue(jsReservedWords, [ 54]).value = "process";
   QB.arrayValue(jsReservedWords, [ 55]).value = "in";
}
async function sub_InitGX() {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   await sub_AddSystemType( "GXPOSITION" ,   "x:LONG,y:LONG");
   await sub_AddSystemType( "GXDEVICEINPUT" ,   "deviceId:INTEGER,deviceType:INTEGER,inputType:INTEGER,inputId:INTEGER,inputValue:INTEGER");
   await sub_AddGXConst( "GX_FALSE");
   await sub_AddGXConst( "GX_TRUE");
   await sub_AddGXConst( "GXEVENT_INIT");
   await sub_AddGXConst( "GXEVENT_UPDATE");
   await sub_AddGXConst( "GXEVENT_DRAWBG");
   await sub_AddGXConst( "GXEVENT_DRAWMAP");
   await sub_AddGXConst( "GXEVENT_DRAWSCREEN");
   await sub_AddGXConst( "GXEVENT_MOUSEINPUT");
   await sub_AddGXConst( "GXEVENT_PAINTBEFORE");
   await sub_AddGXConst( "GXEVENT_PAINTAFTER");
   await sub_AddGXConst( "GXEVENT_COLLISION_TILE");
   await sub_AddGXConst( "GXEVENT_COLLISION_ENTITY");
   await sub_AddGXConst( "GXEVENT_PLAYER_ACTION");
   await sub_AddGXConst( "GXEVENT_ANIMATE_COMPLETE");
   await sub_AddGXConst( "GXANIMATE_LOOP");
   await sub_AddGXConst( "GXANIMATE_SINGLE");
   await sub_AddGXConst( "GXBG_STRETCH");
   await sub_AddGXConst( "GXBG_SCROLL");
   await sub_AddGXConst( "GXBG_WRAP");
   await sub_AddGXConst( "GXKEY_ESC");
   await sub_AddGXConst( "GXKEY_1");
   await sub_AddGXConst( "GXKEY_2");
   await sub_AddGXConst( "GXKEY_3");
   await sub_AddGXConst( "GXKEY_4");
   await sub_AddGXConst( "GXKEY_5");
   await sub_AddGXConst( "GXKEY_6");
   await sub_AddGXConst( "GXKEY_7");
   await sub_AddGXConst( "GXKEY_8");
   await sub_AddGXConst( "GXKEY_9");
   await sub_AddGXConst( "GXKEY_0");
   await sub_AddGXConst( "GXKEY_DASH");
   await sub_AddGXConst( "GXKEY_EQUALS");
   await sub_AddGXConst( "GXKEY_BACKSPACE");
   await sub_AddGXConst( "GXKEY_TAB");
   await sub_AddGXConst( "GXKEY_Q");
   await sub_AddGXConst( "GXKEY_W");
   await sub_AddGXConst( "GXKEY_E");
   await sub_AddGXConst( "GXKEY_R");
   await sub_AddGXConst( "GXKEY_T");
   await sub_AddGXConst( "GXKEY_Y");
   await sub_AddGXConst( "GXKEY_U");
   await sub_AddGXConst( "GXKEY_I");
   await sub_AddGXConst( "GXKEY_O");
   await sub_AddGXConst( "GXKEY_P");
   await sub_AddGXConst( "GXKEY_LBRACKET");
   await sub_AddGXConst( "GXKEY_RBRACKET");
   await sub_AddGXConst( "GXKEY_ENTER");
   await sub_AddGXConst( "GXKEY_LCTRL");
   await sub_AddGXConst( "GXKEY_A");
   await sub_AddGXConst( "GXKEY_S");
   await sub_AddGXConst( "GXKEY_D");
   await sub_AddGXConst( "GXKEY_F");
   await sub_AddGXConst( "GXKEY_G");
   await sub_AddGXConst( "GXKEY_H");
   await sub_AddGXConst( "GXKEY_J");
   await sub_AddGXConst( "GXKEY_K");
   await sub_AddGXConst( "GXKEY_L");
   await sub_AddGXConst( "GXKEY_SEMICOLON");
   await sub_AddGXConst( "GXKEY_QUOTE");
   await sub_AddGXConst( "GXKEY_BACKQUOTE");
   await sub_AddGXConst( "GXKEY_LSHIFT");
   await sub_AddGXConst( "GXKEY_BACKSLASH");
   await sub_AddGXConst( "GXKEY_Z");
   await sub_AddGXConst( "GXKEY_X");
   await sub_AddGXConst( "GXKEY_C");
   await sub_AddGXConst( "GXKEY_V");
   await sub_AddGXConst( "GXKEY_B");
   await sub_AddGXConst( "GXKEY_N");
   await sub_AddGXConst( "GXKEY_M");
   await sub_AddGXConst( "GXKEY_COMMA");
   await sub_AddGXConst( "GXKEY_PERIOD");
   await sub_AddGXConst( "GXKEY_SLASH");
   await sub_AddGXConst( "GXKEY_RSHIFT");
   await sub_AddGXConst( "GXKEY_NUMPAD_MULTIPLY");
   await sub_AddGXConst( "GXKEY_SPACEBAR");
   await sub_AddGXConst( "GXKEY_CAPSLOCK");
   await sub_AddGXConst( "GXKEY_F1");
   await sub_AddGXConst( "GXKEY_F2");
   await sub_AddGXConst( "GXKEY_F3");
   await sub_AddGXConst( "GXKEY_F4");
   await sub_AddGXConst( "GXKEY_F5");
   await sub_AddGXConst( "GXKEY_F6");
   await sub_AddGXConst( "GXKEY_F7");
   await sub_AddGXConst( "GXKEY_F8");
   await sub_AddGXConst( "GXKEY_F9");
   await sub_AddGXConst( "GXKEY_PAUSE");
   await sub_AddGXConst( "GXKEY_SCRLK");
   await sub_AddGXConst( "GXKEY_NUMPAD_7");
   await sub_AddGXConst( "GXKEY_NUMPAD_8");
   await sub_AddGXConst( "GXKEY_NUMPAD_9");
   await sub_AddGXConst( "GXKEY_NUMPAD_MINUS");
   await sub_AddGXConst( "GXKEY_NUMPAD_4");
   await sub_AddGXConst( "GXKEY_NUMPAD_5");
   await sub_AddGXConst( "GXKEY_NUMPAD_6");
   await sub_AddGXConst( "GXKEY_NUMPAD_PLUS");
   await sub_AddGXConst( "GXKEY_NUMPAD_1");
   await sub_AddGXConst( "GXKEY_NUMPAD_2");
   await sub_AddGXConst( "GXKEY_NUMPAD_3");
   await sub_AddGXConst( "GXKEY_NUMPAD_0");
   await sub_AddGXConst( "GXKEY_NUMPAD_PERIOD");
   await sub_AddGXConst( "GXKEY_F11");
   await sub_AddGXConst( "GXKEY_F12");
   await sub_AddGXConst( "GXKEY_NUMPAD_ENTER");
   await sub_AddGXConst( "GXKEY_RCTRL");
   await sub_AddGXConst( "GXKEY_NUMPAD_DIVIDE");
   await sub_AddGXConst( "GXKEY_NUMLOCK");
   await sub_AddGXConst( "GXKEY_HOME");
   await sub_AddGXConst( "GXKEY_UP");
   await sub_AddGXConst( "GXKEY_PAGEUP");
   await sub_AddGXConst( "GXKEY_LEFT");
   await sub_AddGXConst( "GXKEY_RIGHT");
   await sub_AddGXConst( "GXKEY_END");
   await sub_AddGXConst( "GXKEY_DOWN");
   await sub_AddGXConst( "GXKEY_PAGEDOWN");
   await sub_AddGXConst( "GXKEY_INSERT");
   await sub_AddGXConst( "GXKEY_DELETE");
   await sub_AddGXConst( "GXKEY_LWIN");
   await sub_AddGXConst( "GXKEY_RWIN");
   await sub_AddGXConst( "GXKEY_MENU");
   await sub_AddGXConst( "GXACTION_MOVE_LEFT");
   await sub_AddGXConst( "GXACTION_MOVE_RIGHT");
   await sub_AddGXConst( "GXACTION_MOVE_UP");
   await sub_AddGXConst( "GXACTION_MOVE_DOWN");
   await sub_AddGXConst( "GXACTION_JUMP");
   await sub_AddGXConst( "GXACTION_JUMP_RIGHT");
   await sub_AddGXConst( "GXACTION_JUMP_LEFT");
   await sub_AddGXConst( "GXSCENE_FOLLOW_NONE");
   await sub_AddGXConst( "GXSCENE_FOLLOW_ENTITY_CENTER");
   await sub_AddGXConst( "GXSCENE_FOLLOW_ENTITY_CENTER_X");
   await sub_AddGXConst( "GXSCENE_FOLLOW_ENTITY_CENTER_Y");
   await sub_AddGXConst( "GXSCENE_FOLLOW_ENTITY_CENTER_X_POS");
   await sub_AddGXConst( "GXSCENE_FOLLOW_ENTITY_CENTER_X_NEG");
   await sub_AddGXConst( "GXSCENE_CONSTRAIN_NONE");
   await sub_AddGXConst( "GXSCENE_CONSTRAIN_TO_MAP");
   await sub_AddGXConst( "GXFONT_DEFAULT");
   await sub_AddGXConst( "GXFONT_DEFAULT_BLACK");
   await sub_AddGXConst( "GXDEVICE_KEYBOARD");
   await sub_AddGXConst( "GXDEVICE_MOUSE");
   await sub_AddGXConst( "GXDEVICE_CONTROLLER");
   await sub_AddGXConst( "GXDEVICE_BUTTON");
   await sub_AddGXConst( "GXDEVICE_AXIS");
   await sub_AddGXConst( "GXDEVICE_WHEEL");
   await sub_AddGXConst( "GXENTITY_RENDER_DEFAULT");
   await sub_AddGXConst( "GXENTITY_RENDER_TOPDOWN");
   await sub_AddGXConst( "GXTYPE_ENTITY");
   await sub_AddGXConst( "GXTYPE_FONT");
   await sub_AddGXMethod( "SUB" ,   "GXSleep" ,    True);
   await sub_AddGXMethod( "FUNCTION" ,   "GXMouseX" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXMouseY" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXSoundLoad" ,    True);
   await sub_AddGXMethod( "SUB" ,   "GXSoundPlay" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXSoundPlayCopy" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXSoundPlaying" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXSoundRepeat" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXSoundVolume" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXSoundPause" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXSoundStop" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXSoundMuted" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXSoundMuted" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXEntityAnimate" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXEntityAnimateStop" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXEntityAnimateMode" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntityAnimateMode" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXScreenEntityCreate" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntityCreate" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntityRenderMode" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXEntityRenderMode" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXEntityCreate" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntityVisible" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXEntityVisible" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntityMapLayer" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXEntityMapLayer" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXEntityMove" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXEntityPos" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXEntityVX" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntityVX" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXEntityVY" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntityVY" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntityX" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntityY" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntityWidth" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntityHeight" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXEntityFrameNext" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntityFrame" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntityFrames" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXEntityFrames" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXEntityFrameSet" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntitySequence" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntitySequences" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXEntityType" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntityType" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntityUID$" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXFontUID$" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXEntityApplyGravity" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntityApplyGravity" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntityCollide" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXEntityCollisionOffset" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntityCollisionOffsetLeft" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntityCollisionOffsetTop" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntityCollisionOffsetRight" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXEntityCollisionOffsetBottom" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXFullScreen" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXFullScreen" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXBackgroundAdd" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXBackgroundWrapFactor" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXBackgroundClear" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXSceneEmbedded" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXSceneEmbedded" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXSceneCreate" ,    True);
   await sub_AddGXMethod( "SUB" ,   "GXSceneWindowSize" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXSceneScale" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXSceneResize" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXSceneDestroy" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXCustomDraw" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXCustomDraw" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXFrameRate" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXFrameRate" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXFrame" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXSceneDraw" ,    True);
   await sub_AddGXMethod( "SUB" ,   "GXSceneMove" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXScenePos" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXSceneX" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXSceneY" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXSceneWidth" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXSceneHeight" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXSceneColumns" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXSceneRows" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXSceneStart" ,    True);
   await sub_AddGXMethod( "SUB" ,   "GXSceneUpdate" ,    True);
   await sub_AddGXMethod( "SUB" ,   "GXSceneFollowEntity" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXSceneConstrain" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXSceneStop" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXMapCreate" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXMapColumns" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXMapRows" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXMapLayers" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXMapLayerVisible" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXMapLayerVisible" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXMapLayerAdd" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXMapLayerInsert" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXMapLayerRemove" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXMapResize" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXMapDraw" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXMapTilePosAt" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXMapTile" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXMapTile" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXMapTileDepth" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXMapTileAdd" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXMapTileRemove" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXMapVersion" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXMapSave" ,    True);
   await sub_AddGXMethod( "SUB" ,   "GXMapLoad" ,    True);
   await sub_AddGXMethod( "FUNCTION" ,   "GXMapIsometric" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXMapIsometric" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXSpriteDraw" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXSpriteDrawScaled" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXTilesetCreate" ,    True);
   await sub_AddGXMethod( "SUB" ,   "GXTilesetReplaceImage" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXTilesetLoad" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXTilesetSave" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXTilesetPos" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXTilesetWidth" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXTilesetHeight" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXTilesetColumns" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXTilesetRows" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXTilesetFilename" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXTilesetImage" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXTilesetAnimationCreate" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXTilesetAnimationAdd" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXTilesetAnimationRemove" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXTilesetAnimationFrames" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXTilesetAnimationSpeed" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXTilesetAnimationSpeed" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXFontCreate" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXFontCreate" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXFontWidth" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXFontHeight" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXFontCharSpacing" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXFontCharSpacing" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXFontLineSpacing" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXFontLineSpacing" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXDrawText" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXDebug" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXDebug" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXDebugScreenEntities" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXDebugScreenEntities" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXDebugFont" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXDebugFont" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXDebugTileBorderColor" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXDebugTileBorderColor" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXDebugEntityBorderColor" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXDebugEntityBorderColor" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXDebugEntityCollisionColor" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXDebugEntityCollisionColor" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXKeyInput" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXKeyDown" ,    False);
   await sub_AddGXMethod( "SUB" ,   "GXDeviceInputDetect" ,    True);
   await sub_AddGXMethod( "FUNCTION" ,   "GXDeviceInputTest" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXDeviceName" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXDeviceTypeName" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXInputTypeName" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXKeyButtonName" ,    False);
   await sub_AddGXConst( "GX_CR");
   await sub_AddGXConst( "GX_LF");
   await sub_AddGXConst( "GX_CRLF");
   await sub_AddGXMethod( "FUNCTION" ,   "GXSTR_LPad" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXSTR_RPad" ,    False);
   await sub_AddGXMethod( "FUNCTION" ,   "GXSTR_Replace" ,    False);
}
async function sub_InitQBMethods() {
if (QB.halted()) { return; }; 
/* implicit variables: */ 
   await sub_AddQBConst( "_KEEPBACKGROUND");
   await sub_AddQBConst( "_ONLYBACKGROUND");
   await sub_AddQBConst( "_FILLBACKGROUND");
   await sub_AddQBConst( "_OFF");
   await sub_AddQBConst( "ON");
   await sub_AddQBConst( "_STRETCH");
   await sub_AddQBConst( "_SQUAREPIXELS");
   await sub_AddQBConst( "_SMOOTH");
   await sub_AddQBMethod( "FUNCTION" ,   "_Alpha" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Alpha32" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Acos" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Acosh" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Arccot" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Arccsc" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Arcsec" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Atanh" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Asin" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Asinh" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Atan2" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_AutoDisplay" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_AutoDisplay" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_BackgroundColor" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Blue" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Blue32" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_CapsLock" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Ceil" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Clipboard$" ,    True);
   await sub_AddQBMethod( "SUB" ,   "_Clipboard$" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_ClipboardImage" ,    True);
   await sub_AddQBMethod( "SUB" ,   "_ClipboardImage" ,    True);
   await sub_AddQBMethod( "FUNCTION" ,   "_CommandCount" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_ControlChr" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_ControlChr" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_CopyImage" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Cosh" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Cot" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Coth" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Csc" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Csch" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_CWD$" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_D2G" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_D2R" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_DefaultColor" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Deflate" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_Delay" ,    True);
   await sub_AddQBMethod( "FUNCTION" ,   "_DesktopHeight" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_DesktopWidth" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Dest" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_Dest" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Dir" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_DirExists" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Display" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_Display" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_Echo" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_LogTrace" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_LogInfo" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_LogWarn" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_LogError" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_EnvironCount" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_FileExists" ,    True);
   await sub_AddQBMethod( "FUNCTION" ,   "_Font" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_Font" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_FontHeight" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_FontWidth" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_FreeFont" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_FreeImage" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_FullScreen" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_FullScreen" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_G2D" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_G2R" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Green" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Green32" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Height" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Hypot" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Inflate" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_InStrRev" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_Limit" ,    True);
   await sub_AddQBMethod( "SUB" ,   "_KeyClear" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_KeyDown" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_KeyHit" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_LoadFont" ,    True);
   await sub_AddQBMethod( "FUNCTION" ,   "_LoadImage" ,    True);
   await sub_AddQBMethod( "FUNCTION" ,   "_MouseButton" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_MouseInput" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_MouseShow" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_MouseHide" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_MouseWheel" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_MouseX" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_MouseY" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_NewImage" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_NumLock" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_OS$" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Pi" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_PaletteColor" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_PrintMode" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_PrintMode" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_PrintString" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_PrintWidth" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_PutImage" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_R2D" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_R2G" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Readbit" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Red" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Red32" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Resetbit" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Resize" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_ResizeHeight" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_ResizeWidth" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_RGB" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_RGBA" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_RGB32" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_RGBA32" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Round" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_ScreenExists" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_ScreenMove" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_ScreenX" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_ScreenY" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_ScrollLock" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Sec" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Sech" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Setbit" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Shl" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Shr" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Sinh" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Source" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_Source" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_SndClose" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_SndOpen" ,    True);
   await sub_AddQBMethod( "SUB" ,   "_SndPlay" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_SndPlayCopy" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_SndPlaying" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_SndLoop" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_SndPause" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_SndStop" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_SndVol" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_StartDir$" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Strcmp" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Stricmp" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Tanh" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Title" ,    False);
   await sub_AddQBMethod( "SUB" ,   "_Title" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Togglebit" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Trim" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_Width" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Abs" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Asc" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Atn" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Beep" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Chr$" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Cdbl" ,    False);
   await sub_AddQBMethod( "SUB" ,   "ChDir" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Cint" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Clng" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Close" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Csng" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Circle" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Cls" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Color" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Command$" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Cos" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Csrlin" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "CVI" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "CVL" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "CVS" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "CVD" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Date$" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Draw" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Environ" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Environ" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Error" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Run" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Err" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Erl" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_ErrorLine" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "_ErrorMessage$" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "EOF" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Exp" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Files" ,    True);
   await sub_AddQBMethod( "FUNCTION" ,   "Fix" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "FreeFile" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Get" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Put" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Hex$" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Input" ,    True);
   await sub_AddQBMethod( "FUNCTION" ,   "InKey$" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "InStr" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Int" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "LBound" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Left$" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "LCase$" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Len" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Line" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Loc" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Locate" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "LOF" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Log" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "LTrim$" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Kill" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Mid$" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Mid$" ,    False);
   await sub_AddQBMethod( "SUB" ,   "MkDir" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "MKI$" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "MKL$" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "MKS$" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "MKD$" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Name" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Oct$" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Open" ,    True);
   await sub_AddQBMethod( "SUB" ,   "Paint" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Play" ,    True);
   await sub_AddQBMethod( "FUNCTION" ,   "Point" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Pos" ,    False);
   await sub_AddQBMethod( "SUB" ,   "PReset" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Print" ,    True);
   await sub_AddQBMethod( "SUB" ,   "?" ,    True);
   await sub_AddQBMethod( "SUB" ,   "PSet" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Put" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Randomize" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Restore" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Right$" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "RTrim$" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Read" ,    False);
   await sub_AddQBMethod( "SUB" ,   "RmDir" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Rnd" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Screen" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Screen" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Seek" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Seek" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Sgn" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Sin" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Sleep" ,    True);
   await sub_AddQBMethod( "SUB" ,   "Sound" ,    True);
   await sub_AddQBMethod( "FUNCTION" ,   "Space" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "String" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Sqr" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Str$" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Swap" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Tan" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Time$" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Timer" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "UBound" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "UCase$" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Val" ,    False);
   await sub_AddQBMethod( "FUNCTION" ,   "Varptr" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Window" ,    False);
   await sub_AddQBMethod( "SUB" ,   "Write" ,    True);
   await sub_AddQBMethod( "SUB" ,   "IncludeJS" ,    True);
   await sub_AddNativeMethod( "FUNCTION" ,   "JSON.Parse" ,   "JSON.parse" ,    False);
   await sub_AddNativeMethod( "FUNCTION" ,   "JSON.Stringify" ,   "JSON.stringify" ,    False);
   await sub_AddSystemType( "FETCHRESPONSE" ,   "ok:INTEGER,status:INTEGER,statusText:STRING,text:STRING");
   await sub_AddQBMethod( "FUNCTION" ,   "Fetch" ,    True);
   await sub_AddQBMethod( "SUB" ,   "Fetch" ,    True);
}
async function compile(src, debug) {
   await sub_SetDebugMode(debug ? -1 : 0);
   await sub_QBToJS(src, TEXT, '');
   var js = '';
   for (var i=1; i<= QB.func_UBound(jsLines); i++) {
      js += QB.arrayValue(jsLines, [i]).value.text + '\n';
   }
   return js;
}
function getWarnings() {
   var w = [];
   for (var i=1; i <= QB.func_UBound(warnings); i++) {
      w.push({
         line: QB.arrayValue(warnings, [i]).value.line,
         text: QB.arrayValue(warnings, [i]).value.text,
         mtype: QB.arrayValue(warnings, [i]).value.mtype,
         moduleId: QB.arrayValue(warnings, [i]).value.moduleId,
         module: QB.arrayValue(warnings, [i]).value.module,
      });
   }
   return w;
}
function _getMethods(methods) {
   var m = [];
   for (var i=1; i <= QB.func_UBound(methods); i++) {
      var lidx = QB.arrayValue(methods, [i]).value.line;
      m.push({
         line: QB.arrayValue(lines, [lidx]).value.line,
         type: QB.arrayValue(methods, [i]).value.type,
         returnType: QB.arrayValue(methods, [i]).value.returnType,
         name: QB.arrayValue(methods, [i]).value.name,
         uname: QB.arrayValue(methods, [i]).value.uname,
         jsname: QB.arrayValue(methods, [i]).value.jsname,
         argc: QB.arrayValue(methods, [i]).value.argc,
         args: QB.arrayValue(methods, [i]).value.args
      });
   }
   return m;
}
function getMethods() { return _getMethods(methods); }
function getExportMethods() { return _getMethods(exportMethods); }
function getExportConsts() {
   var c = [];
   for (var i=1; i <= QB.func_UBound(exportConsts); i++) {
      c.push({
         name: QB.arrayValue(exportConsts, [i]).value.name,
         jsname: QB.arrayValue(exportConsts, [i]).value.jsname
      });
   }
   return c;
}
function getSourceLine(jsLine) {
   if (jsLine == 0) { return 0; }
   var line = QB.arrayValue(jsLines, [jsLine]).value.line;
   line = QB.arrayValue(lines, [line]).value.line;
   return line;
}
function getModule(id) {
   return QB.arrayValue(modules, [id]).value;
}
function setSelfConvert() { sub_SetSelfConvert(); }

return {
   compile: compile,
   getWarnings: getWarnings,
   getMethods: getMethods,
   getExportMethods: getExportMethods,
   getExportConsts: getExportConsts,
   getSourceLine: getSourceLine,
   getModule: getModule,
   setSelfConvert: setSelfConvert,
};
}
if (typeof module != 'undefined') { module.exports.QBCompiler = _QBCompiler; }
