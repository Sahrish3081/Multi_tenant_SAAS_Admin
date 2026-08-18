import express from "express";
import "dotenv/config";
import dotenv from "dotenv";
import router  from "#routes/route.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/v1/", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Clean MVC Server running on port ${PORT}`);
});