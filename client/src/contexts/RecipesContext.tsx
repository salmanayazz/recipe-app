import React, { useState, createContext, ReactNode, useContext } from 'react';
import { axiosInstance } from './AuthContext';

export interface Recipe {
    _id?: string;
    name: string;
    username?: string;
    ingredients: string[];
    directions: string[];
    image?: File;
    imageName?: string;
}

interface RecipesState {
    recipes: Recipe[];
}

interface RecipesContextType {
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

const defaultRecipesState: RecipesState = {
    recipes: [],
};

export const useRecipes = () => {
    const context = useContext(RecipesContext);
    if (!context) {
      throw new Error('useRecipes must be used within a RecipesProvider');
    }
    return context;
};

const RecipesContext = createContext<RecipesContextType | undefined>(undefined);

interface RecipesProviderProps {
    children: ReactNode;
}

export const RecipesProvider: React.FC<RecipesProviderProps> = ({ children }) => {
    const [recipeState, setRecipeState] = useState<RecipesState>(defaultRecipesState);

    const fetchRecipes = async (searchParams?: SearchParams) => {
        try {
            const response = await axiosInstance.get(`recipes`, { 
                    params: searchParams 
                }
            );

            let recipesImgsToLoad: Recipe[] = []

            // keep the recipe images from the state that haven't been updated
            response.data.forEach((recipe: Recipe) => {
                const existingRecipe = recipeState.recipes.find((r: Recipe) => r.imageName === recipe.imageName);
                if (existingRecipe) {
                    recipe.image = existingRecipe.image;
                } else {
                    recipesImgsToLoad.push(recipe);
                }
            });

            setRecipeState({ ...recipeState, recipes: response.data });

            // get the image for each recipe that has updated
            const newRecipesImgs = await Promise.all(recipesImgsToLoad.map(async (recipe: Recipe) => {
                try {
                    if (recipe.imageName) {
                        const response = await fetch(`${import.meta.env.VITE_BACKEND}/images/${recipe.imageName}`);
                        const blob = await response.blob();
                
                        recipe.image = new File([blob], recipe.imageName, { type: blob.type });
                    }
                } catch (error) {
                    console.error(error);
                }
                return recipe;
            }));

            // add the new images to the recipes state
            setRecipeState((prevState) => {
                const updatedRecipes = prevState.recipes.map((r: Recipe) => {
                    const updatedRecipe = newRecipesImgs.find((newRecipe) => newRecipe.imageName === r.imageName);
                    return updatedRecipe ? { ...r, image: updatedRecipe.image } : r;
                });
                return { ...prevState, recipes: updatedRecipes };
            });

        } catch (error) {
            console.log(error);
        }
    };

    const createRecipe = async (recipe: Recipe) => {
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
                    'Content-Type': 'multipart/form-data',
                },
            });
        
            fetchRecipes();
        } catch (error) {
            console.log(error);
        }
    };

    const updateRecipe = async (recipeID: string, recipe: Recipe) => {
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
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchRecipes();
        } catch (error) {
            console.log(error);
        }
    }

    const deleteRecipe = async (recipeId: string) => {
        try {
            await axiosInstance.delete(`recipes/${recipeId}`);
            fetchRecipes();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <RecipesContext.Provider value={{ 
            recipeState, 
            fetchRecipes, 
            createRecipe, 
            updateRecipe, 
            deleteRecipe
        }}>
            {children}
        </RecipesContext.Provider>
    );
};

export default RecipesProvider;