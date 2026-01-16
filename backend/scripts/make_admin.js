const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'admin_test@example.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User ${email} not found`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();
        console.log(`User ${email} is now an admin`);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

makeAdmin();
