export const logInfo = (message: string) => {
    console.log(`--- INFO: ${message} ---`);
}

export const logError = (error: string) => {
    console.error(`--- ERROR: ${error} ---`);
}

export const logDebug = (error: string) => {
    console.log(`-------------- DEBUG: ${error}`);
}