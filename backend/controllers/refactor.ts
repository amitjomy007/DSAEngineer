const dotenv = require("dotenv");
const Problem = require("../models/problem");
dotenv.config();
import axios from "axios";
import { response } from "express";
import { Mongoose } from "mongoose";
import test from "node:test";
const compilerBackendUrl =
  process.env.COMPILER_BACKEND_URL || "localhost:3000/run";

  