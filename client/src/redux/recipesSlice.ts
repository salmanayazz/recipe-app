import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { axiosInstance } from './authSlice';
import Recipe from '../models/Recipe';

export interface RecipesState {
  recipes: Recipe[];
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string | undefined;
  searchParams: {
    username: string | undefined;
    recipeName: string | undefined;
    ingredients: string | undefined;
  };
}

const initialState: RecipesState = {
  recipes: [],
  status: 'idle',
  error: undefined,
  searchParams: {
    username: undefined,
    recipeName: undefined,
    ingredients: undefined,
  },
};

let BACKEND = process.env.REACT_APP_BACKEND;

// async actions
export const fetchRecipes = createAsyncThunk('recipes/fetchRecipes', async () => {
  if (BACKEND) {
    const response = await axiosInstance.get(`${BACKEND}/recipes`);
    console.log(response.data);
    return response.data;
  }
});

export const createRecipe = createAsyncThunk('recipes/createRecipes', async (recipeData: Recipe) => {
  if (BACKEND) {
    const response = await axiosInstance.post(`${BACKEND}/recipes`, recipeData);
    return response.data;
  }
});

export const updateRecipe = createAsyncThunk('recipes/updateRecipes', async (recipeData: Recipe) => {
  if (BACKEND) {
    const response = await axiosInstance.put(`${BACKEND}/recipes/${recipeData._id}`, recipeData);
    return response.data;
  }
});

export const deleteRecipe = createAsyncThunk('recipes/deleteRecipes', async (recipeID: string) => {
  if (BACKEND) {
    const response = await axiosInstance.delete(`${BACKEND}/recipes/${recipeID}`);
    return response.data;
  }
});

export const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setSearchParams: (state, action) => {
      // set current searchParams to undefined 
    // TODO: this is not working
      state.searchParams = { ...action.payload };
      console.log(state.searchParams);
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher( // pending
        (action) =>
          action.type === fetchRecipes.pending.type ||
          action.type === createRecipe.pending.type ||
          action.type === updateRecipe.pending.type ||
          action.type === deleteRecipe.pending.type,
        (state) => {
          state.status = 'loading';
        }
      )
      .addMatcher( // after success
        (action) =>
          action.type === fetchRecipes.fulfilled.type ||
          action.type === createRecipe.fulfilled.type ||
          action.type === updateRecipe.fulfilled.type ||
          action.type === deleteRecipe.fulfilled.type,
        (state, action) => {
          console.log(action.payload);
          state.status = 'success';
          state.error = undefined;
          state.recipes = action.payload;
        }
      )
      .addMatcher( // after fail
        (action) =>
          action.type === fetchRecipes.rejected.type ||
          action.type === createRecipe.rejected.type ||
          action.type === updateRecipe.rejected.type ||
          action.type === deleteRecipe.rejected.type,
        (state, action) => {
          state.status = 'fail';
          state.error = action.error.message; // TODO: might not be showing the correct error message i want to show
        }
      )
  },
});


export const { setSearchParams } = recipesSlice.actions;
export const getRecipes = (state: RootState) => state.recipes.recipes;

export default recipesSlice.reducer;
