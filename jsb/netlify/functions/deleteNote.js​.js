const { Pool } = require('pg');

exports.handler = async (event, context) => {
    const { id } = JSON.parse(event.body);
    
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Note ID is required' })
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
        await client.query('DELETE FROM notes WHERE id = $1', [id]);
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