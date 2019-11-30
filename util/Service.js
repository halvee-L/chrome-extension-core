// // 请求服务类
define([
  "../util/Class.js",
  "../util/Helper.js",
  "../util/MessageService.js",
  "../lib/jquery-3.4.1.min"
], function(Class, helper, MessageService) {
  const util = helper.util;
  const server = new MessageService();
  const SERVER_CHROME_REQUEST = "chrome.ext.request";
  const SERVER_CHROME_RESPONSE = "chrome.ext.response";

  const ServiceClass = Class.extend({
    init(env) {
      this.env = env;
      if (this.env === "bg") {
        server.accept(SERVER_CHROME_REQUEST, this.ajaxCnt2Bg.bind(this));
      }
    },
    ajaxCnt2Bg(data) {
      let secretKey = data.secretKey;
      delete data.secretKey;
      let callbackFactory = type => data =>
        server.send2Cnt(SERVER_CHROME_RESPONSE + "." + secretKey, {
          type,
          data
        });
      this.ajaxBg(data)
        .then(callbackFactory("success"))
        .fail(callbackFactory("error"));
    },
    ajax(data) {
      if (this.env === "bg") return this.ajaxBg(data);
      let uuid = util.uuid(20);
      server.send2Bg(
        SERVER_CHROME_REQUEST,
        Object.assign(data, {
          secretKey: uuid
        })
      );
      var dtd = $.Deferred();

      server.accept(SERVER_CHROME_RESPONSE + "." + uuid, function(res) {
        if (res.type === "success") {
          dtd.resolve(res.data);
        } else {
          dtd.reject(res.data);
        }
      });

      return dtd;
    },
    ajaxBg(data) {
      return $.ajax(data);
    }
  });
  const instant = {};

  let Service = function(env = "cnt") {
    return instant[env] || (instant[env] = new ServiceClass(env));
  };
  window.ext = window.ext || {};
  window.ext.Service = Service;
  return Service;
});
