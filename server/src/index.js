const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

let counter = 0;
app.get('/api', (request, response) => {
    const message = "Message received from server: " + counter;
    counter++;
    response.json(message)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})