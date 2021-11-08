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

  // Splice the item from the queue only after excluding
  // This prevents both a reinsertion bug and a premature deletion bug
  queue.splice(0, 1);
}

/**
 * Fetches the top n messages from the queue
 *
 * @param {number} n - Number of messages to retrieve from the queue
 * @returns {(Generator|false)} - Returns a generator object if the queue is not locked, false otherwise
 */
function pullTopN(n) {
  if (qLock) {
    console.log("Queue is locked, cannot pull");
    return false;
  }
  return pullGenerator(n);
}

/**
 * Creates a generator for the top n messages from the queue
 *
 * @generator
 * @param {number} n - Number of messages to retrieve from the queue
 * @yields {object} - Generator containing messages
 */
function* pullGenerator(n) {
  qLock = true;
  console.log("Queue lock set");
  for (let i = 0; i < n; i++) {
    console.log("Yielding an item from the queue");
    const item = queue[0];
    if (!item) {
      console.log("Queue is empty, breaking");
      break;
    }
    yield item;
  }
  console.log("Yielding done");
  console.log(`Current queue size: ${queue.length}`);
  console.log("Queue lock released");
  qLock = false;
}

/**
 * Removes the top n messages from the queue
 *
 * @param {number} n - Number of messages to remove from the queue
 */
function deleteTopN(n) {
  return;
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
    queue.splice(
      queue.findIndex(msg => {
        if (msg.bundleMembers) {
          for (const bMember of msg.bundleMembers) {
            if (bMember.path === name) return true;
            if (bMember.thumbFile && bMember.thumbFile.path === name) {
              return true;
            }
            if (bMember.captionFile && bMember.captionFile.path === name) {
              return true;
            }
          }
          return false;
        }
        if (msg.path === name) return true;
        if (msg.thumbFile && msg.thumbFile.path === name) return true;
        if (msg.captionFile && msg.captionFile.path === name) return true;
        return false;
      }),
      1,
    );
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
        names.push(bMember.path);
        if (bMember.thumbFile) names.push(bMember.thumbFile.path);
        if (bMember.captionFile) names.push(bMember.captionFile.path);
      }
      continue;
    }

    names.push(msg.path);
    if (msg.thumbFile) names.push(msg.thumbFile.path);
    if (msg.captionFile) names.push(msg.captionFile.path);
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
