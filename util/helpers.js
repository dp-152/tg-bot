/**
 * Compares two arrays and returns the difference (arrA - arrB)
 *
 * @param {Array<any>} arrA - First set of items to compare
 * @param {Array<any>} arrB - Second set of items to compare
 * @returns {Array<any>} - Returns a new array with items in arrA that are not in arrB (arrA - arrB)
 */
function arrayDiff(arrA, arrB) {
  const result = [];

  for (const itemA of arrA) {
    if (!arrB.includes(itemA)) {
      result.push(itemA);
    }
  }

  return result;
}

/**
 * Escapes illegal characters on a string for use in a RegExp
 *
 * @param {string} string - String to be escaped
 * @returns {string} - Returns a string with escaped characters
 */
function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

/**
 * Flattens a file object by a given property
 *
 * @param {object} fObj - File object to be flattened
 * @param {string} [prop] - Prop to be used when flattening (defaults to "path")
 * @returns {Array<any>} - Returns an array of all the values of the given prop
 */
function flattenFileObject(fObj, prop = "path") {
  const result = [];
  if (fObj.bundleMembers) {
    for (const bMember of fObj.bundleMembers) {
      result.push(bMember[prop]);
      if (bMember.thumbFile) result.push(bMember.thumbFile[prop]);
      if (bMember.captionFile) result.push(bMember.captionFile[prop]);
    }
  }
  result.push(fObj[prop]);
  if (fObj.thumbFile) result.push(fObj.thumbFile[prop]);
  if (fObj.captionFile) result.push(fObj.captionFile[prop]);

  return result.filter(f => f);
}

module.exports = {
  arrayDiff,
  escapeRegex,
  flattenFileObject,
};
