const { options } = require("../../util/config");
const { parseFileList } = require("../assembler/parse-files");
const { createMessages } = require("../assembler/build-messages");
const { addToQueue, getQueueFiles, pullExclude } = require("../queue/queue");
const { moveSentFiles } = require("../fs/move-sent");
const {
  fetchDirContent,
  getFileMeta,
  sortFilesByDate,
} = require("../fs/fetch-content");

function filterNewFiles(fileList, queueList) {
  const outputList = [];

  for (const iName of fileList) {
    let match = false;
    for (const qName of queueList) {
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
  const queueFilesList = getQueueFiles();
  const dirFilesList = await fetchDirContent(options.loadPath);
  const newFilesList = filterNewFiles(dirFilesList, queueFilesList);
  const fileMetaList = await getFileMeta(newFilesList);
  const sortedFlList = sortFilesByDate(fileMetaList);
  const messagesList = await createMessages(parseFileList(sortedFlList));
  addToQueue(messagesList);
}

async function initFillQueue() {
  await fillQueue();
  setInterval(async () => {
    const excludedFiles = pullExclude();
    await moveSentFiles(excludedFiles);
    fillQueue();
  }, (options.sendEvery / 2) * 60 * 1000);
}

module.exports = {
  initFillQueue,
  fillQueue,
};
