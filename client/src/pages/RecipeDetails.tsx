import { useParams, NavLink, useNavigate } from 'react-router-dom';

import PopupWindow from '../components/PopupWindow';
import Header1 from '../components/headers/Header1';
import Header2 from '../components/headers/Header2';
import List from '../components/List';
import HorizontalLine from '../components/HorizontalLine';
import EditButton from '../components/buttons/EditButton'
import DeleteButton from '../components/buttons/DeleteButton'
import Paragraph from '../components/Paragraph';

import { useRecipes } from '../contexts/recipes/RecipesContext';
import { useAuth } from '../contexts/auth/AuthContext';


export default function RecipeDetails() {
    const { authState } = useAuth();
    const { recipeState, deleteRecipe } = useRecipes();
    const navigate = useNavigate();

    const { recipeId } = useParams();
    const recipes = recipeState.recipes;
    const recipe = recipes?.find((recipe) => recipe._id === recipeId);

    function handleDelete(): void {
        if (!recipe || !recipe._id) {return}
        try {
            deleteRecipe(recipe._id);
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

                            {/* only show edit and delete buttons if user owns it */}
                            {recipe.username === authState.user?.username && (
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
                            )}
                        </div>
                        

                        <Paragraph
                            text={`By: ${recipe.username}`}
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