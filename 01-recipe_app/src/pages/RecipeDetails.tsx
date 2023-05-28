import { useParams } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

import PopupWindow from '../components/PopupWindow';
import Header1 from '../components/headers/Header1';
import Header2 from '../components/headers/Header2';
import List from '../components/List';
import HorizontalLine from '../components/HorizontalLine';

import {
    selectRecipes
} from '../features/recipes/recipesSlice';
import Paragraph from '../components/Paragraph';




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

                        <Paragraph
                            text={`Last Modified: ${recipe.lastModified}`}
                        />

                        <HorizontalLine />
                        
                        <Header2
                            text="Ingredients"
                        />

                        <List
                            isOrdered={false}
                            values={recipe.ingredients}
                        />
                        
                        <Header2
                            text="Directions"
                        />

                        <List
                            isOrdered={true}
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