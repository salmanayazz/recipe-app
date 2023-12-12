const express = require('express');
const multer = require('multer');
const { getImage, uploadImage } = require('../controllers/images')

const router = express.Router();


router.post('/', uploadImage);


router.get('/:filename', getImage);

module.exports = router;
