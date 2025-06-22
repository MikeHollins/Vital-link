import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

// Types of HIPAA-related events we want to track
export enum ComplianceEventType {
  DATA_ACCESS = 'DATA_ACCESS',
  DATA_CREATION = 'DATA_CREATION',
  DATA_MODIFICATION = 'DATA_MODIFICATION',
  DATA_DELETION = 'DATA_DELETION',
  USER_AUTHENTICATION = 'USER_AUTHENTICATION',
  SHARING_CHANGE = 'SHARING_CHANGE',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
  ENCRYPTION_EVENT = 'ENCRYPTION_EVENT',
  PRIVACY_SETTING = 'PRIVACY_SETTING',
  HEALTH_DATA_SYNC = 'HEALTH_DATA_SYNC',
  PLATFORM_CONNECTION = 'PLATFORM_CONNECTION',
  BLOCKCHAIN_TRANSACTION = 'BLOCKCHAIN_TRANSACTION',
  SECURITY_EVENT = 'SECURITY_EVENT',
}

// Interface for compliance events
export interface ComplianceEvent {
  eventType: ComplianceEventType;
  timestamp: Date;
  userId: string;
  resourceType: string;
  resourceId?: string | number;
  action: string;
  description: string;
  dataCategories?: string[];
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  failureReason?: string;
}

// HIPAA requirement categories for tracking compliance
export enum HipaaRequirementCategory {
  PRIVACY = 'PRIVACY_RULE',
  SECURITY = 'SECURITY_RULE',
  BREACH_NOTIFICATION = 'BREACH_NOTIFICATION',
  PATIENT_RIGHTS = 'PATIENT_RIGHTS',
  ADMINISTRATIVE = 'ADMINISTRATIVE_SAFEGUARDS',
  PHYSICAL = 'PHYSICAL_SAFEGUARDS',
  TECHNICAL = 'TECHNICAL_SAFEGUARDS',
  ORGANIZATIONAL = 'ORGANIZATIONAL_REQUIREMENTS',
}

// Class to handle compliance logging and reporting
export class HipaaComplianceManager {
  private static instance: HipaaComplianceManager;
  private complianceEvents: ComplianceEvent[] = [];
  private logDirectory: string;
  private readonly maxEventsBeforeWrite = 50; // Write to file after this many events

  private constructor() {
    // Create logs directory if it doesn't exist
    this.logDirectory = path.join(process.cwd(), 'compliance-logs');
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }
  }

  public static getInstance(): HipaaComplianceManager {
    if (!HipaaComplianceManager.instance) {
      HipaaComplianceManager.instance = new HipaaComplianceManager();
    }
    return HipaaComplianceManager.instance;
  }

  // Log a compliance event
  public logEvent(event: ComplianceEvent): void {
    // Add timestamps in a standardized format
    const enrichedEvent = {
      ...event,
      timestamp: event.timestamp || new Date(),
    };

    // Add to in-memory queue
    this.complianceEvents.push(enrichedEvent);
    
    // Also log to console for real-time monitoring
    console.info(`HIPAA Compliance Event: [${enrichedEvent.eventType}] ${enrichedEvent.description}`);

    // Write to file if we've reached the threshold
    if (this.complianceEvents.length >= this.maxEventsBeforeWrite) {
      this.writeEventsToFile();
    }
  }

  // Generate compliance report for a specific time period
  public generateComplianceReport(startDate: Date, endDate: Date): { 
    summary: { 
      totalEvents: number,
      successfulEvents: number,
      failedEvents: number,
      byEventType: Record<string, number>,
      byRequirementCategory: Record<string, number>,
    },
    events: ComplianceEvent[] 
  } {
    // First write any pending events
    this.writeEventsToFile();
    
    // Read all log files within the date range
    const allEvents: ComplianceEvent[] = this.readEventsFromFiles(startDate, endDate);
    
    // Filter events by date range
    const filteredEvents = allEvents.filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= startDate && eventDate <= endDate;
    });
    
    // Generate summary statistics
    const summary = {
      totalEvents: filteredEvents.length,
      successfulEvents: filteredEvents.filter(e => e.success).length,
      failedEvents: filteredEvents.filter(e => !e.success).length,
      byEventType: {} as Record<string, number>,
      byRequirementCategory: {} as Record<string, number>,
    };
    
    // Count events by type
    filteredEvents.forEach(event => {
      if (!summary.byEventType[event.eventType]) {
        summary.byEventType[event.eventType] = 0;
      }
      summary.byEventType[event.eventType]++;
      
      // Map event types to HIPAA requirement categories
      const category = this.mapEventToRequirementCategory(event.eventType);
      if (!summary.byRequirementCategory[category]) {
        summary.byRequirementCategory[category] = 0;
      }
      summary.byRequirementCategory[category]++;
    });
    
    return {
      summary,
      events: filteredEvents
    };
  }

  // Write current events to a log file
  private writeEventsToFile(): void {
    if (this.complianceEvents.length === 0) return;
    
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const filename = `hipaa-compliance-log-${dateStr}.json`;
    const filePath = path.join(this.logDirectory, filename);
    
    try {
      // Read existing events if file exists
      let existingEvents: ComplianceEvent[] = [];
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        existingEvents = JSON.parse(fileContent);
      }
      
      // Combine with new events
      const allEvents = [...existingEvents, ...this.complianceEvents];
      
      // Write to file
      fs.writeFileSync(filePath, JSON.stringify(allEvents, null, 2));
      
      // Clear in-memory queue
      this.complianceEvents = [];
    } catch (error) {
      console.error('Error writing compliance events to file:', error);
    }
  }

  // Read events from log files
  private readEventsFromFiles(startDate: Date, endDate: Date): ComplianceEvent[] {
    const allEvents: ComplianceEvent[] = [];
    
    try {
      // Get all log files
      const files = fs.readdirSync(this.logDirectory)
        .filter(file => file.startsWith('hipaa-compliance-log-') && file.endsWith('.json'));
      
      // Read each file
      for (const file of files) {
        const fileDate = file.replace('hipaa-compliance-log-', '').replace('.json', '');
        const fileDateObj = new Date(fileDate);
        
        // Only process files that might contain events in our date range
        if (fileDateObj >= startDate && fileDateObj <= endDate) {
          const filePath = path.join(this.logDirectory, file);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const fileEvents: ComplianceEvent[] = JSON.parse(fileContent);
          allEvents.push(...fileEvents);
        }
      }
    } catch (error) {
      console.error('Error reading compliance events from files:', error);
    }
    
    return allEvents;
  }

  // Map event types to HIPAA requirement categories
  private mapEventToRequirementCategory(eventType: ComplianceEventType): HipaaRequirementCategory {
    switch (eventType) {
      case ComplianceEventType.DATA_ACCESS:
      case ComplianceEventType.DATA_CREATION:
      case ComplianceEventType.DATA_MODIFICATION:
      case ComplianceEventType.DATA_DELETION:
        return HipaaRequirementCategory.TECHNICAL;
        
      case ComplianceEventType.USER_AUTHENTICATION:
      case ComplianceEventType.SECURITY_EVENT:
        return HipaaRequirementCategory.SECURITY;
        
      case ComplianceEventType.SHARING_CHANGE:
      case ComplianceEventType.PERMISSION_CHANGE:
      case ComplianceEventType.PRIVACY_SETTING:
        return HipaaRequirementCategory.PRIVACY;
        
      case ComplianceEventType.ENCRYPTION_EVENT:
        return HipaaRequirementCategory.TECHNICAL;
        
      case ComplianceEventType.HEALTH_DATA_SYNC:
      case ComplianceEventType.PLATFORM_CONNECTION:
        return HipaaRequirementCategory.TECHNICAL;
        
      case ComplianceEventType.BLOCKCHAIN_TRANSACTION:
        return HipaaRequirementCategory.TECHNICAL;
        
      default:
        return HipaaRequirementCategory.ADMINISTRATIVE;
    }
  }

  // Generate comprehensive HIPAA compliance report
  public generateComprehensiveReport(): {
    generated: Date,
    overallCompliance: {
      privacyRule: { status: string, issues: string[] },
      securityRule: { status: string, issues: string[] },
      patientRights: { status: string, issues: string[] },
      technicalSafeguards: { status: string, issues: string[] }
    },
    recommendations: string[]
  } {
    // In a real implementation, this would perform a detailed analysis
    // For now we'll just return a sample report structure
    
    return {
      generated: new Date(),
      overallCompliance: {
        privacyRule: { 
          status: "Compliant", 
          issues: [] 
        },
        securityRule: { 
          status: "Compliant", 
          issues: [] 
        },
        patientRights: { 
          status: "Compliant", 
          issues: [] 
        },
        technicalSafeguards: { 
          status: "Compliant", 
          issues: [] 
        }
      },
      recommendations: [
        "Continue monitoring access logs for unusual patterns",
        "Conduct quarterly security assessments",
        "Ensure all third-party integrations maintain HIPAA compliance"
      ]
    };
  }
}

// Export singleton instance
export const complianceManager = HipaaComplianceManager.getInstance();

// Utility function to create compliance events
export function createComplianceEvent(
  eventType: ComplianceEventType,
  userId: string,
  resourceType: string,
  action: string,
  description: string,
  options: {
    resourceId?: string | number,
    dataCategories?: string[],
    ipAddress?: string,
    userAgent?: string,
    success?: boolean,
    failureReason?: string
  } = {}
): void {
  complianceManager.logEvent({
    eventType,
    timestamp: new Date(),
    userId,
    resourceType,
    action,
    description,
    resourceId: options.resourceId,
    dataCategories: options.dataCategories,
    ipAddress: options.ipAddress,
    userAgent: options.userAgent,
    success: options.success !== undefined ? options.success : true,
    failureReason: options.failureReason
  });
}

// Helper function to generate daily compliance report
export function generateDailyComplianceReport(): { 
  report: any, 
  filePath: string 
} {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Set time to start of days
  yesterday.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);
  
  // Generate the report
  const report = complianceManager.generateComplianceReport(yesterday, today);
  
  // Save to file
  const dateStr = format(yesterday, 'yyyy-MM-dd');
  const filename = `hipaa-daily-report-${dateStr}.json`;
  const reportDir = path.join(process.cwd(), 'compliance-reports');
  
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const filePath = path.join(reportDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
  
  return { report, filePath };
}

// Schedule daily report generation (for server app)
export function scheduleDailyReports(): void {
  // Check every hour if we need to generate a report
  const interval = setInterval(() => {
    const now = new Date();
    // Generate at 1AM every day
    if (now.getHours() === 1 && now.getMinutes() < 5) {
      generateDailyComplianceReport();
    }
  }, 60 * 60 * 1000); // Check every hour
  
  // Return the interval to be able to clear it if needed
  return interval;
}