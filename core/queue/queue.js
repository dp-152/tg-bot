const queue = [];
const exclude = [];

let qLock = false;

function addToQueue(messages) {
  console.log(`Appending ${messages.length} messages to queue...`);
  queue.push(...messages);
  console.log(`Current queue size: ${queue.length}`);
}

function addToExclude(message) {
  console.log("Appending previous message to exclude list");
  exclude.push(message);
}

function pullTopN(n) {
  if (qLock) return false;
  qLock = true;
  console.log("Queue lock set");
  const slice = queue.slice(0, n);
  console.log(`Just sliced the queue. Gathered ${slice.length} elements`);
  return slice;
}

function deleteTopN(n) {
  console.log(`Deleting ${n} elements from the top of the queue`);
  queue.splice(0, n);
  console.log(`Current queue size: ${queue.length}`);
  qLock = false;
  console.log("Queue lock released");
}

function deleteByName(name) {
  console.log(`Deleting ${name} from queue`);
  queue.splice(queue.findIndex(msg => {
    if (msg.bundleMembers) {
      for (const bMember of msg.bundleMembers) {
        if (bMember.name === name) return true;
      }
      return false;
    }
    if (msg.name === name) return true;
    if (msg.thumbFile === name) return true;
    if (msg.captionFile === name) return true;
    return false;
  }), 1);
}

function pullExclude() {
  console.log("Pulling excluded files for removal");
  return exclude.splice(0, exclude.length);
}

function getQueueFiles() {
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
  pullTopN,
  deleteTopN,
  deleteByName,
  addToExclude,
  pullExclude,
  getQueueFiles,
};
