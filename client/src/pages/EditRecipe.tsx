import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { TextValue } from '../components/DynamicInputList';
import PopupWindow from '../components/PopupWindow';
import Header1 from '../components/headers/Header1';
import HorizontalLine from '../components/HorizontalLine';
import RecipeForm from '../components/RecipeForm';

import { Recipe } from '../contexts/recipes/RecipesContext';

import { useRecipes } from '../contexts/recipes/RecipesContext';


export default function EditRecipe() {
    const { recipeId } = useParams();

    const { recipeState, updateRecipe } = useRecipes();

    const recipes: Recipe[] = recipeState.recipes;
    const recipe: Recipe | undefined = recipes.find((recipe) => recipe._id === recipeId);
    
    const navigate = useNavigate();

    const [name, setName] = useState<string>((recipe ? recipe.name : ''));
    const [ingredients, setIngredients] = useState<TextValue[]>(generateTextValue(recipe?.ingredients));
    const [directions, setDirections] = useState<TextValue[]>(generateTextValue(recipe?.directions));

    function afterSubmit(newRecipe: Recipe) {
        try {
            if (recipe && recipe._id) {
                updateRecipe(recipe._id, newRecipe);
            }
        } catch(e) {
            console.log(e);
            return;
        }
        
        returnHome();
    }

    function generateTextValue(array: string[] | undefined): TextValue[]  {
        const textValues: TextValue[] = [];
        array?.forEach((value) => {
            textValues.push(new TextValue(value));
        })
        return textValues
    }

    function returnHome() {
        navigate(-2);
    }

    return (
        <PopupWindow 
            element={
                <>
                    <Header1
                        text='Edit Recipe'
                    />

                    <HorizontalLine />
                    
                    <RecipeForm
                        recipe={recipe}
                        name={name}
                        setName={setName}
                        ingredients={ingredients}
                        setIngredients={setIngredients}
                        directions={directions}    
                        setDirections={setDirections}
                        afterSubmit={afterSubmit}
                    />
                </>
            }
            onExit={returnHome}
        />
    );
}