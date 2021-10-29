const fs = require("fs");

const options = {
  botAPIKey: null,
  targetChatID: null,
  loadPath: "./content",
  historyPath: "./content-hist",
  APIServer: "http://api.telegram.org",
  handleFiles: "remote",
  sendAtOnce: 10,
  sendEvery: 30,
};

const jsonString = fs.readFileSync("./config.json").toString();

const configFileOptions = JSON.parse(jsonString);

for (const key in configFileOptions) {
  if (configFileOptions.hasOwnProperty(key) && configFileOptions[key] != null) {
    options[key] = configFileOptions[key];
  }
}

if (options.botAPIKey == null || options.targetChatID == null) {
  throw new TypeError("Required settings are empty");
}

module.exports = { options };
