const queue = [];
const exclude = [];

function addToQueue(messages) {
  console.log(`Appending ${messages.length} messages to queue...`);
  queue.push(...messages);
  console.log(`Current queue size: ${queue.length}`);
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
  console.log(`Current queue size: ${queue.length}`);
}

function pullExclude() {
  console.log("Pulling excluded files for removal");
  return exclude.splice(0, exclude.length);
}

function getNamesInQueue() {
  const names = [];

  // Grab name for message file, bundle members,
  // thumb and caption files
  for (const msg of queue) {
    if (msg.bundleMembers) {
      for (const bMember of msg.bundleMembers) {
        names.push(bMember.name);
        if (bMember.thumbFile) names.push(bMember.thumbFile.name);
        if (bMember.captionFile) names.push(bMember.captionFile);
      }
      continue;
    }

    names.push(msg.name);
    if (msg.thumbFile) names.push(msg.thumbFile);
    if (msg.captionFile) names.push(msg.captionFile);
  }
  return names;
}

module.exports = {
  addToQueue,
  pullN,
  deleteN,
  addToExclude,
  pullExclude,
  getNamesInQueue,
};
