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

      generateToken(newUser._id, res);

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
        message: "Invalid user data.",
      });
    }
  } catch (error) {
    console.error("Error in signup controller:", error);
    res.status(500).json({
      sucess: false,
      message: "internal Server error.",
    });
  }
};

const login = async (req, res) => {
  try {
    //firstly check the required fields
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        sucess: false,
        message: "Username and password are required.",
      });
    }

    //check if the user exists
    const user = await User.findOne({ username });
    //compare the password
    const isPasswordValid = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!isPasswordValid || !user) {
      return res.status(401).json({
        sucess: false,
        message: "Invalid username or password.",
      });
    }
    //generate token
    generateToken(user._id, res);

    res.status(200).json({
      message: "Login successful.",
      sucess: true,
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Error in signup controller:", error);
    res.status(500).json({
      sucess: false,
      message: "internal Server error.",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({
      message: "Logout successful.",
      sucess: true,
    });
  } catch (error) {
    console.error("Error in logout controller:", error);
    res.status(500).json({
      sucess: false,
      message: "internal Server error.",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
        
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Error in getProfile controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
module.exports = {
  signup,
  login,
  logout,
  getProfile
};
