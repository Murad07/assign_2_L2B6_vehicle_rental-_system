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

const updateBooking = async (req: Request, res: Response) => {
    try {
        const requesterUser = req.user as { id: string, role: string };
        const isAdmin = requesterUser.role === 'admin';

        // console.log('Requester User:', requesterUser.role, req.body.status);
        // Customer not allowed to mark as returned
        if (!isAdmin && req.body.status === 'returned') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: You do not have access to mark as returned',
                error: 'Forbidden'
            });
        }

        // one user not allowed to cancel other user booking
        if (req.body.status === 'cancelled') {
            const bookingUser = await bookingService.getBookingUser(req.params.bookingId as string, requesterUser.id as string);

            if (Number(bookingUser.rows[0].count) === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: You do not have access to cancel this booking',
                    error: 'Forbidden'
                });
            }
        }

        // final update
        const result = await bookingService.updateBooking(req.params.bookingId as string, req.body);

        if (result.data === null) {
            return res.status(400).json({
                success: false,
                message: result.message,
                errors: 'Booking update failed'
            });
        }

        res.status(200).json({
            success: true,
            message: result.message,
            data: result.data
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Booking update failed',
            errors: err.message
        });
    }
}

export const bookingController = {
    createBooking,
    getAllBookings,
    updateBooking
};