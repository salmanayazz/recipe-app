import { NavLink, Outlet } from 'react-router-dom';
import { useEffect } from 'react';

import AddButton from '../components/buttons/AddButton';
import Recipe from '../models/Recipe';
import Header1 from '../components/headers/Header1';
import HorizontalLine from '../components/HorizontalLine';
import PopupAlert from '../components/PopupAlert';
import RecipeCard from '../components/RecipeCard';

import { useRecipes } from '../contexts/RecipesContext';



export default function RecipeList() {
    const { state, fetchRecipes } = useRecipes();
    const recipes: Recipe[] | undefined = state.recipes;
    
    useEffect(() => {
        fetchRecipes()
    }, []);
    
    return (
        <div 
            className="flex flex-col bg-pri-100 text-sec-100 min-h-screen min-w-screen
            items-center py-2 overflow-y-auto"
        >   
            <div 
                className='w-[90%]'
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
                    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                >
                    {recipes?.map((recipe: Recipe) => (
                        <RecipeCard 
                            recipe={recipe}
                        />
                    ))}
                </div>
            </div>
            
            <PopupAlert />
            
        </div>
    );
}