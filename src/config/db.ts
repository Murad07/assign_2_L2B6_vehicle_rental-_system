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
                role VARCHAR(50) CHECK (role IN ('admin', 'customer')) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS vehicles (
                id SERIAL PRIMARY KEY,
                vehicle_name VARCHAR(100) NOT NULL,
                type VARCHAR(50) CHECK (type IN ('car', 'bike', 'van', 'SUV')),
                registration_number VARCHAR(50) UNIQUE NOT NULL,
                daily_rent_price NUMERIC(10, 2) CHECK(daily_rent_price > 0) NOT NULL,
                availability_status VARCHAR(50) CHECK (availability_status IN ('available', 'booked')) DEFAULT 'available',
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                customer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
                rent_start_date DATE NOT NULL,
                rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
                total_price NUMERIC(10, 2) CHECK(total_price > 0) NOT NULL,
                status VARCHAR(50) CHECK (status IN ('active', 'cancelled', 'returned')),
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