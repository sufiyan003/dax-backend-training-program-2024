
import mongoose from 'mongoose';
import express from 'express';
import { config } from 'dotenv'
import BlogRoutes from './src/app/blog/blog.routes.js'
import z from 'zod'
const app = express()
// Hello

config();

const env_validator_schema = z.object({
    MONGODB_URI: z.string().min(1, "Title is required"),
    APP_PORT: z.string().min(1, "Content is required"),
});


async function main() {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI;

    try {
        env_validator_schema.parse(process.env);
    } catch (err) {
        console.log("Error", err)
    }

    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));
    mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));
}

main();
// jhjkho

app.use(express.json());

// All Moduler Routes
app.use('/blogs', BlogRoutes);

app.use((err, req, res, next) => {
    console.log("I am in End")
    // console.error(err.stack)
    res.status(500).send({ msg: 'Something broke!', detail: err.stack });
});

app.listen(process.env.APP_PORT, () => {
    console.log(`Example app listening on port ${process.env.APP_PORT}`)
});
