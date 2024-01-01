import { Outlet } from "react-router-dom";

import Header1 from "../components/headers/Header1";
import HorizontalLine from "../components/HorizontalLine";
import RecipeCard from "../components/RecipeCard";
import LoadingAnimation from "../components/LoadingAnimation";

import { useEffect, useState } from "react";
import { Recipe } from "../contexts/recipes/RecipesContext";
import { useRecipes, RecipeError } from "../contexts/recipes/RecipesContext";
import Navbar from "../components/Navbar";

export default function RecipeList() {
  const { recipeState, fetchRecipes } = useRecipes();
  const recipes: Recipe[] | undefined = recipeState.recipes;

  const [recipeError, setRecipeError] = useState<RecipeError | undefined>(
    undefined
  );

  useEffect(() => {
    async function fetchData() {
      setRecipeError(await fetchRecipes());
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-pri-100 text-sec-100 overflow-y-auto">
      <Navbar />
      <div
        className="flex flex-col bg-pri-100 text-sec-100
              items-center py-2 flex-1 pb-10"
      >
        <div className="flex flex-col w-[90%] h-full">
          <div className="flex items-center gap-4">
            <Header1 text="Discover Your Next Meal" />
          </div>
          <HorizontalLine />

          {recipeError ? (
            <div className="flex flex-1 justify-center items-center">
              <h1 className="text-red-500 text-3xl font-bold">
                {recipeError.other}
              </h1>
            </div>
          ) : (
            <>
              {recipes && recipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {recipes.map((recipe: Recipe) => (
                    <div key={recipe._id}>
                      <RecipeCard recipe={recipe} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-1 justify-center items-center">
                  {recipeState.fetchingRecipes && <LoadingAnimation />}
                </div>
              )}
            </>
          )}
        </div>

        <Outlet />
      </div>
    </div>
  );
}
