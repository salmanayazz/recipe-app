import { NavLink, Outlet } from 'react-router-dom';

import { useAppSelector } from '../app/hooks';

import AddButton from '../components/buttons/AddButton';
import Recipe from '../models/Recipe';
import Header2 from '../components/headers/Header2';

import {
    selectRecipes
} from '../features/recipes/recipesSlice';
import Header1 from '../components/headers/Header1';


export default function RecipeList() {
    const recipes = useAppSelector(selectRecipes);
    
    return (
        <div 
            className="flex flex-col bg-pri-100 text-sec-100 min-h-screen min-w-screen 
            items-center"
        >   
            <div
                className='w-3/4'
            >
                <div
                    className='flex'
                >
                    <Header1
                        text='Saved Recipes'
                    />
                    <NavLink to="create">
                        <AddButton />
                    </NavLink>
                </div>
                

                <div
                    className='flex flex-col gap-5'
                >
                    { recipes.map((recipe: Recipe) => (
                        <NavLink 
                            key={recipe.name}
                            to={recipe.name}
                            className='w-full bg-pri-200 rounded-md px-4 py-5'
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