import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import { Readable } from "stream";
import { Bucket } from "@google-cloud/storage/build/cjs/src/bucket";
import { Request, Response } from "express";
import dotenv from "dotenv";
import sharp from "sharp";
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
    fileSize: 20 * 1024 * 1024, // file size limit is 20mb
  },
  fileFilter: imageFileFilter,
});

export const imageUploadMiddleware = (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    imageUploadMulter.single("image")(req, res, (err) => {
      if (err) {
        res.status(400).json({ image: err.message });
      } else {
        next();
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ image: "Failed uploading image" });
  }
};

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
    let image = req.file;

    if (!image) {
      res.status(400).json({ image: "Image file is missing." });
      return false;
    }

    // compress the image
    const { fieldname, originalname, encoding, mimetype, buffer } = image;
    const compressedImage = await sharp(buffer).resize(800).toBuffer();

    const imageName = `${uuidv4()}_${originalname}`;
    const blob = bucket.file(imageName);

    const stream = Readable.from(compressedImage);
    const uploadStream = blob.createWriteStream({ resumable: false });

    await new Promise((resolve, reject) => {
      stream.pipe(uploadStream).on("error", reject).on("finish", resolve);
    });

    // add the image name to the request object so it can be saved in the database
    req.imageName = imageName;
    return true;
  } catch (err) {
    console.error(err);
    res.status(500).json({ image: "Failed uploading image" });
    return false;
  }
};

interface CachedImage {
  data: Buffer;
  timestamp: number;
}

const imageCache = new Map<string, CachedImage>();
const maxCacheAge = 60 * 1000;

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
      res.status(400).json({ image: "Image name parameter is missing." });
      return false;
    }

    // if the image is in the cache
    if (imageCache.has(imageName)) {
      const cachedImage = imageCache.get(imageName);
      const currentTime = Date.now();

      if (cachedImage) {
        // refresh the timestamp
        cachedImage.timestamp = currentTime;
        res.send(cachedImage.data);
        return true;
      }
    }

    // remove old images from the cache
    imageCache.forEach((cachedImage, key) => {
      if (cachedImage.timestamp < Date.now() - maxCacheAge) {
        imageCache.delete(key);
      }
    });

    const image = bucket.file(imageName);

    res.setHeader("Content-Type", getContentType(imageName));

    const readStream = image.createReadStream();
    const chunks: Buffer[] = [];

    readStream.on("data", (chunk) => {
      chunks.push(chunk);
    });

    readStream.on("end", () => {
      const imageData = Buffer.concat(chunks);
      // cache image
      imageCache.set(imageName, { data: imageData, timestamp: Date.now() });
      res.send(imageData);
    });

    readStream.on("error", (err) => {
      throw err;
    });

    return true;
  } catch (err) {
    console.error(err);
    res.status(500).json({ image: "Failed retrieving image" });
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
      res.status(400).json({ image: "Image name parameter is missing." });
      return false;
    }

    imageCache.delete(imageName);

    await bucket.file(imageName).delete();
    return true;
  } catch (err) {
    console.error(err);
    res.status(500).json({ image: "Failed deleting image" });
    return false;
  }
};
