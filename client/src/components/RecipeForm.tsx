import { Recipe } from '../contexts/RecipesContext';

import DynamicInputList, { TextValue } from "./DynamicInputList";
import TextInput from "./TextInput";
import Button from "./buttons/Button";
import Header2 from "./headers/Header2";

interface RecipeFormProps {
    recipe?: Recipe
    name: string
    setName: React.Dispatch<React.SetStateAction<string>>
    ingredients: TextValue[]
    setIngredients: React.Dispatch<React.SetStateAction<TextValue[]>>
    directions: TextValue[]
    setDirections: React.Dispatch<React.SetStateAction<TextValue[]>>
    afterSubmit: (recipe: Recipe) => void
}

export default function RecipeForm({
    recipe,
    name,
    setName,
    ingredients,
    setIngredients,
    directions,
    setDirections,
    afterSubmit
}: RecipeFormProps) {
    
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        let ingredientValues: string[] = removeEmpty(ingredients.map((ingredient) => ingredient.value));
        let directionValues: string[] = removeEmpty(directions.map((direction) => direction.value));

        
        let newRecipe: Recipe = {
            _id: '', // handled by backend
            username: '',
            name: name,
            ingredients: ingredientValues,
            directions: directionValues
        }
        
        afterSubmit(newRecipe);
    }

    function removeEmpty(array: string[]): string[] {
        let arrayCopy: string[] = [];
        array.forEach((value) => {
            if (value.length > 0) {
                arrayCopy.push(value);
            }
        })
        return arrayCopy;
    }

    function updateIngredient(index: number, value: string) {
        let newIngredients = [...ingredients];
        newIngredients[index].value = value;
        setIngredients(newIngredients);
    }

    function updateDirection(index: number, value: string) {
        let newDirections = [...directions];
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


    return(
        <form
            onSubmit={(e) => handleSubmit(e)} 
        >
            <div>
                <Header2
                    text='Recipe Name'
                />
                <TextInput
                    onChange={(value) => { setName(value) }}
                    textValue={name}
                    autoFocus={true}
                />
            </div>

            <div>
                <Header2
                    text='Ingredients'
                />

                <DynamicInputList
                    textValues={ingredients} 
                    removeAt={removeIngredient}
                    onChange={updateIngredient}  
                    increaseCount={() => {setIngredients(ingredients.concat([new TextValue('')]))}}             
                />
            </div>

            <div>
                <Header2
                    text='Directions'
                />

                <DynamicInputList
                    textValues={directions} 
                    removeAt={removeDirection}
                    onChange={updateDirection}   
                    increaseCount={() => {setDirections(directions.concat([new TextValue('')]))}}
                    orderedList={true}
                />
            </div>
            <div>
                <div
                    className="flex items-center justify-evenly py-3"
                >
                    <Button 
                        type='button' 
                        element='Reset'
                        onClick={() => {
                            setName('');
                            setIngredients([new TextValue('')]);
                            setDirections([new TextValue('')]);
                        }}
                    />

                    <Button 
                        type='submit' 
                        element='Save'
                    />   
                </div>
                
            </div>
            
            
        </form> 
    );
}