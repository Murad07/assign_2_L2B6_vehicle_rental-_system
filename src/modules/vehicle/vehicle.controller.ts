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

const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vechicleService.getAllVehicles();

        if (result.rows.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No vehicles found',
                data: []
            });
        }

        res.status(200).json({
            success: true,
            message: 'Vehicles retrieved successfully',
            data: result.rows
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve vehicles',
            errors: err.message
        });
    }
}

const getVehicleById = async (req: Request, res: Response) => {

    try {
        const result = await vechicleService.getVehicleById(req.params.vehicleId as string);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found',
                errors: 'Vehicle not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Vehicle retrieved successfully',
            data: result.rows[0]
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve vehicle',
            errors: err.message
        });
    }
}

const updateVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vechicleService.updateVehicle(req.params.vehicleId as string, req.body);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found',
                errors: 'Vehicle not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Vehicle updated successfully',
            data: result.rows[0]
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Vehicle update failed',
            errors: err.message
        });
    }
}

const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const checkActiveBookings = await vechicleService.getActiveBookingsByVehicleId(req.params.vehicleId as string);

        if (checkActiveBookings.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Vehicle deletion failed',
                errors: 'Vehicle has active bookings'
            });
        }

        const result = await vechicleService.deleteVehicle(req.params.vehicleId as string);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found',
                errors: 'Vehicle not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Vehicle deleted successfully',
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Vehicle deletion failed',
            errors: err.message
        });
    }
}

export const vehicleController = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
};