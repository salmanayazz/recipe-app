const mongoose = require('mongoose');

var ingredientSchema = new mongoose.Schema({
    name: {type: String},
})

const Ingredient = mongoose.model("Ingredient", ingredientSchema, 'ingredient');

module.exports = Ingredient;