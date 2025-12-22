const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken.js");
//signup controller
const signup = async (req, res) => {
  try {
    //firstly check the required fields
    const { username, password, fullName, email, gender } = req.body;

    if (!username || !password || !fullName || !email || !gender) {
      return res.status(400).json({
        sucess: false,
        message: "All fields are required.",
      });
    }

    //check if the user already exists with the same username or email
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(409).json({
        sucess: false,
        message: "Username or email already exists.",
      });
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create profile picture based on gender and username
    const profilePic =
      gender === "male"
        ? `https://avatar.iran.liara.run/public/boy?username=${username}`
        : `https://avatar.iran.liara.run/public/girl?username=${username}`;

    //create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      fullName,
      email,
      gender,
      profilePic,
    });

    //save the user and generate token
    if (newUser) {
      //save the user to the database
      await newUser.save();

      const token = generateToken(newUser, res);

      res.status(201).json({
        message: "User registered successfully.",
        sucess: true,
        user: {
          _id: newUser._id,
          username: newUser.username,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        },
      });
    } else {
      return res.status(400).json({ 
        sucess: false,
        message: "Invalid user data." });
    }


  } catch (error) {
    console.error("Error in signup controller:", error);
    res.status(500).json({ 
      sucess: false,
      message: "internal Server error." });
  }
};

const login = async (req, res) => {
  res.send("Login endpoint");
};

const logout = async (req, res) => {
  res.send("Logout endpoint");
};

module.exports = {
  signup,
  login,
  logout,
};
