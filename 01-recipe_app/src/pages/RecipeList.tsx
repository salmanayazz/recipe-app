import { NavLink, Outlet } from 'react-router-dom';

import { useAppSelector } from '../app/hooks';
import Button from '../components/Button';
import Recipe from '../models/Recipe';

import {
    selectRecipes
} from '../features/recipes/recipesSlice';



export default function RecipeList() {
    const recipes = useAppSelector(selectRecipes);
    
    return (
        <div 
            className="flex flex-col bg-pri-100 text-sec-100 min-h-screen min-w-screen 
            items-center"
        >
            <NavLink to="create">
                <Button 
                    text={'Create Recipe'} 
                />
            </NavLink>

            { recipes.map((recipe: Recipe) => (
                <NavLink 
                    key={recipe.name}
                    to={recipe.name}
                >
                    <div 
                        key={recipe.name}
                    >
                        <h1 className="text-3xl font-bold">{recipe.name}</h1>
                    </div>
                </NavLink>
            ))}
            
            <Outlet />
        </div>
    );
}