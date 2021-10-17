const axios = require("axios").default;
const FormData = require("form-data");

const { options } = require("../../util/config");
const botServerUrl = options.APIServer;
const botFullPath = `/bot${options.botAPIKey}`;

/**
 * @typedef {"MarkdownV2" | "HTML"} ParseMode
 * @typedef {import('fs').ReadStream} FsReadStream
 * @typedef {import('../models/entity.js').MessageEntity} MessageEntity
 * @typedef {import('../models/input.js').InputMedia} InputMedia
 */

/**
 * Performs a send request to the API based on the data input
 * @param {TgChatModel} data - TgModel data object to be sent
 * @param {string} route - API route to send the request to
 * @param {boolean} isReadStream - True if the attachment in the data object is a readStream
 * @return {Promise} HTTP request promise
 */
function send(data, route, isReadStream = false) {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (data[key] == null) delete data[key];
    }
  }

  if (isReadStream) {
    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }
    return axios.post(botServerUrl + botFullPath + route, formData, {
      headers: formData.getHeaders(),
    });
  } else {
    return axios.post(botServerUrl + botFullPath + route, data);
  }
}

/**
 * Sends a text message
 * @param {(string|number)} chatID - Unique identifier for the target chat or username of the target channel (in the format [at]channelusername)
 * @param {string} text - Text of the message to be sent, 1-4096 characters after entities parsing
 * @param {ParseMode} [parseMode] - (Optional) Mode for parsing entities in the message text
 * @param {Array.<MessageEntity>} [entities] - (Optional) A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode
 * @param {boolean} [disableWebPagePreview]  - (Optional) Disables link previews for links in this message
 * @param {boolean} [disableNotification] - (Optional) Sends the message silently. Users will receive a notification with no sound.
 * @param {number} [replyToMessageID] - (Optional) If the message is a reply, ID of the original message
 * @param {boolean} [allowSendingWithoutReply] - (Optional) Pass True, if the message should be sent even if the specified replied-to message is not found
 * @param {Array} [replyMarkup] - (Optional) - Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
 * @return {Promise} Returns an HTTP request promise object
 */
function sendMessage(
  chatID,
  text,
  parseMode,
  entities,
  disableWebPagePreview,
  disableNotification,
  replyToMessageID,
  allowSendingWithoutReply,
  replyMarkup
) {
  const data = {
    chat_id: chatID,
    text: text,
    parse_mode: parseMode,
    entities: entities,
    disable_web_page_preview: disableWebPagePreview,
    disable_notification: disableNotification,
    reply_to_message_id: replyToMessageID,
    allow_sending_without_reply: allowSendingWithoutReply,
    reply_markup: replyMarkup,
  };

  const route = "/sendMessage";

  return send(data, route);
}

/**
 * Sends a picture
 * @param {(string|number)} chatID - Unique identifier for the target chat or username of the target channel (in the format [at]channelusername)
 * @param {(FsReadStream|string)} photo - Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20
 * @param {string} [caption] - (Optional) Photo caption (may also be used when resending photos by file_id), 0-1024 characters after entities parsing
 * @param {ParseMode} [parseMode] - (Optional) Mode for parsing entities in the message text
 * @param {Array.<MessageEntity>} [captionEntities] - (Optional) A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode
 * @param {boolean} [disableNotification] - (Optional) Sends the message silently. Users will receive a notification with no sound.
 * @param {number} [replyToMessageID] - (Optional) If the message is a reply, ID of the original message
 * @param {boolean} [allowSendingWithoutReply] - (Optional) Pass True, if the message should be sent even if the specified replied-to message is not found
 * @param {Array} [replyMarkup] - (Optional) - Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
 * @return {Promise} Returns an HTTP request promise object
 */
function sendPhoto(
  chatID,
  photo,
  caption,
  parseMode,
  captionEntities,
  disableNotification,
  replyToMessageID,
  allowSendingWithoutReply,
  replyMarkup
) {
  const data = {
    chat_id: chatID,
    photo: photo,
    caption: caption,
    parse_mode: parseMode,
    captionEntities: captionEntities,
    disable_notification: disableNotification,
    reply_to_message_id: replyToMessageID,
    allow_sending_without_reply: allowSendingWithoutReply,
    reply_markup: replyMarkup,
  };

  const route = "/sendPhoto";

  return send(data, route, typeof photo !== "string");
}

/**
 * Sends a document
 * @param {(string|number)} chatID - Unique identifier for the target chat or username of the target channel (in the format [at]channelusername)
 * @param {(FsReadStream|string)} document - File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data.
 * @param {(FsReadStream|string)} [thumb] - (Optional) Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>.
 * @param {string} [caption] - (Optional) Document caption (may also be used when resending documents by file_id), 0-1024 characters after entities parsing
 * @param {ParseMode} [parseMode] - (Optional) Mode for parsing entities in the message text
 * @param {Array.<MessageEntity>} [captionEntities] - (Optional) A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode
 * @param {boolean} [disableContentTypeDetection] - (Optional) Disables automatic server-side content type detection for files uploaded using multipart/form-data
 * @param {boolean} [disableNotification] - (Optional) Sends the message silently. Users will receive a notification with no sound.
 * @param {number} [replyToMessageID] - (Optional) If the message is a reply, ID of the original message
 * @param {boolean} [allowSendingWithoutReply] - (Optional) Pass True, if the message should be sent even if the specified replied-to message is not found
 * @param {Array} [replyMarkup] - (Optional) - Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
 * @return {Promise} Returns an HTTP request promise object
 */
function sendDocument(
  chatID,
  document,
  thumb,
  caption,
  parseMode,
  captionEntities,
  disableContentTypeDetection,
  disableNotification,
  replyToMessageID,
  allowSendingWithoutReply,
  replyMarkup
) {
  const data = {
    chat_id: chatID,
    document: document,
    thumb: thumb,
    caption: caption,
    parse_mode: parseMode,
    captionEntities: captionEntities,
    disable_content_type_detection: disableContentTypeDetection,
    disable_notification: disableNotification,
    reply_to_message_id: replyToMessageID,
    allow_sending_without_reply: allowSendingWithoutReply,
    reply_markup: replyMarkup,
  };

  const route = "/sendDocument";

  return send(data, route, typeof document !== "string");
}

/**
 * Sends a video
 * @param {(string|number)} chatID - Unique identifier for the target chat or username of the target channel (in the format [at]channelusername)
 * @param {(FsReadStream|string)} video - Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data.
 * @param {number} [duration] - (Optional) Duration of sent video in seconds
 * @param {number} [width] - (Optional) Video width
 * @param {number} [height] - (Optional) Video height
 * @param {(FsReadStream|string)} [thumb] - (Optional) Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>.
 * @param {string} [caption] - (Optional) Video caption (may also be used when resending videos by file_id), 0-1024 characters after entities parsing
 * @param {ParseMode} [parseMode] - (Optional) Mode for parsing entities in the message text
 * @param {Array.<MessageEntity>} [captionEntities] - (Optional) A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode
 * @param {boolean} [disableNotification] - (Optional) Sends the message silently. Users will receive a notification with no sound.
 * @param {number} [replyToMessageID] - (Optional) If the message is a reply, ID of the original message
 * @param {boolean} [allowSendingWithoutReply] - (Optional) Pass True, if the message should be sent even if the specified replied-to message is not found
 * @param {Array} [replyMarkup] - (Optional) - Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
 * @return {Promise} Returns an HTTP request promise object
 */
function sendVideo(
  chatID,
  video,
  duration,
  width,
  height,
  thumb,
  caption,
  parseMode,
  captionEntities,
  disableNotification,
  replyToMessageID,
  allowSendingWithoutReply,
  replyMarkup
) {
  const data = {
    chat_id: chatID,
    video: video,
    duration: duration,
    width: width,
    height: height,
    thumb: thumb,
    caption: caption,
    parse_mode: parseMode,
    captionEntities: captionEntities,
    disable_notification: disableNotification,
    reply_to_message_id: replyToMessageID,
    allow_sending_without_reply: allowSendingWithoutReply,
    reply_markup: replyMarkup,
  };

  const route = "/sendVideo";

  return send(data, route, typeof video !== "string");
}

/**
 * Sends an animation (gif)
 * @param {(string|number)} chatID - Unique identifier for the target chat or username of the target channel (in the format [at]channelusername)
 * @param {(FsReadStream|string)} animation - Animation to send. Pass a file_id as String to send a animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a animation from the Internet, or upload a new animation using multipart/form-data.
 * @param {number} [duration] - (Optional) Duration of sent animation in seconds
 * @param {number} [width] - (Optional) Animation width
 * @param {number} [height] - (Optional) Animation height
 * @param {(FsReadStream|string)} [thumb] - (Optional) Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>.
 * @param {string} [caption] - (Optional) Animation caption (may also be used when resending animations by file_id), 0-1024 characters after entities parsing
 * @param {ParseMode} [parseMode] - (Optional) Mode for parsing entities in the message text
 * @param {Array.<MessageEntity>} [captionEntities] - (Optional) A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode
 * @param {boolean} [disableNotification] - (Optional) Sends the message silently. Users will receive a notification with no sound.
 * @param {number} [replyToMessageID] - (Optional) If the message is a reply, ID of the original message
 * @param {boolean} [allowSendingWithoutReply] - (Optional) Pass True, if the message should be sent even if the specified replied-to message is not found
 * @param {Array} [replyMarkup] - (Optional) - Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
 * @return {Promise} Returns an HTTP request promise object
 */
function sendAnimation(
  chatID,
  animation,
  duration,
  width,
  height,
  thumb,
  caption,
  parseMode,
  captionEntities,
  disableNotification,
  replyToMessageID,
  allowSendingWithoutReply,
  replyMarkup
) {
  const data = {
    chat_id: chatID,
    animation: animation,
    duration: duration,
    width: width,
    height: height,
    thumb: thumb,
    caption: caption,
    parse_mode: parseMode,
    captionEntities: captionEntities,
    disable_notification: disableNotification,
    reply_to_message_id: replyToMessageID,
    allow_sending_without_reply: allowSendingWithoutReply,
    reply_markup: replyMarkup,
  };

  const route = "/sendAnimation";

  return send(data, route, typeof animation !== "string");
}

/**
 * Sends a group of media files (album)
 * @param {(string|number)} chatID - Unique identifier for the target chat or username of the target channel (in the format [at]channelusername)
 * @param {Array.<InputMedia>} mediaArr - A JSON-serialized array describing messages to be sent, must include 2-10 items
 * @param {boolean} disableNotification - (Optional) Sends messages silently. Users will recieve a notification with no sound.
 * @param {number} replyToMessageID - (Optional) If the messages are a reply, ID of the original message
 * @param {boolean} allowSendingWithoutReply - (Optional) Pass True if the message should be sent even if the specified replied-to message is not found
 * @return {Promise} Returns an HTTP request promise object
 */
function sendMediaGroup(
  chatID,
  mediaArr,
  disableNotification,
  replyToMessageID,
  allowSendingWithoutReply
) {
  const data = {
    chat_id: chatID,
    media: mediaArr,
    disable_notification: disableNotification,
    reply_to_message_id: replyToMessageID,
    allow_sending_without_reply: allowSendingWithoutReply,
  };

  const route = "/sendMediaGroup";

  return send(data, route);
}

module.exports = {
  sendMessage,
  sendPhoto,
  sendDocument,
  sendVideo,
  sendAnimation,
  sendMediaGroup,
};
