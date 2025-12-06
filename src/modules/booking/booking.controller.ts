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

export const bookingController = {
    createBooking
};