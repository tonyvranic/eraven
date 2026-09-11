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
const servingsSchema = z.object({
  servingsCount: z.number(),
  perServingWeight: z.number(),
  totalWeight: z.number(),
});

const nutrientsSchema = z.object({
  calories: z.number(),
  carbs: z.number(),
  fats: z.number(),
  protein: z.number(),
  sugars: z.number(),
  saturatedFats: z.number(),
  fibers: z.number(),
  salts: z.number(),
});

const ingredientCategorySchema = z.object({
  title: z.string(),
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

const recipeStepSchema = z.array(
  recipeStepContentSchema
);

const recipeDetailSchema = z.object({
  time: z.string(),
  complexity: z.string(),
  stepsTitle: z.string().optional(),
  steps: z.array(recipeStepSchema),
  servings: servingsSchema,
  ingredients: z.array(ingredientCategorySchema),
  nutrients: nutrientsSchema,
});


const sectionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('textImage'),
    title: z.string().optional(),
    content: z.string().optional(),
    image: imageSchema.optional(),
  }),
  z.object({
    type: z.literal('imageWithText'),
    image: imageSchema.optional(),
    title: z.string().optional(),
    content: z.string().optional(),
  }),
  z.object({
    type: z.literal('abstractText'),
    title: z.string().optional(),
    intro: z.string().optional(),
    contents: z.array(z.string()).optional(),
  }),
  z.object({
    type: z.literal('abstractText2'),
    title: z.string().optional(),
    intro: z.string().optional(),
    contents: z.array(z.string()).optional(),
  }),
  z.object({
    type: z.literal('blockquote'),
    content: z.string(),
    author: z.string().optional(),
    isLarge: z.boolean().optional(),
  }),
  z.object({
    type: z.literal('musicPlayer'),
    title: z.string().optional(),
    content: z.string().optional(),
    audioSrc: z.string(),
  }),
  z.object({
    type: z.literal('closing'),
    content: z.string(),
  }),
  z.object({
    type: z.literal('accordion'),
    title: z.string().optional(),
    content: z.string().optional(),
    items: z.array(accordionItemSchema),
  }),
  z.object({
    type: z.literal('recipeDetail'),
    ...recipeDetailSchema.shape,
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

