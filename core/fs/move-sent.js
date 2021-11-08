const fs = require("fs/promises");
const path = require("path");

const { options } = require("../../util/config");
const { flattenFileObject } = require("../../util/helpers");

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
    for (const filePath of flattenFileObject(file)) {
      promises.push(moveFile(filePath));
    }
  }
  await Promise.all(promises);
}

module.exports = {
  moveSentFiles,
};
