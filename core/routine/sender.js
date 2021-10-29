const { options } = require("../../util/config");
const { pullN } = require("../queue/queue");
const { send } = require("./tg/interface/send");


function initSendJob() {
  setInterval(async () => {
    const list = pullN(options.sendAtOnce);
    for (msg of list) {
      console.log(msg);
      await send(msg);
      await new Promise(res => {
        setTimeout(res, 5000);
      });
    }
  }, options.sendEvery * 60 * 1000);
}

module.exports = {
  initSendJob,
};
