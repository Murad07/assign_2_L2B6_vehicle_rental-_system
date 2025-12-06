import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {

    try {
        const result = await bookingService.createBooking(req.body);

        if (result.error) {
            return res.status(400).json({
                success: false,
                message: 'Booking creation failed',
                errors: result.error
            });
        }

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: result.data
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Booking creation failed',
            errors: err.message
        });
    }

}

const getAllBookings = async (req: Request, res: Response) => {
    try {
        const requesterUser = req.user as { id: string, role: string };
        const isAdmin = requesterUser.role === 'admin';

        const success_msg = isAdmin ? 'Bookings retrieved successfully' : 'Your bookings retrieved successfully';

        const result = await bookingService.getAllBookings(isAdmin, requesterUser.id as string);
        res.status(200).json({
            success: true,
            message: success_msg,
            data: result.data
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            errors: err.message,
        });
    }
}

export const bookingController = {
    createBooking,
    getAllBookings
};