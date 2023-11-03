const mongoose = require("mongoose");

const posts = new mongoose.Schema(
  {
   about:String
  },
  {
    collection: "nsbgramDB",
  }
);

mongoose.model("nsbgramDB", posts);