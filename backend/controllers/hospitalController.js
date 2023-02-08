const asyncHandler = require("express-async-handler");
const Hospital = require("../Models/hospitalModel");
const generateToken = require("../config/generateToken");
const BloodSample = require("../Models/bloodSampleModel");
const BloodRequest = require("../Models/bloodRequestModel");

const registerHospital = asyncHandler(async (req, res) => {
  const { hospitalName, password, hospitalCode } = req.body;

  if (!(hospitalName && password && hospitalCode)) {
    res.status(400);
    throw new Error("Please Enter All the Feilds");
  }

  let hospitalNameExist = await Hospital.findOne({ hospitalName });

  if (hospitalNameExist) {
    res.status(404);
    throw new Error("Hospital Name already Exists");
  }

  let hospital = await Hospital.create({
    hospitalName,
    password,
    hospitalCode,
  });

  if (hospital) {
    res.status(201).json({
      _id: hospital._id,
      hospitalName: hospital.hospitalName,
    });
  } else {
    res.status(400);
    throw new Error("Failed to Create the Hospital");
  }
});

const authHospital = asyncHandler(async (req, res) => {
  const { hospitalName, password } = req.body;

  if (!(hospitalName && password)) {
    res.status(400);
    throw new Error("Please Enter All the Feilds");
  }

  const hospital = await Hospital.findOne({ hospitalName });

  if (hospital && (await hospital.matchPassword(password))) {
    res.json({
      _id: hospital._id,
      hospitalName: hospital.hospitalName,
      hospitalCode: hospital.hospitalCode,
      token: generateToken(hospital._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Hospital Name or Password");
  }
});

const addBloodSamples = asyncHandler(async (req, res) => {
  const { bloodType, quantity, hospitalId } = req.body;

  if (!(bloodType && quantity && hospitalId)) {
    res.status(400);
    throw new Error("Please Enter All the Feilds");
  }

  let TypeOfBloodExist = await BloodSample.findOne({
    hospitalId: hospitalId,
    bloodType: bloodType,
  });

  if (TypeOfBloodExist) {
    let updatedBloodSample = await BloodSample.updateOne(
      {
        hospitalId: hospitalId,
        bloodType: bloodType,
      },
      { $inc: { quantity: quantity } }
    );
    if (updatedBloodSample) {
      return res.status(201).json("Success");
    }
  } else {
    const newBloodSample = await BloodSample.create({
      hospitalId: hospitalId,
      bloodType: bloodType,
      quantity: quantity,
    });
    if (newBloodSample) {
      res.status(201).json({
        _id: newBloodSample._id,
        hospitalId: newBloodSample.hospitalId,
        bloodType: newBloodSample.bloodType,
        quantity: newBloodSample.quantity,
      });
    } else {
      res.status(400);
      throw new Error("Failed to Add Blood Sample");
    }
  }
});

// ---------------------------------Post Controllers End---------------------

const updateBloodInfo = asyncHandler(async (req, res) => {
  const { bloodType, quantity, hospitalId } = req.body;

  if (!(bloodType && quantity && hospitalId)) {
    res.status(400);
    throw new Error("Please Enter All the Feilds");
  }

  let TypeOfBloodExist = await BloodSample.findOne({
    hospitalId: hospitalId,
    bloodType: bloodType,
  });

  if (quantity < 1) {
    let updatedBloodSample = await BloodSample.updateOne(
      {
        hospitalId: hospitalId,
        bloodType: bloodType,
      },
      { quantity: quantity }
    );
    if (updatedBloodSample) {
      return res.status(201).json("Success");
    }
  }

  if (TypeOfBloodExist) {
    let updatedBloodSample = await BloodSample.updateOne(
      {
        hospitalId: hospitalId,
        bloodType: bloodType,
      },
      { $inc: { quantity: quantity } }
    );
    if (updatedBloodSample) {
      return res.status(200).send({
        success: true,
      });
    }
  } else {
    res.status(400);
    throw new Error("Failed to Update Blood Sample");
  }
});

const removeBloodInfo = asyncHandler(async (req, res) => {
  const { hospitalId, bloodType } = req.body;

  const bloodSample = await BloodSample.findOneAndDelete({
    hospitalId: hospitalId,
    bloodType: bloodType,
  });

  if (!bloodSample) {
    return res.status(400).send({
      success: false,
      message: "Blood sample not found",
    });
  }

  res.status(200).send({
    success: true,
    data: bloodSample,
  });
});

// ---------------------------------PUT Controllers End---------------------

const getAllBloodSamples = asyncHandler(async (req, res) => {
  let allBloodSamples = await Hospital.aggregate([
    {
      $lookup: {
        from: "bloodsamples",
        localField: "_id",
        foreignField: "hospitalId",
        as: "bloodSamples",
      },
    },
    {
      $project: {
        _id: "$_id",
        name: "$hospitalName",
        bloodSamples: "$bloodSamples",
      },
    },
  ]);

  if (allBloodSamples) {
    return res.status(201).json(allBloodSamples);
  }

  return res.status(401).json("No Records Found");
});

const getHospitalBloodSamples = asyncHandler(async (req, res) => {
  const { hospitalId } = req.body;
  if (!hospitalId) {
    res.status(400);
    throw new Error("Please Enter Hospital ID");
  }

  const bloodSamples = await BloodSample.find({ hospitalId: hospitalId });

  if (!bloodSamples) {
    return res.status(400).json({
      success: false,
      message: "No blood samples found for the given hospital",
    });
  }

  const hospital = await Hospital.findById(hospitalId);

  if (!hospital) {
    return res.status(400).json({
      success: false,
      message: "Hospital not found for the given id",
    });
  }

  return res.status(200).json({
    success: true,
    hospitalName: hospital.hospitalName,
    bloodSamples,
  });
});

const getReceiverRequests = asyncHandler(async (req, res) => {
  const { hospitalId } = req.body;

  if (!hospitalId) {
    res.status(400);
    throw new Error("Please Enter Hospital Id");
  }

  let allRequests = await BloodRequest.find({
    hospitalId: hospitalId,
  });

  return res.status(200).json({
    success: true,
    count: allRequests.length,
    hospitalName: allRequests.hospitalName,
    data: allRequests,
  });
});

module.exports = {
  registerHospital,
  authHospital,
  addBloodSamples,
  updateBloodInfo,
  removeBloodInfo,
  getAllBloodSamples,
  getHospitalBloodSamples,
  getReceiverRequests,
};
