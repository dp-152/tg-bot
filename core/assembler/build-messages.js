const fs = require("fs");

const models = require("../../tg/models/chat");
const inputFiles = require("../../tg/models/input");
const types = require("../models/types");

const { options } = require("../../util/config");

/**
 * Detects the proper parse mode for a text file
 *
 * @param {object} file - A file object containing a text file with parsed metadata
 * @returns {string|null} - A string containing the proper parse mode for the file. Returns null if file object is empty or no parse mode is found for the file type.
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
 *
 * @param {string} contents - MarkdownV2 text
 * @returns {string} Input string with illegal characters escaped
 */
function mdV2Escape(contents) {
  // @TODO: Improve recognition and escaping of illegal characters
  // (context-aware matching)
  return contents.replace(/([^\\])(>|#|\+|-|=|\||{|}|\.|!)/g, "$1\\$2");
}

/**
 * Transforms a parsed list of files into a list of ready-to-send messages
 *
 * @param {Promise} parsedFileList - A parsed file list containing file types
 * @returns {Promise} List of messages ready to be sent
 */
async function createMessages(parsedFileList) {
  const msgList = [];
  const bundleList = [];
  for (const file of parsedFileList) {
    // ===========================================================
    //                       *** SEGMENT 1 ***
    // ===========================================================
    // Initialization

    // Final object that will be pushed into the queue
    let msgObj;

    // Set defaults for bundle selection
    let isBundleMember = false;
    let isBundleHead = false;

    // Parse and content for text (message, caption)
    let parseMode;
    let messageContent;

    // Data that will be used as args to initialize the message object
    let msgData;

    // ===========================================================
    //                      *** SEGMENT 2 ***
    // ===========================================================
    // Initial checks

    // Check if file is part of a bundle
    // RegEX matches the pattern <filename>{<zeroidx>}.<ext>
    // Elects head based on base name plus index to the tenths place
    // by separating into capture groups
    const matchBundle = file.name.match(
      /^(.*)\{([0-9]*)([0-9])\}\.[a-zA-Z0-9]+/,
    );

    // If file is part of a bundle (RegEx matched), set flags accordingly
    if (matchBundle) {
      // Always a bundle member if the file matches the pattern
      isBundleMember = true;
      // Set bundle head here, unset later if bundleName already exists
      isBundleHead = true;
      // Define head name by base name and tenths of index (match groups 1 and 2)
      file.bundleName = matchBundle[1] + "_" + matchBundle[2];
      // Member index set by last index digit (match group 3)
      file.bundleMemberIndex = +matchBundle[3];
      for (const [index, bundle] of bundleList.entries()) {
        // Check if bundle already exists, otherwise create new bundle
        if (bundle.bundleName === file.bundleName) {
          // Unset bundle head
          isBundleHead = false;
          // Set bundle group as index of bundle in bundleList array
          // This is used later for easy access to append data to the
          // existing bundle
          file.bundleGroup = index;
          break;
        }
      }
      // If bundleHead was not unset, create bundleMembers array
      // inside current file object to append later members
      if (isBundleHead) file.bundleMembers = [];
    }

    // Check whether the current file has a caption.
    // If so, find the parse mode for the caption and get its contents
    if (file.captionFile) {
      parseMode = getParseMode(file.captionFile);
      messageContent = (
        await fs.promises.readFile(file.captionFile.path)
      ).toString();
      if (parseMode === "MarkdownV2") {
        messageContent = mdV2Escape(messageContent);
      }
    }

    // Check whether files should be loaded locally (as a ReadStream)
    // or sent to the API as a file URL, then set msgData accordingly
    if (options.handleFiles === "remote") {
      msgData = [
        `file://${file.path}`,
        file.thumbFile ? `file://${file.thumbFile.path}` : null,
        file.captionFile ? messageContent : null,
        parseMode,
      ];
    } else if (options.handleFiles === "local") {
      msgData = [
        `attach://${file.name}`,
        file.thumbFile && `attach://${file.thumbFile.path}`,
        file.captionFile && messageContent,
        parseMode,
      ];
    }

    // ===========================================================
    //                      *** SEGMENT 3 ***
    // ===========================================================
    // Define and build message per type

    // Switch will use the media type defined when the file was initially parsed
    switch (file.type) {
      // Build object for text message
      case types.TYPE_MEDIA_TEXT: {
        // Building a text message requires only gathering the text file contents
        // and parsing them accordingly
        let messageContent = (await fs.promises.readFile(file.path)).toString();
        const parseMode = getParseMode(file);
        if (parseMode === "MarkdownV2") {
          messageContent = mdV2Escape(messageContent);
        }
        msgObj = new models.TgChatSendMessageModel(
          options.targetChatID,
          messageContent,
          parseMode,
        );
        break;
      }

      // Build object for image file
      case types.TYPE_MEDIA_IMAGE: {
        // Default msgData object includes a thumb file for a second argument.
        // Image type does not accept a thumbnail, so second element is removed.
        // All other arguments are currently unused
        msgData.splice(1, 1);
        // If current file is bundle head, create a new SendMediaGroup as msgObj
        // msgData is added as part of the media array
        if (isBundleHead) {
          msgObj = new models.TgChatSendMediaGroupModel(
            options.targetChatID,
            // Push the member index to the input media object for sorting
            [
              new inputFiles.InputMediaPhoto(
                file.bundleMemberIndex,
                ...msgData,
              ),
            ],
          );
          // If current file is a bundle member, append msgData to bundle head's media array
        } else if (isBundleMember) {
          bundleList[file.bundleGroup].data.media.push(
            new inputFiles.InputMediaPhoto(file.bundleMemberIndex, ...msgData),
          );
          // If file is not part of a bundle, build the corresponding object from msgData
        } else {
          msgObj = new models.TgChatSendPhotoModel(
            options.targetChatID,
            ...msgData,
          );
        }
        break;
      }

      // Build object for audio file
      case types.TYPE_MEDIA_AUDIO: {
        // Audio takes the extra, non default parameters "duration",
        // "performer" and "title", which are currently unused
        if (isBundleHead) {
          // Create full object for bundle head
          msgObj = new models.TgChatSendMediaGroupModel(options.targetChatID, [
            new inputFiles.InputMediaAudio(file.bundleMemberIndex, ...msgData),
          ]);
        } else if (isBundleMember) {
          // Append to existing bundle object when bundle member
          bundleList[file.bundleGroup].data.media.push(
            new inputFiles.InputMediaAudio(file.bundleMemberIndex, ...msgData),
          );
        } else {
          // Create regular object when not in a bundle
          msgObj = new models.TgChatSendAudioModel(
            options.targetChatID,
            ...msgData,
          );
        }
        break;
      }

      // Build object for document file
      case types.TYPE_MEDIA_DOC: {
        if (isBundleHead) {
          msgObj = new models.TgChatSendMediaGroupModel(options.targetChatID, [
            new inputFiles.InputMediaDocument(
              file.bundleMemberIndex,
              ...msgData,
            ),
          ]);
        } else if (isBundleMember) {
          bundleList[file.bundleGroup].data.media.push(
            new inputFiles.InputMediaDocument(
              file.bundleMemberIndex,
              ...msgData,
            ),
          );
        } else {
          msgObj = new models.TgChatSendDocumentModel(
            options.targetChatID,
            ...msgData,
          );
        }
        break;
      }

      // Build object for video file
      case types.TYPE_MEDIA_VIDEO: {
        if (isBundleHead) {
          msgObj = new models.TgChatSendMediaGroupModel(options.targetChatID, [
            new inputFiles.InputMediaVideo(file.bundleMemberIndex, ...msgData),
          ]);
        } else if (isBundleMember) {
          bundleList[file.bundleGroup].data.media.push(
            new inputFiles.InputMediaVideo(file.bundleMemberIndex, ...msgData),
          );
        } else {
          msgObj = new models.TgChatSendVideoModel(
            options.targetChatID,
            ...msgData,
          );
        }
        break;
      }

      // Build object for animation file
      case types.TYPE_MEDIA_ANIM: {
        if (isBundleHead) {
          msgObj = new models.TgChatSendMediaGroupModel(options.targetChatID, [
            new inputFiles.InputMediaAnimation(
              file.bundleMemberIndex,
              ...msgData,
            ),
          ]);
        } else if (isBundleMember) {
          bundleList[file.bundleGroup].data.media.push(
            new inputFiles.InputMediaAnimation(
              file.bundleMemberIndex,
              ...msgData,
            ),
          );
        } else {
          msgObj = new models.TgChatSendAnimationModel(
            options.targetChatID,
            ...msgData,
          );
        }

        break;
      }
    }

    // ===========================================================
    //                      *** SEGMENT 4 ***
    // ===========================================================
    // Appending extra data and pushing object

    if (isBundleMember && !isBundleHead) {
      // If handling files locally, create a key in the root message object
      // with the same name as the file, and point it to a read stream
      // of the file itself:
      // { "filename.jpg": ReadStream("path/to/filename.jpg")}
      // This applies to both the main media file, bundle media and thumbnails
      if (options.handleFiles === "local") {
        bundleList[file.bundleGroup].data[file.name] = fs.createReadStream(
          file.path,
        );
        if (file.thumbFile) {
          bundleList[file.bundleGroup][file.thumbFile.name] =
            fs.createReadStream(file.thumbfile.path);
        }
      }
      // If bundle member, append self to bundle head object
      bundleList[file.bundleGroup].bundleMembers.push({ ...file });
    } else {
      if (options.handleFiles === "local") {
        msgObj[file.name] = fs.createReadStream(file.path);
        if (file.thumbFile) {
          msgObj[file.thumbFile.name] = fs.createReadStream(
            file.thumbFile.path,
          );
        }
      }
      // Append message object to file object
      file.data = msgObj;
      // Push full file object to send queue
      msgList.push(file);
      // If file is bundle head, push the same object to bundleList
      // Every insertion to the object on the bundleList array will
      // reflect in the same object in the msgList array
      if (isBundleHead) {
        file.bundleMembers.push(file);
        bundleList.push(file);
      }
    }
  }

  // After building all file object, sort each bundle's media
  // array based on its member index value (mediaIdx)
  for (const msg of bundleList) {
    msg.data.media.sort((a, b) => a.mediaIdx - b.mediaIdx);
  }
  return msgList;
}

module.exports = {
  createMessages,
};
