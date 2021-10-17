const axios = require("axios").default;
const FormData = require("form-data");

const { botAPIToken, botServerUrl } = require("../../util/settings");
const botFullPath = `/bot${botAPIToken}`;

/**
 * @typedef {import("../models/chat").TgChatModel} TgChatModel
 */

/**
 *
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
    return axios.post(botServerUrl + botAPIToken + tgData.path, formData, {
      headers: formData.getHeaders(),
    });
  } else {
    return axios.post(botServerUrl + botFullPath + tgData.path, tgData);
  }
}

exports.send = send;
