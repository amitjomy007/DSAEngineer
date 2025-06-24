const express = require("express");

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: any, res: any) => {
  res.send("Backend Server is up and running!");
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
