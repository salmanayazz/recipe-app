import Recipe from '../models/Recipe'

export default class LocalDB {
    // local storage key prefixes
    private readonly recipePrefix: string = 'recipe-';

    public getRecipes(): Recipe[] {
        let recipes: Recipe[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
            let key = window.localStorage.key(i)!;

            if (key.startsWith('recipe-')) {
                recipes.push(JSON.parse(localStorage.getItem(key)!));
            }
        }
        return recipes;
    }

    public addRecipe(recipe: Recipe): void {
        window.localStorage.setItem(
            this.recipePrefix + recipe.name,
            JSON.stringify(recipe)
        );
    }
}