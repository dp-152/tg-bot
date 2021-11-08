const fs = require("fs/promises");
const path = require("path");

const { options } = require("../../util/config");

/**
 * Moves a single file to the history directory.
 *
 * @param {string} filePath - Path to the file to move
 * @returns {Promise<void>} - Resolves when the file has been moved
 */
async function moveFile(filePath) {
  console.log(
    `Moving file ${path.basename(filePath)} to ${options.historyPath}`,
  );
  return fs.rename(
    filePath,
    path.resolve(options.historyPath, path.basename(filePath)),
  ).catch(err => console.error(err));
}

/**
 * Moves all files in the given list to the history directory.
 *
 * @param {Array<string>} fileList - List of files to move
 */
async function moveSentFiles(fileList) {
  try {
    await fs.mkdir(options.historyPath);
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }
  const promises = [];
  for (const file of fileList) {
    if (file.bundleMembers) {
      for (const bundleMember of file.bundleMembers) {
        promises.push(moveFile(bundleMember.path));
        if (bundleMember.thumbFile) {
          promises.push(moveFile(bundleMember.thumbFile.path));
        }
        if (bundleMember.captionFile) {
          promises.push(moveFile(bundleMember.captionFile.path));
        }
      }
      continue;
    }

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
