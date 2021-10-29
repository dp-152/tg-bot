const { options } = require("../../util/config");
const { initFillQueue } = require("./queue-fill");
const { pullN } = require("../queue/queue");
const { send } = require("../../tg/interface/send");

async function sendJob() {
  const list = pullN(options.sendAtOnce);
  for (msg of list) {
    console.log(msg);
    await send(msg.data);
    await new Promise(res => {
      setTimeout(res, 5000);
    });
  }
}

async function initSendJob() {
  await initFillQueue();
  sendJob();
  setInterval(sendJob, options.sendEvery * 60 * 1000);
}

module.exports = {
  initSendJob,
};
