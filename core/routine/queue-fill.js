const { options } = require("../../util/config");
const { arrayDiff } = require("../../util/helpers");
const { parseFileList } = require("../assembler/parse-files");
const { createMessages } = require("../assembler/build-messages");
const { addToQueue, getQueueFiles, pullExclude } = require("../queue/queue");
const { moveSentFiles } = require("../fs/move-sent");
const {
  fetchDirContent,
  getFileMeta,
  sortFilesByDate,
} = require("../fs/fetch-content");

/**
 * @description Fills the queue with files from the file system
 */
async function fillQueue() {
  const queueFilesList = getQueueFiles();
  const dirFilesList = await fetchDirContent(options.loadPath);

  const newFilesList = arrayDiff(dirFilesList, queueFilesList);
  const fileMetaList = await getFileMeta(newFilesList);
  const sortedFlList = sortFilesByDate(fileMetaList);
  const messagesList = await createMessages(parseFileList(sortedFlList));
  addToQueue(messagesList);
}

/**
 * @description Initializes the queue fill routine
 */
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
