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
}

export interface RecipesContextType {
  recipeState: RecipesState;
  fetchRecipes: (searchParams?: SearchParams) => void;
  createRecipe: (recipe: Recipe) => void;
  updateRecipe: (recipeID: string, recipe: Recipe) => void;
  deleteRecipe: (recipeId: string) => void;
}

export interface SearchParams {
  recipeName?: string;
  username?: string;
}

export const useRecipes = () => {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error("useRecipes must be used within a RecipesProvider");
  }
  return context;
};

export const RecipesContext = createContext<RecipesContextType | undefined>(
  undefined,
);
