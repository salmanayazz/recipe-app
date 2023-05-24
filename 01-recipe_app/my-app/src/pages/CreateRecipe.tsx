import { useAppSelector, useAppDispatch } from '../app/hooks';

import {
    addRecipe
} from '../features/recipes/recipesSlice';

export default function CreateRecipe() {

    function handleSubmit() {

    }

    function increaseIngredients() {

    }

    function increaseInstructions() {

    }

    return (
        <form
            onSubmit={handleSubmit} 
            className="flex flex-col">
            
        </form>
    );
}