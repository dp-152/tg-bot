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
 * @param {TgChatModel} tgData - TgModel data object to be sent
 * @param {boolean} isReadStream - True if the attachment in the data object is a readStream
 * @return {Promise} HTTP request promise
 */
function send(tgData, isReadStream = false) {
  if (isReadStream) {
    const formData = new FormData();
    for (const key in tgData) {
      if (tgData.hasOwnProperty(key) && key !== "path") {
        formData.append(key, tgData[key]);
      }
    }
    return axios.post(botServerUrl + botFullPath + tgData.route, formData, {
      headers: formData.getHeaders(),
    });
  } else {
    return axios.post(botServerUrl + botFullPath + tgData.route, tgData);
  }
}

exports.send = send;
