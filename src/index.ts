import { AccessRoutes } from './app/rbac/access.routes';
import mongoose from 'mongoose';
import express, { Request, Response, NextFunction, Express } from 'express';
import { config } from 'dotenv';
import BlogRoutes from './app/blog/blog.routes'; // Correct import without .js extension
import * as z from 'zod';

config(); // Load environment variables

const app: Express = express();

// Environment variables validation schema
const envValidatorSchema = z.object({
    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
    APP_PORT: z.string().min(1, "APP_PORT is required"),
    PRIVATE_KEY: z.string().min(1, "PRIVATE_KEY is required"),
});

async function main() {
    try {
        // Validate environment variables
        const env = envValidatorSchema.parse(process.env);

        // Connect to MongoDB
        await mongoose.connect(env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error initializing application:', error);
        process.exit(1); // Exit the process if the connection fails
    }
}

main();

// Middleware to parse JSON requests
app.use(express.json());

// Modular Routes
app.use('/blogs', BlogRoutes);
app.use('/users', new AccessRoutes().router)

// Global Error Handling Middleware
app.use((err: any, _req: Request, _res: Response, _next: NextFunction) => {
    console.error('Error occurred:', err.stack || err.message);
    _res.status(500).json({
        message: 'Something went wrong!',
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Only expose stack trace in development
    });
});

// Start the server
const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
