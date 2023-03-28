import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

const ImageSchema = new mongoose.Schema({
  url: String,
  fileName: String,
});

ImageSchema.set("toObject", { virtuals: true });
ImageSchema.set("toJSON", { virtuals: true });

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/ar_4:3,c_crop/w_200");
});

ImageSchema.virtual("cardImage").get(function () {
  return this.url.replace("/upload", "/upload/ar_4:3,c_crop");
});

const RoomSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  subtitle: {
    type: String,
    // required: true,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  landmark: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  images: [ImageSchema],
  services: [
    {
      type: String,
      // enum: [
      //   "Beach access – Beachfront",
      //   "Chef",
      //   "Airport transfer",
      //   "Cleaning available during stay",
      //   "Security guard",
      //   "Kitchen",
      //   "Wifi",
      // ],
      // required: true,
    },
  ],
  price: {
    type: Number,
    // required: true,
  },
  startDate: {
    type: String,
    // required: true,
  },
  endDate: {
    type: String,
    // required: true,
  },
  like: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

////  Middleware to delete images after deleting post

RoomSchema.post("findOneAndUpdate", async (doc) => {
  if (doc.images) {
    for (const img of doc.images) {
      await cloudinary.uploader.destroy(img.fileName);
    }
  }
});

export default mongoose.model("Rooms", RoomSchema);
