import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { sanitizeInput } from './security-fixes';

// Enhanced authentication middleware with security logging
export function secureAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Sanitize all incoming request data
    req.body = sanitizeInput(req.body);
    req.query = sanitizeInput(req.query);
    req.params = sanitizeInput(req.params);

    // Check for authentication token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Not authenticated',
        timestamp: new Date().toISOString()
      });
    }

    const token = authHeader.substring(7);
    
    // Basic token validation (implement proper JWT validation in production)
    if (!token || token.length < 10) {
      return res.status(401).json({ 
        message: 'Invalid authentication token',
        timestamp: new Date().toISOString()
      });
    }

    // For demo purposes, create a mock user
    // In production, decode and validate JWT token here
    req.user = {
      id: 'demo-user',
      email: 'demo@vitallink.health',
      role: 'user'
    };

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ 
      message: 'Authentication service error',
      timestamp: new Date().toISOString()
    });
  }
}

// Health data access authorization
export function healthDataAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'User not authenticated for health data access',
        timestamp: new Date().toISOString()
      });
    }

    // Log health data access for HIPAA compliance
    console.log(`HIPAA Compliance Event: [DATA_ACCESS] ${req.method} ${req.path} - User: ${req.user.id}`);
    
    next();
  } catch (error) {
    console.error('Health data authorization error:', error);
    res.status(500).json({ 
      message: 'Health data authorization failed',
      timestamp: new Date().toISOString()
    });
  }
}

// Rate limiting for API security
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimitMiddleware(maxRequests: number = 100, windowMs: number = 60000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    const clientData = requestCounts.get(clientIP);
    
    if (!clientData || now > clientData.resetTime) {
      requestCounts.set(clientIP, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (clientData.count >= maxRequests) {
      return res.status(429).json({ 
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
      });
    }
    
    clientData.count++;
    next();
  };
}

export default {
  secureAuthMiddleware,
  healthDataAuthMiddleware,
  rateLimitMiddleware
};