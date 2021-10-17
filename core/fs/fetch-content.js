const fs = require("fs/promises");

const { options } = require("../../util/config");

exports.dirContentsPromise = fs.readdir(options.loadPath);
