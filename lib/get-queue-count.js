const { readdir } = require('fs').promises
const { QUEUE_DIRECTORY_PATH } = require('../config')

module.exports = async () => {
  const allFiles = await readdir(QUEUE_DIRECTORY_PATH)
  const files = allFiles.filter(file => file.includes('.json'))
  return files.length
}
