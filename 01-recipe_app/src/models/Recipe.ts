import uniqid from 'uniqid';

export default class Recipe {
    id: string = uniqid();
    name: string;
    ingredients: string[];
    directions: string[];
    lastModified: Date = new Date();

    constructor(name: string, ingredients: string[], directions: string[]) {
        
        // extra error check
        try {
            Recipe.validateName(name);
            Recipe.validateIngredients(ingredients);
            Recipe.validateDirections(directions);
        } catch(e) {
            throw e;
        }
        

        this.name = name;
        this.ingredients = ingredients;
        this.directions = directions;
    }

    public static validateName(name: string): boolean {
        if (name.length === 0) throw new Error('Name cannot be empty');
        return true;
    }

    public static validateIngredients(ingredients: string[]): boolean {
        if (ingredients.length === 0) throw new Error('Ingredients cannot be empty');
        return true;
    }

    public static validateDirections(directions: string[]): boolean {
        if (directions.length === 0) throw new Error('Directions cannot be empty');
        return true;
    }
}