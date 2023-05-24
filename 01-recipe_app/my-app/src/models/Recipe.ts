export default class Recipe {
    name: string;
    ingredients: string[];
    directions: string[];

    constructor(name: string, ingredients: string[], directions: string[]) {
        this.name = name;
        this.ingredients = ingredients;
        this.directions = directions;
    }
}