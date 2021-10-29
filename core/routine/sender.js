const { options } = require("../../util/config");
const { initFillQueue } = require("./queue-fill");
const { pullN, deleteN, addToExclude } = require("../queue/queue");
const { send } = require("../../tg/interface/send");

async function sendJob() {
  const list = pullN(options.sendAtOnce);
  for (msg of list) {
    console.log(`\nSending message from file ${msg.name}`);
    console.log(`- Has thumb: ${!!msg.thumbFile}`);
    console.log(`- Has caption: ${!!msg.captionFile}`);
    await send(msg.data);
    addToExclude(msg);
    await new Promise(res => {
      setTimeout(res, 5000);
    });
  }
  deleteN(list.length);
}

async function initSendJob() {
  await initFillQueue();
  sendJob();
  setInterval(sendJob, options.sendEvery * 60 * 1000);
}

module.exports = {
  initSendJob,
};
