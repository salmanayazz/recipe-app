const express = require('express');
const multer = require('multer');
const { getImage, uploadImage, deleteImage } = require('../controllers/images')

const router = express.Router();


router.post('/', uploadImage);


router.get('/:imageName', getImage);

router.delete('/:imageName', deleteImage);

module.exports = router;
