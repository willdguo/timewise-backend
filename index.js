const config = require('./utils/config')
const server = require('./app')
const logger = require('./utils/logger')

server.listen(config.PORT, () => {
    logger.info(`Server running on ${config.PORT}. Happy working!`)
})