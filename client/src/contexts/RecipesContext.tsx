import React, { useState, createContext, ReactNode, useContext } from 'react';
import { axiosInstance } from '../redux/authSlice';

export interface Recipe {
    _id: string;
    name: string;
    username: string;
    ingredients: string[];
    directions: string[];
}

interface RecipesState {
    recipes: Recipe[];
}

interface RecipesContextType {
    state: RecipesState;
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
    const [state, setState] = useState<RecipesState>(defaultRecipesState);

    const fetchRecipes = async (searchParams?: SearchParams) => {
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_BACKEND}/recipes`, { 
                    params: searchParams 
                }
            );
            setState({ ...state, recipes: response.data });
        } catch (error) {
            console.log(error);
        }
    };

    const createRecipe = async (recipe: Recipe) => {
        try {
            await axiosInstance.post(`${process.env.REACT_APP_BACKEND}/recipes`, recipe);
            fetchRecipes();
        } catch (error) {
            console.log(error);
        }
    }

    const updateRecipe = async (recipeID: string, recipe: Recipe) => {
        try {
            await axiosInstance.put(`${process.env.REACT_APP_BACKEND}/recipes/${recipeID}`, recipe);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteRecipe = async (recipeId: string) => {
        try {
            await axiosInstance.delete(`${process.env.REACT_APP_BACKEND}/recipes/${recipeId}`);
            fetchRecipes();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <RecipesContext.Provider value={{ 
            state, 
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