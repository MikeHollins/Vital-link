import { regulatoryCompliance, securityAuditLogs } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface ComplianceFramework {
  jurisdiction: string;
  framework: string;
  dataRetentionDays: number;
  requiresExplicitConsent: boolean;
  allowsDataTransfer: boolean;
  encryptionRequired: boolean;
}

export const COMPLIANCE_FRAMEWORKS: Record<string, ComplianceFramework> = {
  'US': {
    jurisdiction: 'US',
    framework: 'HIPAA',
    dataRetentionDays: 2555, // 7 years
    requiresExplicitConsent: true,
    allowsDataTransfer: true,
    encryptionRequired: true,
  },
  'SG': {
    jurisdiction: 'SG',
    framework: 'PDPA',
    dataRetentionDays: 365,
    requiresExplicitConsent: true,
    allowsDataTransfer: false,
    encryptionRequired: true,
  },
  'EU': {
    jurisdiction: 'EU',
    framework: 'GDPR',
    dataRetentionDays: 1095, // 3 years
    requiresExplicitConsent: true,
    allowsDataTransfer: false,
    encryptionRequired: true,
  },
  'CA': {
    jurisdiction: 'CA',
    framework: 'PIPEDA',
    dataRetentionDays: 1825, // 5 years
    requiresExplicitConsent: true,
    allowsDataTransfer: true,
    encryptionRequired: true,
  },
  'AU': {
    jurisdiction: 'AU',
    framework: 'Privacy Act',
    dataRetentionDays: 2555, // 7 years
    requiresExplicitConsent: true,
    allowsDataTransfer: true,
    encryptionRequired: true,
  },
};

export class RegulatoryComplianceService {
  async detectJurisdiction(ipAddress: string, userPreferences?: any): Promise<string> {
    // Patent Claim 4: Automatically determine jurisdiction based on geolocation, IP address, or user metadata
    
    // First check user preferences
    if (userPreferences?.preferredJurisdiction) {
      return userPreferences.preferredJurisdiction;
    }

    // IP geolocation detection (simplified for demonstration)
    // In production, you'd use a real IP geolocation service
    const ipToCountry: Record<string, string> = {
      '192.168.': 'US', // Local/dev IPs default to US
      '10.': 'US',
      '172.': 'US',
    };

    for (const [prefix, country] of Object.entries(ipToCountry)) {
      if (ipAddress.startsWith(prefix)) {
        return country;
      }
    }

    // Default to Singapore for production (launch market)
    return 'SG';
  }

  async updateUserCompliance(
    userId: string, 
    ipAddress: string, 
    userAgent: string,
    geoLocation?: { lat: number; lng: number },
    userPreferences?: any
  ) {
    const jurisdiction = await this.detectJurisdiction(ipAddress, userPreferences);
    const framework = COMPLIANCE_FRAMEWORKS[jurisdiction] || COMPLIANCE_FRAMEWORKS['SG'];

    // Patent Claim 8: Dynamically select compliance requirements based on jurisdictional metadata
    const compliance = await db.insert(regulatoryCompliance).values({
      userId,
      detectedJurisdiction: jurisdiction,
      complianceFramework: framework.framework,
      geoLocation,
      ipAddress,
      userPreferences,
      dataRetentionPeriod: framework.dataRetentionDays,
      consentStatus: 'pending',
      isActive: true,
    }).onConflictDoUpdate({
      target: regulatoryCompliance.userId,
      set: {
        detectedJurisdiction: jurisdiction,
        complianceFramework: framework.framework,
        ipAddress,
        geoLocation,
        userPreferences,
        dataRetentionPeriod: framework.dataRetentionDays,
        lastUpdated: new Date(),
      },
    }).returning();

    // Patent Claim 8: Generate audit trails for all verification activities
    await this.logSecurityEvent(userId, 'COMPLIANCE_UPDATE', {
      jurisdiction,
      framework: framework.framework,
      ipAddress,
      userAgent,
    });

    return compliance[0];
  }

  async grantConsent(userId: string, consentType: string) {
    await db.update(regulatoryCompliance)
      .set({
        consentStatus: 'granted',
        consentTimestamp: new Date(),
        lastUpdated: new Date(),
      })
      .where(eq(regulatoryCompliance.userId, userId));

    await this.logSecurityEvent(userId, 'CONSENT_GRANTED', { consentType });
  }

  async withdrawConsent(userId: string) {
    await db.update(regulatoryCompliance)
      .set({
        consentStatus: 'withdrawn',
        consentTimestamp: new Date(),
        lastUpdated: new Date(),
      })
      .where(eq(regulatoryCompliance.userId, userId));

    await this.logSecurityEvent(userId, 'CONSENT_WITHDRAWN', {});
  }

  async getUserCompliance(userId: string) {
    const [compliance] = await db.select()
      .from(regulatoryCompliance)
      .where(eq(regulatoryCompliance.userId, userId));

    return compliance;
  }

  async logSecurityEvent(
    userId: string | null,
    eventType: string,
    metadata: any,
    severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL' = 'INFO'
  ) {
    await db.insert(securityAuditLogs).values({
      userId,
      eventType,
      description: `${eventType}: ${JSON.stringify(metadata)}`,
      metadata,
      severity,
    });
  }

  getFrameworkRequirements(jurisdiction: string): ComplianceFramework {
    return COMPLIANCE_FRAMEWORKS[jurisdiction] || COMPLIANCE_FRAMEWORKS['SG'];
  }
}

export const regulatoryService = new RegulatoryComplianceService();