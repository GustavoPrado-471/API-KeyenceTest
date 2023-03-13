const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
require("dotenv").config();
const attendanceRoutes = require("./routes/attendance");

const app = express();
const port = process.env.PORT || 3000;
const whiteList = [process.env.ORIGIN1, process.env.ORIGIN2];

//Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("!", origin);
      if (!origin || whiteList.includes(origin)) {
        return callback(null, origin);
      }
      return callback("Error de CORS origin" + origin + "No autorizado");
    },
    credentials : true,
  })
);
app.use(express.json());
app.use("/api", attendanceRoutes);

//Routes
// app.get("/", (req, res) => {
//   res.send("API test for KEYENCE");
// });

//Connection to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Successful Connection to MongoDB"))
  .catch((error) => console.log(error));

app.listen(port, () => {
  console.log("Server listening on Port", port);
});
