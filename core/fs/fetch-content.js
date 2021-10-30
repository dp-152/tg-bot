const fs = require("fs/promises");
const path = require("path");

function fetchDirContent(rootPath) {
  return fs.readdir(rootPath).then(res => res.sort());
}

async function getFileMeta(rootPath, fileNamesList) {
  const fileList = [];

  for (const fName of fileNamesList) {
    const stat = await fs.stat(path.join(rootPath, fName));

    // Gather stat data for current file
    if (!stat.isDirectory()) {
      // Grab the absolute file path
      const fPath = path.resolve(rootPath, fName);
      // Grab the file extension
      const fExt = path.extname(fName);

      fileList.push({
        name: fName,
        path: fPath,
        ext: fExt,
        stat,
      });
    }
  }

  return fileList;
}

function sortFilesByDate(fileList) {
  return fileList.sort(
    (a, b) => a.stat.mtime.getTime() - b.stat.mtime.getTime()
  );
}

module.exports = {
  fetchDirContent,
  getFileMeta,
  sortFilesByDate,
};
