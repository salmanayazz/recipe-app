import { NavLink, Outlet } from 'react-router-dom';

import { useAppSelector } from '../app/hooks';

import AddButton from '../components/buttons/AddButton';
import Recipe from '../models/Recipe';
import Header2 from '../components/headers/Header2';

import {
    selectRecipes
} from '../features/recipes/recipesSlice';
import Header1 from '../components/headers/Header1';
import Button from '../components/buttons/Button';
import HorizontalLine from '../components/HorizontalLine';


export default function RecipeList() {
    const recipes = useAppSelector(selectRecipes);
    
    return (
        <div 
            className="flex flex-col bg-pri-100 text-sec-100 min-h-screen min-w-screen 
            items-center py-2 overflow-y-auto"
        >   
            <div
                className='w-3/4'
            >
                <div
                    className='flex items-center gap-2'
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
                    className='flex flex-col justify-center items-center gap-5 my-4'
                >
                    { recipes.map((recipe: Recipe) => (
                        <NavLink 
                            key={recipe.id}
                            to={recipe.id}
                            className='flex items-center w-full bg-pri-200 rounded-md px-4 py-2'
                        >
                            <Header2
                                text={recipe.name}
                            />
                        </NavLink>
                    ))}
                </div>
            </div>
            

            {/* outlet to render RecipeDetails and CreateRecipe pages ontop of this page */ }
            <Outlet />
        </div>
    );
}