const { options } = require("../../util/config");
const { parseFileList } = require("../assembler/parse-files");
const { createMessages } = require("../assembler/build-messages");
const { addToQueue, getNamesInQueue } = require("../queue/queue");
const { moveSent } = require("./sent-cleanup");
const {
  fetchDirContent,
  getFileMeta,
  sortFilesByDate,
} = require("../fs/fetch-content");

function removeInQueue(inputList) {
  const outputList = [];
  const qFileNames = getNamesInQueue();

  for (const iName of inputList) {
    let match = false;
    for (const qName of qFileNames) {
      if (iName === qName) {
        match = true;
        break;
      }
    }
    if (!match) outputList.push(iName);
  }

  return outputList;
}

async function fillQueue() {
  console.log("Will begin seeking new files from the file system");
  const fileNamesList = await fetchDirContent(options.loadPath);
  const cleanFlNmList = removeInQueue(fileNamesList);
  const sortedFlList = sortFilesByDate(
    await getFileMeta(options.loadPath, cleanFlNmList)
  );
  const appendList = await createMessages(parseFileList(sortedFlList));
  addToQueue(appendList);
}

async function initFillQueue() {
  await fillQueue();
  setInterval(async () => {
    await moveSent();
    fillQueue();
  }, (options.sendEvery / 2) * 60 * 1000);
}

module.exports = {
  initFillQueue,
  fillQueue,
};
