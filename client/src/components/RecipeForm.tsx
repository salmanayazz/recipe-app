import { useEffect, useState } from 'react';
import { Recipe, useRecipes } from '../contexts/RecipesContext';

import DynamicInputList, { TextValue } from "./DynamicInputList";
import TextInput from "./TextInput";
import Button from "./buttons/Button";
import Header2 from "./headers/Header2";
import { useDropzone } from 'react-dropzone';

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

    useEffect(() => {
        if (recipe?.image) {
            setImage(recipe.image);
        }
    }, []);

    const [image, setImage] = useState<File | undefined>(undefined);

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
          'image/*': []
        },
        onDrop: (acceptedFiles) => {
          // set the selected image file
          setImage(acceptedFiles[0]);
        },
    });
    
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        let ingredientValues: string[] = removeEmpty(ingredients.map((ingredient) => ingredient.value));
        let directionValues: string[] = removeEmpty(directions.map((direction) => direction.value));

        
        let newRecipe: Recipe = {
            name: name,
            ingredients: ingredientValues,
            directions: directionValues,
            image: image
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
            className='flex flex-col gap-3'
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

            <div
                className='flex flex-col gap-2'
            >
                <Header2 
                    text='Image'
                />
                <div {...getRootProps()} className="border-dashed border-2 border-sec-200 rounded-md p-4 text-center cursor-pointer">
                    <input {...getInputProps()} />
                    {image ? (
                        <div
                            className='flex flex-col gap-2'
                        >   
                            <p className="text-lg font-semibold">Selected Image</p>
                            <img
                                src={URL.createObjectURL(image)}
                                alt="recipe"
                                className="mx-auto rounded-md shadow-md h-40 object-contain"
                            />
                            <Button 
                                type='button' 
                                element='Remove Image'
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setImage(undefined)
                                }}
                            />
                        </div>   
                    ) : (
                        <>
                            <p className="text-lg font-semibold">Drag and Drop Image Here</p>
                            <p className="text-sec-200">or click to select one</p>
                        </>
                    )}
                </div>
            </div>
    
            <div className="flex gap-3">
                <Button 
                    type='button' 
                    element='Reset'
                    onClick={() => {
                        setName('');
                        setIngredients([new TextValue('')]);
                        setDirections([new TextValue('')]);
                        setImage(undefined);
                    }}
                />

                <Button 
                    type='submit' 
                    element='Save'
                />
            </div>
        </form> 
    );
}