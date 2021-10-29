const fs = require("fs/promises");
const path = require("path");

function fetchDirContent(rootPath) {
  return fs.readdir(rootPath).then(res => res.sort());
}

async function sortFilesByDate(rootPath, fileNamesList) {
  const promises = fileNamesList.reduce(async (result, el) => {
    result = await result;
    const stat = await fs.stat(path.join(rootPath, el));
    if (!stat.isDirectory()) {
      const fName = el;
      // Grab the absolute file path
      const fPath = path.resolve(rootPath, fName);
      // Grab the file extension
      const fExt = path.extname(fName);

      result.push({
        name: fName,
        path: fPath,
        ext: fExt,
        stat,
      });
    }
    return result;
  }, []);
  const fileList = await promises;
  return fileList.sort(
    (a, b) => a.stat.mtime.getTime() - b.stat.mtime.getTime()
  );
}

module.exports = {
  fetchDirContent,
  sortFilesByDate,
};
