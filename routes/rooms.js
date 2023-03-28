import express from "express";
import {
  getRooms,
  getRoom,
//   editRoom,
  deleteRoom,
} from "../controllers/rooms.js";

const router = express.Router();

router.get("/", getRooms);
// Below Route is moved to index.js
// router.post("/", upload.array("images"), addRooms);
router.get("/:id", getRoom);
// router.put("/:id", editRoom);
router.delete("/:id", deleteRoom);

export default router;
