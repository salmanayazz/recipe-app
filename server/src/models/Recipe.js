const mongoose = require('mongoose');

var recipeSchema = new mongoose.Schema({
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
    lastModified: {
        type: Date,
        default: Date.now,
    },
})

const Recipe = mongoose.model("Recipe", recipeSchema, 'recipe');

module.exports = Recipe;