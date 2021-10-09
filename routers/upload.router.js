const express = require("express");

const router = express.Router();

var multer = require("multer");
const sharp = require("sharp");

const { v4 } = require("uuid");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

var storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    // console.log(req.file);
    cb(null, "");
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
    files: 9,
  },
  fileFilter: fileFilter,
});

var cpUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 6 },
]);

router.post("/", cpUpload, (req, res) => {
  // const thumbnail = url + req.files.thumbnail[0].filename;
  const images = req.files.images;

  const multipleImages = [];
  const imageArr = Array.from(images);
  var imagesProccessed = 0;
  imageArr && imageArr.forEach((image, index, array) => {
    imagesProccessed++;
    let myFiles = image.originalname.split(".");
    let fileType = myFiles[myFiles.length - 1];


    const compressedBuffer = sharp(image.buffer).resize(640, 640);

    // console.log(fileType);
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${v4()}.${fileType}`,
      Body: compressedBuffer,
      ACL: "public-read",
      ContentType: "image/jpeg", //<-- this is what you need!
    };
    s3.upload(params, (error, data) => {
      //  console.log(data.Location);

      if (error) {
      } else {
        multipleImages.push(data.Location);
        if (multipleImages.length === array.length) {
          res.send({
            response: multipleImages,
          });
        }
      }
    });
  });
  // console.log(req.files.images)
  // console.log(imageArr);
});

module.exports = router;
