const { options } = require("../../util/config");
const { initFillQueue } = require("./queue-fill");
const { pullN, deleteN, addToExclude } = require("../queue/queue");
const { send } = require("../../tg/interface/send");

async function sendJob() {
  const list = pullN(options.sendAtOnce);
  for (const msg of list) {
    console.log(`Sending message from file ${msg.name}`);
    console.log(`- Has thumb: ${!!msg.thumbFile}`);
    console.log(`- Has caption: ${!!msg.captionFile}\n`);
    try {
      await send(msg.data);
    } catch (err) {
      console.log("Message send failed with the following error:");
      console.log(err.response.data);
      if (err.response.status === 429) {
        console.log("API responded with too many requests error.");
        console.log("Will wait for 30 seconds and then try again");
        await new Promise(res => {
          setTimeout(res, 30 * 1000);
        });
        try {
          await send(msg.data);
        } catch (err) {
          console.log("Sending message has failed again.");
          console.log(err.response.data);
        }
      }
    }
    addToExclude(msg);

    let timeout;
    if (msg.bundleName) timeout = 40;
    else timeout = 15;

    await new Promise(res => {
      setTimeout(res, timeout * 1000);
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
