const axios = require("axios").default;
const FormData = require("form-data");

const { options } = require("../../util/config");
const botServerUrl = options.APIServer;
const botFullPath = `/bot${options.botAPIKey}`;

/**
 * @typedef {import("../models/chat").TgChatModel} TgChatModel
 */

/**
 * Performs a send to Telegram's bot API server
 * Will send all the data contained in the tgData object
 * to the route declared in tgData.route
 * @param {TgChatModel} msgData - TgModel data object to be sent
 * @param {boolean} isReadStream - True if the attachment in the data object is a readStream
 * @return {Promise} HTTP request promise
 */
function send(msgData) {
  if (options.handleFiles === "local") {
    const formData = new FormData();
    for (const key in msgData) {
      if (msgData.hasOwnProperty(key) && key !== "path") {
        let data = msgData[key];
        if (Array.isArray(data)) data = JSON.stringify(data);
        formData.append(key, data);
      }
    }
    return axios.post(botServerUrl + botFullPath + msgData.route, formData, {
      headers: formData.getHeaders(),
    });
  } else {
    return axios.post(botServerUrl + botFullPath + msgData.route, msgData);
  }
}

exports.send = send;
