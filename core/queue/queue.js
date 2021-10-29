const queue = [];
const exclude = [];

function addToQueue(messages) {
  console.log("Appending to queue...");
  queue.push(...messages);
}

function addToExclude(message) {
  console.log("Appending previous message to exclude list");
  exclude.push(message);
}

function pullN(n) {
  const slice = queue.slice(0, n);
  console.log(`Just sliced the queue. Gathered ${slice.length} elements`);
  return slice;
}

function deleteN(n) {
  console.log(`Deleting ${n} elements from the top of the queue`);
  queue.splice(0, n);
}

function pullExclude() {
  console.log("Pulling excluded files for removal");
  return exclude.splice(0, exclude.length);
}

function getNamesInQueue() {
  return queue.map(el => el.name);
}

module.exports = {
  addToQueue,
  pullN,
  deleteN,
  addToExclude,
  pullExclude,
  getNamesInQueue,
};
