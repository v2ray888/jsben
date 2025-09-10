const { Pool } = require('pg');

exports.handler = async (event, context) => {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM notes ORDER BY created_at DESC');
        client.release();
        
        return {
            statusCode: 200,
            body: JSON.stringify(result.rows)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Database error' })
        };
    }
};