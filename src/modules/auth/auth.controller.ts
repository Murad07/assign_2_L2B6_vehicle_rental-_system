import { Request, Response } from "express";
import { authService } from "./auth.service";
import { error } from "console";

const registerUser = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    try {
        if (role === 'admin') {
            return res.status(400).json({
                success: false,
                message: 'User registration failed',
                errors: 'Admin role not allowed'
            })
        }

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

        // console.log('User inserted:', result.rows[0]);

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

const singinUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const result = await authService.signinUser(email, password);

        if (result === null) {
            return res.status(404).json({
                success: false,
                message: 'Login failed',
                errors: 'User not found'
            });
        }

        if (result === false) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed',
                errors: 'Invalid password'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Login failed',
            errors: err.message
        });
    }
}

export const AuthController = {
    registerUser,
    singinUser,
};