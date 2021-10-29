const queue = [];

function addToQueue(...messages) {
  queue.push(...messages);
}

function pullN(n) {
  return queue.splice(0, n);
}

module.exports = {
  addToQueue,
  pullN,
};
