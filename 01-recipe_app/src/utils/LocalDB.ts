import Recipe from '../models/Recipe'

export default class LocalDB {
    // local storage key prefixes
    private readonly recipePrefix: string = 'recipe-';

    public getRecipes(): Recipe[] {
        let recipes: Recipe[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
            let key = window.localStorage.key(i)!;

            if (key.startsWith(this.recipePrefix)) {
                recipes.push(JSON.parse(localStorage.getItem(key)!));
            }
        }
        return recipes;
    }

    public getRecipe(id: string): Recipe | undefined {
        let recipe = localStorage.getItem(this.recipePrefix + id);
        if (recipe) {
            return JSON.parse(recipe);
        }
        return undefined;
    }

    public addRecipe(recipe: Recipe): void {
        if (this.getRecipe(recipe.id)) { throw new Error('Recipe already exists')}
        window.localStorage.setItem(
            this.recipePrefix + recipe.id,
            JSON.stringify(recipe)
        );
    }

    public updateRecipe(recipe: Recipe): void {
        if (!this.getRecipe(recipe.id)) { throw new Error('Recipe does not already exist')}
        window.localStorage.setItem(
            this.recipePrefix + recipe.id,
            JSON.stringify(recipe)
        );
    }

    public deleteRecipe(id: string): void {
        localStorage.removeItem(this.recipePrefix + id);
    }

    
}