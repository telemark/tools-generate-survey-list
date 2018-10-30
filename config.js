if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

module.exports = {
  DATA_DIRECTORY_PATH: process.env.DATA_DIRECTORY_PATH || 'test/directories/data',
  DONE_DIRECTORY_PATH: process.env.DONE_DIRECTORY_PATH || 'test/directories/done',
  JOBS_DIRECTORY_PATH: process.env.JOBS_DIRECTORY_PATH || 'test/directories/jobs',
  QUEUE_DIRECTORY_PATH: process.env.QUEUE_DIRECTORY_PATH || 'test/directories/queue',
  DSF_JWT_SECRET: process.env.DSF_JWT_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  DSF_SERVICE_URL: process.env.DSF_SERVICE_URL || 'https://dsf.micro.tjeneste.win',
  KOR_JWT_SECRET: process.env.KOR_JWT_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  KOR_SERVICE_URL: process.env.KOR_SERVICE_URL || 'https://kor.tjeneste.win/personinfo'
}
