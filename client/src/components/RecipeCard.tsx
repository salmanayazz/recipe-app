import { NavLink, Outlet } from 'react-router-dom';
import Recipe from '../models/Recipe' 
import Header2 from './headers/Header2';
import Paragraph from './Paragraph';

interface RecipeCardProps {
    recipe: Recipe;
}

export default function RecipeCard({
    recipe
}: RecipeCardProps) {

    return (
        recipe._id ? (
            <NavLink 
                key={recipe._id}
                to={recipe._id}
                className='flex flex-col bg-pri-200 rounded-md px-4 py-2'
            >
                <img src='https://img.traveltriangle.com/blog/wp-content/uploads/2019/08/Vancouver-Food_23rd-oct.jpg'>
                </img>
                <div>
                    <Header2
                        text={recipe.name}
                    />
                    <Paragraph
                        text={`By: ${recipe.username}`}
                    />
                </div>
            </NavLink>
        ) : (
            null
        )
    )
} 