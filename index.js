import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import multer from "multer";
import helmet from "helmet";
import { storage } from "./cloudinary/cloudinary.js";

import { addRooms, editRoom } from "./controllers/rooms.js";

import roomRoutes from "./routes/rooms.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT;
const CONNECTION_URL = process.env.MONGOOSE_URL;

mongoose.set("strictQuery", false);
mongoose
  .connect(CONNECTION_URL)
  .then(() => {
    console.log("connected to Mongoose");
  })
  .catch((e) => {
    console.log("mongoose error");
    console.log(e);
  });

app.use(express.urlencoded({ extended: "true" }));
app.use(express.json());
app.use(cors());
app.use(morgan("common"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

const upload = multer({ storage });

/////   EXPRESS ROUTER   /////
app.use("/rooms", roomRoutes);

////  imported here cause it cannot be updated in Routes Folder
app.post("/rooms", upload.array("images"), addRooms);
app.put("/rooms/:id", upload.array("newImages"), editRoom);

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
