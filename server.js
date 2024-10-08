const express = require("express");
const app = express();
require("dotenv").config();
const { uuid } = require("uuidv4");
const multer = require("multer");
const fs = require("fs"); // This library is used for handling file and folder operations
app.use(express.json());
const storage = multer.diskStorage({
  destination: "./upload",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
  filename: (req, file, cb) => {
    let filename = uuid() + file.originalname;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });
require("./db/db.js");
const cloudinary = require("./cloudinary/cloud.js");

app.post("/api/cloud_upload", upload.single("image"), (req, res) => {
  // NOw send this file on cludianry i.e others server then we will delte this file from upload files

  cloudinary.uploader.upload(req.file.path, (result, error) => {
    console.log(result);
    fs.unlink(req.file.path, function (err) {
      if (err) {
        console.log("file is not deleted");
      } else {
        console.log("flie is deleted");
      }
    });
  });
  res.status(200).json({
    msg: "Uploading cloud ",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
