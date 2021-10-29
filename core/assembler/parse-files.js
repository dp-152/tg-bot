const types = require("../models/types");

/**
 * Parses a list of files
 * Will append file extension, media type, thumbnail (if available) and caption (if available)
 * @param {Array} fileList - Array containing file list to be parsed
 * @return {Array} - File list with parsed data
 */
function parseFileList(fileList) {
  const skippedFileNames = [];
  const parsedList = [];

  // TODO: Ignore directories
  // TODO: Read text file contents
  // TODO: Escape reserved characters inside text file
  fileList.forEach(currFile => {
    // Find if file extension is known
    currFile.type = types.knownMedias.find(
      el => el.exts.indexOf(currFile.ext) >= 0
    ).type; // will output an error if the file is unknown

    // If file is in skip list, stop processing here
    if (skippedFileNames.indexOf(currFile.name) >= 0) return;

    // Unknown extensions are passed as documents
    if (!currFile.type) currFile.type = types.TYPE_MEDIA_DOC;
    // If a video or GIF file has a "_animation" suffix,
    // it is passed as an animation instead
    else if (
      (currFile.type === types.TYPE_MEDIA_VIDEO ||
        currFile.ext === types.TYPE_EXT_GIF) &&
      currFile.name.match(
        new RegExp("^.*" + types.TYPE_SUFFIX_ANIM + "\\..*$", "g")
      )
    ) {
      currFile.type = types.TYPE_MEDIA_ANIM;
    }

    // Look for a thumb image only for document, video
    // and animation types
    if (
      [
        types.TYPE_MEDIA_DOC,
        types.TYPE_MEDIA_VIDEO,
        types.TYPE_MEDIA_ANIM,
      ].indexOf(currFile.type) >= 0
    ) {
      const thumbFileName = currFile.name + types.TYPE_SUFFIX_THUMB;
      const thumbFile = fileList.find(el => {
        return (
          el.name === thumbFileName + types.TYPE_EXT_JPG ||
          el.name === thumbFileName + types.TYPE_EXT_JPEG
        );
      });
      if (thumbFile) {
        skippedFileNames.push(thumbFile.name);
        currFile.thumbFile = thumbFile;
      }
    }

    // Look for a caption file for every non-text file
    // TODO: Condense this double iteration into one?
    if (currFile.type !== types.TYPE_MEDIA_TEXT) {
      const captionFileName = currFile.name + types.TYPE_SUFFIX_CAPTION;
      const captionFile = fileList.find(el => {
        return (
          el.name === captionFileName + types.TYPE_EXT_TXT ||
          el.name === captionFileName + types.TYPE_EXT_MD ||
          el.name === captionFileName + types.TYPE_EXT_HTM ||
          el.name === captionFileName + types.TYPE_EXT_HTML
        );
      });
      if (captionFile) {
        skippedFileNames.push(captionFile.name);
        currFile.captionFile = captionFile;
      }
    }

    // Push current file to the return list
    // Only push if file is not caption or thumb
    if (
      !currFile.name.match(/^.*\.[a-zA-Z0-9]+_(caption|thumb)\.[a-zA-Z0-9]+$/g)
    ) {
      parsedList.push(currFile);
    }
  });
  return parsedList;
}

module.exports = {
  parseFileList,
};
