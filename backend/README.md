# RecipeShare Backend API

A complete Node.js/Express backend for the RecipeShare application with JWT authentication, image uploads, and all required APIs.

## 🚀 Features

- **User Authentication**: JWT-based login/registration
- **Recipe Management**: Full CRUD operations for recipes
- **Image Uploads**: Multer-based file uploads with validation
- **Comments System**: Add comments to recipes
- **Rating System**: 5-star rating system
- **Search & Filtering**: Advanced recipe search and filtering
- **Security**: Helmet, CORS, rate limiting, input validation

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Recipes
- `GET /api/recipes` - Get all recipes (with filtering)
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create new recipe (authenticated)
- `PUT /api/recipes/:id` - Update recipe (author only)
- `DELETE /api/recipes/:id` - Delete recipe (author only)

### Comments
- `POST /api/recipes/:id/comments` - Add comment (authenticated)

### Ratings
- `POST /api/recipes/:id/ratings` - Add/update rating (authenticated)

## 🛠️ Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp env.example .env
   ```

4. **Configure environment variables:**
   ```bash
   # Edit .env file with your values
   JWT_SECRET=your-super-secret-key
   FRONTEND_URL=http://localhost:3000
   ```

5. **Create uploads directory:**
   ```bash
   mkdir uploads
   ```

## 🚀 Running the Backend

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The backend will run on `http://localhost:5000`

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📁 File Structure

```
backend/
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── recipes.js       # Recipe CRUD routes
│   └── users.js         # User management routes
├── uploads/             # Image upload directory
├── server.js            # Main server file
├── package.json         # Dependencies
└── env.example          # Environment configuration
```

## 🗄️ Database

Currently using in-memory storage. For production, replace with:

- **MongoDB**: Use Mongoose ODM
- **PostgreSQL**: Use Sequelize ORM
- **MySQL**: Use Prisma ORM

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API request throttling
- **Input Validation**: Request data validation
- **File Upload Security**: File type and size validation

## 🚀 Deployment

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Railway
```bash
railway login
railway init
railway up
```

### DigitalOcean App Platform
- Connect your GitHub repository
- Set environment variables
- Deploy automatically

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `JWT_SECRET` | JWT signing secret | required |
| `FRONTEND_URL` | Frontend URL | http://localhost:3000 |
| `MONGODB_URI` | MongoDB connection | optional |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary config | optional |

## 🧪 Testing

Test the API endpoints using:

- **Postman**: Import the collection
- **Insomnia**: REST client
- **cURL**: Command line testing
- **Thunder Client**: VS Code extension

## 📊 API Response Format

### Success Response
```json
{
  "id": "recipe-id",
  "title": "Recipe Title",
  "description": "Recipe description",
  "imageUrl": "/uploads/image.jpg",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": ["step 1", "step 2"],
  "category": "Dinner",
  "authorId": "user-id",
  "authorName": "Author Name",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "comments": [],
  "ratings": []
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": ["Validation errors"]
}
```

## 🔄 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Cloud image storage (Cloudinary/AWS S3)
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social login (Google, Facebook)
- [ ] Recipe sharing and collaboration
- [ ] Advanced search with Elasticsearch
- [ ] Real-time notifications
- [ ] Recipe import from URLs
- [ ] Nutritional information
- [ ] Meal planning features

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check the API documentation
- Review the error logs

---

**Happy Cooking! 🍳**
