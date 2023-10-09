var express = require('express');
var router = express.Router();
require('dotenv').config();

const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');
const User = require('../models/User');

function checkAuthenticated(req, res, next) {
    console.log(req.session);
    if (req.session && req.session.username) {
        return next();
    }

    res.status(401).send('Unauthorized');
} 


router.get('/', async function(req, res) {
    try {        
        res.json(await Recipe.find({}));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/', checkAuthenticated, async function(req, res) {
    try {

        const ingredients = req.body.ingredients;
    
        // Create an array to store the ingredient references
        const ingredientRefs = [];
    
        // Iterate over the ingredients and create them if they don't exist
        for (const ingredientName of ingredients) {
            let ingredient = await Ingredient.findOne({ name: ingredientName });
        
            if (!ingredient) {
                ingredient = await Ingredient.create({ name: ingredientName });
            }
        
            ingredientRefs.push(ingredient._id);
        }

        console.log(await User.findOne({username: req.session.username}))
    
        // Create the recipe
        const recipe = await Recipe.create({
            ...req.body,
            user: await User.findOne({username: req.session.username}),
            ingredients: ingredientRefs,
        });
    
        res.json(await getRecipesWithIngredientNames());
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.put('/:recipeID', checkAuthenticated, async function(req, res) {
    try {
        const { name, ingredients, directions, lastModified } = req.body;
    
        // Create an array to store the ingredient references
        const ingredientRefs = [];
    
        // Iterate over the ingredients and create them if they don't exist
        for (const ingredientName of ingredients) {
            let ingredient = await Ingredient.findOne({ name: ingredientName });
        
            if (!ingredient) {
                ingredient = await Ingredient.create({ name: ingredientName });
            }
        
            ingredientRefs.push(ingredient._id);
        }
    
        const recipe = await Recipe.findByIdAndUpdate({
            _id: req.params.recipeID,
            user: await User.findOne({username: req.session.username}),
        }, {
                name,
                ingredients: ingredientRefs,
                directions,
                lastModified
            },
            { new: true }
        );
    
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
    
        res.json(await getRecipesWithIngredientNames());
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.delete('/:recipeID', checkAuthenticated, async function(req, res) {
    try {
        const recipe = await Recipe.findByIdAndDelete({
            _id: req.params.recipeID,
            user: await User.findOne({username: req.session.username}),
        });

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json(await getRecipesWithIngredientNames());
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})


module.exports = router; 