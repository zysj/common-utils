
/**
 * encodeReserveReplacer,encode均为vue-router.js的方法
 */
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;

var encode = function (str) { return encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ','); };

/**
 * 对对象进行简单转换成参数字符串
 * @param {Object} obj 
 */
function simpleParam(obj){
    if(!obj)return;
    var str = '';
    var val,i,subVal;
    for(var key in obj){
        if(key == '' || key == null)continue;
        val = obj[key];
        if(val instanceof Array){
            for(i=0,len=val.length;i<len;i++){
                subVal = val[i];
                if(subVal === undefined ){
                    str += encode(key) + '&';
                }else{
                    str += encode(key) + '=' + encode(subVal)+'&';
                }
            }
        }else if(val === null){
            str += encode(key) + '&';
        }else if(val === undefined){
            continue;
        }else{
            str += encode(key) + '=' + encode(val)+'&';
        }
    }
    return str.slice(0,-1);
}

/**
 * 对simpleParam函数生成的字符串转换成对象
 * @param {String} str 
 */
function simpleParse(str){
    str = str.trim();
    var parts = str.split('&'),sparts,val,res={};
    for(var i = 0,len = parts.length;i<len;i++){
        sparts = parts[i].split('=');
        var key = decodeURIComponent(sparts.shift());
        var val = sparts.length > 0 ? decodeURIComponent(sparts.join('=')) : null;
        if(res[key] === undefined){
            res[key] = val;
        }else if(val instanceof Array){
            res[key].push(val);
        }else{
            res[key] = [res[key],val];
        }
    }
    return res;
}

/**
 * 对参数对象进行详细的转换
 * @param {Object} obj 
 */
function toParam(obj){
    var str = '', name, val, parambName, subName, subVal, innerObj, i;
      
    for(name in obj) {
      val = obj[name];
        
      if(val instanceof Array) {
        for(i=0; i<val.length; ++i) {
          subVal = val[i];
          paramName = name + '[' + i + ']';
          innerObj = {};
          innerObj[paramName] = subVal;
          str += toParam(innerObj) + '&';
        }
      }
      else if(val instanceof Object) {
        for(subName in val) {
          subVal = val[subName];
          paramName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[paramName] = subVal;
          str += toParam(innerObj) + '&';
        }
      }
      else if(val !== undefined && val !== null)
      str += encodeURIComponent(name) + '=' + encodeURIComponent(val) + '&';
    }
      
    return str.length ? str.substr(0, str.length - 1) : str;
}