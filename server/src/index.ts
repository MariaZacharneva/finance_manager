const express = require('express')
const cors = require('cors')
const db = require('./database/query')
const logger = require('./utils/logger')
const PORT = 3001
const app = express()

app.use(cors())
app.use(express.json())

let counter = 0;

app.get('/api', (request, response) => {
    logger.logInfo(`Received request to get all: ${JSON.stringify(request.body)}`)
    db.getAllMessages().then((result) => {
        logger.logInfo(`Sending ${result.length} messages`);
        logger.logInfo(`Message example: ${JSON.stringify(result[0])}`);
        counter = result.length;
        response.status(200).json(result);
    });
})

app.post('/api/new_message', (request, response) => {
    logger.logInfo(`Received request to add new: ${JSON.stringify(request.body)}`);
    db.addMessage(request.body.text_message).then((result) => {
        logger.logInfo(`Added message: ${JSON.stringify(result)}`);
        counter++;
        response.json(result);
    });
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})