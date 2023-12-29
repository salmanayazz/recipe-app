import { createContext, useContext } from "react";

export interface Recipe {
  _id?: string;
  name: string;
  username?: string;
  ingredients: string[];
  directions: string[];
  image?: File;
  imageName?: string;
}

export interface RecipesState {
  recipes: Recipe[];
  fetchingRecipes: boolean;
  fetchingImages: boolean;
}

export interface RecipesContextType {
  recipeState: RecipesState;
  fetchRecipes: (
    searchParams?: SearchParams
  ) => Promise<RecipeError | undefined>;
  createRecipe: (recipe: Recipe) => Promise<RecipeError | undefined>;
  updateRecipe: (
    recipeID: string,
    recipe: Recipe
  ) => Promise<RecipeError | undefined>;
  deleteRecipe: (recipeId: string) => Promise<RecipeError | undefined>;
}

export interface SearchParams {
  recipeName?: string;
  username?: string;
}

export interface RecipeError {
  name?: string;
  ingredients?: string;
  directions?: string;
  image?: string;
  other?: string;
}

export const useRecipes = () => {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error("useRecipes must be used within a RecipesProvider");
  }
  return context;
};

export const RecipesContext = createContext<RecipesContextType | undefined>(
  undefined
);
