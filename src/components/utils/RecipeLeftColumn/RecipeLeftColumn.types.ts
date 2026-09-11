export interface Servings {
    servingsCount: number;
    perServingWeight: number;
    totalWeight: number;
}

export interface Nutrients {
    calories: number;
    carbs: number;
    fats: number;
    protein: number;
    sugars: number;
    saturatedFats: number;
    fibers: number;
    salts: number;
}

export interface IngredientCategory {
    title: string;
    items: string[];
}