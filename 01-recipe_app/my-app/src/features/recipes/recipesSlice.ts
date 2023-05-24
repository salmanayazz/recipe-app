import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import Recipe from '../../models/Recipe';

export interface RecipeState {
  recipes: Recipe[]
}

const initialState: RecipeState = {
  recipes: []
};

export const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    addRecipe: (state, action: PayloadAction<Recipe>) => {
      const recipe = { ...action.payload };
      // TODO: change recipe to use a serializable object 
      state.recipes.push(recipe); 
    } 
  },
});

export const { 
  addRecipe
} = recipesSlice.actions;

export const selectRecipes = (state: RootState) => state.recipes.recipes;

export default recipesSlice.reducer;
