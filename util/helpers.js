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

module.exports = {
  arrayDiff,
};
