import { useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { useNavigate } from 'react-router-dom';

import TextInput from '../components/TextInput';
import DynamicInputList, { TextValue } from '../components/DynamicInputList';
import Button from '../components/buttons/Button';
import PopupWindow from '../components/PopupWindow';
import Header1 from '../components/headers/Header1';
import Header2 from '../components/headers/Header2';

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
                    <Header1
                        text='New Recipe'
                    />

                    <div>
                        <Header2
                            text='Recipe Name'
                        />
                        <TextInput
                            onChange={(value) => { setName(value) }}
                        />
                    </div>

                    <div>
                        <Header2
                            text='Ingredients'
                        />

                        <DynamicInputList
                            textValues={ingredients} 
                            removeAt={removeIngredient/* TODO: fix */}
                            onChange={updateIngredient}  
                            increaseCount={() => { setIngredients(ingredients.concat([new TextValue('')])) }}             
                        />
                    </div>

                    <div>
                        <Header2
                            text='Directions'
                        />

                        <DynamicInputList
                            textValues={directions} 
                            removeAt={removeDirection/* TODO: fix */}
                            onChange={updateDirection}   
                            increaseCount={() => { setDirections(directions.concat([new TextValue('')])) }}
                            orderedList={true}
                        />
                    </div>

                    <Button 
                        type='submit' 
                        text='Save'
                    />
                    
                </form> 
            }
        />
    );
}