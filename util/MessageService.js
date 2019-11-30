define(["../util/Emitter"], function(Emitter) {
  const emitter = new Emitter();

  const serialize = function(name, data) {
    return { type: name, data: data };
  };

  const unserialize = function(data) {
    return data;
  };

  //前后端接受消息均是这个API
  chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    emitter.emit("accept", unserialize(request), callback);
  });
  // 后端前指定前端发送消息

  let MessageService = Emitter.extend({
    init(params = {}) {
      this._super();
      this.env = params.env || "bg";
      emitter.on(
        "accept",
        function(data, callback) {
          this.emit(data.type, data.data, callback);
        },
        this
      );
    },
    send2Bg(name, message) {
      chrome.runtime.sendMessage(serialize(name, message), function(response) {
        console.log("content get response:", response);
      });
    },
    send2Cnt(name, message) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, serialize(name, message), function(
          response
        ) {
          console.log("content tabs get response:", response);
        });
      });
    },
    send(name, message) {
      this.env === "bg"
        ? this.send2Cnt(name, message)
        : this.send2Bg(name, message);
    },
    accept(name, handle) {
      return this.on(name, this.acceptHandle(handle));
    },
    acceptOnce(name, handle) {
      this.once(name, this.acceptHandle(handle));
    },
    acceptHandle(handle) {
      return function(data, callback) {
        let res = handle(data);
        // 此代码无效，当addListener返回为true时生效
        if (res && res.then) {
          res.then(callback);
        } else {
          callback();
        }
      };
    }
  });
  window.ext = window.ext || {};
  window.ext.MessageService = MessageService;
  return MessageService;
});
