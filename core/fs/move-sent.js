const fs = require("fs/promises");
const path = require("path");

const { options } = require("../../util/config");

async function moveFile(filePath) {
  console.log(
    `Moving file ${path.basename(filePath)} to ${options.historyPath}`
  );
  return fs.rename(
    filePath,
    path.resolve(options.historyPath, path.basename(filePath))
  );
}

async function moveSentFiles(fileList) {
  try {
    await fs.mkdir(options.historyPath);
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }
  const promises = [];
  for (file of fileList) {
    promises.push(moveFile(file.path));
    if (file.thumbFile) {
      promises.push(moveFile(file.thumbFile.path));
    }
    if (file.captionFile) {
      promises.push(moveFile(file.captionFile.path));
    }
  }
  await Promise.all(promises);
}

module.exports = {
  moveSentFiles,
};
