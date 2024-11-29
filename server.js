import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './src/config/dbConnect.js';
import router from './src/Middleware/indexRoutes.js';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express'
import swagger from './Swagger.js';


// Load environment variables
dotenv.config();

// Constants
const PORT = process.env.PORT || 3003;
// const MONGOURL = process.env.MONGOURL;

// Initialize Express app
const app = express();

// Connect to MongoDB
dbConnect();

// Middleware


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Static file hosting
app.use('/upload', express.static('upload'));

// API Routes
app.use(router);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, (err) => {
    if (err) {
        console.error('Error starting server:', err);
    } else {
        console.log(`Server is running on Port ${PORT}`);
    }
});
