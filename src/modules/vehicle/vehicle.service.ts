import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;


    const result = await pool.query(
        'INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status',
        [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    );

    return result;
}

const getAllVehicles = async () => {
    const result = await pool.query('SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles');
    return result;
}

const getVehicleById = async (vehicleId: string) => {
    const result = await pool.query('SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles WHERE id = $1', [vehicleId]);
    return result;
}

const updateVehicle = async (vehicleId: string, data: {
    vehicle_name?: string,
    type?: string,
    registration_number?: string,
    daily_rent_price?: number,
    availability_status?: string
}) => {
    const columns = Object.keys(data).map(column => `${column} = $${Object.keys(data).indexOf(column) + 1}`);
    const values = Object.values(data);

    const result = await pool.query(
        `UPDATE vehicles SET ${columns.join(', ')} WHERE id = $${Object.keys(data).length + 1} RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`,
        [...values, vehicleId]
    );

    return result;
}

const deleteVehicle = async (vehicleId: string) => {
    const result = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [vehicleId]);
    return result;
}

const getActiveBookingsByVehicleId = async (vehicleId: string) => {
    const result = await pool.query(
        'SELECT * FROM bookings WHERE vehicle_id = $1 AND status = $2',
        [vehicleId, 'active']
    );
    return result;
}



export const vechicleService = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
    getActiveBookingsByVehicleId
};