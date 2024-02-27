const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = async (req, res, next) => {
  let token;
  console.log("value ", req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // decode token id.
      const decode = jwt.verify(token, "sourav");
      req.user = await User.findById(decode.id).select("-password");
      next();
    } catch (err) {
      res.send(401);
      throw new Error("Not Authorization, token failed");
    }
  }
  if (!token) {
    res.send(401);
    throw new Error("Not Authorized , no token");
  }
};

module.exports = { protect };
