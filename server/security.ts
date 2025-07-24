import crypto from 'crypto';

/**
 * Security Configuration for TechNurture Application
 * 
 * This file contains all security-related configurations including:
 * - JWT token settings
 * - Encryption keys
 * - Session security
 * - CORS policies
 * - Rate limiting
 */

// Generate secure random keys if not provided in environment
export const generateSecureKey = (length: number = 64): string => {
  return crypto.randomBytes(length).toString('hex');
};

// JWT Configuration
export const JWT_CONFIG = {
  // JWT Secret - Use environment variable or generate secure key
  SECRET: process.env.JWT_SECRET || generateSecureKey(64),
  
  // Token expiration times
  ACCESS_TOKEN_EXPIRES: process.env.JWT_ACCESS_EXPIRES || '15m',
  REFRESH_TOKEN_EXPIRES: process.env.JWT_REFRESH_EXPIRES || '7d',
  
  // JWT Algorithm
  ALGORITHM: 'HS256' as const,
  
  // Token issuer
  ISSUER: process.env.JWT_ISSUER || 'technurture-api',
  
  // Token audience
  AUDIENCE: process.env.JWT_AUDIENCE || 'technurture-client'
};

// Encryption Configuration
export const ENCRYPTION_CONFIG = {
  // AES-256-GCM encryption key
  KEY: process.env.ENCRYPTION_KEY || generateSecureKey(32),
  
  // Algorithm for encryption/decryption
  ALGORITHM: 'aes-256-gcm' as const,
  
  // IV length for GCM
  IV_LENGTH: 16,
  
  // Tag length for GCM
  TAG_LENGTH: 16
};

// Session Configuration
export const SESSION_CONFIG = {
  // Session secret
  SECRET: process.env.SESSION_SECRET || generateSecureKey(64),
  
  // Session name
  NAME: process.env.SESSION_NAME || 'technurture.sid',
  
  // Cookie settings
  COOKIE: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const
  },
  
  // Session store settings
  STORE: {
    checkPeriod: 24 * 60 * 60 * 1000 // Check for expired sessions every 24 hours
  }
};

// Rate Limiting Configuration
export const RATE_LIMIT_CONFIG = {
  // Login attempt limits
  LOGIN: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5,
    skipSuccessfulRequests: true
  },
  
  // API request limits
  API: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    skipSuccessfulRequests: false
  },
  
  // File upload limits
  UPLOAD: {
    windowMs: 60 * 1000, // 1 minute
    maxUploads: 10
  }
};

// CORS Configuration
export const CORS_CONFIG = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://technurture.com',
    'https://www.technurture.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Password Requirements
export const PASSWORD_POLICY = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000 // 15 minutes
};

// Security Headers
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': process.env.CSP_POLICY || "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:;"
};

// File Upload Security
export const UPLOAD_CONFIG = {
  // Maximum file size (50MB)
  maxFileSize: 50 * 1024 * 1024,
  
  // Allowed MIME types
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'application/pdf'
  ],
  
  // File name sanitization
  sanitizeFileName: true,
  
  // Virus scanning (if enabled)
  virusScanning: process.env.ENABLE_VIRUS_SCAN === 'true'
};

// Database Security
export const DATABASE_CONFIG = {
  // Connection timeout
  connectionTimeout: 30000,
  
  // Enable SSL for production
  ssl: process.env.NODE_ENV === 'production',
  
  // Connection pool settings
  poolSize: {
    min: 2,
    max: 10
  },
  
  // Query timeout
  queryTimeout: 60000
};

// Audit Logging
export const AUDIT_CONFIG = {
  enabled: process.env.ENABLE_AUDIT_LOG === 'true',
  
  // Events to log
  events: [
    'user_login',
    'user_logout',
    'user_registration',
    'password_change',
    'admin_action',
    'data_export',
    'security_violation'
  ],
  
  // Log retention (days)
  retention: parseInt(process.env.AUDIT_RETENTION_DAYS || '90'),
  
  // Sensitive data masking
  maskSensitiveData: true
};

// Environment-specific security settings
export const getSecurityConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    // Stricter settings for production
    enforceHTTPS: isProduction,
    enableCSRF: isProduction,
    enableRateLimit: isProduction,
    logLevel: isProduction ? 'warn' : 'debug',
    
    // Development-specific settings
    allowInsecureConnections: isDevelopment,
    enableDebugMode: isDevelopment,
    skipSSLVerification: isDevelopment
  };
};

// Key rotation utilities
export const KEY_ROTATION = {
  // Rotation interval (30 days)
  interval: 30 * 24 * 60 * 60 * 1000,
  
  // Check if key needs rotation
  needsRotation: (keyTimestamp: number) => {
    return Date.now() - keyTimestamp > KEY_ROTATION.interval;
  },
  
  // Generate new key pair
  rotateKeys: () => ({
    jwt: generateSecureKey(64),
    encryption: generateSecureKey(32),
    session: generateSecureKey(64),
    timestamp: Date.now()
  })
};

// Export all configuration
export const SECURITY_CONFIG = {
  JWT_CONFIG,
  ENCRYPTION_CONFIG,
  SESSION_CONFIG,
  RATE_LIMIT_CONFIG,
  CORS_CONFIG,
  PASSWORD_POLICY,
  SECURITY_HEADERS,
  UPLOAD_CONFIG,
  DATABASE_CONFIG,
  AUDIT_CONFIG,
  KEY_ROTATION,
  ...getSecurityConfig()
};