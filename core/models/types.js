const TYPE_MEDIA_VIDEO = "video";
const TYPE_MEDIA_IMAGE = "image";
const TYPE_MEDIA_AUDIO = "audio";
const TYPE_MEDIA_TEXT = "text";
const TYPE_MEDIA_DOC = "document";
const TYPE_MEDIA_ANIM = "animation";

const TYPE_SUFFIX_ANIM = "_animation";
const TYPE_SUFFIX_THUMB = "_thumb";
const TYPE_SUFFIX_CAPTION = "_caption";

const TYPE_EXT_MP4 = ".mp4";

const TYPE_EXT_JPG = ".jpg";
const TYPE_EXT_JPEG = ".jpeg";
const TYPE_EXT_PNG = ".png";
const TYPE_EXT_GIF = ".gif";
const TYPE_EXT_WEBP = ".webp";

const TYPE_EXT_MP3 = ".mp3";

const TYPE_EXT_TXT = ".txt";
const TYPE_EXT_MD = ".md";
const TYPE_EXT_HTM = ".htm";
const TYPE_EXT_HTML = ".html";

const knownMedias = [
  {
    type: TYPE_MEDIA_VIDEO,
    title: "MPEG-4 video file",
    exts: [TYPE_EXT_MP4],
    mime: "video/mp4",
  },
  {
    type: TYPE_MEDIA_IMAGE,
    title: "JPEG image file",
    exts: [TYPE_EXT_JPG, TYPE_EXT_JPEG],
    mime: "image/jpeg",
  },
  {
    type: TYPE_MEDIA_IMAGE,
    title: "PNG image file",
    exts: [TYPE_EXT_PNG],
    mime: "image/png",
  },
  {
    type: TYPE_MEDIA_IMAGE,
    title: "GIF image file",
    exts: [TYPE_EXT_GIF],
    mime: "image/gif",
  },
  {
    type: TYPE_MEDIA_IMAGE,
    title: "WebP image file",
    exts: [TYPE_EXT_WEBP],
    mime: "image/webp",
  },
  {
    type: TYPE_MEDIA_AUDIO,
    title: "MP3 audio file",
    exts: [TYPE_EXT_MP3],
    mime: "audio/mpeg",
  },
  {
    type: TYPE_MEDIA_TEXT,
    title: "Plain Text",
    exts: [TYPE_EXT_TXT],
  },
  {
    type: TYPE_MEDIA_TEXT,
    title: "Markdown text",
    exts: [TYPE_EXT_MD],
  },
  {
    type: TYPE_MEDIA_TEXT,
    title: "HTML text",
    exts: [TYPE_EXT_HTM, TYPE_EXT_HTML],
  },
];

module.exports = {
  TYPE_MEDIA_VIDEO,
  TYPE_MEDIA_IMAGE,
  TYPE_MEDIA_AUDIO,
  TYPE_MEDIA_TEXT,
  TYPE_MEDIA_DOC,
  TYPE_MEDIA_ANIM,
  TYPE_SUFFIX_ANIM,
  TYPE_SUFFIX_THUMB,
  TYPE_SUFFIX_CAPTION,
  TYPE_EXT_MP4,
  TYPE_EXT_JPG,
  TYPE_EXT_JPEG,
  TYPE_EXT_PNG,
  TYPE_EXT_GIF,
  TYPE_EXT_WEBP,
  TYPE_EXT_MP3,
  TYPE_EXT_TXT,
  TYPE_EXT_MD,
  TYPE_EXT_HTM,
  TYPE_EXT_HTML,
  knownMedias,
};
