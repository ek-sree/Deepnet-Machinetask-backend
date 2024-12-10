import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import { connectToDatabase } from './database/mongodb.js';
import { authRouter } from './app/router/authRoute.js';
import { adminRouter } from './app/router/adminRouter.js';
import { userRouter } from './app/router/userRouter.js';
import { limiter } from './utils/rateLimiter.js';
import helmet from 'helmet';
const app = express();
app.use(express.json());
app.use(cors({
    origin: config.cors,
    credentials: true,
}));
app.use(limiter);
app.use(helmet());
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
const startServer = async () => {
    try {
        await connectToDatabase();
        const port = config.port;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        console.error("Error during admin creation or starting server:", error);
    }
};
startServer();
