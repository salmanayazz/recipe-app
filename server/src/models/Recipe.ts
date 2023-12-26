import { Schema, model, Document } from "mongoose";

interface Recipe extends Document {
  username: string;
  name: string;
  ingredients: string[];
  directions: string[];
  imageName?: string;
}

var recipeSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  directions: {
    type: [String],
    required: true,
  },
  imageName: {
    type: String,
  },
});

const RecipeModel = model<Recipe>("Recipe", recipeSchema);

export { RecipeModel, Recipe };
