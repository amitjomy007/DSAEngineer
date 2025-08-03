import express from "express";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/user");

export const registerControl = async (req: any, res: any) => {
  try {
    let { firstname, lastname, email, password } = req.body;

    if (!(firstname && lastname && email && password)) {
      return res.status(400).send("All input is required");
    }
    email = email.toLowerCase();
    const existingUser = await User.findOne({ email });
    console.log("Existing user? : ", existingUser);
    if (existingUser) {
      console.log("existing ra");
      return res.status(200).json({ message: "existing user, please login" });
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
    res.cookie("auth_token", token, {
      maxAge: 3600000*24, // 1 *24hour
      httpOnly: true, // Can't be read by JS (security)
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "none",
    });
    res.cookie("user_id", user._id.toString(), {
      maxAge: 3600000*24,
      httpOnly: false, // Frontend can read this
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    user.token = token;
    console.log("token was: ", token);
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
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("All input is required");
    }
    email = email.toLowerCase();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("The user with this email does not exist");
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      console.log("ivde 2");
      return res.status(401).send("Invalid email or password");
    }
    const token = await jwt.sign({ user: user }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    // SET AUTOMATIC HTTP-ONLY COOKIE (for API requests)
    res.cookie("auth_token", token, {
      maxAge: 3600000*24, // 1*24 hour
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    res.cookie("user_id", user._id.toString(), {
      maxAge: 3600000*24,
      httpOnly: false, // Frontend can read this
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    user.token = token;

    user.password = undefined;
    console.log("token was: ", token);
    console.log(user);
    res.status(200).json({ message: "You have successfully logged in", user });
  } catch (error) {}
};
