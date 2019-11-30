require(["../util/MessageService", "../util/Service"], function(
  MessageService,
  Service
) {
  let server = Service("bg");
  let msserver = new MessageService({ env: "bg" });

  const getCallBack = name => (tabId, info, tab) => {
    //todo
  };

  chrome.tabs.onUpdated.addListener(getCallBack("onUpdated"));

  chrome.tabs.onActivated.addListener(getCallBack("onActivated"));

  chrome.tabs.onReplaced.addListener(getCallBack("onReplaced"));

  chrome.tabs.onCreated.addListener(getCallBack("onCreated"));

  // msserver
  //   .accept(TASKSTART, info => {})
  //   //todo 这个位置TASKLOOP可能会有问题,先在这个位置踩个点
  //   .accept(TASKLOOP, () => {});
});
