import { Request, Response } from "express";
import { userService } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userService.getAllUsers();
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            errors: err.message,
        });
    }
}

const updateUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const requesterUser = req.user as { id: string, role: string };

    const isOwner = String(requesterUser.id) as string === userId;
    const isAdmin = requesterUser.role === 'admin';

    // console.log('Requester User:', typeof (userId), typeof (requesterUser.id));

    if (!isOwner && !isAdmin) {
        return res.status(403).json({
            success: false,
            message: 'Forbidden: You do not have access to this resource',
            error: 'Forbidden'
        });
    }

    try {
        const result = await userService.updateUser(userId as string, req.body);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User update failed',
                errors: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: result.rows[0]
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            errors: err.message,
        });
    }
}

const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        const checkActiveBookings = await userService.getActiveBookingsByUserId(userId as string);

        if (checkActiveBookings.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User deletion failed',
                errors: 'User has active bookings'
            });
        }

        const result = await userService.deleteUser(userId as string);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User deletion failed',
                errors: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            errors: err.message
        });
    }
}

export const userController = {
    getAllUsers,
    updateUser,
    deleteUser
};