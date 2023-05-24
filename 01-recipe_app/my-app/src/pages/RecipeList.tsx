import { useAppSelector, useAppDispatch } from '../app/hooks';
import Recipe from '../models/Recipe';

import {
    addRecipe, // TODO remove
    selectRecipes
} from '../features/recipes/recipesSlice';

export default function RecipeList() {
    const recipes = useAppSelector(selectRecipes);
    const dispatch = useAppDispatch();
    console.table(recipes);
    
    return (
        <div className="flex flex-col justify-center bg-pri-100">
            <div>test</div>
            <button className="bg-sec-100" onClick={() => dispatch(addRecipe(new Recipe("1", [], [])))}>click</button>
            { recipes.map((recipe: Recipe) => (
                <div key={recipe.name}>
                    <h1 className="text-3xl font-bold">{recipe.name}</h1>
                </div>
            ))}
        </div>
    );
}