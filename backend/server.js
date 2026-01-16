require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();


// Middleware
app.use(express.json());
app.use(cors());


// Default Route
app.get('/', (req, res) => {
    res.send('Loan Application System API is running...');
});

// Ignore favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/loans', require('./routes/loanRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
