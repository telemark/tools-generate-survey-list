(async () => {
  const csv = require('csvtojson')
  const dateFromPersonalId = require('birthdate-from-id')
  const getAge = require('get-age')
  const uuid = require('uuid-random')
  const saveFile = require('../lib/save-file')
  const { DATA_DIRECTORY_PATH, QUEUE_DIRECTORY_PATH } = require('../config')
  const logger = require('../lib/logger')
  const dataFilePath = `${DATA_DIRECTORY_PATH}/data.csv`
  const dropFilePath = `${DATA_DIRECTORY_PATH}/drop.csv`
  const data = await csv().fromFile(dataFilePath)
  const drop = await csv().fromFile(dropFilePath)
  const dropIds = drop.map(item => item.fnr)
  logger('info', ['generate-queue', 'ready', 'got', data.length, 'data', dropIds.length, 'dropIds'])
  const filtered = data
    .filter(item => !dropIds.includes(item.fnr))
    .filter(item => item.PCkode === 'PC18')
  logger('info', ['generate-queue', 'got', filtered.length, 'filtered'])
  const uniques = filtered.reduce((prev, curr) => {
    if (!prev.includes(curr.fnr)) {
      prev.push(curr.fnr)
    }
    return prev
  }, [])
  logger('info', ['generate-queue', 'got', uniques.length, 'uniques'])
  const next = async () => {
    if (uniques.length > 0) {
      logger('info', ['generate-queue', uniques.length, 'to go'])
      const fnr = uniques.pop()
      const data = {
        fnr: fnr,
        isUnderAge: getAge(dateFromPersonalId(fnr)) < 18
      }
      const filePath = `${QUEUE_DIRECTORY_PATH}/${uuid()}.json`
      await saveFile({ filePath: filePath, data: data })
      await next()
    } else {
      logger('info', ['generate-queue', 'finished'])
    }
  }
  await next()
})()
