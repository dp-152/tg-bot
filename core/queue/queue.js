const queue = [];
const exclude = [];

function addToQueue(messages) {
  console.log("Appending to queue...");
  console.log("\nQueue before append:");
  for (message of queue) console.log("-", message.name);
  console.log("\nData to append:");
  for (message of messages) console.log("-", message.name);
  queue.push(...messages);
  console.log("\nQueue after append:");
  for (message of queue) console.log("-", message.name);
  console.log("\n\n");
}

function addToExclude(message) {
  exclude.push(message);
}

function pullN(n) {
  console.log(`Just sliced the queue. Gathered ${n} elements`);
  console.log("\nQueue before slice:");
  for (message of queue) console.log("-", message.name);
  const sliced = queue.slice(0, n);
  console.log("\nData gathered:");
  for (message of sliced) console.log("-", message.name);
  console.log("\nQueue after slice:");
  for (message of queue) console.log("-", message.name);
  console.log("\n\n");

  return sliced;
}

function deleteN(n) {
  console.log(`Deleting ${n} elements from the top of the queue`);
  console.log("\nQueue before delete:");
  for (message of queue) console.log("-", message.name);
  queue.splice(0, n);
  console.log("\nQueue after delete:");
  for (message of queue) console.log("-", message.name);
}

function pullExclude() {
  console.log("Pulling excluded files for removal");
  console.log("\nCurrent exclude list:");
  for (file of exclude) console.log("-", file);
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
