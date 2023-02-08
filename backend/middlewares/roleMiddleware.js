// Receiver Middleware
const isReceiver = (req, res, next) => {
  if (req.user.role !== "receiver") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access: Receiver only",
    });
  }
  next();
};

// Hospital Middleware
const isHospital = (req, res, next) => {
  if (req.user.role !== "hospital") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access: Hospital only",
    });
  }
  next();
};
