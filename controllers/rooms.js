import Rooms from "../models/rooms.js";
import wrapAsync from "../utils/wrapAsync.js";
import { v2 as cloudinary } from "cloudinary";

export const getRooms = wrapAsync(async (req, res) => {
  const rooms = await Rooms.find({});
  res.json(rooms);
});

export const addRooms = wrapAsync(async (req, res) => {
  // console.log(req.body);
  // console.log(req.body.data);
  const room = new Rooms(JSON.parse(req.body.data));
  room.images = await req.files.map((f) => ({
    url: f.path,
    fileName: f.filename,
  }));
  await room.save();
  res.json(room);
  // console.log(room);
});

export const getRoom = wrapAsync(async (req, res) => {
  const { id } = await req.params;
  const room = await Rooms.findById(id);
  res.json(room);
});

/////  check for model with campground or populate images

export const editRoom = wrapAsync(async (req, res) => {
  const { id } = await req.params;
  const newData = await JSON.parse(req.body.data);
  // console.log(newData);
  // console.log(req.files);
  const room = await Rooms.findByIdAndUpdate(id, { ...newData });
  const image = await req.files.map((f) => ({
    url: f.path,
    fileName: f.filename,
  }));
  room.images.push(...image);
  await room.save();
  if (newData.deleteImages) {
    for (let fileName of newData.deleteImages) {
      await cloudinary.uploader.destroy(fileName);
    }
    await room.updateOne({
      $pull: { images: { fileName: { $in: newData.deleteImages } } },
    });
  }
  res.json(room);
});

export const deleteRoom = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const room = await Rooms.findByIdAndDelete(id);
  res.json(room);
  console.log(room);
});
