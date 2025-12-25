const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
app.use(cors(
  {origin: process.env.FRONTEND_URL, credentials: true}
));
// Importing Routes
const authRoutes = require('./routes/auth.route');
const messageRoutes = require('./routes/message.route.js');
const userRoutes = require('./routes/user.route.js');
// Connect to Database
const connectDB = require('./config/db');
dotenv.config();
//port
const PORT = process.env.PORT || 3000; 
// Middleware
app.use(express.json());
app.use(cookieParser());
// Routes Middleware
app.use('/api/auth',authRoutes)
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

connectDB();
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});