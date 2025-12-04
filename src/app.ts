import express, { Request, Response } from 'express';
import initDB from './config/db';
import { userRoutes } from './modules/user/user.routes';
import { authRoutes } from './modules/auth/auth.routes';



const app = express()

app.use(express.json());



initDB().catch(console.error);



app.get('/', (req: Request, res: Response) => {
    res.send('Hello Assignment 2 L2B6 Vehicle Rental System!')
})

app.use('/api/v1/auth', authRoutes);

// User CRUD endpoints go here
app.use('/users', userRoutes);


app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
    });
});


export default app;
