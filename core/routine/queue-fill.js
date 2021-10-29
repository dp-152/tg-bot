const { options } = require("../../util/config");
const { parseFileList } = require("../assembler/parse-files");
const { createMessages } = require("../assembler/build-messages");
const { addToQueue, currentQueue } = require("../queue/queue");
const {
  fetchDirContent,
  getFileMeta,
  sortFilesByDate,
} = require("../fs/fetch-content");

function removeInQueue(inputList) {
  const qFileNames = currentQueue;

  for (let i = 0; i < inputList.length; i++) {
    if (
      inputList[i].match(/^.*\.[a-zA-Z0-9]+_(caption|thumb)\.[a-zA-Z0-9]+$/g)
    ) {
      continue;
    }

    for (let j = 0; j < qFileNames.length; j++) {
      if (inputList[i] === qFileNames[j]) {
        inputList.splice(i, 1);
      }
    }
  }

  return inputList;
}

async function fillQueue() {
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
  setInterval(fillQueue, (options.sendEvery / 2) * 60 * 1000);
}

module.exports = {
  initFillQueue,
  fillQueue,
};
