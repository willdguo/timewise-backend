const config = require('./utils/config')
const server = require('./app')
const logger = require('./utils/logger')

server.listen(config.PORT, () => {
    logger.info(`Server running on ${config.PORT}. Happy Coworking!`)
})

// node to ec2: https://www.youtube.com/watch?v=T-Pum2TraX4&t=572s