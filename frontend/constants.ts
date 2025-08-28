
import type { Recipe, User } from './types';

export const MOCK_USER: User = {
  id: 'user-1',
  name: 'Alex Cook',
};

export const RECIPE_CATEGORIES: string[] = ['All', 'Dinner', 'Dessert', 'Vegan', 'Breakfast', 'Soup'];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Classic Spaghetti Carbonara',
    description: 'A creamy, classic Italian pasta dish made with eggs, cheese, pancetta, and pepper. Ready in just 30 minutes!',
    imageUrl: 'https://picsum.photos/seed/carbonara/800/600',
    ingredients: ['200g spaghetti', '100g pancetta', '2 large eggs', '50g Pecorino cheese', 'Salt and black pepper'],
    instructions: ['Cook spaghetti according to package directions.', 'While pasta cooks, fry pancetta until crisp.', 'In a bowl, whisk eggs and cheese.', 'Drain pasta, reserving some pasta water. Quickly mix in egg mixture, pancetta, and a splash of pasta water.', 'Season with lots of black pepper and serve immediately.'],
    category: 'Dinner',
    authorId: 'user-2',
    authorName: 'Maria Rossi',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    comments: [
      { id: 'c1', authorId: 'user-1', authorName: 'Alex Cook', text: 'This was delicious!', createdAt: new Date().toISOString() },
    ],
    ratings: [
      { userId: 'user-1', value: 5 },
      { userId: 'user-3', value: 4 },
    ],
  },
  {
    id: '2',
    title: 'Fudgy Chocolate Brownies',
    description: 'The ultimate fudgy brownies with a crinkly top. Intensely chocolatey and incredibly moist.',
    imageUrl: 'https://picsum.photos/seed/brownies/800/600',
    ingredients: ['1/2 cup butter, melted', '1 cup sugar', '2 eggs', '1 tsp vanilla extract', '1/3 cup cocoa powder', '1/2 cup flour', '1/4 tsp salt', '1/4 tsp baking powder'],
    instructions: ['Preheat oven to 350°F (175°C).', 'Mix melted butter, sugar, eggs, and vanilla.', 'In a separate bowl, sift together cocoa, flour, salt, and baking powder.', 'Gradually add dry ingredients to wet ingredients.', 'Pour into a greased 8-inch square pan.', 'Bake for 20-25 minutes. Let cool completely before cutting.'],
    category: 'Dessert',
    authorId: 'user-1',
    authorName: 'Alex Cook',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    comments: [],
    ratings: [
      { userId: 'user-2', value: 5 },
    ],
  },
  {
    id: '3',
    title: 'Vegan Lentil Soup',
    description: 'A hearty and nutritious vegan lentil soup that is packed with flavor and plant-based protein.',
    imageUrl: 'https://picsum.photos/seed/lentilsoup/800/600',
    ingredients: ['1 tbsp olive oil', '1 onion, chopped', '2 carrots, chopped', '2 celery stalks, chopped', '2 cloves garlic, minced', '1 cup brown or green lentils, rinsed', '4 cups vegetable broth', '1 (14.5 ounce) can diced tomatoes', '1 tsp dried thyme', 'Salt and pepper to taste'],
    instructions: ['Heat olive oil in a large pot over medium heat.', 'Add onion, carrots, and celery and cook until softened.', 'Stir in garlic and cook for 1 minute more.', 'Add lentils, vegetable broth, tomatoes, and thyme.', 'Bring to a boil, then reduce heat and simmer for 40-50 minutes, or until lentils are tender.', 'Season with salt and pepper before serving.'],
    category: 'Vegan',
    authorId: 'user-3',
    authorName: 'Sam Vegan',
    createdAt: new Date().toISOString(),
    comments: [],
    ratings: [
      { userId: 'user-1', value: 4 },
      { userId: 'user-2', value: 4 },
    ],
  },
];
