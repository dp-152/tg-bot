/**
 * @typedef {"MarkdownV2" | "HTML"} ParseMode
 * @typedef {import('fs').ReadStream} FsReadStream
 * @typedef { TgChatSendMessageModel | TgChatSendPhotoModel | TgChatSendDocumentModel | TgChatSendVideoModel | TgChatSendAnimationModel | TgChatSendMediaGroupModel } TgChatModel
 * @typedef {import('../models/entity.js').MessageEntity} MessageEntity
 * @typedef {import('../models/input.js').InputMedia} InputMedia
 */

/**
 * Base class for chat interface
 */
class TgChatModel {
  /**
   *
   * @param {(string|number)} chatID - Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   */
  constructor(chatID) {
    this.chat_id = chatID;
  }
}

/**
 * Base class for send interfaces
 * @extends TgChatModel
 */
class TgChatSendModel extends TgChatModel {
  /**
   *
   * @param {(string|number)} chatID - Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param {string} text - Text of the message to be sent, 1-4096 characters after entities parsing
   * @param {ParseMode} [parseMode] - (Optional) Mode for parsing entities in the message text
   * @param {Array<MessageEntity>} [entities] - (Optional) A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode
   * @param {boolean} [disableWebPagePreview]  - (Optional) Disables link previews for links in this message
   * @param {boolean} [disableNotification] - (Optional) Sends the message silently. Users will receive a notification with no sound.
   * @param {number} [replyToMessageID] - (Optional) If the message is a reply, ID of the original message
   * @param {boolean} [allowSendingWithoutReply] - (Optional) Pass True, if the message should be sent even if the specified replied-to message is not found
   * @param {Array} [replyMarkup] - (Optional) - Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   */
  constructor(
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
    super(chatID);
    if (text != null) this.text = text;
    if (parseMode != null) this.parse_mode = parseMode;
    if (entities != null) this.entities = entities;
    if (disableWebPagePreview != null) {
      this.disable_web_page_preview = disableWebPagePreview;
    }
    if (disableNotification != null) {
      this.disable_notification = disableNotification;
    }
    if (replyToMessageID != null) this.reply_to_message_id = replyToMessageID;
    if (allowSendingWithoutReply != null) {
      this.allow_sending_without_reply = allowSendingWithoutReply;
    }
    if (replyMarkup != null) this.reply_markup = replyMarkup;
  }
}

/**
 * Sends a text message
 * @extends TgChatSendModel
 */
class TgChatSendMessageModel extends TgChatSendModel {
  /**
   *
   * @param {(string|number)} chatID - Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param {string} text - Text of the message to be sent, 1-4096 characters after entities parsing
   * @param {ParseMode} [parseMode] - (Optional) Mode for parsing entities in the message text
   * @param {Array<MessageEntity>} [entities] - (Optional) A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode
   * @param {boolean} [disableWebPagePreview]  - (Optional) Disables link previews for links in this message
   * @param {boolean} [disableNotification] - (Optional) Sends the message silently. Users will receive a notification with no sound.
   * @param {number} [replyToMessageID] - (Optional) If the message is a reply, ID of the original message
   * @param {boolean} [allowSendingWithoutReply] - (Optional) Pass True, if the message should be sent even if the specified replied-to message is not found
   * @param {Array} [replyMarkup] - (Optional) - Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   */
  constructor(
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
    super(
      chatID,
      text,
      parseMode,
      entities,
      disableWebPagePreview,
      disableNotification,
      replyToMessageID,
      allowSendingWithoutReply,
      replyMarkup
    );
    this.path = "/sendMessage";
  }
}

/**
 * Base class for sending media files
 */
class TgChatSendMediaModel extends TgChatSendModel {
  /**
   *
   * @param {(string|number)} chatID - Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param {string} [caption] - (Optional) Media caption, 0-1024 characters after entities parsing
   * @param {ParseMode} [parseMode] - (Optional) Mode for parsing entities in the message text
   * @param {Array<MessageEntity>} [captionEntities] - (Optional) A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode
   * @param {boolean} [disableNotification] - (Optional) Sends the message silently. Users will receive a notification with no sound.
   * @param {number} [replyToMessageID] - (Optional) If the message is a reply, ID of the original message
   * @param {boolean} [allowSendingWithoutReply] - (Optional) Pass True, if the message should be sent even if the specified replied-to message is not found
   * @param {Array} [replyMarkup] - (Optional) - Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   */
  constructor(
    chatID,
    caption,
    parseMode,
    captionEntities,
    disableNotification,
    replyToMessageID,
    allowSendingWithoutReply,
    replyMarkup
  ) {
    /**
     * Text -> Caption
     * Entities -> Caption Entities
     * Disable Web Page Preview -> null
     */
    super(
      chatID,
      null,
      parseMode,
      null,
      null,
      disableNotification,
      replyToMessageID,
      allowSendingWithoutReply,
      replyMarkup
    );
    if (caption != null) this.caption = caption;
    if (captionEntities != null) this.captionEntities = captionEntities;
  }
}

/**
 * Defines an object for sending a single image file
 * @extends TgChatSendMediaModel
 */
class TgChatSendPhotoModel extends TgChatSendMediaModel {
  /**
   *
   * @param {(string|number)} chatID - Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param {(FsReadStream|string)} photo - Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20
   * @param {string} [caption] - (Optional) Photo caption (may also be used when resending photos by file_id), 0-1024 characters after entities parsing
   * @param {ParseMode} [parseMode] - (Optional) Mode for parsing entities in the message text
   * @param {Array<MessageEntity>} [captionEntities] - (Optional) A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode
   * @param {boolean} [disableNotification] - (Optional) Sends the message silently. Users will receive a notification with no sound.
   * @param {number} [replyToMessageID] - (Optional) If the message is a reply, ID of the original message
   * @param {boolean} [allowSendingWithoutReply] - (Optional) Pass True, if the message should be sent even if the specified replied-to message is not found
   * @param {Array} [replyMarkup] - (Optional) - Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   */
  constructor(
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
    super(
      chatID,
      caption,
      parseMode,
      captionEntities,
      disableNotification,
      replyToMessageID,
      allowSendingWithoutReply,
      replyMarkup
    );

    this.path = "/sendPhoto";
    this.photo = photo;
  }
}
/**
 * Sends a document file
 * @extends TgChatSendMediaModel
 */
class TgChatSendDocumentModel extends TgChatSendMediaModel {
  /**
   *
   * @param {(string|number)} chatID - Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param {(FsReadStream|string)} document - File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data.
   * @param {(FsReadStream|string)} [thumb] - (Optional) Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>.
   * @param {string} [caption] - (Optional) Document caption (may also be used when resending documents by file_id), 0-1024 characters after entities parsing
   * @param {ParseMode} [parseMode] - (Optional) Mode for parsing entities in the message text
   * @param {Array<MessageEntity>} [captionEntities] - (Optional) A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode
   * @param {boolean} [disableContentTypeDetection] - (Optional) Disables automatic server-side content type detection for files uploaded using multipart/form-data
   * @param {boolean} [disableNotification] - (Optional) Sends the message silently. Users will receive a notification with no sound.
   * @param {number} [replyToMessageID] - (Optional) If the message is a reply, ID of the original message
   * @param {boolean} [allowSendingWithoutReply] - (Optional) Pass True, if the message should be sent even if the specified replied-to message is not found
   * @param {Array} [replyMarkup] - (Optional) - Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   */
  constructor(
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
    super(
      chatID,
      caption,
      parseMode,
      captionEntities,
      disableNotification,
      replyToMessageID,
      allowSendingWithoutReply,
      replyMarkup
    );
    this.path = "/sendDocument";
    this.document = document;
    if (thumb != null) this.thumb = thumb;
    if (disableContentTypeDetection != null) {
      this.disableContentTypeDetection = disableContentTypeDetection;
    }
  }
}
/**
 * Sends a video file
 * @extends TgChatSendMediaModel
 */
class TgChatSendVideoModel extends TgChatSendMediaModel {
  /**
   *
   * @param {(string|number)} chatID - Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param {(FsReadStream|string)} video - Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data.
   * @param {number} [duration] - (Optional) Duration of sent video in seconds
   * @param {number} [width] - (Optional) Video width
   * @param {number} [height] - (Optional) Video height
   * @param {(FsReadStream|string)} [thumb] - (Optional) Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>.
   * @param {string} [caption] - (Optional) Video caption (may also be used when resending videos by file_id), 0-1024 characters after entities parsing
   * @param {ParseMode} [parseMode] - (Optional) Mode for parsing entities in the message text
   * @param {Array<MessageEntity>} [captionEntities] - (Optional) A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode
   * @param {boolean} [disableNotification] - (Optional) Sends the message silently. Users will receive a notification with no sound.
   * @param {number} [replyToMessageID] - (Optional) If the message is a reply, ID of the original message
   * @param {boolean} [allowSendingWithoutReply] - (Optional) Pass True, if the message should be sent even if the specified replied-to message is not found
   * @param {Array} [replyMarkup] - (Optional) - Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   */
  constructor(
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
    super(
      chatID,
      caption,
      parseMode,
      captionEntities,
      disableNotification,
      replyToMessageID,
      allowSendingWithoutReply,
      replyMarkup
    );
    this.path = "/sendVideo";
    this.video = video;
    if (duration != null) this.duration = duration;
    if (width != null) this.width = width;
    if (height != null) this.height = height;
    if (thumb != null) this.thumb = thumb;
  }
}

/**
 * Sends an animation (GIF, MP4 without audio)
 * @extends TgChatSendVideoModel
 */
class TgChatSendAnimationModel extends TgChatSendVideoModel {
  /**
   *
   * @param {(string|number)} chatID - Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param {(FsReadStream|string)} animation - Animation to send. Pass a file_id as String to send a animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a animation from the Internet, or upload a new animation using multipart/form-data.
   * @param {number} [duration] - (Optional) Duration of sent animation in seconds
   * @param {number} [width] - (Optional) Animation width
   * @param {number} [height] - (Optional) Animation height
   * @param {(FsReadStream|string)} [thumb] - (Optional) Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>.
   * @param {string} [caption] - (Optional) Animation caption (may also be used when resending animations by file_id), 0-1024 characters after entities parsing
   * @param {ParseMode} [parseMode] - (Optional) Mode for parsing entities in the message text
   * @param {Array<MessageEntity>} [captionEntities] - (Optional) A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode
   * @param {boolean} [disableNotification] - (Optional) Sends the message silently. Users will receive a notification with no sound.
   * @param {number} [replyToMessageID] - (Optional) If the message is a reply, ID of the original message
   * @param {boolean} [allowSendingWithoutReply] - (Optional) Pass True, if the message should be sent even if the specified replied-to message is not found
   * @param {Array} [replyMarkup] - (Optional) - Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   */
  constructor(
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
    super(
      chatID,
      null,
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
    );
    delete this.video;
    this.path = "/sendAnimation";
    this.animation = animation;
  }
}
/**
 * Sends a group of media files (2-10)
 * @extends TgChatSendMediaModel
 */
class TgChatSendMediaGroupModel extends TgChatSendMediaModel {
  /**
   *
   * @param {(string|number)} chatID - Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   * @param {Array<InputMedia>} mediaArr - A JSON-serialized array describing messages to be sent, must include 2-10 items
   * @param {boolean} disableNotification - (Optional) Sends messages silently. Users will recieve a notification with no sound.
   * @param {number} replyToMessageID - (Optional) If the messages are a reply, ID of the original message
   * @param {boolean} allowSendingWithoutReply - (Optional) Pass True if the message should be sent even if the specified replied-to message is not found
   */
  constructor(
    chatID,
    mediaArr,
    disableNotification,
    replyToMessageID,
    allowSendingWithoutReply
  ) {
    super(
      chatID,
      null,
      null,
      null,
      disableNotification,
      replyToMessageID,
      allowSendingWithoutReply,
      null
    );
    this.path = "/sendMediaGroup";
    this.media = mediaArr;
  }
}

module.exports = {
  TgChatSendMessageModel,
  TgChatSendPhotoModel,
  TgChatSendDocumentModel,
  TgChatSendVideoModel,
  TgChatSendAnimationModel,
  TgChatSendMediaGroupModel,
};
