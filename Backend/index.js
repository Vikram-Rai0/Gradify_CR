import express from 'express'
import db from './db.js'
const app = express();
import dotenv from 'dotenv'

dotenv.config();

const PORT = process.env.PORT || 5000;
// Middleware
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.send('Hello from Express backend!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
