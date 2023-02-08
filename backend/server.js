const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/dbConnection");
const Receiver = require("./routes/receiverRoutes");
const hospital = require("./routes/hospital");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // to Accept Json Data

app.get("/", (req, res) => {
  res.send("API is Running");
});

app.use("/api/hospital", hospital);
app.use("/api/receiver", Receiver);

//If no routes exist it will fall on this
app.use(notFound);
//If still there is a error it will fall on this
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server Started on Port ${PORT}`);
});
