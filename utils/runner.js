const sleep = require('then-sleep')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const getQueueCount = require('../lib/get-queue-count')
const logger = require('../lib/logger')

async function checkQueue () {
  const queueCount = await getQueueCount()
  if (queueCount > 0) {
    logger('info', ['runner', 'got', queueCount, 'jobs left'])
    await sleep(10000)
    const cmd = `node index.js`
    const { stdout, stderr } = await exec(cmd)
    console.log(stdout)
    console.error(stderr)
    await checkQueue()
  } else {
    logger('info', ['runner', 'all done'])
    process.exit(0)
  }
}

checkQueue()
