const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

//@desc Register new user
//@route POST /api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  //check user exists
  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) {
    res.status(400);
    throw new Error("Email already exist");
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ username, email, password: hashedPassword });

  if (!user) {
    throw new Error("Invalid user data");
  }

  res.status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

//@desc Login user
//@route POST /api/login
//@access Public
const authenticateUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("Please enter username and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Could not find user");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error("Incorrect password");
  }

  res.status(200).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

//@desc Get user data
//@route POST /api/users/me
//@access Private
const getUser = asyncHandler(async (req, res) => {
  const { _id, name, email } = await User.findById(req.user.id);
  res.status(200).json({ id: _id, name, email });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = { registerUser, authenticateUser, getUser };
