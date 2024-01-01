import { NavLink } from "react-router-dom";
import { Recipe, useRecipes } from "../contexts/recipes/RecipesContext";
import Header2 from "./headers/Header2";
import Paragraph from "./Paragraph";
import LoadingAnimation from "./LoadingAnimation";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { recipeState } = useRecipes();

  return recipe._id ? (
    <NavLink
      key={recipe._id}
      to={recipe._id}
      className="flex flex-col bg-pri-200 rounded-md px-4 py-2"
    >
      {recipe.image ? (
        <img
          className="rounded-md object-contain w-full h-40"
          src={URL.createObjectURL(recipe.image)}
        />
      ) : (
        /* creates space to keep card height consistent */
        <div className="flex justify-center items-center w-full h-40">
          {recipeState.fetchingImages && recipe.imageName && (
            <LoadingAnimation />
          )}
        </div>
      )}

      <div>
        <Header2 text={recipe.name} />
        <Paragraph text={`By: ${recipe.username}`} />
      </div>
    </NavLink>
  ) : null;
}
