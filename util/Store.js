define(["../util/Class"], function(Class) {
  const serialize = function(data) {
    let type = Object.prototype.toString(data);
    return JSON.stringify({
      type: type,
      data
    });
  };

  const unserialize = function(data) {
    try {
      return JSON.parse(data).data;
    } catch (e) {
      return;
    }
  };

  const Store = Class.extend({
    init() {},
    add(name, val) {
      localStorage.setItem(name, serialize(val));
    },
    get(name) {
      let val = localStorage.getItem(name);
      return unserialize(val);
    },
    remove(name) {
      localStorage.removeItem(name);
    }
  });
  window.ext = window.ext || {};
  window.ext.Store = Store;
  return Store;
});
