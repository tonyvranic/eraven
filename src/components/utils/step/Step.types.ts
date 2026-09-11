import type { ContentImage } from "../Image.astro";

interface RecipeStepText {
    type: 'text';
    content: string;
}
interface RecipeStepImage {
    type: 'image';
    image: ContentImage;
}

export type RecipeStep = RecipeStepText | RecipeStepImage;