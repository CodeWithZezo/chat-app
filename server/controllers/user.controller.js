const mongoose = require("mongoose");
const User = require("../models/user.model.js");

const getUsersForSidebar = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const allUsers = await User.find({
      _id: { $ne: new mongoose.Types.ObjectId(currentUserId) }
    }).select("-password -email -createdAt -updatedAt -__v");

    res.status(200).json({
      success: true,
      data: allUsers
    });

  } catch (error) {
    console.error("Error fetching users for sidebar:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

module.exports = { getUsersForSidebar };
