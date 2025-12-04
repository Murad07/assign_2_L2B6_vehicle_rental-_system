import { Pool } from 'pg';
import config from '.';

export const pool = new Pool({
    connectionString: `${config.connection_str}`,
});

const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE,
                password TEXT NOT NULL CHECK (LENGTH(password) >= 6),
                phone VARCHAR(15),
                role VARCHAR(50) NOT NULL DEFAULT 'customer',
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);



        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    }
}

export default initDB;