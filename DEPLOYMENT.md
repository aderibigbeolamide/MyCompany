# Deployment Guide for TechNurture Website

This guide covers how to deploy your TechNurture website to various cloud platforms.

## Prerequisites

1. **MongoDB Atlas** (Cloud Database)
   - Your database is already set up: `mongodb+srv://technuture:technutured@technurture.snt0niu.mongodb.net/`
   - This connection string works from anywhere on the internet

2. **Cloudinary** (Image Storage)
   - Cloud name: Set in environment variables
   - API credentials: Configured in your environment

## Platform-Specific Deployment

### 1. Netlify Deployment

**Step 1: Prepare for Netlify**
```bash
# Add netlify build command to package.json
npm install --save-dev @netlify/functions
```

**Step 2: Create netlify.toml**
```toml
[build]
  command = "npm run build"
  publish = "dist/public"
  functions = "netlify/functions"

[build.environment]
  NODE_ENV = "production"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Step 3: Environment Variables in Netlify**
- Go to Site Settings > Environment Variables
- Add these variables:
  ```
  MONGODB_URI=mongodb+srv://technuture:technutured@technurture.snt0niu.mongodb.net/?retryWrites=true&w=majority&appName=TechNurture
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  NODE_ENV=production
  ```

### 2. Render Deployment

**Step 1: Create render.yaml**
```yaml
services:
  - type: web
    name: technurture-website
    env: node
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        value: mongodb+srv://technuture:technutured@technurture.snt0niu.mongodb.net/?retryWrites=true&w=majority&appName=TechNurture
      - key: CLOUDINARY_CLOUD_NAME
        sync: false
      - key: CLOUDINARY_API_KEY
        sync: false
      - key: CLOUDINARY_API_SECRET
        sync: false
```

**Step 2: Deploy to Render**
1. Connect your GitHub/GitLab repository
2. Select "Web Service"
3. Add environment variables in the Render dashboard
4. Deploy

### 3. Railway Deployment

**Step 1: Install Railway CLI**
```bash
npm install -g @railway/cli
```

**Step 2: Deploy**
```bash
railway login
railway init
railway add --env MONGODB_URI="mongodb+srv://technuture:technutured@technurture.snt0niu.mongodb.net/?retryWrites=true&w=majority&appName=TechNurture"
railway add --env NODE_ENV="production"
railway add --env CLOUDINARY_CLOUD_NAME="your_cloud_name"
railway add --env CLOUDINARY_API_KEY="your_api_key"
railway add --env CLOUDINARY_API_SECRET="your_api_secret"
railway up
```

### 4. Vercel Deployment

**Step 1: Create vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/**/*",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "npm run build",
        "outputDirectory": "dist/public"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/public/$1"
    }
  ],
  "env": {
    "MONGODB_URI": "@mongodb_uri",
    "CLOUDINARY_CLOUD_NAME": "@cloudinary_cloud_name",
    "CLOUDINARY_API_KEY": "@cloudinary_api_key",
    "CLOUDINARY_API_SECRET": "@cloudinary_api_secret"
  }
}
```

**Step 2: Deploy with Vercel CLI**
```bash
npm install -g vercel
vercel
vercel --prod
```

## Local Development with MongoDB

To run locally with MongoDB instead of PostgreSQL:

1. **Update your .env file**
```env
MONGODB_URI=mongodb+srv://technuture:technutured@technurture.snt0niu.mongodb.net/?retryWrites=true&w=majority&appName=TechNurture
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

2. **Start the development server**
```bash
npm run dev
```

The application will automatically detect the MongoDB connection string and use MongoDB instead of PostgreSQL.

## Database Management

### Admin Access
- Username: `admin`
- Password: `admin123`
- URL: `your-domain.com/admin/login`

### Creating Content
1. Log in to the admin panel
2. Go to Blog Management to create/edit articles
3. Use Form Builder to create custom forms
4. View submissions in the Submissions section

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `SESSION_SECRET` | Session encryption key | No (has default) |

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MONGODB_URI is correct
   - Check MongoDB Atlas IP whitelist (should allow all IPs: 0.0.0.0/0)

2. **Images Not Uploading**
   - Verify Cloudinary credentials
   - Check file size limits

3. **Admin Login Not Working**
   - Run the database seed script to create admin user
   - Verify bcrypt password hashing

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Production start
npm start

# Database operations
npm run db:push  # Apply schema changes (not needed for MongoDB)
```

## Security Notes

1. **Environment Variables**: Never commit sensitive environment variables to version control
2. **Database Access**: MongoDB Atlas credentials are secured with IP restrictions
3. **Session Security**: Uses secure session cookies in production
4. **File Uploads**: Limited to images/videos with size restrictions

Your TechNurture website is now ready for deployment to any major cloud platform!