import express from "express";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/user");

export const registerControl = async (req: any, res: any) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!(firstname && lastname && email && password)) {
      return res.status(400).send("All input is required");
    }
    const existingUser = await User.findOne({ email });
    console.log("Existing user? : ", existingUser);
    if (existingUser) {
      console.log("existing ra");
      return res.status(200).json({ message: "existing user, please login"});
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

export const loginControl = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("All input is required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("Invalid email or password");
      console.log("ivde1")
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid email or password");
      console.log("ivde 2")
    }
    const token = jwt.sign({ user: user }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    user.token = token;
    user.password = undefined;
    res.status(200).json({ message: "You have successfully logged in", user });
  } catch (error) {}
};
