// xor function in one place for easy modification
class xor {
  static encode(str) {
    
  }
  static decode(str) {
    if (!str) return str;
    str = atob(str);
    let result = '';
    for(let i=0; i<str.length; i++) {
        result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  }
}
// and setting path easily. (wait this is in the js.js file as prefix though?)
path = __uv$config.prefix