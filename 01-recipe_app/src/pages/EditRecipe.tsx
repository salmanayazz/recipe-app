import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useNavigate, useParams } from 'react-router-dom';

import { TextValue } from '../components/DynamicInputList';
import PopupWindow from '../components/PopupWindow';
import Header1 from '../components/headers/Header1';
import HorizontalLine from '../components/HorizontalLine';
import RecipeForm from '../components/RecipeForm';

import PopupAlert from '../components/PopupAlert';

import Recipe from '../models/Recipe';

import {
    updateRecipe,
    selectRecipes
} from '../features/recipes/recipesSlice';


export default function EditRecipe() {
    let { recipeId } = useParams();
    const recipes: Recipe[] = useAppSelector(selectRecipes);
    const recipe: Recipe | undefined = recipes.find((recipe) => recipe.id === recipeId);
    
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState<string>((recipe ? recipe.name : ''));
    const [ingredients, setIngredients] = useState<TextValue[]>(generateTextValue(recipe?.ingredients));
    const [directions, setDirections] = useState<TextValue[]>(generateTextValue(recipe?.directions));

    const [error, setError] = useState<any>();

    function afterSubmit(newRecipe: Recipe) {
        try {
            dispatch(updateRecipe(newRecipe));
        } catch(e) {
            console.log(e);
            return;
        }
        
        returnHome();
    }

    function generateTextValue(array: string[] | undefined): TextValue[]  {
        let textValues: TextValue[] = [];
        array?.forEach((value) => {
            textValues.push(new TextValue(value));
        })
        return textValues
    }

    function returnHome() {
        navigate(-2);
    }

    return (
        <>
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
                            setError={setError}
                        />
                    </>
                }
                onExit={returnHome}
            />
        
        {error ? ( // TODO: remove this error and place somewehre else
            <PopupAlert 
                element={error}
                type='error'
            />

        ) : (
            null
        )}
        </>
    );
}