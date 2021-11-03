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
