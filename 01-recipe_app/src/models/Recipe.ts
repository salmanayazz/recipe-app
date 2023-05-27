import uniqid from 'uniqid';

export default class Recipe {
    id: string = uniqid();
    name: string;
    ingredients: string[];
    directions: string[];

    constructor(name: string, ingredients: string[], directions: string[]) {
        this.name = name;
        // extra error handling
        if (ingredients.length === 0) throw new Error('Ingredients cannot be empty');
        if (directions.length === 0) throw new Error('Directions cannot be empty');

        this.ingredients = ingredients;
        this.directions = directions;
    }
}