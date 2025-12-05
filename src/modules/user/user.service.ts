import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

const getAllUsers = async () => {
    const result = await pool.query('SELECT id, name, email, phone, role FROM users');
    return result;
}

export const userService = {
    getAllUsers
};