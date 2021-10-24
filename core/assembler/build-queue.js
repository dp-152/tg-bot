const fs = require("fs");

const models = require("../../tg/models/chat");
const types = require("../models/types");

const { options } = require("../../util/config");


/**
 * Detects the proper parse mode for a text file
 * @param {Object} file - A file object containing a text file with parsed metadata
 * @return {string|null} - A string containing the proper parse mode for the file. Returns null if file object is empty or no parse mode is found for the file type.
 */
function getParseMode(file) {
  if (!file) return null;

  let textParseMode;
  if (file.ext === types.TYPE_EXT_MD) {
    textParseMode = "MarkdownV2";
  } else if (
    file.ext === types.TYPE_EXT_HTM ||
    file.ext === types.TYPE_EXT_HTML
  ) {
    textParseMode = "HTML";
  } else {
    textParseMode = null;
  }
  return textParseMode;
}


/**
 * Transforms a parsed list of files into a queue of messages
 * @param {Promise} parsedFileList - A parsed file list containing file types
 * @return {Promise} List of messages ready to be sent
 */
function createQueue(parsedFileList) {
  const queue = [];

  return parsedFileList
    .then(files => {
      files.forEach(file => {
        // Final object that will be pushed into the queue
        let messageObj;

        // TODO: Implement parsing of entities for plaintext files
        switch (file.type) {
          // Build object for text message
          case types.TYPE_MEDIA_TEXT:
            messageObj = new models.TgChatSendMessageModel(
              options.targetChatID,
              fs.readFileSync(file.path),
              getParseMode(file),
              null,
              null,
              null,
              null,
              null,
              null
            );
            break;

          // Build object for image file
          case types.TYPE_MEDIA_IMAGE:
            messageObj = new models.TgChatSendPhotoModel(
              options.targetChatID,
              `file://${file.path}`,
              file.captionFile ? `file://${file.captionFile.path}` : null,
              getParseMode(file.captionFile),
              null,
              null,
              null,
              null,
              null
            );
            break;

          // Build object for document file
          case types.TYPE_MEDIA_DOC:
            messageObj = new models.TgChatSendDocumentModel(
              options.targetChatID,
              `file://${file.path}`,
              file.thumbFile ? `file://${file.thumbFile.path}` : null,
              file.captionFile
                ? fs.readFileSync(file.captionFile.path).toString()
                : null,
              getParseMode(file.captionFile),
              null,
              null,
              null,
              null,
              null,
              null
            );
            break;

          // Build object for video file
          case types.TYPE_MEDIA_VIDEO:
            messageObj = new models.TgChatSendVideoModel(
              options.targetChatID,
              `file://${file.path}`,
              null,
              null,
              null,
              file.thumbFile ? `file://${file.thumbFile.path}` : null,
              file.captionFile
                ? fs.readFileSync(file.captionFile.path).toString()
                : null,
              getParseMode(file.captionFile),
              null,
              null,
              null,
              null,
              null
            );
            break;

          // Build object for animation file
          case types.TYPE_MEDIA_ANIM:
            messageObj = new models.TgChatSendAnimationModel(
              options.targetChatID,
              `file://${file.path}`,
              null,
              null,
              null,
              file.thumbFile ? `file://${file.thumbFile.path}` : null,
              file.captionFile
                ? fs.readFileSync(file.captionFile.path).toString()
                : null,
              getParseMode(file.captionFile),
              null,
              null,
              null,
              null,
              null
            );
            break;
        }
        // Push message to send queue
        queue.push(messageObj);
      });
    })
    .catch(err => {
      console.log(err);
      debugger;
    });
}

module.exports = {
  createQueue,
};
