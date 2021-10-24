const fs = require("fs/promises");
const path = require("path");

/**
 * Fetches all files in the directory and sorts them by date
 * @param {string} rootPath - Path of the directory which will be probed
 * @return {Promise} - Promise that resolves to the sorted file list of the content directory
 */
function fetchSortedFileList(rootPath) {
  const dirContentsPromise = fs.readdir(rootPath);
  const fileListPromise = dirContentsPromise
    .then(async res => {
      res = res.sort();
      const promises = res.reduce(async (result, el) => {
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
    })
    .catch(err => {
      console.log(err);
      debugger;
    });
  return fileListPromise;
}

module.exports = {
  fetchSortedFileList,
};
