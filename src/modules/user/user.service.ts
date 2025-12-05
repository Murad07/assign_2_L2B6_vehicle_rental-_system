import { pool } from "../../config/db";

const getAllUsers = async () => {
    const result = await pool.query('SELECT id, name, email, phone, role FROM users');
    return result;
}

const updateUser = async (userId: string, data: {
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

const deleteUser = async (userId: string) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
    return result;
}

const getActiveBookingsByUserId = async (userId: string) => {
    const result = await pool.query(
        'SELECT * FROM bookings WHERE customer_id = $1 AND status = $2',
        [userId, 'active']
    );
    return result;
}

export const userService = {
    getAllUsers,
    updateUser,
    deleteUser,
    getActiveBookingsByUserId
};