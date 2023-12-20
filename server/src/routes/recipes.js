var express = require('express');
var router = express.Router();
require('dotenv').config();
const multer = require('multer');
const { getImage, uploadImage, deleteImage } = require('../controllers/images');

const Recipe = require('../models/Recipe');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

function checkAuthenticated(req, res, next) {
    if (req.session && req.session.username) {
        return next();
    }

    res.status(401).send('Unauthorized');
} 

router.get('/', async function(req, res) {
    try {     
        // build the query based on search parameters
        const query = {};

        if (req.query.username) {
            query.username = req.query.username;
        }

        if (req.query.recipeName) {
            console.log(req.params.recipeName);
            // substring search
            query.name = {
                $regex: req.query.recipeName,
                $options: 'i',
            };
        }
        if (req.query.ingredients) {
            query.ingredients = req.query.ingredients;
        }

        res.json(await Recipe.find(query).limit(20));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/', checkAuthenticated, upload.single('image'), async function(req, res) {
    try {
        // prevent user from setting the _id
        req.body._id = undefined;

        const recipe = new Recipe({
            ...req.body,
            username: req.session.username,
        });

        // upload the image
        if (req.file) {
            await uploadImage(req, res);

            // save the image name
            recipe.imageName = req.imageName;
        }
        await recipe.save();

        res.status(201).send('Recipe created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/:recipeID', checkAuthenticated, async function(req, res) {
    try {
        const { name, ingredients, directions } = req.body;
    
        const recipe = await Recipe.findByIdAndUpdate({
            _id: req.params.recipeID,
            username: req.session.username,
        }, {
                name,
                ingredients: ingredients,
                directions
            },
            { new: true }
        );
    
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
    
        res.json(await Recipe.find({}).limit(20));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.delete('/:recipeID', checkAuthenticated, async function(req, res) {
    try {
        const recipe = await Recipe.findByIdAndDelete({
            _id: req.params.recipeID,
            username:  req.session.username,
        });

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json(await Recipe.find({}).limit(20));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})


module.exports = router; 