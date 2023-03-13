const logInfo = (message) => {
    console.log(`--- INFO: ${message} ---`)
}

const logError = (error) => {
    console.error(`--- ERROR: ${error} ---`)
}

export default {
    logInfo,
    logError,
};