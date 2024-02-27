const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please enter all the fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("user already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("failed to create new user");
  }
});

const authUser = asyncHandler(async (req, res) => {
  console.log("comming here");
  console.log("generate token ", process.env.JWT_SECRET);
  const { email, password } = req.body;
  console.log("email", email, "password ", password);
  const user = await User.findOne({ email });
  // console.log("user value ", user);
  if (user && (await user.matchingPassword(password))) {
    console.log("password is matching.");
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("invalid email or password");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keywords = req.query.search
    ? {
        $or: [
          { user: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keywords).find({
    _id: { $ne: req.user._id },
  });
  res.send(users);
});

module.exports = { registerUser, authUser, allUsers };
