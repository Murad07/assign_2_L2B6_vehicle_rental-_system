import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;


    const result = await pool.query(
        'INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status',
        [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    );

    return result;
}

const getAllVehicles = async () => {
    const result = await pool.query('SELECT id, name, email, phone, role FROM users');
    return result;
}

const updateVehicle = async (userId: string, data: {
    name?: string,
    email?: string,
    phone?: string,
    role?: string
}) => {
    const columns = Object.keys(data).map(column => `${column} = $${Object.keys(data).indexOf(column) + 1}`);
    const values = Object.values(data);

    const result = await pool.query(
        `UPDATE users SET ${columns.join(', ')} WHERE id = $${Object.keys(data).length + 1} RETURNING id, name, email, phone, role`,
        [...values, userId]
    );

    return result;
}

const deleteVehicle = async (userId: string) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
    return result;
}



export const vechicleService = {
    createVehicle,
    getAllVehicles,
    updateVehicle,
    deleteVehicle
};