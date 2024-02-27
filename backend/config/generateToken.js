const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  console.log("in generate token comp.", process.env.JWT_SECRET);
  return jwt.sign({ id }, "sourav", {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
