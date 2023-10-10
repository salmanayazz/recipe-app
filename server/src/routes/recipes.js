var express = require('express');
var router = express.Router();
require('dotenv').config();

const Recipe = require('../models/Recipe');

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
            query.name = req.query.recipeName;
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

router.post('/', checkAuthenticated, async function(req, res) {
    try {
        const recipe = await Recipe.create({
            ...req.body,
            username:  req.session.username,
        });
    
        res.json(await Recipe.find({}).limit(20));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

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