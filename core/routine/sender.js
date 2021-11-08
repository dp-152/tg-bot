const { options } = require("../../util/config");
const { initFillQueue } = require("./queue-fill");
const { pullTopN, addToExclude } = require("../queue/queue");
const { send } = require("../../tg/interface/send");


/**
 * Wraps a send call to handle errors.
 *
 * @param {object} msgData - Message data to be sent.
 * @param {number} ticks - Number of attempts made up to the current call
 */
async function sendWrapper(msgData, ticks = 1) {
  if (ticks > 5) {
    console.log("Failed to send message after 5 attempts. Closing");
    const err = new Error("Failed to send message after 5 attempts. Closing");
    err.code = "ERR_TOO_MANY_ATTEMPTS";
    throw err;
  }
  let retry = false;
  try {
    await send(msgData);
  } catch (err) {
    console.log("Error sending message:", err);

    if (!err.response) {
      console.log("Server unavailable. Reason:", err.code);
      retry = true;
    } else {
      console.log("Server response:", err.response.data);
      if (err.response.status === 429) {
        retry = true;
      }
    }
  }
  if (retry) {
    console.log("Trying again in 30 seconds...");
    await new Promise(res => {
      setTimeout(res, 30 * 1000);
    });
    await sendWrapper(msgData, ++ticks);
  }
}

/**
 * @description Executes a single send job.
 */
async function sendJob() {
  let list = pullTopN(options.sendAtOnce);
  let waitCount = 0;
  while (!list) {
    console.log("Queue locked! Waiting 15 seconds");
    console.log(`My thread has waited ${waitCount} ticks for a release`);
    list = pullTopN(options.sendAtOnce);
    waitCount++;
    await new Promise(res => {
      setTimeout(res, 15000);
    });
  }
  for (const msg of list) {
    console.log(`Sending message from file ${msg.name}`);
    console.log(`- Has thumb: ${!!msg.thumbFile}`);
    console.log(`- Has caption: ${!!msg.captionFile}`);

    await sendWrapper(msg.data);
    addToExclude(msg);

    let timeout;
    if (msg.bundleName) timeout = 25;
    else timeout = 5;

    await new Promise(res => {
      setTimeout(res, timeout * 1000);
    });
  }
}

/**
 * @description Initializes the sender routine.
 */
async function initSendJob() {
  await initFillQueue();
  sendJob();
  setInterval(sendJob, options.sendEvery * 60 * 1000);
}

module.exports = {
  initSendJob,
};
