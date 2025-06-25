import express from "express";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
const User = require("../models/user");

export const registerControl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    if (!(firstname && lastname && email && password)) {
      return res.status(400).send("All input is required");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send("User already exists. Please login.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    const token = jwt.sign({ user: user }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    user.token = token;
    user.password = undefined;
    res
      .status(200)
      .json({ message: "You have succesfully registered the user: ", user });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const loginControl = (req: express.Request, res: express.Response) => {
  // Logic for handling registration
  res.send("Login successful");
};
