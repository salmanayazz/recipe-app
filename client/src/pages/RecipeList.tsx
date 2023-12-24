import { Outlet } from "react-router-dom";
import { useEffect } from "react";

import { Recipe } from "../contexts/recipes/RecipesContext";
import Header1 from "../components/headers/Header1";
import HorizontalLine from "../components/HorizontalLine";
import RecipeCard from "../components/RecipeCard";

import { useRecipes } from "../contexts/recipes/RecipesContext";

export default function RecipeList() {
  const { recipeState, fetchRecipes } = useRecipes();
  const recipes: Recipe[] | undefined = recipeState.recipes;

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div
      className="flex flex-col bg-pri-100 text-sec-100
            items-center py-2 overflow-y-auto"
    >
      <div className="w-[90%]">
        <div className="flex items-center gap-4">
          <Header1 text="Discover Your Next Meal" />
        </div>
        <HorizontalLine />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recipes?.map((recipe: Recipe) => (
            <div key={recipe._id}>
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      </div>

      <Outlet />
    </div>
  );
}
