const dateFromPersonalId = require('birthdate-from-id')
const getAge = require('get-age')
const lookupDsf = require('./lookup-dsf')
const filterGuardian = require('./filter-guardian')
const logger = require('./logger')

module.exports = async data => {
  if (data.isUnderAge === true) {
    const dsf = await lookupDsf(data)
    if (dsf) {
      const parents = filterGuardian(dsf)
      if (parents.length > 0) {
        const parent = parents[0]
        const fnr = `${parent.FODT}${parent.PERS}`
        return {
          fnr: fnr,
          isUnderAge: getAge(dateFromPersonalId(fnr)) < 18
        }
      } else {
        logger('info', ['get-guardian', 'no parents'])
      }
    } else {
      logger('info', ['get-guardian', 'no dsf data'])
      return false
    }
  } else {
    logger('info', ['get-guardian', 'not under age', 'no guardians search'])
    return false
  }
}
