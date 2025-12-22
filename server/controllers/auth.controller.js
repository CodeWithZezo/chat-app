const User =require( "../models/user.model.js");
const bcrypt = require("bcryptjs");

 const signup = async (req, res) => {
  try {
    const { username, password, fullName, email, gender } = req.body;

    if (!username || !password || !fullName || !email || !gender) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username or email already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profilePic =
      gender === "male"
        ? `https://avatar.iran.liara.run/public/boy?username=${username}`
        : `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      username,
      password: hashedPassword,
      fullName,
      email,
      gender,
      profilePic,
    });

    if(newUser){
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data." });
    }
    
  } catch (error) {
    console.error("Error in signup controller:", error);
    res.status(500).json({ message: "Server error." });
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