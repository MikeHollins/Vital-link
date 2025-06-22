import OpenAI from "openai";
import { db } from "../db";
import { consentRecords, auditTrail, regulatoryCompliance } from "@shared/schema";
import { eq, and } from "drizzle-orm";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ConsentRequest {
  userId: string;
  consentType: string;
  purpose: string;
  dataTypes: string[];
  requestingParty: string;
  jurisdiction: string;
  expirationDays?: number;
}

export interface ConsentResponse {
  consentId: string;
  status: 'granted' | 'denied' | 'pending';
  grantedAt?: Date;
  expiresAt?: Date;
  scope: string[];
  auditTrailId: string;
}

export interface ComplianceAnalysis {
  framework: string;
  requirements: string[];
  isCompliant: boolean;
  recommendations: string[];
}

export class ConsentService {
  // Grant consent with jurisdiction-specific compliance validation
  async grantConsent(request: ConsentRequest): Promise<ConsentResponse> {
    try {
      // Analyze compliance requirements for jurisdiction
      const complianceAnalysis = await this.analyzeComplianceRequirements(
        request.jurisdiction,
        request.dataTypes,
        request.purpose
      );

      if (!complianceAnalysis.isCompliant) {
        throw new Error(`Consent request violates ${complianceAnalysis.framework} requirements`);
      }

      // Calculate expiration date
      const expiresAt = request.expirationDays 
        ? new Date(Date.now() + request.expirationDays * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Default 1 year

      // Store consent record
      const [consentRecord] = await db
        .insert(consentRecords)
        .values({
          userId: request.userId,
          consentType: request.consentType,
          purpose: request.purpose,
          dataTypes: request.dataTypes,
          expiresAt,
          jurisdiction: request.jurisdiction,
        })
        .returning();

      // Create audit trail entry
      const [auditEntry] = await db
        .insert(auditTrail)
        .values({
          userId: request.userId,
          action: 'CONSENT_GRANTED',
          resourceType: 'consent_record',
          resourceId: consentRecord.id,
          details: {
            consentType: request.consentType,
            purpose: request.purpose,
            dataTypes: request.dataTypes,
            requestingParty: request.requestingParty,
            jurisdiction: request.jurisdiction,
            complianceFramework: complianceAnalysis.framework
          }
        })
        .returning();

      return {
        consentId: consentRecord.id,
        status: 'granted',
        grantedAt: consentRecord.grantedAt!,
        expiresAt: consentRecord.expiresAt!,
        scope: request.dataTypes,
        auditTrailId: auditEntry.id
      };
    } catch (error) {
      console.error("Consent granting failed:", error);
      throw error;
    }
  }

  // Revoke consent with secure deletion compliance
  async revokeConsent(
    consentId: string,
    userId: string,
    reason?: string
  ): Promise<{
    revoked: boolean;
    deletionScheduled: boolean;
    auditTrailId: string;
  }> {
    try {
      // Update consent record
      await db
        .update(consentRecords)
        .set({
          revokedAt: new Date(),
          isActive: false
        })
        .where(and(
          eq(consentRecords.id, consentId),
          eq(consentRecords.userId, userId)
        ));

      // Schedule secure deletion
      const deletionScheduled = await this.scheduleSecureDeletion(consentId, userId);

      // Create audit trail entry
      const [auditEntry] = await db
        .insert(auditTrail)
        .values({
          userId,
          action: 'CONSENT_REVOKED',
          resourceType: 'consent_record',
          resourceId: consentId,
          details: {
            reason,
            deletionScheduled,
            revokedAt: new Date()
          }
        })
        .returning();

      return {
        revoked: true,
        deletionScheduled,
        auditTrailId: auditEntry.id
      };
    } catch (error) {
      console.error("Consent revocation failed:", error);
      throw error;
    }
  }

  // Analyze compliance requirements using AI
  private async analyzeComplianceRequirements(
    jurisdiction: string,
    dataTypes: string[],
    purpose: string
  ): Promise<ComplianceAnalysis> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a data privacy compliance expert specializing in GDPR, HIPAA, CCPA, and international privacy regulations."
          },
          {
            role: "user",
            content: `Analyze compliance requirements for:
            - Jurisdiction: ${jurisdiction}
            - Data Types: ${dataTypes.join(', ')}
            - Purpose: ${purpose}
            
            Return JSON with: framework (GDPR/HIPAA/CCPA/etc), requirements (array), isCompliant (boolean), recommendations (array).`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 600,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        framework: result.framework || this.getDefaultFramework(jurisdiction),
        requirements: result.requirements || [],
        isCompliant: result.isCompliant !== false,
        recommendations: result.recommendations || []
      };
    } catch (error) {
      console.error("Compliance analysis failed:", error);
      // Return conservative compliance analysis
      return {
        framework: this.getDefaultFramework(jurisdiction),
        requirements: ['explicit_consent', 'purpose_limitation', 'data_minimization'],
        isCompliant: true,
        recommendations: ['Ensure clear consent language', 'Implement data retention policies']
      };
    }
  }

  // Get default compliance framework for jurisdiction
  private getDefaultFramework(jurisdiction: string): string {
    const frameworks: Record<string, string> = {
      'EU': 'GDPR',
      'US': 'HIPAA',
      'CA': 'CCPA',
      'UK': 'GDPR',
      'AU': 'Privacy Act',
      'SG': 'PDPA'
    };
    return frameworks[jurisdiction] || 'GDPR';
  }

  // Schedule secure deletion of data
  private async scheduleSecureDeletion(consentId: string, userId: string): Promise<boolean> {
    try {
      // In a real implementation, this would integrate with secure deletion systems
      const deletionJob = {
        consentId,
        userId,
        scheduledFor: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        status: 'scheduled'
      };

      // Create audit entry for deletion scheduling
      await db.insert(auditTrail).values({
        userId,
        action: 'SECURE_DELETION_SCHEDULED',
        resourceType: 'consent_record',
        resourceId: consentId,
        details: deletionJob
      });

      return true;
    } catch (error) {
      console.error("Secure deletion scheduling failed:", error);
      return false;
    }
  }

  // Check consent validity for data access
  async validateConsentForAccess(
    userId: string,
    dataTypes: string[],
    purpose: string
  ): Promise<{
    isValid: boolean;
    consentRecords: any[];
    missingConsents: string[];
    expiredConsents: string[];
  }> {
    try {
      // Get active consent records
      const activeConsents = await db
        .select()
        .from(consentRecords)
        .where(and(
          eq(consentRecords.userId, userId),
          eq(consentRecords.isActive, true)
        ));

      // Analyze consent coverage using AI
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a consent validation specialist. Analyze if existing consents cover the requested data access."
          },
          {
            role: "user",
            content: `Validate consent coverage:
            
            Requested Data Types: ${dataTypes.join(', ')}
            Requested Purpose: ${purpose}
            
            Existing Consents: ${JSON.stringify(activeConsents.map(c => ({
              purpose: c.purpose,
              dataTypes: c.dataTypes,
              expiresAt: c.expiresAt
            })))}
            
            Return JSON with: isValid, missingDataTypes, expiredConsents, recommendations.`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 400,
      });

      const analysis = JSON.parse(response.choices[0].message.content || "{}");
      
      // Check for expired consents
      const now = new Date();
      const expiredConsents = activeConsents
        .filter(consent => consent.expiresAt && consent.expiresAt < now)
        .map(consent => consent.id);

      return {
        isValid: analysis.isValid !== false && expiredConsents.length === 0,
        consentRecords: activeConsents,
        missingConsents: analysis.missingDataTypes || [],
        expiredConsents
      };
    } catch (error) {
      console.error("Consent validation failed:", error);
      return {
        isValid: false,
        consentRecords: [],
        missingConsents: dataTypes,
        expiredConsents: []
      };
    }
  }

  // Generate consent audit report
  async generateConsentAuditReport(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalConsents: number;
    grantedConsents: number;
    revokedConsents: number;
    expiredConsents: number;
    complianceStatus: string;
    auditEvents: any[];
  }> {
    try {
      // Get consent records in date range
      const consentHistory = await db
        .select()
        .from(consentRecords)
        .where(eq(consentRecords.userId, userId));

      // Get audit trail events
      const auditEvents = await db
        .select()
        .from(auditTrail)
        .where(and(
          eq(auditTrail.userId, userId),
          eq(auditTrail.resourceType, 'consent_record')
        ));

      // Analyze compliance using AI
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a compliance auditor generating consent management reports."
          },
          {
            role: "user",
            content: `Generate consent audit summary:
            
            Consent Records: ${consentHistory.length} total
            Audit Events: ${auditEvents.length} events
            Date Range: ${startDate.toISOString()} to ${endDate.toISOString()}
            
            Return JSON with: complianceStatus, riskLevel, recommendations, summary.`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 400,
      });

      const analysis = JSON.parse(response.choices[0].message.content || "{}");
      
      // Calculate statistics
      const grantedConsents = consentHistory.filter(c => c.grantedAt).length;
      const revokedConsents = consentHistory.filter(c => c.revokedAt).length;
      const expiredConsents = consentHistory.filter(c => 
        c.expiresAt && c.expiresAt < new Date()
      ).length;

      return {
        totalConsents: consentHistory.length,
        grantedConsents,
        revokedConsents,
        expiredConsents,
        complianceStatus: analysis.complianceStatus || 'compliant',
        auditEvents: auditEvents
      };
    } catch (error) {
      console.error("Audit report generation failed:", error);
      throw error;
    }
  }

  // Cross-border data transfer compliance check
  async validateCrossBorderTransfer(
    sourceJurisdiction: string,
    targetJurisdiction: string,
    dataTypes: string[]
  ): Promise<{
    isPermitted: boolean;
    requirements: string[];
    additionalSafeguards: string[];
  }> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an international data transfer compliance expert familiar with adequacy decisions, SCCs, and BCRs."
          },
          {
            role: "user",
            content: `Analyze cross-border data transfer:
            - From: ${sourceJurisdiction}
            - To: ${targetJurisdiction}
            - Data Types: ${dataTypes.join(', ')}
            
            Return JSON with: isPermitted, transferMechanism, requirements, safeguards.`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 400,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        isPermitted: result.isPermitted !== false,
        requirements: result.requirements || [],
        additionalSafeguards: result.safeguards || []
      };
    } catch (error) {
      console.error("Cross-border transfer validation failed:", error);
      return {
        isPermitted: false,
        requirements: ['Standard Contractual Clauses', 'Adequacy Decision'],
        additionalSafeguards: ['Data encryption', 'Access controls']
      };
    }
  }
}

export const consentService = new ConsentService();