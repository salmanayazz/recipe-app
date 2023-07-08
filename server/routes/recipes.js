var express = require('express');
var router = express.Router();
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);

const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');

mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');
})

async function getRecipesWithIngredientNames() {
    const recipes = await Recipe.find();
    // replace ingredient _id with ingredient name
    const recipesWithNames = await Promise.all(recipes.map(async (recipe) => {
        const ingredients = await Promise.all(recipe.ingredients.map(async (ingredient) => {
            const ingredientName = await Ingredient.findById(ingredient);
            return ingredientName.name;
        }));
        return {
            ...recipe._doc,
            ingredients,
        };
    }));
    return recipesWithNames;
    
}

router.get('/', async function(req, res) {
    try {        
        res.json(await getRecipesWithIngredientNames());
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/', async function(req, res) {
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
    
        // Create the recipe
        const recipe = await Recipe.create({
            ...req.body,
            ingredients: ingredientRefs,
        });
    
        res.json(await getRecipesWithIngredientNames());
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.put('/:recipeID', async function(req, res) {
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
    
        const recipe = await Recipe.findByIdAndUpdate(
            req.params.recipeID, {
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

router.delete('/:recipeID', async function(req, res) {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.recipeID);

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