
import mongoose from 'mongoose';
import express from 'express';
import BlogRoutes from './blog/blog.routes.js'

const app = express()

async function main() {
    // Connect to MongoDB
    const mongoURI = 'mongodb://127.0.0.1:27017/blogs';
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

app.listen(3000, () => {
    console.log(`Example app listening on port`)
});
