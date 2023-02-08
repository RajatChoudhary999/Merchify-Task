const express = require("express");
const {
  registerHospital,
  authHospital,
  addBloodSamples,
  updateBloodInfo,
  removeBloodInfo,
  getAllBloodSamples,
  getHospitalBloodSamples,
  getReceiverRequests,
} = require("../controllers/hospitalController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

// --------------------GET END POINTS-------------------------------
router.route("/blood-samples-info").get(getAllBloodSamples); //Public
router.route("/hospital-blood-samples").get(protect, getHospitalBloodSamples);
router.route("/receiver-requests").get(protect, getReceiverRequests);

// --------------------POST END POINTS-------------------------------
router.route("/add-blood-info").post(protect, addBloodSamples);
router.route("/").post(registerHospital);
router.route("/login").post(authHospital);

// --------------------PUT END POINTS-------------------------------
router.route("/update-blood-info").put(protect, updateBloodInfo); //HSC
router.route("/remove-blood-info").put(protect, removeBloodInfo); //HSC

module.exports = router;
