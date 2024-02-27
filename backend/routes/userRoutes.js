const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controller/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
// router.route("/login", authUser);
router.route("/login").post(authUser);
// router.route('/').get(allUsers);

module.exports = router;
