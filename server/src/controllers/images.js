const { Storage } = require("@google-cloud/storage");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const util = require("util");
const { Readable } = require("stream");

const storage = new Storage();

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

// filter to only allow images
const imageFileFilter = (req, file, callback) => {
  const allowedMimes = ["image/jpeg", "image/pjpeg", "image/png"];

  if (allowedMimes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    console.error(`Invalid file type: ${file.mimetype}`);
    callback(new Error("Only images are allowed. (jpeg, pjpeg, png)"), false);
  }
};

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // file size limit is 5mb
  },
  fileFilter: imageFileFilter,
});

/**
 * to set the header content type based on the file extension
 */
const getContentType = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();

  const contentTypeMap = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    bmp: "image/bmp",
    webp: "image/webp",
  };

  return contentTypeMap[extension] || "application/octet-stream";
};

const uploadImage = async (req, res) => {
  try {
    const image = req.file;

    if (!image) {
      res.status(400).send("Image file is missing.");
      return false;
    }

    const imageName = `${uuidv4()}_${image.originalname}`;
    const blob = bucket.file(imageName);

    const stream = Readable.from(image.buffer);
    stream.pipe(blob.createWriteStream({ resumable: false }));

    await new Promise((resolve, reject) => {
      stream.on("end", resolve);
      stream.on("error", reject);
    });

    // add the image name to the request object so it can be saved in the MONGODB_URI
    req.imageName = imageName;
    return true;
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
    return false;
  }
};

// retrieve image files
const getImage = async (req, res) => {
  try {
    const imageName = req.params.imageName;

    if (!imageName) {
      res.status(400).send("Image name parameter is missing.");
      return false;
    }

    const image = bucket.file(imageName);

    res.setHeader("Content-Type", getContentType(imageName));

    const readStream = image.createReadStream();
    readStream.pipe(res);

    readStream.on("error", (err) => {
      console.error(err);
      res.status(500).send("Internal server error");
      return false;
    });
    return true;
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
    return false;
  }
};

const deleteImage = async (req, res) => {
  try {
    const imageName = req.params.imageName;

    if (!imageName) {
      res.status(400).send("Image name parameter is missing.");
      return false;
    }

    await bucket.file(imageName).delete();
    return true;
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
    return false;
  }
};

module.exports = {
  uploadImage,
  getImage,
  deleteImage,
  imageUpload,
};
