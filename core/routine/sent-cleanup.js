const { pullExclude } = require("../queue/queue");
const { moveSentFiles } = require("../fs/move-sent");

async function moveSent() {
  await moveSentFiles(pullExclude());
}

module.exports = {
  moveSent,
};
