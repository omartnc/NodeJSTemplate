const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const winston = require("winston");

// Load Input validation
const validateRegisterInput = require("../validation/register");

router.get("/me", [auth], async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

router.get("/", [admin], async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});
router.get("/:id", [admin], async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

router.put("/:id", [admin], async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      isAdmin: req.body.isAdmin,
      email: req.body.email,
      name: req.body.name
    },
    {
      new: true
    }
  );

  if (!user)
    return res.status(404).json("The user with the given ID was not found.");

  res.json(user);
});

router.post("/", async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();

  winston.info(user._id + " : idli kullanici sisteme kayit yapti.");

  res
    .header("x-auth-token", token)
    .json(_.pick(user, ["_id", "name", "email"]));
});
// Delete User

router.delete("/delete/:id", [admin], async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  user.remove().then(() => res.json({ success: "true" }));
});
module.exports = router;
