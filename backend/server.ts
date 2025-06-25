const cors = require('cors');
const express = require("express");
import router from "./routes/routes";
const { DBConnection } = require("./database/db");
DBConnection();


const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
