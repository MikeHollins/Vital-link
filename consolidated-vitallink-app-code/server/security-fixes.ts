import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Input validation schemas
export const inputValidationSchemas = {
  id: z.coerce.number().int().positive(),
  userId: z.string().regex(/^[a-zA-Z0-9_-]+$/).min(1).max(50),
  platform: z.enum(['apple_health', 'fitbit', 'garmin', 'samsung_health', 'google_fit']),
  healthDataType: z.enum(['steps', 'heart_rate', 'sleep', 'calories', 'distance']),
  dateString: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  language: z.enum(['en', 'es', 'zh', 'ms', 'ta', 'ru', 'de']),
  timestamp: z.coerce.number().int().positive(),
  limit: z.coerce.number().int().min(1).max(1000).default(50),
  proofId: z.string().uuid()
};

// Secure input sanitization
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input
      .replace(/[<>'"&]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '')
      .trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(item => sanitizeInput(item));
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    Object.entries(input).forEach(([key, value]) => {
      sanitized[key] = sanitizeInput(value);
    });
    return sanitized;
  }
  
  return input;
}

// Secure parameter validation middleware
export function validateParams(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      res.status(400).json({ 
        error: 'Invalid parameters',
        details: error instanceof z.ZodError ? error.errors : 'Validation failed'
      });
    }
  };
}

// Secure query validation middleware
export function validateQuery(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      res.status(400).json({ 
        error: 'Invalid query parameters',
        details: error instanceof z.ZodError ? error.errors : 'Validation failed'
      });
    }
  };
}

// Secure body validation middleware
export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = sanitizeInput(req.body);
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ 
        error: 'Invalid request body',
        details: error instanceof z.ZodError ? error.errors : 'Validation failed'
      });
    }
  };
}

// Secure URL creation for external links
export function createSecureURL(baseUrl: string, path: string): string {
  try {
    const url = new URL(path, baseUrl);
    
    // Only allow specific trusted domains
    const trustedDomains = [
      'polygonscan.com',
      'opensea.io',
      'etherscan.io'
    ];
    
    if (!trustedDomains.includes(url.hostname)) {
      throw new Error('Untrusted domain');
    }
    
    return url.toString();
  } catch {
    return '#'; // Safe fallback
  }
}

// Health data specific validation schemas
export const healthDataSchemas = {
  healthMetric: z.object({
    type: inputValidationSchemas.healthDataType,
    value: z.number().min(0),
    unit: z.string().max(20),
    timestamp: inputValidationSchemas.timestamp
  }),
  
  deviceConnection: z.object({
    platform: inputValidationSchemas.platform,
    credentials: z.object({
      apiKey: z.string().min(10).max(500),
      clientId: z.string().min(5).max(100)
    }).optional()
  }),
  
  zkProof: z.object({
    proofData: z.string().min(100).max(10000),
    publicInputs: z.array(z.string()),
    verificationKey: z.string().min(50).max(1000)
  })
};

export default {
  inputValidationSchemas,
  sanitizeInput,
  validateParams,
  validateQuery,
  validateBody,
  createSecureURL,
  healthDataSchemas
};