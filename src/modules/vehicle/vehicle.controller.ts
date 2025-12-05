import { Request, Response } from "express";
import { vechicleService } from "./vehicle.service";
const createVehicle = async (req: Request, res: Response) => {

    try {
        const result = await vechicleService.createVehicle(req.body);

        res.status(201).json({
            success: true,
            message: 'Vehicle created successfully',
            data: result.rows[0]
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Vehicle creation failed',
            errors: err.message
        });
    }

}

export const vehicleController = {
    createVehicle
};