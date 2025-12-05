import { Request, Response } from "express";
import { authService } from "./auth.service";
import { error } from "console";

const registerUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'User registration failed',
                errors: 'Password must be at least 6 characters.'
            });
        }

        if (!email || email !== email.toLowerCase()) {
            return res.status(400).json({
                success: false,
                message: 'User registration failed',
                errors: 'Email must be lowercase.'
            });
        }


        const result = await authService.registerUser(req.body);

        console.log('User inserted:', result.rows[0]);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                id: result.rows[0].id,
                name: result.rows[0].name,
                email: result.rows[0].email,
                phone: result.rows[0].phone,
                role: result.rows[0].role
            }
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'User registration failed',
            errors: err.message
        });
    }

}

export const AuthController = {
    registerUser,
};