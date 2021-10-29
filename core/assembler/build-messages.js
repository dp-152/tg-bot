const fs = require("fs/promises");

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
 * Escapes illegal characters in MarkdownV2 text
 * @param {string} contents - MarkdownV2 text
 * @return {string} Input string with illegal characters escaped
 */
function mdV2Escape(contents) {
  return contents.replace(/([^\\])(>|#|\+|-|=|\||{|}|\.|!)/g, "$1\\$2");
}

/**
 * Transforms a parsed list of files into a queue of messages
 * @param {Promise} parsedFileList - A parsed file list containing file types
 * @return {Promise} List of messages ready to be sent
 */
async function createMessages(parsedFileList) {
  const msgList = [];
  for (const file of parsedFileList) {
    // Final object that will be pushed into the queue
    let messageObj;

    // TODO: Implement parsing of entities for plaintext files
    switch (file.type) {
      // Build object for text message
      case types.TYPE_MEDIA_TEXT: {
        let messageContent = (await fs.readFile(file.path)).toString();
        const parseMode = getParseMode(file);
        if (parseMode === "MarkdownV2") {
          messageContent = mdV2Escape(messageContent);
        }
        messageObj = new models.TgChatSendMessageModel(
          options.targetChatID,
          messageContent,
          parseMode
        );
        break;
      }

      // Build object for image file
      case types.TYPE_MEDIA_IMAGE: {
        let parseMode;
        let messageContent;
        if (file.captionFile) {
          parseMode = getParseMode(file.captionFile);
          messageContent = (
            await fs.readFile(file.captionFile.path)
          ).toString();
          if (parseMode === "MarkdownV2") {
            messageContent = mdV2Escape(messageContent);
          }
        }
        messageObj = new models.TgChatSendPhotoModel(
          options.targetChatID,
          `file://${file.path}`,
          file.captionFile ? messageContent : null,
          parseMode
        );
        break;
      }
      // Build object for document file
      case types.TYPE_MEDIA_DOC: {
        let parseMode;
        let messageContent;
        if (file.captionFile) {
          parseMode = getParseMode(file.captionFile);
          messageContent = (
            await fs.readFile(file.captionFile.path)
          ).toString();
          if (parseMode === "MarkdownV2") {
            messageContent = mdV2Escape(messageContent);
          }
        }
        messageObj = new models.TgChatSendDocumentModel(
          options.targetChatID,
          `file://${file.path}`,
          file.thumbFile ? `file://${file.thumbFile.path}` : null,
          file.captionFile ? messageContent : null,
          parseMode
        );
        break;
      }

      // Build object for video file
      case types.TYPE_MEDIA_VIDEO: {
        let parseMode;
        let messageContent;
        if (file.captionFile) {
          parseMode = getParseMode(file.captionFile);
          messageContent = (
            await fs.readFile(file.captionFile.path)
          ).toString();
          if (parseMode === "MarkdownV2") {
            messageContent = mdV2Escape(messageContent);
          }
        }
        messageObj = new models.TgChatSendVideoModel(
          options.targetChatID,
          `file://${file.path}`,
          null,
          null,
          null,
          file.thumbFile ? `file://${file.thumbFile.path}` : null,
          file.captionFile ? messageContent : null,
          parseMode
        );
        break;
      }

      // Build object for animation file
      case types.TYPE_MEDIA_ANIM: {
        let parseMode;
        let messageContent;
        if (file.captionFile) {
          parseMode = getParseMode(file.captionFile);
          messageContent = (
            await fs.readFile(file.captionFile.path)
          ).toString();
          if (parseMode === "MarkdownV2") {
            messageContent = mdV2Escape(messageContent);
          }
        }
        messageObj = new models.TgChatSendAnimationModel(
          options.targetChatID,
          `file://${file.path}`,
          null,
          null,
          null,
          file.thumbFile ? `file://${file.thumbFile.path}` : null,
          file.captionFile ? messageContent : null,
          parseMode
        );
        break;
      }
    }
    // Append message object to file object
    const fileObj = { ...file, data: messageObj };
    // Push message to send queue
    msgList.push(fileObj);
  }
  return msgList;
}

module.exports = {
  createMessages,
};
