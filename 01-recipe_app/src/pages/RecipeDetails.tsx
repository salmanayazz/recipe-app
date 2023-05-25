import { useParams } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

import {
    selectRecipes
} from '../features/recipes/recipesSlice';


export default function RecipeDetails() {
    let { recipeName } = useParams();
    console.log('the name is: ', recipeName);
    const recipes = useAppSelector(selectRecipes);
    console.table(recipes || 'no recipes');
    const recipe = recipes.find((recipe) => recipe.name === recipeName);

    return (
        <div 
            // blured background
            className="fixed top-0 left-0 w-screen h-screen bg-pri-100 bg-opacity-0 z-0 pointer-events-none"
        >
            <div
                className="flex flex-col bg-pri-100 text-sec-100
                items-center z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"   
            >
                <h1>{recipe ? recipe.name : 'error recipe not found'}</h1>
                <h2>Ingredients</h2>
                <ul>
                    {recipe?.ingredients.map((ingredient) => (
                        <li key={ingredient}>{ingredient}</li>
                    ))}
                </ul>
                <h2>Directions</h2>
                <ol>
                    {recipe?.directions.map((direction) => (
                        <li key={direction}>{direction}</li>
                    ))}
                </ol>
            </div>
        </div>
    )
}