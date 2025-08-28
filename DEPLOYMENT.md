# 🚀 RecipeShare Deployment Guide

Complete guide to deploy your RecipeShare application to production.

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository set up
- Code editor (VS Code recommended)
- Terminal/Command Prompt

## 🏗️ Project Structure

```
recipeshare/
├── frontend/                 # React frontend
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── contexts/           # React contexts
│   ├── services/           # API services
│   ├── types.ts            # TypeScript types
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js backend
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
└── README.md               # Project documentation
```

## 🚀 Quick Start

### 1. **Clone and Setup**
```bash
git clone <your-repo-url>
cd recipeshare
```

### 2. **Frontend Setup**
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. **Backend Setup**
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env with your values
JWT_SECRET=your-super-secret-key
FRONTEND_URL=http://localhost:3000

# Create uploads directory
mkdir uploads

# Start backend server
npm run dev
```

## 🌐 Frontend Deployment

### **Option 1: Vercel (Recommended)**

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Configure environment variables in Vercel dashboard:**
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

### **Option 2: Netlify**

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Drag and drop the `dist` folder to Netlify**

3. **Set environment variables in Netlify dashboard:**
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

### **Option 3: GitHub Pages**

1. **Add to package.json:**
   ```json
   {
     "homepage": "https://yourusername.github.io/recipeshare",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

2. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

## 🔧 Backend Deployment

### **Option 1: Railway (Recommended)**

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login and deploy:**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Set environment variables in Railway dashboard:**
   ```
   JWT_SECRET=your-production-secret
   FRONTEND_URL=https://your-frontend-url.com
   NODE_ENV=production
   ```

### **Option 2: Heroku**

1. **Install Heroku CLI:**
   ```bash
   # Windows
   https://devcenter.heroku.com/articles/heroku-cli
   
   # macOS
   brew tap heroku/brew && brew install heroku
   ```

2. **Create and deploy:**
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set JWT_SECRET=your-production-secret
   heroku config:set FRONTEND_URL=https://your-frontend-url.com
   heroku config:set NODE_ENV=production
   ```

### **Option 3: DigitalOcean App Platform**

1. **Connect your GitHub repository**
2. **Set environment variables:**
   ```
   JWT_SECRET=your-production-secret
   FRONTEND_URL=https://your-frontend-url.com
   NODE_ENV=production
   ```
3. **Deploy automatically**

## 🔐 Environment Variables

### **Frontend (.env)**
```bash
VITE_API_URL=https://your-backend-url.com/api
```

### **Backend (.env)**
```bash
PORT=5000
NODE_ENV=production
JWT_SECRET=your-super-secret-production-key
FRONTEND_URL=https://your-frontend-url.com
```

## 🗄️ Database Setup (Optional)

### **MongoDB Atlas**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create cluster
3. Get connection string
4. Add to backend `.env`:
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/recipeshare
   ```

### **PostgreSQL (Railway)**
1. Create PostgreSQL database in Railway
2. Get connection string
3. Add to backend `.env`:
   ```bash
   DATABASE_URL=postgresql://username:password@host:port/database
   ```

## 📸 Image Storage (Optional)

### **Cloudinary**
1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get credentials
3. Add to backend `.env`:
   ```bash
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

### **AWS S3**
1. Create AWS account
2. Create S3 bucket
3. Get credentials
4. Add to backend `.env`:
   ```bash
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_REGION=your-region
   AWS_S3_BUCKET=your-bucket-name
   ```

## 🔒 Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] HTTPS enabled on production
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] File upload restrictions set
- [ ] Environment variables secured
- [ ] Database connection secured

## 📱 Domain Setup

### **Custom Domain**
1. **Frontend (Vercel/Netlify):**
   - Add custom domain in dashboard
   - Update DNS records
   - Enable HTTPS

2. **Backend:**
   - Update CORS settings
   - Update FRONTEND_URL in environment

## 🧪 Testing Deployment

### **Health Check**
```bash
curl https://your-backend-url.com/api/health
```

### **API Endpoints**
```bash
# Test recipes endpoint
curl https://your-backend-url.com/api/recipes

# Test authentication
curl -X POST https://your-backend-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 🚨 Troubleshooting

### **Common Issues**

1. **CORS Errors:**
   - Check FRONTEND_URL in backend environment
   - Verify CORS configuration

2. **JWT Errors:**
   - Ensure JWT_SECRET is set
   - Check token expiration

3. **Image Upload Issues:**
   - Verify uploads directory exists
   - Check file size limits
   - Verify file type restrictions

4. **Database Connection:**
   - Check connection string
   - Verify network access
   - Check credentials

### **Debug Commands**
```bash
# Check backend logs
railway logs

# Check environment variables
railway variables

# Restart backend
railway up
```

## 📊 Monitoring

### **Health Monitoring**
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor API response times
- Set up error alerting

### **Performance Monitoring**
- Use Vercel Analytics for frontend
- Monitor backend performance
- Set up logging (Winston, Morgan)

## 🔄 Continuous Deployment

### **GitHub Actions**
1. Create `.github/workflows/deploy.yml`
2. Configure automatic deployment on push
3. Set up environment secrets

### **Railway Auto-Deploy**
- Enable auto-deploy in Railway dashboard
- Connect GitHub repository
- Deploy on every push

## 📈 Scaling

### **Frontend**
- Vercel/Netlify auto-scales
- CDN distribution included
- Edge functions for performance

### **Backend**
- Railway auto-scales
- Load balancing available
- Database connection pooling

## 💰 Cost Optimization

### **Free Tiers**
- **Vercel:** 100GB bandwidth/month
- **Netlify:** 100GB bandwidth/month
- **Railway:** $5 credit/month
- **Heroku:** $7/month (basic dyno)

### **Production Recommendations**
- **Frontend:** Vercel Pro ($20/month)
- **Backend:** Railway ($5-20/month)
- **Database:** MongoDB Atlas ($9/month) or Railway PostgreSQL

## 🎯 Next Steps

1. **Set up monitoring and logging**
2. **Implement database persistence**
3. **Add image optimization**
4. **Set up CI/CD pipeline**
5. **Add analytics and tracking**
6. **Implement caching strategies**
7. **Add backup and recovery**
8. **Set up staging environment**

## 📞 Support

- **Documentation:** Check README files
- **Issues:** Create GitHub issue
- **Community:** Stack Overflow, Reddit
- **Paid Support:** Consider Upwork, Fiverr

---

**🚀 Your RecipeShare app is now ready for production!**

Remember to:
- Test thoroughly before going live
- Monitor performance and errors
- Keep dependencies updated
- Backup data regularly
- Document any custom configurations

**Happy Deploying! 🎉**
