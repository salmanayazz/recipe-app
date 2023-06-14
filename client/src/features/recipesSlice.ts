import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

import Recipe from '../models/Recipe';
import LocalDB from '../utils/LocalDB';

export interface RecipesState {
  // TODO: serialized object warning occurs here, but nothing seems to be broken
  recipes: Recipe[];
}

const storage = new LocalDB();

const initialState: RecipesState = {
  recipes: storage.getRecipes()
};

export const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    addRecipe: (state, action: PayloadAction<Recipe>) => {
      const recipe = { ...action.payload };
      try {
        storage.addRecipe(recipe)
      } catch (e) {
        throw e;
      }
      state.recipes.push(recipe);
    },

    updateRecipe: (state, action: PayloadAction<Recipe>) => {
      const recipe = { ...action.payload }; 
      try {
        storage.updateRecipe(recipe)
      } catch (e) {
        throw e;
      }
      state.recipes.forEach((oldRecipe, index) => {
        if (oldRecipe.id === recipe.id) {
          state.recipes[index] = recipe; 
        }
      })
    },

    deleteRecipe: (state, action: PayloadAction<Recipe>) => {
      const recipe = { ...action.payload }; 
      try {
        storage.deleteRecipe(recipe.id)
      } catch (e) {
        throw e;
      }
      state.recipes = state.recipes.filter((oldRecipe) => oldRecipe.id !== recipe.id);
      
    }
  },
});


export const { 
  addRecipe,
  updateRecipe,
  deleteRecipe
} = recipesSlice.actions;

export const selectRecipes = (state: RootState) => state.recipes.recipes;

export default recipesSlice.reducer;
