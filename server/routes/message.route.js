const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/message.controller');
const protectRoute = require('../middlewares/protectRoute.js');

router.post("/send/:id",protectRoute, sendMessage);
router.get("/get/:id", getMessages);

module.exports = router;