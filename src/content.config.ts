import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// TODO - Deprecate category field in favor of categorized urls
// Schemas // Schemas // Schemas // Schemas // Schemas
// Image
const imageSchema = z.object({
  src: z.string(),
  alt: z.string(),
});

// Accordion
const accordionItemSchema = z.object({
  title: z.string(),
  content: z.string(),
});

// Recipe Detail
const nutrientsSchema = z.object({
  calories: z.string(),
  carbs: z.string(),
  fats: z.string(),
  protein: z.string(),
  sugars: z.string(),
  saturatedFats: z.string(),
  fibers: z.string(),
});

const ingredientCategorySchema = z.object({
  title: z.string().optional(),
  items: z.array(z.string()),
});

const recipeStepContentSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('text'),
    content: z.string(),
  }),
  z.object({
    type: z.literal('image'),
    image: imageSchema,
  }),
]);

const recipeStepSchema = z.object({
  content: z.array(recipeStepContentSchema),
});

const recipeDetailSchema = z.object({
  time: z.string(),
  complexity: z.string(),
  nutrients: nutrientsSchema,
  ingredients: z.array(ingredientCategorySchema),
  stepsTitle: z.string().optional(),
  steps: z.array(recipeStepSchema),
});

// TODO
const sectionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('blockquote'),
    quote: z.string(),
    author: z.string().optional(),
  }),
  z.object({
    type: z.literal('closing'),
    content: z.string(),
  }),
  z.object({
    type: z.literal('accordion'),
    title: z.string(),
    content: z.string(),
    items: z.array(accordionItemSchema),
  }),
  z.object({
    type: z.literal('recipeDetail'),
    detail: recipeDetailSchema,
  }),
]);


// Collections // Collections // Collections // Collections // Collections
const detailSchema = z.object({
  thumbnail: imageSchema,
  heroImage: imageSchema,
  title: z.string(),
  excerpt: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  dateCreated: z.coerce.date(),
  lastEditDate: z.coerce.date(),
  sections: z.array(sectionSchema),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/blog' }),
  schema: detailSchema
});

const recipe = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/recipe' }),
  schema: detailSchema
});


// Exports // Exports // Exports // Exports
export const collections = {
  blog,
  recipe,
};

