import { useParams } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

import PopupWindow from '../components/PopupWindow';
import Header1 from '../components/headers/Header1';
import Header2 from '../components/headers/Header2';
import OrderedList from '../components/lists/OrderedList';
import UnorderedList from '../components/lists/UnorderedList';

import {
    selectRecipes
} from '../features/recipes/recipesSlice';

export default function RecipeDetails() {
    let { recipeId } = useParams();
    const recipes = useAppSelector(selectRecipes);
    const recipe = recipes.find((recipe) => recipe.id === recipeId);

    return (
        <PopupWindow
            element={
                recipe ? (
                    <>
                        <Header1
                            text={recipe.name}
                        />
                        
                        <Header2
                            text="Ingredients"
                        />

                        <UnorderedList
                            values={recipe.ingredients}
                        />
                        
                        <Header2
                            text="Directions"
                        />

                        <OrderedList
                            values={recipe.directions}
                        />
                    </>
                ) : (
                    <Header1
                        text='No Recipe found'
                    />
                )
            }
        />
    )
}