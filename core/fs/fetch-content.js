const fs = require("fs/promises");
const path = require("path");

const { options } = require("../../util/config");

/**
 * Fetches all files in the content directory set in config.json
 * @return {Promise} - Promise that resolves to the sorted file list of the content directory
 */
function fetchSortedFileList() {
  const dirContentsPromise = fs.readdir(options.loadPath);
  const fileListPromise = dirContentsPromise
    .then(async res => {
      res = res.sort();
      const promises = res.map(async el => {
        return {
          name: el,
          stat: await fs.stat(path.join(options.loadPath, el)),
        };
      });
      const fileList = await Promise.all(promises);
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
