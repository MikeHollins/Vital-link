import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

interface SecurityVulnerability {
  type: 'XSS' | 'SQL_INJECTION' | 'CSRF' | 'INPUT_VALIDATION';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  file: string;
  line: number;
  description: string;
  recommendation: string;
  codeSnippet: string;
}

export class SecurityAuditor {
  private vulnerabilities: SecurityVulnerability[] = [];

  // Comprehensive XSS detection patterns
  private xssPatterns = [
    /dangerouslySetInnerHTML/g,
    /\.innerHTML\s*=/g,
    /document\.write/g,
    /eval\(/g,
    /Function\(/g,
    /setTimeout\s*\(\s*["'`][^"'`]*["'`]/g,
    /setInterval\s*\(\s*["'`][^"'`]*["'`]/g,
    /location\s*=\s*["'`][^"'`]*["'`]/g,
    /window\.open\s*\(\s*["'`][^"'`]*["'`]/g,
  ];

  // Input validation patterns
  private inputValidationPatterns = [
    /req\.body\.[^.]+(?!\s*=\s*.*validate)/g,
    /req\.query\.[^.]+(?!\s*=\s*.*validate)/g,
    /req\.params\.[^.]+(?!\s*=\s*.*validate)/g,
  ];

  public scanFile(content: string, filePath: string): SecurityVulnerability[] {
    const fileVulns: SecurityVulnerability[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for XSS vulnerabilities
      this.xssPatterns.forEach(pattern => {
        const matches = line.match(pattern);
        if (matches) {
          fileVulns.push({
            type: 'XSS',
            severity: 'HIGH',
            file: filePath,
            line: index + 1,
            description: `Potential XSS vulnerability: ${matches[0]}`,
            recommendation: 'Use textContent or secure DOM manipulation methods instead of innerHTML',
            codeSnippet: line.trim()
          });
        }
      });

      // Check for input validation issues
      this.inputValidationPatterns.forEach(pattern => {
        const matches = line.match(pattern);
        if (matches) {
          fileVulns.push({
            type: 'INPUT_VALIDATION',
            severity: 'MEDIUM',
            file: filePath,
            line: index + 1,
            description: `Unvalidated input: ${matches[0]}`,
            recommendation: 'Validate and sanitize all user inputs before processing',
            codeSnippet: line.trim()
          });
        }
      });
    });

    return fileVulns;
  }

  public async generateSecurityReport(): Promise<string> {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
Analyze these security vulnerabilities found in a React/Express health application:

${JSON.stringify(this.vulnerabilities, null, 2)}

Provide a comprehensive security assessment including:
1. Risk prioritization
2. Specific fix recommendations with code examples
3. Security best practices for health data applications
4. HIPAA compliance considerations

Focus on actionable solutions for immediate implementation.
`;

    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Security analysis failed:', error);
      return 'Security analysis unavailable - manual review required';
    }
  }
}

// Secure DOM manipulation utilities
export class SecureDOM {
  // Safe text content setter
  static setTextContent(element: HTMLElement, text: string): void {
    element.textContent = this.sanitizeText(text);
  }

  // Safe HTML creation with sanitization
  static createElement(tag: string, attributes: Record<string, string> = {}, textContent?: string): HTMLElement {
    const element = document.createElement(tag);
    
    // Sanitize and set attributes
    Object.entries(attributes).forEach(([key, value]) => {
      if (this.isValidAttribute(key)) {
        element.setAttribute(key, this.sanitizeAttribute(value));
      }
    });

    if (textContent) {
      this.setTextContent(element, textContent);
    }

    return element;
  }

  // Sanitize text content
  private static sanitizeText(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Sanitize attribute values
  private static sanitizeAttribute(input: string): string {
    return input
      .replace(/[<>"'&]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+=/gi, '');
  }

  // Validate attribute names
  private static isValidAttribute(name: string): boolean {
    const allowedAttributes = [
      'id', 'class', 'style', 'title', 'alt', 'src', 'href', 'type',
      'value', 'placeholder', 'data-testid', 'aria-label', 'role'
    ];
    return allowedAttributes.includes(name.toLowerCase()) && 
           !name.toLowerCase().startsWith('on');
  }

  // Safe pattern for rendering lists
  static renderSecureList(
    container: HTMLElement, 
    items: any[], 
    renderItem: (item: any) => { tag: string; attributes?: Record<string, string>; text?: string }
  ): void {
    // Clear container safely
    container.textContent = '';
    
    items.forEach(item => {
      const config = renderItem(item);
      const element = this.createElement(config.tag, config.attributes, config.text);
      container.appendChild(element);
    });
  }
}

// Health data specific security utilities
export class HealthDataSecurity {
  // Sanitize patient names and sensitive data
  static sanitizeHealthData(data: any): any {
    if (typeof data === 'string') {
      return SecureDOM['sanitizeText'](data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeHealthData(item));
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      Object.entries(data).forEach(([key, value]) => {
        sanitized[key] = this.sanitizeHealthData(value);
      });
      return sanitized;
    }
    
    return data;
  }

  // Validate medical data formats
  static validateMedicalInput(input: string, type: 'name' | 'medication' | 'condition' | 'note'): boolean {
    const patterns = {
      name: /^[a-zA-Z\s\-']{1,100}$/,
      medication: /^[a-zA-Z0-9\s\-().,]{1,200}$/,
      condition: /^[a-zA-Z0-9\s\-().,]{1,500}$/,
      note: /^[\w\s\-().,!?]{1,1000}$/
    };

    return patterns[type].test(input);
  }
}

export default SecurityAuditor;