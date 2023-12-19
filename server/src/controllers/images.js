const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const util = require('util');
const { Readable } = require('stream');

const storage = new Storage();

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

// filter to only allow images
const imageFileFilter = (req, file, callback) => {
    const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png'];
  
    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Only images are allowed. (jpeg, pjpeg, png)'), false);
    }
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // file size limit is 10mb
    },
    fileFilter: imageFileFilter,
});

const uploadImage = async (req, res) => {
    try {
        const multerUpload = util.promisify(upload.single('file'));
        await multerUpload(req, res);
        const image = req.file;

        if (!image) {
            return res.status(400).send('No image uploaded.');
        }

        const blob = bucket.file(`${uuidv4()}_${image.originalname}`);

        const stream = Readable.from(image.buffer);
        stream.pipe(blob.createWriteStream({ resumable: false }));

        stream.on('end', () => {
            res.status(200).send('Image uploaded');
        });

        stream.on('error', (err) => {
            console.log(err);
            res.status(500).send('Error uploading image');
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(`${err.message}`);
    }
};

// retrieve image files
const getImage = async (req, res) => {
    try {
        const imageName = req.params.imageName;
    
        if (!imageName) {
            return res.status(400).send('Filename parameter is missing.');
        }
    
        const image = bucket.file(imageName);
    
        const readStream = image.createReadStream();
        readStream.pipe(res);
    
        readStream.on('error', (err) => {
            console.error(err);
            res.status(500).send('Error retrieving image');
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const deleteImage = async (req, res) => {
    try {
        const imageName = req.params.imageName;

        if (!imageName) {
            return res.status(400).send('Image name parameter is missing.');
        }

        const image = bucket.file(imageName);

        const [exists] = await image.exists();
        if (!exists) {
            return res.status(404).send('Image not found.');
        }

        await image.delete();

        res.status(200).send('Image deleted successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    uploadImage,
    getImage,
    deleteImage
};