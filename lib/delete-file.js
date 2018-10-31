const { unlink } = require('fs').promises
const logger = require('./logger')

module.exports = async filePath => {
  try {
    await unlink(filePath)
    logger('info', ['delete-file', filePath, 'success'])
    return filePath
  } catch (error) {
    logger('error', ['delete-file', filePath, 'error', JSON.stringify(error)])
    throw error
  }
}
