import { pool } from "../../config/db";
const createBooking = async (payload: Record<string, unknown>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
    const start_date = new Date(rent_start_date as Date);
    const end_date = new Date(rent_end_date as Date);

    autoReturnBooking();

    // customer availability check
    const customer_result = await pool.query('SELECT COUNT(*) FROM users WHERE id = $1', [customer_id]);
    if (parseInt(customer_result.rows[0].count) === 0) {
        return { error: "No Customer found" };
    }

    const vehicle_result = await pool.query('SELECT COUNT(*) FROM vehicles WHERE id = $1', [vehicle_id]);
    if (parseInt(vehicle_result.rows[0].count) === 0) {
        return { error: "No Vehicle found" };
    }

    // Vehicle availability check
    const availability_result = await pool.query(
        `SELECT COUNT(*) FROM bookings 
         WHERE vehicle_id = $1 
         AND status = 'active' 
         AND NOT (rent_end_date < $2 OR rent_start_date > $3)`,
        [vehicle_id, start_date, end_date]
    );

    if (parseInt(availability_result.rows[0].count) > 0) {
        return { error: "Vehicle is not available for the selected dates" };
    }

    // total_price calculation
    const number_of_days = Math.ceil(Math.abs(end_date.getTime() - start_date.getTime()) / (1000 * 60 * 60 * 24));
    const daily_rent_price_result = await pool.query('SELECT daily_rent_price FROM vehicles WHERE id = $1', [vehicle_id]);
    const daily_rent_price = daily_rent_price_result.rows[0].daily_rent_price;
    const total_price = daily_rent_price * number_of_days;


    const update_vehicle_status = await pool.query(
        `UPDATE vehicles SET availability_status = $1 WHERE id = $2 RETURNING vehicle_name, daily_rent_price`,
        ['booked', vehicle_id]
    );

    let result = await pool.query(
        'INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status',
        [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, 'active']
    );

    const booking = result.rows[0];
    booking.rent_start_date = booking.rent_start_date.toISOString().split('T')[0];
    booking.rent_end_date = booking.rent_end_date.toISOString().split('T')[0];
    booking.vehicle = update_vehicle_status.rows[0];


    return { data: booking };
}

const getAllBookings = async (isAdmin: boolean, customer_id: string) => {
    await autoReturnBooking();

    let query = `SELECT b.id, b.customer_id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status, v.vehicle_name, v.registration_number, v.daily_rent_price, v.type, u.name, u.email 
        FROM bookings b 
        INNER JOIN vehicles v ON b.vehicle_id = v.id
        INNER JOIN users u ON b.customer_id = u.id`;

    let params = [] as any[];

    if (!isAdmin) {
        query += ` WHERE b.customer_id = $1`;
        params = [customer_id];
    }

    const result = await pool.query(query, params);

    let final_result = null;
    if (isAdmin) {
        final_result = result.rows.map((booking: any) => ({
            id: booking.id,
            customer_id: booking.customer_id,
            vehicle_id: booking.vehicle_id,
            rent_start_date: booking.rent_start_date.toISOString().split('T')[0],
            rent_end_date: booking.rent_end_date.toISOString().split('T')[0],
            total_price: booking.total_price,
            status: booking.status,
            customer: {
                name: booking.name,
                email: booking.email
            },
            vehicle: {
                vehicle_name: booking.vehicle_name,
                registration_number: booking.registration_number
            }
        }));
    } else {
        final_result = result.rows.map((booking: any) => ({
            id: booking.id,
            customer_id: booking.customer_id,
            vehicle_id: booking.vehicle_id,
            rent_start_date: booking.rent_start_date.toISOString().split('T')[0],
            rent_end_date: booking.rent_end_date.toISOString().split('T')[0],
            total_price: booking.total_price,
            status: booking.status,
            vehicle: {
                vehicle_name: booking.vehicle_name,
                registration_number: booking.registration_number,
                type: booking.type
            }
        }));
    }


    return { data: final_result };
}

const updateBooking = async (bookingId: string, data: Record<string, unknown>) => {

    let bookingUpdate = null;
    if (data.status === 'cancelled') {
        bookingUpdate = await pool.query(
            `UPDATE bookings SET status = $1 WHERE id = $2 AND rent_start_date > now() RETURNING *`,
            [data.status, bookingId]
        );
    } else {
        bookingUpdate = await pool.query(
            `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
            [data.status, bookingId]
        );
    }

    if (Number(bookingUpdate.rowCount) === 0) {
        return { message: "You can't cancel this booking", data: null };
    }

    const update_vehicle_status = await pool.query(
        `UPDATE vehicles SET availability_status = $1 WHERE id IN (
             SELECT vehicle_id FROM bookings
         ) RETURNING *`,
        ['available']
    );


    let final_result = null;
    let message = null;
    if (data.status === 'returned') {
        message = "Booking marked as returned. Vehicle is now available";
        final_result = {
            id: bookingUpdate.rows[0].id,
            customer_id: bookingUpdate.rows[0].customer_id,
            vehicle_id: bookingUpdate.rows[0].vehicle_id,
            rent_start_date: bookingUpdate.rows[0].rent_start_date.toISOString().split('T')[0],
            rent_end_date: bookingUpdate.rows[0].rent_end_date.toISOString().split('T')[0],
            total_price: bookingUpdate.rows[0].total_price,
            status: bookingUpdate.rows[0].status,
            vehicle: {
                availability_status: update_vehicle_status.rows[0].availability_status
            }
        }
    } else {
        message = "Booking cancelled successfully";

        final_result = {
            id: bookingUpdate.rows[0].id,
            customer_id: bookingUpdate.rows[0].customer_id,
            vehicle_id: bookingUpdate.rows[0].vehicle_id,
            rent_start_date: bookingUpdate.rows[0].rent_start_date.toISOString().split('T')[0],
            rent_end_date: bookingUpdate.rows[0].rent_end_date.toISOString().split('T')[0],
            total_price: bookingUpdate.rows[0].total_price,
            status: bookingUpdate.rows[0].status
        }
    }

    return { message: message, data: final_result };

}

const getBookingUser = async (bookingId: string, customerId: string) => {
    const result = await pool.query(
        `SELECT COUNT(*) FROM bookings WHERE id = $1 AND customer_id = $2`,
        [bookingId, customerId]
    );

    return result;
}

const autoReturnBooking = async () => {
    const currentDate = new Date();

    await pool.query(
        `UPDATE vehicles 
         SET availability_status = 'available' 
         WHERE id IN (
             SELECT vehicle_id FROM bookings 
             WHERE rent_end_date < $1 
             AND status = 'active'
         )`,
        [currentDate]
    );

    await pool.query(
        `UPDATE bookings 
         SET status = 'returned' 
         WHERE rent_end_date < $1 
         AND status = 'active'`,
        [currentDate]
    );
}

export const bookingService = {
    createBooking,
    getAllBookings,
    updateBooking,
    getBookingUser
};