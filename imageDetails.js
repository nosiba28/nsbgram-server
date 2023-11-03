const mongoose = require("mongoose");

const ImageDetailsSchema = new mongoose.Schema(
  {
   about:String,
   image:String
  },
  {
    collection: "ImageDetails",
  }
);

mongoose.model("ImageDetails", ImageDetailsSchema);