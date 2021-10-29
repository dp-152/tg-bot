const queue = [];
const exclude = [];

function addToQueue(messages) {
  queue.push(...messages);
}

function addToExclude(message) {
  exclude.push(message);
}

function pullN(n) {
  return queue.splice(0, n);
}

function pullExclude() {
  return exclude.splice(0, exclude.length);
}

module.exports = {
  addToQueue,
  pullN,
  addToExclude,
  pullExclude,
  get currentQueue() {
    return queue.map(el => el.name);
  },
};
