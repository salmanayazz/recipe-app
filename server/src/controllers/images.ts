import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import { Readable } from "stream";
import { Bucket } from "@google-cloud/storage/build/cjs/src/bucket";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const storage = new Storage();

let bucket: Bucket;
if (!process.env.GCS_BUCKET_NAME) {
  throw new Error("GCS_BUCKET_NAME is missing.");
} else {
  bucket = storage.bucket(process.env.GCS_BUCKET_NAME);
}

// filter to only allow images
const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: any
) => {
  const allowedMimes = ["image/jpeg", "image/pjpeg", "image/png"];

  if (allowedMimes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    console.error(`Invalid file type: ${file.mimetype}`);
    callback(new Error("Only images are allowed. (jpeg, pjpeg, png)"), false);
  }
};

export const imageUploadMulter = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // file size limit is 5mb
  },
  fileFilter: imageFileFilter,
});

/**
 * to set the header content type based on the file extension
 */
const getContentType = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  const contentTypeMap: { [key: string]: string } = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    bmp: "image/bmp",
    webp: "image/webp",
  };

  return contentTypeMap[extension] || "application/octet-stream";
};

/**
 * interface to add imageName to the request object
 * to return it from the uploadImage function
 */
export interface ImageRequest extends Request {
  imageName?: string;
}

/**
 * upload image files
 * @returns
 * returns true if the image was uploaded successfully
 */
export const uploadImage = async (
  req: ImageRequest,
  res: Response
): Promise<boolean> => {
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

    // add the image name to the request object so it can be saved in the database
    req.imageName = imageName;
    return true;
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
    return false;
  }
};

/**
 * get image files
 * @returns
 * returns true if the image was retrieved successfully
 */
export const getImage = async (
  req: Request,
  res: Response
): Promise<boolean> => {
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

/**
 * delete image files
 * @returns
 * returns true if the image was deleted successfully
 */
export const deleteImage = async (
  req: Request,
  res: Response
): Promise<boolean> => {
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
