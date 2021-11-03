const queue = [];
const exclude = [];

let qLock = false;

/**
 * Adds new messages to the queue
 *
 * @param {Array<object>} messages - Array of messages to add to the queue
 */
function addToQueue(messages) {
  console.log(`Appending ${messages.length} messages to queue...`);
  queue.push(...messages);
  console.log(`Current queue size: ${queue.length}`);
}

/**
 * Adds a sent message to the exclude list
 *
 * @param {object} message - Message to add to the exclude list
 */
function addToExclude(message) {
  console.log("Appending previous message to exclude list");
  exclude.push(message);
}

/**
 * Fetches the top n messages from the queue
 *
 * @param {number} n - Number of messages to retrieve from the queue
 * @returns {Array<object>} - Array of messages
 */
function pullTopN(n) {
  if (qLock) return false;
  qLock = true;
  console.log("Queue lock set");
  const slice = queue.slice(0, n);
  console.log(`Just sliced the queue. Gathered ${slice.length} elements`);
  return slice;
}

/**
 * Removes the top n messages from the queue
 *
 * @param {number} n - Number of messages to remove from the queue
 */
function deleteTopN(n) {
  console.log(`Deleting ${n} elements from the top of the queue`);
  queue.splice(0, n);
  console.log(`Current queue size: ${queue.length}`);
  qLock = false;
  console.log("Queue lock released");
}

/**
 * Removes messages containing any file in nameList from the queue
 *
 * @param {Array<string>} nameList - List of file names to check and remove from the queue
 */
function deleteNames(nameList) {
  for (const name of nameList) {
    console.log(`Deleting ${name} from queue`);
    queue.splice(queue.findIndex(msg => {
      if (msg.bundleMembers) {
        for (const bMember of msg.bundleMembers) {
          if (bMember.name === name) return true;
        }
        return false;
      }
      if (msg.name === name) return true;
      if (msg.thumbFile.name === name) return true;
      if (msg.captionFile.name === name) return true;
      return false;
    }), 1);
  }
}

/**
 * Retrieves messages to be excluded from the content directory
 *
 * @returns {Array<object>} - Array of messages to be excluded
 */
function pullExclude() {
  console.log("Pulling excluded files for removal");
  return exclude.splice(0, exclude.length);
}

/**
 * Gets all file names from messages currently in the queue
 *
 * @returns {Array<string>} - List of file names currently in the queue
 */
function getQueueFiles() {
  const names = [];

  // Grab name for message file, bundle members,
  // thumb and caption files
  for (const msg of queue) {
    if (exclude.includes(msg)) continue;
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
  deleteNames,
  addToExclude,
  pullExclude,
  getQueueFiles,
};
