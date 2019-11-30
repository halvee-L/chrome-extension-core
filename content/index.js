define(["../util/MessageService", "../util/Service"], function(
  MessageService,
  Service
) {
  const msserver = new MessageService({ env: "cnt" });
  const server = Service("cnt");
  msserver.accept(TASKLOOP, hotel => {}).accept(TASKPARSE, userInfo => {});
});
