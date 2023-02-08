const generateToken = require("../config/generateToken");
const asyncHandler = require("express-async-handler");
const Hospital = require("../Models/hospitalModel");
const BloodRequest = require("../Models/bloodRequestModel");
const Receiver = require("../Models/receiverModel");

const registerReceiver = asyncHandler(async (req, res) => {
  const { receiverName, password, bloodType } = req.body;

  if (!(receiverName && password && bloodType)) {
    res.status(400);
    throw new Error("Please Enter All the Feilds");
  }

  const receiverExists = await Receiver.findOne({ receiverName });

  if (receiverExists) {
    res.status(400);
    throw new Error("Receiver already exists");
  }

  const receiver = await Receiver.create({
    receiverName,
    password,
    bloodType,
  });

  if (receiver) {
    res.status(201).json({
      _id: receiver._id,
      name: receiver.receiverName,
      bloodType: receiver.bloodType,
    });
  } else {
    res.status(400);
    throw new Error("Failed to Create the Receiver");
  }
});

const authReceiver = asyncHandler(async (req, res) => {
  const { receiverName, password } = req.body;

  const receiver = await Receiver.findOne({ receiverName });
  if (receiver && (await receiver.matchPassword(password))) {
    res.json({
      _id: receiver._id,
      name: receiver.receiverName,
      bloodType: receiver.bloodType,
      token: generateToken(receiver._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const requestBloodSample = asyncHandler(async (req, res) => {
  const { receiverId, hospitalId, bloodType, quantity } = req.body;

  if (!(receiverId && hospitalId && bloodType && quantity)) {
    res.status(400);
    throw new Error("Please Enter All the Feilds");
  }

  let hospitalExist = await Hospital.findOne({ _id: hospitalId });
  if (!hospitalExist) {
    res.status(401);
    throw new Error("Hospital With this Id Dosen't Exists");
  }

  let receiverExists = Receiver.findById({ _id: receiverId });
  if (!receiverExists) {
    res.status(401);
    throw new Error("Receiver With this Id Dosen't Exists");
  }

  let RequestExist = await BloodRequest.findOne({
    hospitalId: hospitalId,
    receiverId: receiverId,
  });

  if (RequestExist) {
    return res.json("Request Already Made");
  }

  let request = await BloodRequest.create({
    receiverId,
    hospitalId,
    bloodType,
    quantity,
  });

  if (request) {
    return res.status(201).json({
      _id: request._id,
      receiverId: request.receiverId,
      hospitalId: request.hospitalId,
      bloodType: request.bloodType,
      quantity: request.quantity,
      status: request.status,
    });
  }
  return res.status(401).json("Failed to Create Request");
});

module.exports = {
  registerReceiver,
  authReceiver,
  requestBloodSample,
};
