import { Router } from 'express';
import { isAuthenticated } from '../replitAuth';
import { 
  complianceManager, 
  generateDailyComplianceReport,
  HipaaRequirementCategory
} from '../hipaa-compliance';
import { z } from 'zod';

const router = Router();

// Validate date range schema
const dateRangeSchema = z.object({
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Start date must be a valid date string"
  }),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "End date must be a valid date string"
  })
});

// Get compliance report for a specific date range
router.post('/reports/date-range', isAuthenticated, async (req: any, res) => {
  try {
    // Check if user has administrative privileges
    // This would be a more robust check in a production system
    const userId = req.user.claims.sub;
    
    // Validate request
    const result = dateRangeSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        message: 'Invalid date range', 
        errors: result.error.errors 
      });
    }
    
    const { startDate, endDate } = result.data;
    
    // Generate report
    const report = complianceManager.generateComplianceReport(
      new Date(startDate),
      new Date(endDate)
    );
    
    // Remove sensitive information before returning
    const sanitizedEvents = report.events.map(event => ({
      ...event,
      // Redact certain fields for security
      ipAddress: '***.***.***.**',
    }));
    
    res.json({
      ...report,
      events: sanitizedEvents
    });
  } catch (error) {
    console.error('Error generating compliance report:', error);
    res.status(500).json({ message: 'Failed to generate compliance report' });
  }
});

// Generate a comprehensive HIPAA compliance report
router.get('/reports/comprehensive', isAuthenticated, async (req: any, res) => {
  try {
    // Security: In a real app, check if user has admin rights
    const userId = req.user.claims.sub;
    
    // Generate comprehensive report
    const report = complianceManager.generateComprehensiveReport();
    
    res.json(report);
  } catch (error) {
    console.error('Error generating comprehensive report:', error);
    res.status(500).json({ message: 'Failed to generate comprehensive report' });
  }
});

// Get latest daily report
router.get('/reports/daily', isAuthenticated, async (req: any, res) => {
  try {
    // Security: In a real app, check if user has admin rights
    const userId = req.user.claims.sub;
    
    // Generate today's report (or get existing one)
    const { report } = generateDailyComplianceReport();
    
    res.json(report);
  } catch (error) {
    console.error('Error retrieving daily report:', error);
    res.status(500).json({ message: 'Failed to retrieve daily compliance report' });
  }
});

// Get compliance status by category
router.get('/status/:category', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { category } = req.params;
    
    // Validate category
    if (!Object.values(HipaaRequirementCategory).includes(category as HipaaRequirementCategory)) {
      return res.status(400).json({ message: 'Invalid compliance category' });
    }
    
    // In a real implementation, this would check actual compliance status
    // For now, return a sample status
    const status = {
      category,
      compliant: true,
      lastChecked: new Date(),
      issues: [],
      recommendations: [
        "Continue monitoring logs for unusual activity",
        "Ensure all data access is properly authenticated"
      ]
    };
    
    res.json(status);
  } catch (error) {
    console.error('Error checking compliance status:', error);
    res.status(500).json({ message: 'Failed to check compliance status' });
  }
});

export default router;