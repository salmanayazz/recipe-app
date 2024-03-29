import { useEffect, useState } from "react";
import { Recipe, RecipeError } from "../contexts/recipes/RecipesContext";

import DynamicInputList, { TextValue } from "./DynamicInputList";
import TextInput from "./TextInput";
import Button from "./buttons/Button";
import Header2 from "./headers/Header2";
import { useDropzone } from "react-dropzone";

/**
 * props for the RecipeForm component
 * @param recipe
 * the recipe to edit
 * @param name
 * the name of the recipe
 * @param setName
 * function to set the name of the recipe
 * @param ingredients
 * the ingredients of the recipe
 * @param setIngredients
 * function to set the ingredients of the recipe
 * @param directions
 * the directions of the recipe
 * @param setDirections
 * function to set the directions of the recipe
 * @param afterSubmit
 * function to call after the form is submitted
 */
interface RecipeFormProps {
  recipe?: Recipe;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  ingredients: TextValue[];
  setIngredients: React.Dispatch<React.SetStateAction<TextValue[]>>;
  directions: TextValue[];
  setDirections: React.Dispatch<React.SetStateAction<TextValue[]>>;
  afterSubmit: (recipe: Recipe) => Promise<RecipeError | undefined>;
}

export default function RecipeForm({
  recipe,
  name,
  setName,
  ingredients,
  setIngredients,
  directions,
  setDirections,
  afterSubmit,
}: RecipeFormProps) {
  const [image, setImage] = useState<File | undefined>(undefined);
  const [recipeError, setRecipeError] = useState<RecipeError | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // load the recipe image data if it exists
    if (recipe?.image) {
      setImage(recipe.image);
    }
  }, [recipe?.image]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      // set the selected image file
      setImage(acceptedFiles[0]);
    },
  });

  /**
   * handles the submit of the form and creates a new recipe
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const ingredientValues: string[] = removeEmpty(
      ingredients.map((ingredient) => ingredient.value)
    );
    const directionValues: string[] = removeEmpty(
      directions.map((direction) => direction.value)
    );

    const newRecipe: Recipe = {
      name: name,
      ingredients: ingredientValues,
      directions: directionValues,
      image: image,
    };

    setLoading(true);
    setRecipeError(await afterSubmit(newRecipe));
    setLoading(false);
  }

  /**
   * removes empty strings from an array
   */
  function removeEmpty(array: string[]): string[] {
    const arrayCopy: string[] = [];
    array.forEach((value) => {
      if (value.length > 0) {
        arrayCopy.push(value);
      }
    });
    return arrayCopy;
  }

  /**
   * updates the value of an ingredient at a given index
   */
  function updateIngredient(index: number, value: string) {
    const newIngredients = [...ingredients];
    newIngredients[index].value = value;
    setIngredients(newIngredients);
  }

  /**
   * updates the value of a direction at a given index
   */
  function updateDirection(index: number, value: string) {
    const newDirections = [...directions];
    newDirections[index].value = value;
    setDirections(newDirections);
  }

  /**
   * removes an ingredient at a given index
   */
  function removeIngredient(index: number) {
    const ingredientsCopy = [...ingredients];
    ingredientsCopy.splice(index, 1);
    setIngredients(ingredientsCopy);
  }

  /**
   * removes a direction at a given index
   */
  function removeDirection(index: number) {
    const directionsCopy = [...directions];
    directionsCopy.splice(index, 1);
    setDirections(directionsCopy);
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-3">
      {/* text inputs */}
      <div>
        <Header2 text="Recipe Name" />
        <TextInput
          onChange={(value) => {
            setName(value);
          }}
          textValue={name}
          autoFocus={true}
          error={recipeError?.name}
        />
      </div>

      <div>
        <Header2 text="Ingredients" />

        <DynamicInputList
          textValues={ingredients}
          removeAt={removeIngredient}
          onChange={updateIngredient}
          increaseCount={() => {
            setIngredients(ingredients.concat([new TextValue("")]));
          }}
          error={recipeError?.ingredients}
        />
      </div>

      <div>
        <Header2 text="Directions" />

        <DynamicInputList
          textValues={directions}
          removeAt={removeDirection}
          onChange={updateDirection}
          increaseCount={() => {
            setDirections(directions.concat([new TextValue("")]));
          }}
          orderedList={true}
          error={recipeError?.directions}
        />
      </div>

      {/* image upload */}
      <div className="flex flex-col gap-2">
        <Header2 text="Image" />
        <div
          {...getRootProps()}
          className="border-dashed border-2 border-sec-200 rounded-md p-4 text-center cursor-pointer"
        >
          <input {...getInputProps()} />
          {image ? (
            <div className="flex flex-col gap-2">
              <p className="text-lg font-semibold">Selected Image</p>
              <img
                src={URL.createObjectURL(image)}
                alt="recipe"
                className="mx-auto rounded-md shadow-md h-40 object-contain"
              />
              {recipeError?.image && (
                <p className="text-red-500 mt-1">{recipeError.image}</p>
              )}
              <Button
                type="button"
                element="Remove Image"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setImage(undefined);
                }}
              />
            </div>
          ) : (
            <>
              <p className="text-lg font-semibold">Drag and Drop Image Here</p>
              <p className="text-sec-200">or click to select one</p>
              {recipeError?.image && (
                <p className="text-red-500 mt-1">{recipeError.image}</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          element="Reset"
          onClick={() => {
            setName("");
            setIngredients([new TextValue("")]);
            setDirections([new TextValue("")]);
            setImage(undefined);
          }}
        />

        <Button
          type="submit"
          element="Save"
          error={recipeError?.other}
          onClick={() => {
            setRecipeError(undefined);
          }}
          loading={loading}
        />
      </div>
    </form>
  );
}
