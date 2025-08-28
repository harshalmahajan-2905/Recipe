# RecipeShare - A Collaborative Recipe Book

RecipeShare is a modern, interactive web application that allows users to share their favorite recipes, including ingredients, instructions, and a photo of the dish. Other users can view, rate, and comment on these recipes, fostering a collaborative community of food lovers.

This project is built with React, TypeScript, and Tailwind CSS, and it simulates a full-stack experience using a mock API for data persistence within the user's session.

## Core Features

- **Create, Read, Update & Delete (CRUD) Recipes**: Authenticated users can manage their own recipe submissions.
- **Recipe Gallery**: The homepage displays all submitted recipes in a clean, filterable gallery format.
- **Detailed Recipe View**: A dedicated page for each recipe with a clear, two-column layout for ingredients and instructions, perfect for following along while cooking.
- **Interactive Ingredient Checklist**: Users can click on ingredients to mark them as "checked," making it easy to track progress.
- **Commenting System**: Users can post comments on recipes to share their thoughts and variations.
- **5-Star Rating System**: Users can rate recipes, and the average rating is displayed on each recipe card and detail page.
- **"My Favorites" Collection**: Users can bookmark their favorite recipes, which are saved to a personal "My Favorites" page using `localStorage` for persistence.
- **Responsive Design**: The application is fully responsive and works beautifully on devices of all sizes, from mobile phones to desktops.

## Tech Stack

- **Frontend**: React, TypeScript
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **Development Environment**: Vite (or a similar modern build tool setup)

## Project Structure

The codebase is organized into logical directories to ensure clarity and maintainability.

```
/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── CommentSection.tsx
│   │   ├── Header.tsx
│   │   ├── RecipeCard.tsx
│   │   └── StarRating.tsx
│   ├── contexts/
│   │   └── RecipeContext.tsx
│   ├── pages/
│   │   ├── FavoritesPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── RecipeDetailPage.tsx
│   │   └── RecipeEditorPage.tsx
│   ├── services/
│   │   └── api.ts
│   ├── App.tsx
│   ├── constants.ts
│   ├── index.tsx
│   └── types.ts
├── .gitignore
├── index.html
├── package.json
├── README.md
└── tailwind.config.js
```

- **`src/components`**: Contains reusable React components used across multiple pages (e.g., `RecipeCard`, `StarRating`).
- **`src/contexts`**: Manages global state using the React Context API. `RecipeContext.tsx` is the central hub for all recipe-related data and actions.
- **`src/pages`**: Contains top-level components that correspond to different routes/pages in the application (e.g., `HomePage`, `RecipeDetailPage`).
- **`src/services`**: Includes the mock API (`api.ts`) that simulates backend operations, using an in-memory array to store data.
- **`src/constants.ts`**: Stores initial mock data and constant values like recipe categories.
- **`src/types.ts`**: Defines all TypeScript types and interfaces for the application.
- **`App.tsx`**: The root component that sets up the application layout and routing.

## Getting Started

To run this project locally, you will need Node.js and a package manager like `npm` or `yarn` installed.

### 1. Clone the repository

```bash
git clone <repository-url>
cd recipe-share-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

The application should now be running on `http://localhost:5173` (or another port if 5173 is in use).

## How It Works

### State Management

The application's state is managed globally via `RecipeContext`. This context provides all components with access to the recipe list, current user information, favorites, and functions to interact with the data (e.g., `addRecipe`, `postComment`, `toggleFavorite`). This approach avoids prop-drilling and centralizes data logic.

### Mock API

The backend is simulated in `src/services/api.ts`. This file exports functions that mimic asynchronous API calls using `Promise` and `setTimeout` to simulate network latency. The recipes are stored in an in-memory array that is initialized with mock data from `src/constants.ts`. This allows the frontend to be developed and tested independently of a real backend service.

### User Authentication

For simplicity, the application uses a mock user object (`MOCK_USER` in `constants.ts`) to simulate an authenticated session. In a full-stack application, this would be replaced with a proper authentication system (e.g., JWT, OAuth). The current user's ID is used to authorize actions like editing or deleting a recipe.
