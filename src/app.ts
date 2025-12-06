import express, { Request, Response } from 'express';
import initDB from './config/db';
import { userRoutes } from './modules/user/user.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { vehicleRoutes } from './modules/vehicle/vehicle.routes';
import { bookingRoutes } from './modules/booking/booking.routes';



const app = express()

app.use(express.json());



initDB().catch(console.error);



app.get('/', (req: Request, res: Response) => {
    res.send('Hello Assignment 2 L2B6 Vehicle Rental System!')
})

app.use('/api/v1/auth', authRoutes);

// User CRUD endpoints go here
app.use('/api/v1/users', userRoutes);

app.use('/api/v1/vehicles', vehicleRoutes);

app.use('/api/v1/bookings', bookingRoutes);


app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
    });
});


export default app;
