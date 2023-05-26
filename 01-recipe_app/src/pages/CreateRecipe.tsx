import { useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { useNavigate } from 'react-router-dom';

import TextInput from '../components/TextInput';
import DynamicInputCount, { TextValue } from '../components/DynamicInputCount';
import Button from '../components/buttons/Button';
import PopupWindow from '../components/PopupWindow';

import Recipe from '../models/Recipe';

import {
    addRecipe
} from '../features/recipes/recipesSlice';

export default function CreateRecipe() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState<string>('');
    const [ingredients, setIngredients] = useState<TextValue[]>([new TextValue("")]);
    const [directions, setDirections] = useState<TextValue[]>([new TextValue("")]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        let ingredientValues: string[] = ingredients.map((ingredient) => ingredient.value);
        let directionValues: string[] = directions.map((direction) => direction.value);

        let recipe = new Recipe(name, ingredientValues, directionValues);
        dispatch(addRecipe(recipe));
        navigate(-1);
    }

    function updateIngredient(index: number, value: string) {
        let newIngredients = [...ingredients];
        newIngredients[index].value = value;
        setIngredients(newIngredients);
    }

    function updateDirection(index: number, value: string) {
        let newDirections = directions;
        newDirections[index].value = value;
        setDirections(newDirections);
    }

    function removeIngredient(index: number) {
        let ingredientsCopy = [...ingredients];
        ingredientsCopy.splice(index, 1);
        setIngredients(ingredientsCopy);
    }

    function removeDirection(index: number) {
        let directionsCopy = [...directions];
        directionsCopy.splice(index, 1);
        setDirections(directionsCopy);
    }

    return (
        <PopupWindow 
            element={
                <form
                    onSubmit={(e) => handleSubmit(e)} 
                >
                    <h1
                        className=""
                    >
                        New Recipe
                    </h1>

                    <div>
                        <TextInput
                            placeholder="Recipe Name"
                            onChange={(value) => { setName(value) }}
                        />
                    </div>

                    <div>
                        <h2>
                            Ingredients
                        </h2>

                        <DynamicInputCount
                            textValues={ingredients} 
                            removeAt={removeIngredient/* TODO: fix */}
                            onChange={updateIngredient}  
                            increaseCount={() => { setIngredients(ingredients.concat([new TextValue('')])) }}             
                        />
                    </div>

                    <div>
                        <h2>
                            Directions
                        </h2>

                        <DynamicInputCount
                            textValues={directions} 
                            removeAt={removeDirection/* TODO: fix */}
                            onChange={updateDirection}   
                            increaseCount={() => { setDirections(directions.concat([new TextValue('')])) }}
                        />
                    </div>

                    <Button 
                        type='submit' 
                        text='Save Recipe'
                    />
                    
                </form> 
            }
        />
    );
}