import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useEffect } from 'react';

import PopupWindow from '../components/PopupWindow';
import Header1 from '../components/headers/Header1';
import Header2 from '../components/headers/Header2';
import List from '../components/List';
import HorizontalLine from '../components/HorizontalLine';
import EditButton from '../components/buttons/EditButton'
import DeleteButton from '../components/buttons/DeleteButton'
import Paragraph from '../components/Paragraph';

import {
    getRecipes,
    deleteRecipe
} from '../features/recipesSlice';


export default function RecipeDetails() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    let { recipeId } = useParams();
    console.log('1');
    const recipes = useAppSelector(getRecipes);
    console.log('2');
    const recipe = recipes?.find((recipe) => recipe._id === recipeId);
    console.log('3');

    function handleDelete(): void {
        if (!recipe || !recipe._id) {return}
        try {
            dispatch(deleteRecipe(recipe._id));
        } catch(e) {
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
                recipe ? (
                    <>
                        <div
                            className='flex items-center gap-10'
                        >
                            <Header1
                                text={recipe.name}
                            />
                            <div
                                className='flex items-center gap-4'    
                            >
                                <NavLink
                                    to='edit'
                                    className='flex justify-center items-center'
                                >
                                    <EditButton/>
                                </NavLink>

                                <DeleteButton 
                                    onClick={handleDelete}
                                />
                            </div>
                            
                            
                        </div>
                        

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
            onExit={returnHome}
        />
    )
}