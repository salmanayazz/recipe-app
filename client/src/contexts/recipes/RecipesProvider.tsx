import React, { ReactNode, useState } from "react";
import {
  Recipe,
  RecipesState,
  SearchParams,
  RecipesContext,
  RecipeError,
} from "./RecipesContext";
import { axiosInstance } from "../AxiosInstance";

interface RecipesProviderProps {
  children: ReactNode;
}

const defaultRecipesState: RecipesState = {
  recipes: [],
  fetchingRecipes: false,
  fetchingImages: false,
};

export const RecipesProvider: React.FC<RecipesProviderProps> = ({
  children,
}) => {
  const [recipeState, setRecipeState] =
    useState<RecipesState>(defaultRecipesState);

  const fetchRecipes = async (
    searchParams?: SearchParams
  ): Promise<RecipeError | undefined> => {
    try {
      setRecipeState({ ...recipeState });
      const response = await axiosInstance.get(`recipes`, {
        params: searchParams,
      });

      const recipesImgsToLoad: Recipe[] = [];

      // keep the recipe images from the state that haven't been updated
      response.data.forEach((recipe: Recipe) => {
        const existingRecipe = recipeState.recipes.find(
          (r: Recipe) => r.imageName === recipe.imageName
        );
        if (existingRecipe) {
          recipe.image = existingRecipe.image;
        } else {
          recipesImgsToLoad.push(recipe);
        }
      });

      setRecipeState({
        ...recipeState,
        recipes: response.data,
      });

      // get the image for each recipe that has updated
      const newRecipesImgs = await Promise.all(
        recipesImgsToLoad.map(async (recipe: Recipe) => {
          if (recipe.imageName) {
            const response = await fetch(
              `${import.meta.env.VITE_SERVER_URL}/images/${recipe.imageName}`
            );
            const blob = await response.blob();

            recipe.image = new File([blob], recipe.imageName, {
              type: blob.type,
            });
          }

          return recipe;
        })
      );

      // add the new images to the recipes state
      setRecipeState((prevState) => {
        const updatedRecipes = prevState.recipes.map((r: Recipe) => {
          const updatedRecipe = newRecipesImgs.find(
            (newRecipe) => newRecipe.imageName === r.imageName
          );
          return updatedRecipe ? { ...r, image: updatedRecipe.image } : r;
        });
        return { ...prevState, recipes: updatedRecipes };
      });
    } catch (error: any) {
      return error?.response?.data || { other: error?.message };
    }
    return;
  };

  const createRecipe = async (
    recipe: Recipe
  ): Promise<RecipeError | undefined> => {
    try {
      const formData = new FormData();

      // append all fields from the recipe object to formData
      Object.entries(recipe).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value, value.name);
        } else if (value) {
          formData.append(key, JSON.stringify(value));
        }
      });

      await axiosInstance.post(`recipes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchRecipes();
    } catch (error: any) {
      return error?.response?.data || { other: error?.message };
    }
    return;
  };

  const updateRecipe = async (
    recipeID: string,
    recipe: Recipe
  ): Promise<RecipeError | undefined> => {
    try {
      const formData = new FormData();

      // append all fields from the recipe object to formData
      Object.entries(recipe).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value, value.name);
        } else if (value) {
          formData.append(key, JSON.stringify(value));
        }
      });

      await axiosInstance.put(`recipes/${recipeID}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchRecipes();
    } catch (error: any) {
      return error?.response?.data || { other: error?.message };
    }
    return;
  };

  const deleteRecipe = async (
    recipeId: string
  ): Promise<RecipeError | undefined> => {
    try {
      await axiosInstance.delete(
        `${import.meta.env.VITE_SERVER_URL}/recipes/${recipeId}`
      );
      fetchRecipes();
    } catch (error: any) {
      return error?.response?.data || { other: error?.message };
    }
    return;
  };

  return (
    <RecipesContext.Provider
      value={{
        recipeState,
        fetchRecipes,
        createRecipe,
        updateRecipe,
        deleteRecipe,
      }}
    >
      {children}
    </RecipesContext.Provider>
  );
};

export default RecipesProvider;
