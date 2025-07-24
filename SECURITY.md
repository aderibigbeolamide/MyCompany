# Security Guide for TechNurture Website

This document outlines the comprehensive security implementation including JWT authentication, encryption, and best practices.

## 🔐 Authentication System

### JWT Token-Based Authentication

The application implements a dual-token JWT system:

1. **Access Tokens** (15 minutes): For API requests
2. **Refresh Tokens** (7 days): For obtaining new access tokens

#### Login Process
```bash
# Request
POST /api/auth/login
{
  "username": "admin",
  "password": "admin123"
}

# Response
{
  "success": true,
  "user": {
    "id": "user_id",
    "username": "admin",
    "role": "admin"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Using JWT Tokens
```bash
# Include in Authorization header
Authorization: Bearer your_access_token_here

# Example API request
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
     http://localhost:5000/api/auth/me
```

#### Token Refresh
```bash
POST /api/auth/refresh
{
  "refreshToken": "your_refresh_token"
}
```

### Session-Based Authentication (Legacy Support)

The system maintains backward compatibility with session-based authentication for existing frontend components.

## 🔒 Security Features

### 1. Password Security
- **Bcrypt Hashing**: All passwords use bcrypt with 12 salt rounds
- **Password Policy**: 
  - Minimum 8 characters
  - Requires uppercase, lowercase, numbers, and special characters
  - Maximum 128 characters

### 2. Rate Limiting
- **Login Attempts**: 5 attempts per 15 minutes per IP
- **API Requests**: 100 requests per 15 minutes per IP
- **File Uploads**: 10 uploads per minute per IP

### 3. Data Encryption
- **AES-256-GCM**: For sensitive data encryption
- **Secure Key Generation**: Cryptographically secure random keys
- **Key Rotation**: Automatic key rotation every 30 days

### 4. Session Security
- **HTTP-Only Cookies**: Prevent XSS attacks
- **Secure Cookies**: HTTPS-only in production
- **SameSite Strict**: CSRF protection
- **Session Expiration**: 24-hour timeout

### 5. Security Headers
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; ...
```

## 🛡️ Environment Security

### Production Environment Variables

#### Required Security Keys
```bash
# Generate secure keys for production
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
```

#### Complete Environment Configuration
```env
# Security Keys (REQUIRED)
JWT_SECRET=your_generated_64_char_jwt_secret
ENCRYPTION_KEY=your_generated_32_byte_encryption_key
SESSION_SECRET=your_generated_64_char_session_secret

# JWT Configuration
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
JWT_ISSUER=technurture-api
JWT_AUDIENCE=technurture-client

# CORS & Origins
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Security Features
ENABLE_RATE_LIMIT=true
ENABLE_AUDIT_LOG=true
AUDIT_RETENTION_DAYS=90

# Content Security Policy
CSP_POLICY=default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:;
```

## 🔍 API Security

### Protected Routes

All admin routes require authentication and authorization:

```bash
# Blog Management
POST /api/blog          # Create blog post
PUT /api/blog/:id       # Update blog post
DELETE /api/blog/:id    # Delete blog post

# Form Management
POST /api/forms         # Create form
PUT /api/forms/:id      # Update form
DELETE /api/forms/:id   # Delete form

# Data Access
GET /api/contacts       # View contacts
GET /api/enrollments    # View enrollments
GET /api/submissions    # View form submissions
```

### Authentication Middleware

```javascript
// JWT Authentication
app.use('/api/admin/*', authenticateToken, requireAdmin);

// Session Authentication (fallback)
app.use('/api/legacy/*', requireSessionAuth);
```

## 🚨 Security Monitoring

### Audit Logging
- User login/logout events
- Admin actions
- Failed authentication attempts
- Data access and modifications
- Security violations

### Rate Limit Monitoring
- Track excessive requests
- Block suspicious IPs
- Alert on unusual patterns

### Error Handling
- No sensitive data in error messages
- Proper HTTP status codes
- Consistent error response format

## 📋 Security Checklist

### Deployment Security
- [ ] Generate unique JWT_SECRET for production
- [ ] Set secure ENCRYPTION_KEY
- [ ] Configure SESSION_SECRET
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Set up CORS properly
- [ ] Configure security headers
- [ ] Enable rate limiting
- [ ] Set up audit logging
- [ ] Configure CSP policy
- [ ] Test all authentication flows

### Database Security
- [ ] Use connection strings with authentication
- [ ] Enable SSL for database connections
- [ ] Implement connection pooling
- [ ] Set query timeouts
- [ ] Use parameterized queries
- [ ] Regular security updates

### File Upload Security
- [ ] File type validation
- [ ] File size limits
- [ ] Virus scanning (if enabled)
- [ ] Secure file storage
- [ ] Access control for uploaded files

## 🔧 Security Utilities

### Password Validation
```javascript
const validation = AuthService.validatePassword(password);
if (!validation.isValid) {
  console.log(validation.errors);
}
```

### Data Encryption
```javascript
const encrypted = AuthService.encryptData(sensitiveData);
const decrypted = AuthService.decryptData(encrypted);
```

### Key Generation
```javascript
const secureKey = AuthService.generateSessionId();
```

## 🚀 Security Best Practices

### Development
1. Never commit secrets to version control
2. Use environment variables for all sensitive data
3. Implement proper error handling
4. Test authentication flows thoroughly
5. Use HTTPS in development when possible

### Production
1. Use strong, unique secrets
2. Enable all security headers
3. Set up monitoring and alerting
4. Regular security audits
5. Keep dependencies updated
6. Implement backup and recovery
7. Use CDN for static assets
8. Enable DDoS protection

### Maintenance
1. Rotate keys regularly
2. Monitor audit logs
3. Update security patches
4. Review access permissions
5. Test security measures
6. Maintain security documentation

## 📞 Security Incident Response

### If Compromised
1. Immediately rotate all secrets
2. Revoke all active tokens
3. Check audit logs for suspicious activity
4. Update affected users
5. Implement additional security measures
6. Review and improve security policies

Your TechNurture website now has enterprise-grade security with JWT authentication, encryption, and comprehensive monitoring!