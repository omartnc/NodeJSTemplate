const Joi = require('joi');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const winston = require('winston');
const router = express.Router();

router.post('/', async (req, res) => {
  // const { error } = validate(req.body); 
  // if (error) return res.status(400).json(error.details[0].message);
let errors={};
  let user = await User.findOne({ email: req.body.email });
  errors.email='Invalid email or password.';
  if (!user) return res.status(400).json(errors);

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  errors.password='Invalid email or password.'
  if (!validPassword) return res.status(400).json(errors);

  const token = user.generateAuthToken();
  winston.info( user._id+" : idli kullanici sisteme giris yapti.");
  res.json(token);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router; 
