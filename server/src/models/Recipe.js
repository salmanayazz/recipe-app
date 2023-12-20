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
        type: [String],
        required: true,
    }],
    directions: {
        type: [String],
        required: true,
    }, 
    imageName: {
        type: String,
    },
})

const Recipe = mongoose.model("Recipe", recipeSchema, 'recipe');

module.exports = Recipe;