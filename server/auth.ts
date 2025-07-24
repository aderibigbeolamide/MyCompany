import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { storage } from './storage';

// Generate secure keys if not provided
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex');
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');

// JWT token expiration times
const ACCESS_TOKEN_EXPIRES = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRES = '7d'; // 7 days

export interface JWTPayload {
  userId: string;
  username: string;
  role: string;
  type: 'access' | 'refresh';
}

export class AuthService {
  /**
   * Generate JWT access and refresh tokens
   */
  static generateTokens(user: { id: any; username: string; role: string }) {
    const payload = {
      userId: user.id.toString(),
      username: user.username,
      role: user.role
    };

    const accessToken = jwt.sign(
      { ...payload, type: 'access' },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );

    const refreshToken = jwt.sign(
      { ...payload, type: 'refresh' },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES }
    );

    return { accessToken, refreshToken };
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(refreshToken: string) {
    const decoded = this.verifyToken(refreshToken);
    
    if (!decoded || decoded.type !== 'refresh') {
      throw new Error('Invalid refresh token');
    }

    // Verify user still exists
    const user = await storage.getUserByUsername(decoded.username);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate new access token
    const accessToken = jwt.sign(
      {
        userId: decoded.userId,
        username: decoded.username,
        role: decoded.role,
        type: 'access'
      },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );

    return { accessToken };
  }

  /**
   * Authenticate user with username and password
   */
  static async authenticateUser(username: string, password: string) {
    try {
      // Trim whitespace from inputs to handle copy-paste issues
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      
      const user = await storage.getUserByUsername(trimmedUsername);
      if (!user) {
        return null;
      }

      const isValidPassword = await bcrypt.compare(trimmedPassword, user.password);
      if (!isValidPassword) {
        return null;
      }

      return {
        id: user.id,
        username: user.username,
        role: user.role
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  /**
   * Hash password for storage
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /**
   * Encrypt sensitive data
   */
  static encryptData(text: string): string {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher(algorithm, key);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * Decrypt sensitive data
   */
  static decryptData(encryptedText: string): string {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');
    
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    
    const decipher = crypto.createDecipher(algorithm, key);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Generate secure session ID
   */
  static generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export the secrets for use in middleware
export const authConfig = {
  JWT_SECRET,
  SESSION_SECRET,
  ENCRYPTION_KEY,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES
};