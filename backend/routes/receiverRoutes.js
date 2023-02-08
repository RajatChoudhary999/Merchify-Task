const express = require("express");
const {
  registerReceiver,
  authReceiver,
  requestBloodSample,
} = require("../controllers/receiverController");

const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

// --------------------POST END POINTS-------------------------------
router.route("/").post(registerReceiver);
router.route("/login").post(authReceiver);
router.route("/request-blood-sample").post(protect, requestBloodSample);

module.exports = router;
