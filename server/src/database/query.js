const Pool = require('pg').Pool;
const logger = require('../utils/logger')
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

const getAllMessages = async () => {
    try {
        const result = await pool.query('SELECT * FROM init_table');
        return result.rows;
    } catch (err) {
        logger.logError(err.toString());
    }
}

const addMessage = async (new_text_message) => {
    try {
        const result = await pool.query('INSERT INTO init_table (text_message) VALUES ($1) RETURNING *',
            [new_text_message]);
        return result.rows[0];
    } catch (err) {
        logger.logError(err.toString());
    }
}

module.exports = {
    getAllMessages,
    addMessage,
};
