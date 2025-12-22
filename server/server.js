const express = require('express');
const app = express();
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.route');
const messageRoutes = require('./routes/message.route.js');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
dotenv.config();

const PORT = process.env.PORT || 3000; 

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRoutes)
app.use('/api/messages', messageRoutes);
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});