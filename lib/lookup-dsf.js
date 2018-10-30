const config = require('../config')
const getData = require('./get-data')
const logger = require('./logger')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    let dsfData = false
    logger('info', ['lookup-dsf'])
    const method = data.isUnderAge ? 'hentForeldre' : 'hentDetaljer'
    logger('info', ['lookup-dsf'])
    const options = {
      url: `${config.DSF_SERVICE_URL}/${method}`,
      secret: config.DSF_JWT_SECRET,
      payload: {
        saksref: 'avtale-survey',
        foedselsnr: data.fnr
      }
    }
    dsfData = await getData(options)

    if (dsfData !== false) {
      logger('info', ['lookup-dsf', 'success'])
      const dsf = dsfData.RESULT
      resolve(dsf)
    } else {
      logger('error', ['lookup-dsf'])
      resolve({})
    }
  })
}
