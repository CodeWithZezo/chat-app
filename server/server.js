const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
app.use(cors(
  {origin: process.env.FRONTEND_URL, credentials: true}
));

const authRoutes = require('./routes/auth.route');
const messageRoutes = require('./routes/message.route.js');
const userRoutes = require('./routes/user.route.js');

const connectDB = require('./config/db');
dotenv.config();

const PORT = process.env.PORT || 3000; 

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRoutes)
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

connectDB();
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});