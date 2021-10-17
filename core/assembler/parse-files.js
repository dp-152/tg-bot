const path = require("path");

const { filesPromise } = require("../fs/fetch-content");
const types = require("../models/types");

exports.parsedFilesPromise = filesPromise
  .then(files => {
    const skippedFileNames = [];
    const parsedList = [];
    files.forEach(currFile => {
      // Return if file is in skip list
      if (skippedFileNames.indexOf(currFile.name) >= 0) return;

      // Grab the extension
      currFile.ext = path.extname(currFile.name);
      // Find if file extension is known
      currFile.type = types.knownMedia.find(
        el => el.exts.indexOf(currFile.ext) >= 0
      ).type;
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
        const thumbFile = files.find(el => {
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
      if (currFile.type !== types.TYPE_MEDIA_TEXT) {
        const captionFileName = currFile.name + types.TYPE_SUFFIX_CAPTION;
        const captionFile = files.find(el => {
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
      parsedList.push(currFile);
    });
    return parsedList;
  })
  .catch(err => {
    console.log(err);
    debugger;
  });
