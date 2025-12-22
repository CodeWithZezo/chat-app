const express = require('express');
const app = express();
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.route');
const connectDB = require('./config/db');
dotenv.config();

const PORT = process.env.PORT || 3000; 

app.use(express.json());

app.use('/api/auth',authRoutes)

connectDB();
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});