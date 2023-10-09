import { NavLink, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../app/hooks';
import { useEffect } from 'react';
import { AppDispatch } from '../app/store';

import AddButton from '../components/buttons/AddButton';
import Recipe from '../models/Recipe';
import Header2 from '../components/headers/Header2';
import Header1 from '../components/headers/Header1';
import HorizontalLine from '../components/HorizontalLine';
import PopupAlert from '../components/PopupAlert';
import RecipeCard from '../components/RecipeCard';

import {
    getRecipes,
    fetchRecipes
} from '../redux/recipesSlice';



export default function RecipeList() {
    const dispatch = useDispatch<AppDispatch>();
    const recipes: Recipe[] = useAppSelector(getRecipes);
    
    useEffect(() => {
        dispatch(fetchRecipes());
    }, [dispatch]);
    
    return (
        <div 
            className="flex flex-col bg-pri-100 text-sec-100 min-h-screen min-w-screen
            items-center py-2 overflow-y-auto"
        >   
            <div 
                className='w-[90%] md:w-[75%]'
            >
                <div
                    className='flex items-center gap-4'
                >
                    <Header1
                        text='Saved Recipes'
                    />

                    <NavLink 
                        to="create"
                        className='flex justify-center items-center'
                    >
                        <AddButton />
                    </NavLink>
                </div>
                <HorizontalLine />
                

                <div
                    className='grid grid-cols-auto-fit-20 
                    grid-rows-300 justify-center gap-5 my-4 w-100'
                >
                    {recipes.map((recipe: Recipe) => (
                        recipe._id ? (
                            <NavLink 
                                key={recipe._id}
                                to={recipe._id}
                                className='flex items-center bg-pri-200 rounded-md px-4 py-2'
                            >
                                <RecipeCard 
                                    recipe={recipe}
                                />
                            </NavLink>
                            
                        ) : (
                            null
                        )
                    ))}
                </div>
            </div>
            
            <PopupAlert />

        </div>
    );
}