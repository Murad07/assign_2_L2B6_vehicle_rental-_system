import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {

    try {
        // Call the booking service to create a booking
        const result = await bookingService.createBooking(req.body);

        if (result.error) {
            return res.status(400).json({
                success: false,
                message: 'Booking creation failed',
                errors: result.error
            });
        }

        console.log('Booking created:', result.data);

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