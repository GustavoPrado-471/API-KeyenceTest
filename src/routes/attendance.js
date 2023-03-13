const express = require("express");
const router = express.Router();

const userSchema = require("../models/attendance");
const loginSchema = require("../models/login");
const verifyToken = require("./verifyToken");

const jwt = require("jsonwebtoken");
require("dotenv").config();

// -------------- ------- Log In ----------------
//Sing In
router.post("/signUp", async (req, res, next) => {
  const { userName, email, password } = req.body;
  const loginschema = new loginSchema({
    userName,
    email,
    password,
  });
  loginschema.password = await loginschema.encryptPassword(
    loginschema.password
  );
  await loginschema.save();

  const token = jwt.sign({ id: loginschema._id }, process.env.USER_SECRETKEY, {
    expiresIn: 60 * 60 * 24,
  });
  res.json({ auth: true, token });
});

//LogIn
router.post("/signIn", async (req, res, next) => {
  //Search one user by email and password
  const { email, password } = req.body;
  const user = await loginSchema.findOne({ email: email });
  if (!user) {
    return res.status(404).send("The email provided doen't exists !!!");
  }
  //User valid
  const passwordIsValid = await user.validatePassword(password);
  if (!passwordIsValid) {
    res.status(401).json({
      auth: false,
      token: null,
    });
  }
  const token = jwt.sign({ id: user._id }, process.env.USER_SECRETKEY, {
    expiresIn: 60 * 60 * 24,
  });

  res.json({ auth: true, token });
});

router.get("/dashboard", verifyToken, async (req, res, next) => {
  const user = await loginSchema.findById(req.userId, { password: 0 });
  if (!user) {
    return res.status(404).send("No user found");
  }
  res.json(user);
});

// -------------- ------- C R U D Users ----------------

//Create new user, with Token
router.post("/newUser", verifyToken, async (req, res) => {
  const user = userSchema(req.body);
  await user
    .save()
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(401).json({ message: error }));
});

//Get all data users
router.get("/allUsers", verifyToken, async (req, res) => {
  await userSchema
    .find()
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(401).json({ message: error }));
});

//Get only one user
router.get("/user/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  await userSchema
    .findById(id)
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(401).json({ message: error }));
});

//Update one user
router.put("/user/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { userID, userName, date, punchIn, punchOut } = req.body;
  await userSchema
    .updateOne(
      { _id: id },
      { $set: { userID, userName, date, punchIn, punchOut } }
    )
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(401).json({ message: error }));
});

//Delete one user
router.delete("/user/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  await userSchema
    .deleteOne({ _id: id })
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(401).json({ message: error }));
});

module.exports = router;
