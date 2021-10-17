const fs = require("fs/promises");
const path = require("path");

const { options } = require("../../util/config");

const dirContentsPromise = fs.readdir(options.loadPath);

exports.filesPromise = dirContentsPromise
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
