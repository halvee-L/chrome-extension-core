/***
 *@author:halvee.L
 *@time: 2019/10/30
 *@desc: 在content中注入JS时，由于前端加载机制，通过ADM加载时路径会会指向当前页面根目录，采用劫持的方案来实现伪模块加载
 */

/**
 * @update:2019/10/31 后期通过此机制修改当
 * var imgURL = chrome.extension.getURL("images/myimage.png");
 * document.getElementById("someImage").src = imgURL;
 *
 */
(function(win) {
  let jdg;
  let isArray = Array.isArray
    ? arr => Array.isArray(arr)
    : arr => Object.prototype.toString.call(arr) === "[object Array]";

  let define = function(name, deps, factory) {
    jdg = window.ext || {};
    if (isArray(name)) {
      factory = deps;
      deps = name;
    }
    //../util/MessageService
    deps = deps.map(function(key) {
      let name = key
        .split("/")
        .pop()
        .replace(".js", "");
      let obj = jdg[name] || {};
      return obj;
    });
    return factory.apply(this, deps);
  };
  win.define = define;
})((0, eval)("this"));
