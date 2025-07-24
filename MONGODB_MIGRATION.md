# MongoDB Migration Guide

This guide walks you through migrating your TechNurture website from PostgreSQL to MongoDB.

## Prerequisites

1. **MongoDB Atlas Setup**
   - Your MongoDB connection string: `mongodb+srv://technuture:technutured@technurture.snt0niu.mongodb.net/?retryWrites=true&w=majority&appName=TechNurture`
   - IP Address Whitelist: Add `0.0.0.0/0` (allow all IPs) in MongoDB Atlas Network Access settings

## Step 1: Configure Environment

Update your `.env` file to use MongoDB:

```bash
# Comment out PostgreSQL
# DATABASE_URL=postgresql://replit:password@localhost/replit_db_rest_express

# Add MongoDB connection
MONGODB_URI=mongodb+srv://technuture:technutured@technurture.snt0niu.mongodb.net/?retryWrites=true&w=majority&appName=TechNurture
```

## Step 2: Run Migration Script

The migration script is ready at `scripts/migrate-to-mongodb.js`. Run it with:

```bash
# Method 1: Using npm script (once package.json is updated)
npm run migrate:mongodb

# Method 2: Direct execution
export MONGODB_URI="mongodb+srv://technuture:technutured@technurture.snt0niu.mongodb.net/?retryWrites=true&w=majority&appName=TechNurture"
node scripts/migrate-to-mongodb.js
```

## Step 3: Fix IP Whitelisting Issue

If you see "Could not connect to any servers" error:

1. Go to MongoDB Atlas Dashboard
2. Navigate to Network Access
3. Click "Add IP Address"
4. Choose "Allow Access from Anywhere" (0.0.0.0/0)
5. Click "Confirm"

## Step 4: Restart Application

After successful migration:

```bash
# Restart the development server
npm run dev
```

The application will automatically detect MongoDB and use it instead of PostgreSQL.

## What the Migration Does

The migration script:

✓ **Creates Admin User**
- Username: `admin`
- Password: `admin123`
- Role: `admin`

✓ **Creates Sample Blog Posts**
- AI & Machine Learning article
- Web Development Bootcamp guide
- Tech Career Roadmap

✓ **Creates Sample Forms**
- Course Enrollment Application
- Job Application Form

✓ **Sets up Collections**
- users
- blogPosts
- contacts
- enrollments
- dynamicForms
- formSubmissions

## Verification Steps

After migration, verify everything works:

1. **Check Application Logs**
   Look for: "🔍 Database Detection: { hasMongoURI: true, isMongoDatabase: true }"

2. **Test Admin Login**
   - Go to `/admin/login`
   - Username: `admin`
   - Password: `admin123`

3. **Check Blog Posts**
   - Visit `/blog`
   - Should see 3 sample articles

4. **Test API Endpoints**
   ```bash
   # Check blog posts
   curl http://localhost:5000/api/blog
   
   # Test JWT authentication
   curl -X POST http://localhost:5000/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{"username":"admin","password":"admin123"}'
   ```

## Troubleshooting

### Connection Issues
- Ensure IP is whitelisted in MongoDB Atlas
- Verify connection string is correct
- Check if MongoDB cluster is running

### Authentication Issues
- Run migration script to create admin user
- Check if bcrypt password hashing is working
- Verify JWT tokens are being generated

### Data Issues
- Migration script uses upsert, so it's safe to run multiple times
- Check MongoDB Atlas Data Explorer to see created collections
- Verify sample data is populated correctly

## Environment Detection

The application automatically detects which database to use:

```javascript
// In server/storage.ts
const hasMongoURI = !!process.env.MONGODB_URI;
const isMongoDatabase = hasMongoURI || process.env.DATABASE_URL?.includes('mongodb');

// Uses MongoDB if MONGODB_URI is set, otherwise falls back to PostgreSQL
```

## Deployment Notes

For cloud deployment:

1. **Environment Variables**
   - Set `MONGODB_URI` in your cloud platform
   - Remove or comment out `DATABASE_URL`

2. **Production Security**
   - Use IP restrictions instead of 0.0.0.0/0
   - Set up VPC peering for better security
   - Enable MongoDB authentication logging

3. **Scaling Considerations**
   - MongoDB Atlas auto-scales based on usage
   - Consider connection pooling for high traffic
   - Monitor performance and optimize queries

Your migration is ready to run once the IP whitelisting issue is resolved!