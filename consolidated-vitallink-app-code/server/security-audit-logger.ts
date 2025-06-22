import { Express, Request, Response, NextFunction } from 'express';
import { createComplianceEvent, ComplianceEventType } from './hipaa-compliance';
import fs from 'fs';
import path from 'path';

// Security audit event types
export enum SecurityEventType {
  AUTHENTICATION_SUCCESS = 'AUTH_SUCCESS',
  AUTHENTICATION_FAILURE = 'AUTH_FAILURE',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  DATA_ACCESS_VIOLATION = 'DATA_ACCESS_VIOLATION',
  ENCRYPTION_OPERATION = 'ENCRYPTION_OPERATION',
  ZK_PROOF_OPERATION = 'ZK_PROOF_OPERATION',
  NFT_OPERATION = 'NFT_OPERATION',
  API_KEY_USAGE = 'API_KEY_USAGE',
  CROSS_ORIGIN_REQUEST = 'CORS_REQUEST',
  SQL_INJECTION_ATTEMPT = 'SQL_INJECTION_ATTEMPT',
  XSS_ATTEMPT = 'XSS_ATTEMPT'
}

export interface SecurityAuditEvent {
  eventId: string;
  timestamp: Date;
  eventType: SecurityEventType;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  dataAccessed?: string[];
  securityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  metadata?: Record<string, any>;
}

class SecurityAuditLogger {
  private static instance: SecurityAuditLogger;
  private auditLog: SecurityAuditEvent[] = [];
  private logDirectory: string;
  private maxLogSize = 10000; // Maximum events before rotation

  private constructor() {
    this.logDirectory = path.join(process.cwd(), 'security-logs');
    this.ensureLogDirectory();
  }

  public static getInstance(): SecurityAuditLogger {
    if (!SecurityAuditLogger.instance) {
      SecurityAuditLogger.instance = new SecurityAuditLogger();
    }
    return SecurityAuditLogger.instance;
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }
  }

  public logSecurityEvent(event: Omit<SecurityAuditEvent, 'eventId' | 'timestamp'>): void {
    const securityEvent: SecurityAuditEvent = {
      eventId: this.generateEventId(),
      timestamp: new Date(),
      ...event
    };

    this.auditLog.push(securityEvent);

    // Write to file immediately for critical events
    if (event.securityLevel === 'CRITICAL' || event.securityLevel === 'HIGH') {
      this.writeEventToFile(securityEvent);
    }

    // Rotate logs if they get too large
    if (this.auditLog.length >= this.maxLogSize) {
      this.rotateLogFiles();
    }

    // Also log to HIPAA compliance system if health data related
    if (this.isHealthDataRelated(event.eventType)) {
      createComplianceEvent(
        ComplianceEventType.SECURITY_EVENT,
        event.userId || 'anonymous',
        'SECURITY_AUDIT',
        event.eventType,
        event.description,
        {
          dataCategories: event.dataAccessed || [],
          ipAddress: event.ipAddress,
          userAgent: event.userAgent,
          success: event.statusCode < 400
        }
      );
    }
  }

  private generateEventId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private isHealthDataRelated(eventType: SecurityEventType): boolean {
    const healthRelatedEvents = [
      SecurityEventType.ZK_PROOF_OPERATION,
      SecurityEventType.NFT_OPERATION,
      SecurityEventType.DATA_ACCESS_VIOLATION,
      SecurityEventType.ENCRYPTION_OPERATION
    ];
    return healthRelatedEvents.includes(eventType);
  }

  private writeEventToFile(event: SecurityAuditEvent): void {
    const logFileName = `security-audit-${new Date().toISOString().split('T')[0]}.json`;
    const logFilePath = path.join(this.logDirectory, logFileName);
    
    const logEntry = JSON.stringify(event) + '\n';
    fs.appendFileSync(logFilePath, logEntry);
  }

  private rotateLogFiles(): void {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const archiveFileName = `security-audit-archive-${timestamp}.json`;
    const archivePath = path.join(this.logDirectory, archiveFileName);
    
    fs.writeFileSync(archivePath, JSON.stringify(this.auditLog, null, 2));
    this.auditLog = [];
  }

  public getSecurityReport(startDate?: Date, endDate?: Date): {
    totalEvents: number;
    criticalEvents: number;
    suspiciousActivity: number;
    topThreats: string[];
    securityScore: number;
  } {
    let filteredEvents = this.auditLog;
    
    if (startDate) {
      filteredEvents = filteredEvents.filter(event => event.timestamp >= startDate);
    }
    if (endDate) {
      filteredEvents = filteredEvents.filter(event => event.timestamp <= endDate);
    }

    const criticalEvents = filteredEvents.filter(e => e.securityLevel === 'CRITICAL').length;
    const suspiciousActivity = filteredEvents.filter(e => 
      e.eventType === SecurityEventType.SUSPICIOUS_ACTIVITY ||
      e.eventType === SecurityEventType.UNAUTHORIZED_ACCESS ||
      e.eventType === SecurityEventType.SQL_INJECTION_ATTEMPT ||
      e.eventType === SecurityEventType.XSS_ATTEMPT
    ).length;

    // Calculate security score (0-100)
    const totalEvents = filteredEvents.length;
    const securityScore = Math.max(0, 100 - (criticalEvents * 10) - (suspiciousActivity * 5));

    // Get top threat types
    const threatCounts: Record<string, number> = {};
    filteredEvents.forEach(event => {
      if (event.securityLevel === 'HIGH' || event.securityLevel === 'CRITICAL') {
        threatCounts[event.eventType] = (threatCounts[event.eventType] || 0) + 1;
      }
    });

    const topThreats = Object.entries(threatCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([threat]) => threat);

    return {
      totalEvents,
      criticalEvents,
      suspiciousActivity,
      topThreats,
      securityScore
    };
  }
}

// Middleware to log all requests for security auditing
export function securityAuditMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const logger = SecurityAuditLogger.getInstance();

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /union\s+select/i,
    /<script/i,
    /javascript:/i,
    /eval\(/i,
    /exec\(/i
  ];

  const requestBody = JSON.stringify(req.body || '');
  const queryString = JSON.stringify(req.query || '');
  const isSuspicious = suspiciousPatterns.some(pattern => 
    pattern.test(requestBody) || pattern.test(queryString) || pattern.test(req.url)
  );

  // Override res.end to capture response details
  const originalEnd = res.end;
  res.end = function(this: Response, ...args: any[]) {
    const responseTime = Date.now() - startTime;
    
    // Determine security level
    let securityLevel: SecurityAuditEvent['securityLevel'] = 'LOW';
    if (isSuspicious) securityLevel = 'CRITICAL';
    else if (res.statusCode >= 400) securityLevel = 'MEDIUM';
    else if (req.url.includes('/api/zk/') || req.url.includes('/api/nft/')) securityLevel = 'HIGH';

    // Determine event type
    let eventType = SecurityEventType.API_KEY_USAGE;
    if (isSuspicious && requestBody.includes('union select')) eventType = SecurityEventType.SQL_INJECTION_ATTEMPT;
    else if (isSuspicious && requestBody.includes('<script')) eventType = SecurityEventType.XSS_ATTEMPT;
    else if (res.statusCode === 401) eventType = SecurityEventType.AUTHENTICATION_FAILURE;
    else if (res.statusCode === 403) eventType = SecurityEventType.UNAUTHORIZED_ACCESS;
    else if (req.url.includes('/api/zk/')) eventType = SecurityEventType.ZK_PROOF_OPERATION;
    else if (req.url.includes('/api/nft/')) eventType = SecurityEventType.NFT_OPERATION;

    // Log the security event
    logger.logSecurityEvent({
      eventType,
      userId: (req as any).user?.claims?.sub,
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      endpoint: req.url,
      method: req.method,
      statusCode: res.statusCode,
      responseTime,
      securityLevel,
      description: `${req.method} ${req.url} - ${res.statusCode} - ${responseTime}ms`,
      metadata: {
        requestSize: requestBody.length,
        hasAuth: !!(req as any).user,
        suspicious: isSuspicious
      }
    });

    originalEnd.apply(this, args);
  };

  next();
}

// API endpoints for security monitoring
export function setupSecurityAuditAPI(app: Express): void {
  const logger = SecurityAuditLogger.getInstance();

  // Get security dashboard data
  app.get('/api/security/dashboard', async (req: Request, res: Response) => {
    try {
      const report = logger.getSecurityReport();
      res.json(report);
    } catch (error) {
      console.error('Error generating security report:', error);
      res.status(500).json({ message: 'Failed to generate security report' });
    }
  });

  // Get detailed security events (admin only)
  app.get('/api/security/events', async (req: Request, res: Response) => {
    try {
      // In production, add admin authentication check here
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      
      const report = logger.getSecurityReport(startDate, endDate);
      res.json(report);
    } catch (error) {
      console.error('Error fetching security events:', error);
      res.status(500).json({ message: 'Failed to fetch security events' });
    }
  });

  // Manual security alert endpoint
  app.post('/api/security/alert', async (req: Request, res: Response) => {
    try {
      const { description, securityLevel, metadata } = req.body;
      
      logger.logSecurityEvent({
        eventType: SecurityEventType.SUSPICIOUS_ACTIVITY,
        userId: (req as any).user?.claims?.sub,
        ipAddress: req.ip || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown',
        endpoint: '/api/security/alert',
        method: 'POST',
        statusCode: 200,
        responseTime: 0,
        securityLevel: securityLevel || 'MEDIUM',
        description: description || 'Manual security alert triggered',
        metadata
      });

      res.json({ message: 'Security alert logged successfully' });
    } catch (error) {
      console.error('Error logging security alert:', error);
      res.status(500).json({ message: 'Failed to log security alert' });
    }
  });
}

export const securityLogger = SecurityAuditLogger.getInstance();