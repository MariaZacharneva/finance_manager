const logInfo = (message) => {
    console.log(`--- INFO: ${message} ---`)
}

const logError = (error) => {
    console.error(`--- ERROR: ${error} ---`)
}

module.exports = {
    logInfo,
    logError,
};