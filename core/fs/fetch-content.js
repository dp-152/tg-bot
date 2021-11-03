const fs = require("fs/promises");
const path = require("path");

async function fetchDirContent(rootPath) {
  const dirContent = (await fs.readdir(rootPath)).map(fName =>
    path.resolve(path.join(rootPath, fName)),
  );
  dirContent.sort();
  return dirContent;
}

async function getFileMeta(fileNamesList) {
  const fileList = [];

  for (const fPath of fileNamesList) {
    const stat = await fs.stat(fPath);

    // Gather stat data for current file
    if (!stat.isDirectory()) {
      // Grab the absolute file path
      const fName = path.basename(fPath);
      // Grab the file extension
      const fExt = path.extname(fName).toLowerCase();

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
    (a, b) => a.stat.ctime.getTime() - b.stat.ctime.getTime(),
  );
}

module.exports = {
  fetchDirContent,
  getFileMeta,
  sortFilesByDate,
};
