import { useParams } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

import PopupWindow from '../components/PopupWindow';

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
        <PopupWindow
            element={
                <>
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
                </>
            }
        />
    )
}