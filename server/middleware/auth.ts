import { Request, Response, NextFunction } from 'express';
import { AuthService, JWTPayload } from '../auth';

// Extend Express Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  const decoded = AuthService.verifyToken(token);
  
  if (!decoded || decoded.type !== 'access') {
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }

  req.user = {
    id: decoded.userId,
    username: decoded.username,
    role: decoded.role
  };

  next();
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }

  next();
};

/**
 * Middleware to check if user is authenticated (either JWT or session)
 */
export const requireAuth = (req: any, res: Response, next: NextFunction) => {
  // First check JWT token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const decoded = AuthService.verifyToken(token);
    if (decoded && decoded.type === 'access') {
      req.user = {
        id: decoded.userId,
        username: decoded.username,
        role: decoded.role
      };
      return next();
    }
  }

  // Fallback to session-based authentication
  if (req.session?.user) {
    req.user = req.session.user;
    return next();
  }

  return res.status(401).json({ 
    success: false, 
    message: 'Authentication required' 
  });
};

/**
 * Middleware for rate limiting login attempts
 */
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export const rateLimitLogin = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  const attempts = loginAttempts.get(ip);
  
  if (attempts) {
    // Reset counter if window has passed
    if (now - attempts.lastAttempt > windowMs) {
      loginAttempts.delete(ip);
    } else if (attempts.count >= maxAttempts) {
      return res.status(429).json({
        success: false,
        message: 'Too many login attempts. Please try again later.',
        retryAfter: Math.ceil((windowMs - (now - attempts.lastAttempt)) / 1000)
      });
    }
  }

  // Track this attempt
  const currentAttempts = attempts ? attempts.count + 1 : 1;
  loginAttempts.set(ip, {
    count: currentAttempts,
    lastAttempt: now
  });

  next();
};

/**
 * Clean up old login attempts periodically
 */
setInterval(() => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  
  for (const [ip, attempts] of loginAttempts.entries()) {
    if (now - attempts.lastAttempt > windowMs) {
      loginAttempts.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes