const mongoose = require('mongoose');

var recipeSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    ingredients: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Ingredient',
        required: true,
    }],
    directions: {
        type: [String],
        required: true,
    }, 
})

const Recipe = mongoose.model("Recipe", recipeSchema, 'recipe');

module.exports = Recipe;