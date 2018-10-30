(async () => {
  const uuid = require('uuid-random')
  const { readdir } = require('fs').promises
  const saveFile = require('./lib/save-file')
  const moveFile = require('./lib/move-file')
  const getKorData = require('./lib/get-kor-data')
  const { DONE_DIRECTORY_PATH, JOBS_DIRECTORY_PATH, QUEUE_DIRECTORY_PATH } = require('./config')
  const logger = require('./lib/logger')
  const getGuardian = require('./lib/get-guardian')
  const allFiles = await readdir(QUEUE_DIRECTORY_PATH)
  const files = allFiles.filter(file => file.includes('.json'))
  logger('info', ['got', files.length, 'files'])
  if (files.length > 0) {
    const fileName = files[0]
    logger('info', ['index', fileName])
    const data = require(`./${QUEUE_DIRECTORY_PATH}/${fileName}`)
    let list = [data]
    const guardian = await getGuardian(data)
    if (guardian) {
      list.push(guardian)
    }
    const next = async () => {
      if (list.length > 0) {
        logger('info', ['index', fileName])
        const recipient = list.pop()
        const korData = await getKorData([recipient.fnr])
        if (korData.length === 1) {
          const person = korData[0]
          if (person.reservasjon === 'NEI' && person.status === 'AKTIV' && person.kontaktinformasjon.epostadresse) {
            const filePath = `${JOBS_DIRECTORY_PATH}/${uuid()}.json`
            const data = {
              email: person.kontaktinformasjon.epostadresse,
              isUnderAge: recipient.isUnderAge
            }
            await saveFile({ filePath: filePath, data: data })
          } else {
            logger('info', ['index', fileName, 'no email'])
          }
        } else {
          logger('info', ['index', fileName, 'no korData'])
        }
        await next()
      } else {
        const fromPath = `${QUEUE_DIRECTORY_PATH}/${fileName}`
        const toPath = `${DONE_DIRECTORY_PATH}/${fileName}`
        await moveFile(fromPath, toPath)
        logger('info', ['index', fileName, 'finished'])
      }
    }
    await next()
  } else {
    logger('info', ['index', 'nothing to do', 'finished'])
  }
})()
