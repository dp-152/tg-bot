const fs = require("fs");

const defaultOptions = {
  botAPIKey: "",
  targetChatID: 0,
  loadPath: "",
  historyPath: "",
  APIServer: "http://api.telegram.org",
  handleFiles: "remote",
};

const jsonString = fs.readFileSync("../config.json").toString();

const configFileOptions = JSON.parse(jsonString);

exports.options = {
  ...defaultOptions,
  ...configFileOptions,
};
