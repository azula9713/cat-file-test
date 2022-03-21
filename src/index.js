import express from "express";
import cors from "cors";
import fs from "fs";
import { getMyImage } from "./controllers/CatController.js";

const server = express();

server.use(cors());
server.use(express.json());

const PORT = process.env.PORT || 3000;

server.get("/cats/getmyimage", (req, res) => {
  getMyImage(req, res);
});

server.listen(PORT, () => {
  //if there is no directory named output, create it
  if (!fs.existsSync("./output")) {
    fs.mkdirSync("./output");
  }
  console.log(`Server is listening on port ${PORT}`);
});
