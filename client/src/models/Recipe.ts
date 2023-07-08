export default class Recipe {
    _id: string | undefined;
    name: string;
    ingredients: string[];
    directions: string[];
    lastModified: string = new Date().toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });

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
        if (name.length === 0) throw new Error('Must include a name');
        return true;
    }

    public static validateIngredients(ingredients: string[]): boolean {
        if (ingredients.length === 0) throw new Error('Must include at least one ingredient');
        return true;
    }

    public static validateDirections(directions: string[]): boolean {
        if (directions.length === 0) throw new Error('Must include at least one direction');
        return true;
    }
}