const INPUT_MEDIA_PHOTO = "photo";
const INPUT_MEDIA_VIDEO = "video";
const INPUT_MEDIA_ANIMATION = "animation";
const INPUT_MEDIA_AUDIO = "audio";
const INPUT_MEDIA_DOCUMENT = "document";

/**
 * @typedef {"MarkdownV2" | "HTML"} ParseMode
 * @typedef {import('fs').ReadStream} FsReadStream
 * @typedef {InputMediaPhoto | InputMediaVideo | InputMediaAnimation | InputMediaAudio | InputMediaDocument } InputMedia
 */

/**
 * Base class for input media models
 */
class InputMedia {
  /**
   *
   * @param {string} type - Type of the result. Must be one of "photo", "video", "animation", "audio" or "document"
   * @param {number} mediaIdx - Index of the media input
   * @param {string} media  - File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name>
   * @param {string} [thumb] - (Optional) Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>.
   * @param {string} [caption] - (Optional) Caption of the media to be sent, 0-1024 characters after entities parsing
   * @param {ParseMode} [parseMode] - (Optional) Mode for parsing entities in the media caption.
   * @param {Array} [captionEntities] - (Optional) List of special entities that appear in the caption, which can be specified instead of parse_mode
   */
  constructor(
    type,
    mediaIdx,
    media,
    thumb,
    caption,
    parseMode,
    captionEntities,
  ) {
    this.type = type;
    this.mediaIdx = mediaIdx;
    this.media = media;
    if (thumb != null) this.thumb = thumb;
    if (caption != null) this.caption = caption;
    if (parseMode != null) this.parse_mode = parseMode;
    if (captionEntities != null) this.caption_entities = captionEntities;
  }
}

/**
 * Model for photo input
 * @extends InputMedia
 */
class InputMediaPhoto extends InputMedia {
  /**
   *
   * @param {number} mediaIdx - Index of the media input
   * @param {string} media  - File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name>
   * @param {string} [caption] - (Optional) Caption of the photo to be sent, 0-1024 characters after entities parsing
   * @param {ParseMode} [parseMode] - (Optional) Mode for parsing entities in the photo caption.
   * @param {Array} [captionEntities] - (Optional) List of special entities that appear in the caption, which can be specified instead of parse_mode
   */
  constructor(mediaIdx, media, caption, parseMode, captionEntities) {
    super(
      INPUT_MEDIA_PHOTO,
      mediaIdx,
      media,
      null,
      caption,
      parseMode,
      captionEntities,
    );
  }
}

/**
 * Model for video input
 * @extends InputMedia
 */
class InputMediaVideo extends InputMedia {
  /**
   *
   * @param {number} mediaIdx - Index of the media input
   * @param {string} media  - File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name>
   * @param {string} [thumb] - (Optional) Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>.
   * @param {string} [caption] - (Optional) Caption of the video to be sent, 0-1024 characters after entities parsing
   * @param {ParseMode} [parseMode] - (Optional) Mode for parsing entities in the video caption.
   * @param {Array} [captionEntities] - (Optional) List of special entities that appear in the caption, which can be specified instead of parse_mode
   * @param {number} [width] - (Optional) Video width
   * @param {number} [height] - (Optional) Video height
   * @param {number} [duration] - (Optional) Video duration
   * @param {boolean} [supportsStreaming] - (Optional) Pass True, if the uploaded video is suitable for streaming
   */
  constructor(
    mediaIdx,
    media,
    thumb,
    caption,
    parseMode,
    captionEntities,
    width,
    height,
    duration,
    supportsStreaming,
  ) {
    super(
      INPUT_MEDIA_VIDEO,
      mediaIdx,
      media,
      thumb,
      caption,
      parseMode,
      captionEntities,
    );
    if (width != null) this.width = width;
    if (height != null) this.height = height;
    if (duration != null) this.duration = duration;
    if (supportsStreaming != null) this.supports_streaming = supportsStreaming;
  }
}

/**
 * Model for animation input (GIF, MP4 without audio)
 * @extends InputMediaVideo
 */
class InputMediaAnimation extends InputMediaVideo {
  /**
   *
   * @param {number} mediaIdx - Index of the media input
   * @param {string} media  - File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name>
   * @param {string} [thumb] - (Optional) Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>.
   * @param {string} [caption] - (Optional) Caption of the animation to be sent, 0-1024 characters after entities parsing
   * @param {ParseMode} [parseMode] - (Optional) Mode for parsing entities in the animation caption.
   * @param {Array} [captionEntities] - (Optional) List of special entities that appear in the caption, which can be specified instead of parse_mode
   * @param {number} [width] - (Optional) Animation width
   * @param {number} [height] - (Optional) Animation height
   * @param {number} [duration] - (Optional) Animation duration
   */
  constructor(
    mediaIdx,
    media,
    thumb,
    caption,
    parseMode,
    captionEntities,
    width,
    height,
    duration,
  ) {
    super(
      mediaIdx,
      media,
      thumb,
      caption,
      parseMode,
      captionEntities,
      width,
      height,
      duration,
      null,
    );
    this.type = INPUT_MEDIA_ANIMATION;
  }
}

/**
 * Model for audio input
 * @Extends InputMedia
 */
class InputMediaAudio extends InputMedia {
  /**
   *
   * @param {number} mediaIdx - Index of the media input
   * @param {string} media  - File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name>
   * @param {string} [thumb] - (Optional) Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>.
   * @param {string} [caption] - (Optional) Caption of the photo to be sent, 0-1024 characters after entities parsing
   * @param {ParseMode} [parseMode] - (Optional) Mode for parsing entities in the photo caption.
   * @param {Array} [captionEntities] - (Optional) List of special entities that appear in the caption, which can be specified instead of parse_mode
   * @param {number} [duration] - (Optional) Duration of the audio in seconds
   * @param {string} [performer] - (Optional) Performer of the audio
   * @param {string} [title] - (Optional) Title of the audio
   */
  constructor(
    mediaIdx,
    media,
    thumb,
    caption,
    parseMode,
    captionEntities,
    duration,
    performer,
    title,
  ) {
    super(
      INPUT_MEDIA_AUDIO,
      mediaIdx,
      media,
      thumb,
      caption,
      parseMode,
      captionEntities,
    );
    if (duration != null) this.duration = duration;
    if (performer != null) this.performer = performer;
    if (title != null) this.title = title;
  }
}

/**
 * Model for document input
 * @extends InputMedia
 */
class InputMediaDocument extends InputMedia {
  /**
   *
   * @param {number} mediaIdx - Index of the media input
   * @param {string} media  - File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass "attach://<file_attach_name>" to upload a new one using multipart/form-data under <file_attach_name>
   * @param {string} [thumb] - (Optional) Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>.
   * @param {string} [caption] - (Optional) Caption of the document to be sent, 0-1024 characters after entities parsing
   * @param {ParseMode} [parseMode] - (Optional) Mode for parsing entities in the document caption.
   * @param {Array} [captionEntities] - (Optional) List of special entities that appear in the caption, which can be specified instead of parse_mode
   * @param {boolean} [disableContentTypeDetection] - (Optional) Disables automatic server-side content type detection for files uploaded using multipart/form-data. Always true, if the document is sent as part of an album.
   */
  constructor(
    mediaIdx,
    media,
    thumb,
    caption,
    parseMode,
    captionEntities,
    disableContentTypeDetection,
  ) {
    super(
      INPUT_MEDIA_DOCUMENT,
      mediaIdx,
      media,
      thumb,
      caption,
      parseMode,
      captionEntities,
    );
    if (disableContentTypeDetection != null) {
      this.disable_content_type_detection = disableContentTypeDetection;
    }
  }
}

module.exports = {
  InputMediaPhoto,
  InputMediaVideo,
  InputMediaAnimation,
  InputMediaAudio,
  InputMediaDocument,
};
