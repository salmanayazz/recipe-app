const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const util = require('util');
const { Readable } = require('stream');

const storage = new Storage();

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

const upload = multer({
    storage: multer.memoryStorage(),
});

// uploads files to gcp cloud storage
const uploadImage = async (req, res) => {
    try {
        const multerUpload = util.promisify(upload.single('file'));

        await multerUpload(req, res);

        const file = req.file;

        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const blob = bucket.file(`${uuidv4()}_${file.originalname}`);

        const stream = Readable.from(file.buffer);
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
        res.status(500).send('Internal Server Error');
    }
};


// retrieve image files
const getImage = async (req, res) => {
    try {
        const filename = req.params.filename;
    
        if (!filename) {
            return res.status(400).send('Filename parameter is missing.');
        }
    
        const file = bucket.file(filename);
    
        const readStream = file.createReadStream();
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

module.exports = {
    uploadImage,
    getImage,
};