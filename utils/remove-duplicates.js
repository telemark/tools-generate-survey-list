(async () => {
  const { readdir } = require('fs').promises
  const deleteFile = require('../lib/delete-file')
  const logger = require('../lib/logger')
  const { JOBS_DIRECTORY_PATH } = require('../config')
  const allFiles = await readdir(JOBS_DIRECTORY_PATH)
  let files = allFiles.filter(file => file.includes('.json'))
  let emails = []
  let duplicates = 0
  logger('info', ['remove-duplicates', 'got', files.length, 'files'])
  const next = async () => {
    if (files.length > 0) {
      const fileName = files.pop()
      const file = require(`../${JOBS_DIRECTORY_PATH}/${fileName}`)
      if (emails.includes(file.email)) {
        logger('info', ['remove-duplicate', 'found duplicate', file.email])
        duplicates++
        const removeFilePath = `${JOBS_DIRECTORY_PATH}/${fileName}`
        logger('info', ['remove-duplicate', 'removing', removeFilePath])
        await deleteFile(removeFilePath)
      } else {
        emails.push(file.email)
      }
      await next()
    } else {
      logger('info', ['remove-duplicates', 'emails', emails.length, 'duplicates', duplicates, 'finished'])
    }
  }
  await next()
})()
