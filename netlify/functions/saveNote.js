const { Pool } = require('pg');

exports.handler = async (event, context) => {
    const { content } = JSON.parse(event.body);
    
    if (!content) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Content is required' })
        };
    }
    
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    
    try {
        const client = await pool.connect();
        await client.query('INSERT INTO notes (content) VALUES ($1)', [content]);
        client.release();
        
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Database error' })
        };
    }
};