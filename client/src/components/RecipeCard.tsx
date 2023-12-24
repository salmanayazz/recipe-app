import { NavLink } from "react-router-dom";
import { Recipe } from "../contexts/recipes/RecipesContext";
import Header2 from "./headers/Header2";
import Paragraph from "./Paragraph";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
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
        <div className="w-full h-40"></div>
      )}

      <div>
        <Header2 text={recipe.name} />
        <Paragraph text={`By: ${recipe.username}`} />
      </div>
    </NavLink>
  ) : null;
}
