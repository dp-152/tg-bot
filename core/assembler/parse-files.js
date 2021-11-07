const types = require("../models/types");

/**
 * Sorts files by name
 *
 * @param {Array} fileList - Array containing file list to be sorted
 * @returns {Array} - Sorted file list
 */
function preSortFiles(fileList) {
  return fileList.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
}

/**
 * Parses a list of files
 * Will append info such as media type, thumbnail (if available) and caption (if available)
 *
 * @param {Array} fileList - Array containing file list to be parsed
 * @returns {Array} - File list with parsed data
 */
function parseFileList(fileList) {
  // Pre-sort files by name to ensure correct order
  fileList = preSortFiles(fileList);
  // Initialize list for final output and excluded files
  const skippedFileNames = [];
  const parsedList = [];

  fileList.forEach((currFile, idx) => {
    // Look for media type for current file
    let mediaType;

    // Bypass file type checking if file has a document suffix
    if (
      currFile.name.match(
        new RegExp("^.*" + types.TYPE_SUFFIX_DOC + "\\..*$", "g"),
      )
    ) {
      mediaType = types.TYPE_MEDIA_DOC;
    } else {
      // Get media type by matching against known media extensions
      mediaType = types.knownMedias.find(
        el => el.exts.indexOf(currFile.ext) >= 0,
      );
    }
    currFile.type = mediaType && mediaType.type;

    // If file is in skip list, stop processing here
    if (skippedFileNames.indexOf(currFile.name) !== -1) return;

    // Unknown extensions are passed as documents
    if (!currFile.type) currFile.type = types.TYPE_MEDIA_DOC;
    // If current file has a .gif extension, or is a MP4 file
    // with the "_animation" suffix, set type to animation
    else if (
      currFile.ext === types.TYPE_EXT_GIF ||
      (currFile.type === types.TYPE_MEDIA_VIDEO &&
        currFile.name.match(
          new RegExp("^.*" + types.TYPE_SUFFIX_ANIM + "\\..*$", "g"),
        ))
    ) {
      currFile.type = types.TYPE_MEDIA_ANIM;
    }

    // Look for either a caption file or a thumb file for current file
    // Create regexp to match expected file name and all possible extensions
    const thumbRegExp = new RegExp(
      currFile.name +
        types.TYPE_SUFFIX_THUMB +
        `(${types.TYPE_EXT_JPG}|` +
        `${types.TYPE_EXT_JPEG})`,
    );
    const captionRegExp = new RegExp(
      currFile.name +
        types.TYPE_SUFFIX_CAPTION +
        `(${types.TYPE_EXT_TXT}|` +
        `${types.TYPE_EXT_HTM}|` +
        `${types.TYPE_EXT_HTML}|` +
        `${types.TYPE_EXT_MD})`,
    );

    // Slice the list from current file index, including the next 4 files
    // As the file list is sorted by name, the thumb and caption files can only be
    // within the next 3 adjacent files.
    // This minimizes greatly the cost of iteration, as the search does not need to
    // go through the entire list for every file
    for (const matchFile of fileList.slice(idx, idx + 4)) {
      if (matchFile.name.match(thumbRegExp)) {
        currFile.thumbFile = matchFile;
        skippedFileNames.push(matchFile.name);
      } else if (matchFile.name.match(captionRegExp)) {
        currFile.captionFile = matchFile;
        skippedFileNames.push(matchFile.name);
      }
    }

    // Push current file to the return list
    if (
      // Only push if file is not caption or thumb
      // This check prevents thumb or caption files which may
      // appear in the file list before their root counterpart
      // from being pushed into the main list
      !currFile.name.match(
        new RegExp(
          "^.*.[a-zA-Z0-9]+" +
            `(${types.TYPE_SUFFIX_CAPTION}|${types.TYPE_SUFFIX_THUMB})` +
            ".[a-zA-Z0-9]+$",
          "g",
        ),
      )
    ) {
      parsedList.push(currFile);
    }
  });
  return parsedList;
}

module.exports = {
  parseFileList,
};
