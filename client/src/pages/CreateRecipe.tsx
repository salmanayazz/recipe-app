import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { TextValue } from "../components/DynamicInputList";
import PopupWindow from "../components/PopupWindow";
import Header1 from "../components/headers/Header1";
import HorizontalLine from "../components/HorizontalLine";
import RecipeForm from "../components/RecipeForm";

import { Recipe } from "../contexts/recipes/RecipesContext";
import { useRecipes } from "../contexts/recipes/RecipesContext";

export default function CreateRecipe() {
  const navigate = useNavigate();

  const { createRecipe } = useRecipes();

  const [name, setName] = useState<string>("");
  const [ingredients, setIngredients] = useState<TextValue[]>([
    new TextValue(""),
  ]);
  const [directions, setDirections] = useState<TextValue[]>([
    new TextValue(""),
  ]);

  function afterSubmit(recipe: Recipe) {
    try {
      createRecipe(recipe);
    } catch (e) {
      console.log(e);
      return;
    }
    returnHome();
  }

  function returnHome() {
    navigate(-1);
  }

  return (
    <PopupWindow
      element={
        <>
          <Header1 text="New Recipe" />

          <HorizontalLine />

          <RecipeForm
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
