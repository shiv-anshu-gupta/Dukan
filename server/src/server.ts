import 'dotenv/config';
import express from 'express';
import { connectDB } from './db';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { clerkMiddleware } from '@clerk/express';
import { authRouter } from './routes/auth/auth.routes';
import { adminProductRouter } from './routes/admin/product.routes';
import { customerProductRouter } from './routes/customer/product.routes';
import { customerAddressRouter } from './routes/customer/address.routes';

async function mainEntryFunction(){
    await connectDB();

    const app = express();

    const corsOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173").split(",").map(origin => origin.trim()).filter(Boolean);
    
    app.use(
        cors({
            origin: corsOrigins,
            credentials: true,
        })
    )

    app.use(express.json());
    app.use(morgan("dev"));

    app.use(clerkMiddleware());

    app.get("/health", (_req, res) => {
        res.send("OK");
    });
    app.use("/auth", authRouter);

    app.use("/customer", customerProductRouter);
    app.use("/customer", customerAddressRouter);
    app.use("/admin", adminProductRouter);
    app.use(notFound);
    app.use(errorHandler);

    const port = Number(process.env.PORT) || 5000;

    app.listen(port, ()=>{
        console.log(`Server is running on port ${port}`);
    })
}

mainEntryFunction().catch((err)=>{
    console.error("Failed to start server", err);
    process.exit(1);
})