import express from 'express';
import multer from 'multer';
import path from 'path';
import { body, validationResult } from 'express-validator';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// In-memory recipe storage (replace with database in production)
let recipes = [
  {
    id: '1',
    title: 'Classic Spaghetti Carbonara',
    description: 'A creamy, classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.',
    imageUrl: 'https://picsum.photos/seed/carbonara/800/600',
    ingredients: ['200g spaghetti', '100g pancetta', '2 large eggs', '50g Pecorino cheese', 'Salt and black pepper'],
    instructions: ['Cook spaghetti according to package directions.', 'While pasta cooks, fry pancetta until crisp.', 'In a bowl, whisk eggs and cheese.', 'Drain pasta, reserving some pasta water. Quickly mix in egg mixture, pancetta, and a splash of pasta water.', 'Season with lots of black pepper and serve immediately.'],
    category: 'Dinner',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 'Medium',
    authorId: '1',
    authorName: 'Alex Cook',
    authorAvatar: null,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    comments: [
      { id: 'c1', authorId: '1', authorName: 'Alex Cook', authorAvatar: null, text: 'This was delicious!', createdAt: new Date().toISOString() },
    ],
    ratings: [
      { userId: '1', value: 5 },
    ],
    tags: ['Italian', 'Pasta', 'Quick']
  }
];

// Validation middleware
const validateRecipe = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('ingredients').isArray({ min: 1 }).withMessage('At least one ingredient is required'),
  body('instructions').isArray({ min: 1 }).withMessage('At least one instruction is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('prepTime').optional().isInt({ min: 0 }).withMessage('Prep time must be a positive number'),
  body('cookTime').optional().isInt({ min: 0 }).withMessage('Cook time must be a positive number'),
  body('servings').optional().isInt({ min: 1 }).withMessage('Servings must be at least 1'),
  body('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard')
];

// GET /api/recipes - Get all recipes (public)
router.get('/', optionalAuth, (req, res) => {
  try {
    const { category, search, sort = 'newest' } = req.query;
    
    let filteredRecipes = [...recipes];
    
    // Filter by category
    if (category && category !== 'All') {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.category === category);
    }
    
    // Search by title or description
    if (search) {
      const searchLower = search.toLowerCase();
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchLower) ||
        recipe.description.toLowerCase().includes(searchLower) ||
        recipe.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort recipes
    switch (sort) {
      case 'oldest':
        filteredRecipes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'rating':
        filteredRecipes.sort((a, b) => {
          const avgA = a.ratings.length > 0 ? a.ratings.reduce((sum, r) => sum + r.value, 0) / a.ratings.length : 0;
          const avgB = b.ratings.length > 0 ? b.ratings.reduce((sum, r) => sum + r.value, 0) / b.ratings.length : 0;
          return avgB - avgA;
        });
        break;
      case 'newest':
      default:
        filteredRecipes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
    
    res.json(filteredRecipes);
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/recipes/:id - Get single recipe (public)
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const recipe = recipes.find(r => r.id === id);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    res.json(recipe);
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/recipes - Create new recipe (authenticated)
router.post('/', authenticateToken, upload.single('image'), validateRecipe, (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const {
      title,
      description,
      ingredients,
      instructions,
      category,
      prepTime,
      cookTime,
      servings,
      difficulty,
      tags
    } = req.body;

    // Handle image upload
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    } else {
      return res.status(400).json({ error: 'Recipe image is required' });
    }

    const newRecipe = {
      id: Date.now().toString(),
      title,
      description,
      imageUrl,
      ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
      instructions: Array.isArray(instructions) ? instructions : [instructions],
      category,
      prepTime: prepTime ? parseInt(prepTime) : undefined,
      cookTime: cookTime ? parseInt(cookTime) : undefined,
      servings: servings ? parseInt(servings) : undefined,
      difficulty,
      authorId: req.user.userId,
      authorName: req.user.name || 'Anonymous',
      authorAvatar: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      ratings: [],
      tags: tags ? (Array.isArray(tags) ? tags : [tags]) : []
    };

    recipes.push(newRecipe);
    res.status(201).json(newRecipe);

  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/recipes/:id - Update recipe (authenticated, author only)
router.put('/:id', authenticateToken, upload.single('image'), validateRecipe, (req, res) => {
  try {
    const { id } = req.params;
    const recipeIndex = recipes.findIndex(r => r.id === id);
    
    if (recipeIndex === -1) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    const recipe = recipes[recipeIndex];
    
    // Check if user is the author
    if (recipe.authorId !== req.user.userId) {
      return res.status(403).json({ error: 'Only the author can edit this recipe' });
    }

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const {
      title,
      description,
      ingredients,
      instructions,
      category,
      prepTime,
      cookTime,
      servings,
      difficulty,
      tags
    } = req.body;

    // Handle image upload
    let imageUrl = recipe.imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    const updatedRecipe = {
      ...recipe,
      title,
      description,
      imageUrl,
      ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
      instructions: Array.isArray(instructions) ? instructions : [instructions],
      category,
      prepTime: prepTime ? parseInt(prepTime) : undefined,
      cookTime: cookTime ? parseInt(cookTime) : undefined,
      servings: servings ? parseInt(servings) : undefined,
      difficulty,
      tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
      updatedAt: new Date().toISOString()
    };

    recipes[recipeIndex] = updatedRecipe;
    res.json(updatedRecipe);

  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/recipes/:id - Delete recipe (authenticated, author only)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const recipeIndex = recipes.findIndex(r => r.id === id);
    
    if (recipeIndex === -1) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    const recipe = recipes[recipeIndex];
    
    // Check if user is the author
    if (recipe.authorId !== req.user.userId) {
      return res.status(403).json({ error: 'Only the author can delete this recipe' });
    }

    recipes.splice(recipeIndex, 1);
    res.json({ message: 'Recipe deleted successfully' });

  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/recipes/:id/comments - Add comment (authenticated)
router.post('/:id/comments', authenticateToken, [
  body('text').trim().isLength({ min: 1, max: 500 }).withMessage('Comment must be between 1 and 500 characters')
], (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const recipeIndex = recipes.findIndex(r => r.id === id);
    if (recipeIndex === -1) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const newComment = {
      id: `c${Date.now()}`,
      authorId: req.user.userId,
      authorName: req.user.name || 'Anonymous',
      authorAvatar: null,
      text,
      createdAt: new Date().toISOString()
    };

    recipes[recipeIndex].comments.push(newComment);
    res.status(201).json(newComment);

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/recipes/:id/ratings - Add rating (authenticated)
router.post('/:id/ratings', authenticateToken, [
  body('value').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
], (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const recipeIndex = recipes.findIndex(r => r.id === id);
    if (recipeIndex === -1) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const recipe = recipes[recipeIndex];
    
    // Check if user already rated this recipe
    const existingRatingIndex = recipe.ratings.findIndex(r => r.userId === req.user.userId);
    
    if (existingRatingIndex > -1) {
      // Update existing rating
      recipe.ratings[existingRatingIndex] = { userId: req.user.userId, value: parseInt(value) };
    } else {
      // Add new rating
      recipe.ratings.push({ userId: req.user.userId, value: parseInt(value) });
    }

    res.json(recipe);

  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
