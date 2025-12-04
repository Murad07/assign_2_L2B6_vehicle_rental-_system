import { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {

    try {

        const result = await userService.createUser(req.body);

        console.log('User inserted:', result.rows[0]);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: result.rows[0]
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }

}

export const userController = {
    createUser,
};