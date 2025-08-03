const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
import router from "./routes/routes";
const { DBConnection } = require("./database/db");
DBConnection();
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();
console.log("COrs frontend URL: " , process.env.FRONTEND_URL);
// Environment-based CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cookie",
    "user-id",
    "Origin",
    "Accept",
    "X-Requested-With",
  ],
  optionsSuccessStatus: 200,
};


app.use(cookieParser());
app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
  console.log(
    "CORS configured for origin:",
    process.env.FRONTEND_URL || "http://localhost:5173"
  );
});
