import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';

// Rate limiting configuration
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many login attempts from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many API requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Development-friendly security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: false, // Disable CSP for development
  crossOriginEmbedderPolicy: false,
  hsts: false, // Disable HSTS for development
  frameguard: false,
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "no-referrer-when-downgrade" }
});

// Enhanced input validation middleware
export const validateInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeString = (str: string): string => {
    // Remove script tags, event handlers, and dangerous protocols
    return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/javascript:/gi, '')
              .replace(/data:text\/html/gi, '')
              .replace(/vbscript:/gi, '')
              .replace(/on\w+\s*=/gi, '')
              .replace(/style\s*=\s*["'][^"']*expression\s*\(/gi, '')
              .replace(/href\s*=\s*["']javascript:/gi, '')
              .trim();
  };

  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      // Additional length validation
      if (obj.length > 10000) {
        throw new Error('Input string too long');
      }
      return sanitizeString(obj);
    }
    if (Array.isArray(obj)) {
      if (obj.length > 1000) {
        throw new Error('Array too large');
      }
      return obj.map(sanitizeObject);
    }
    if (obj && typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length > 100) {
        throw new Error('Object has too many properties');
      }
      const sanitized: any = {};
      for (const key in obj) {
        // Validate property names
        if (key.includes('__proto__') || key.includes('constructor') || key.includes('prototype')) {
          continue; // Skip dangerous property names
        }
        sanitized[key] = sanitizeObject(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  try {
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid input data' });
  }
};

// HIPAA audit logging middleware
export const auditLogger = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    console.log(`[AUDIT] ${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip} - User: ${(req as any).user?.claims?.sub || 'anonymous'}`);
    
    return originalSend.call(this, data);
  };
  
  next();
};

// Environment validation
export const validateEnvironment = () => {
  const requiredEnvVars = [
    'DATABASE_URL',
    'SESSION_SECRET',
    'REPL_ID',
    'REPLIT_DOMAINS'
  ];

  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Error handling middleware
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error);

  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(500).json({
    message: 'Internal server error',
    ...(isDevelopment && { error: error.message, stack: error.stack })
  });
};