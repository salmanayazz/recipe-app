import Recipe from '../models/Recipe' 
import Header2 from './headers/Header2';

interface RecipeCardProps {
    recipe: Recipe;
}

export default function RecipeCard({
    recipe
}: RecipeCardProps) {

    return (
        <div
            className=''
        >
            <img src='https://img.traveltriangle.com/blog/wp-content/uploads/2019/08/Vancouver-Food_23rd-oct.jpg'>
            </img>
            <div>
                <Header2
                    text={recipe.name}
                />
            </div>
        </div>
    )
} 