import { pool } from "../../config/db"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const registerUser = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload;

    const hashedPassword = await bcrypt.hash(password as string, 10);

    const result = await pool.query(
        'INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, email, hashedPassword, phone, role]
    );

    return result;
}

const signinUser = async (email: string, password: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if (result.rows.length === 0) {
        return null; // User not found
    }

    const user = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        phone: result.rows[0].phone,
        role: result.rows[0].role
    };

    const match = await bcrypt.compare(password, result.rows[0].password);

    if (!match) {
        return false; // Password is incorrect
    }


    const token = jwt.sign(
        {
            name: user.name,
            role: user.role,
            email: user.email,
            id: user.id
        },
        config.jwt_secret as string,
        {
            expiresIn: '5h'
        }
    );

    return { token, user } // Return the token and user result;

}

export const authService = {
    registerUser,
    signinUser
};

