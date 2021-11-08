const fs = require("fs/promises");
const path = require("path");

/**
 * Fetches all file names from a given directory
 *
 * @param {string} rootPath - Path to the directory to search
 * @returns {Promise<Array<string>>} - Array containing the names of all files in the directory
 */
async function fetchDirContent(rootPath) {
  const dirContent = (await fs.readdir(rootPath)).map(fName =>
    path.resolve(path.join(rootPath, fName)),
  );
  return dirContent;
}

/**
 * Gathers stat information for all files passed in fileList
 *
 * @param {Array<string>} fileList - List of files to fetch stats for
 * @returns {Array<object>} - List of objects containing the file info and stats
 */
async function getFileMeta(fileList) {
  const promises = fileList.map(async fPath => {
    const stat = await fs.stat(fPath);

    // Gather stat data for current file
    if (!stat.isDirectory()) {
      // Grab the absolute file path
      const fName = path.basename(fPath);
      // Grab the file extension
      const fExt = path.extname(fName).toLowerCase();

      return ({
        name: fName,
        path: fPath,
        ext: fExt,
        stat,
      });
    }
  });

  const result = await Promise.all(promises);

  // Filter out any undefined values
  return result.filter(f => f);
}

/**
 * Sort a list of files by their ctime
 *
 * @param {Array<object>} fileList - List of files to sort
 * @returns {Array<object>} - Sorted file list
 */
function sortFilesByDate(fileList) {
  return fileList.sort(
    (a, b) => a.stat.ctime.getTime() - b.stat.ctime.getTime(),
  );
}

module.exports = {
  fetchDirContent,
  getFileMeta,
  sortFilesByDate,
};
