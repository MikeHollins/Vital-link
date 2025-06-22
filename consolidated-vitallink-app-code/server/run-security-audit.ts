import fs from 'fs';
import path from 'path';
import SecurityAuditor from './security-audit';

async function scanDirectory(dirPath: string, auditor: SecurityAuditor): Promise<void> {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dirPath, file.name);
    
    if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
      await scanDirectory(fullPath, auditor);
    } else if (file.isFile() && (file.name.endsWith('.ts') || file.name.endsWith('.tsx') || file.name.endsWith('.js') || file.name.endsWith('.jsx'))) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const vulnerabilities = auditor.scanFile(content, fullPath);
      
      if (vulnerabilities.length > 0) {
        console.log(`\n🚨 Found ${vulnerabilities.length} security issues in ${fullPath}:`);
        vulnerabilities.forEach(vuln => {
          console.log(`  - Line ${vuln.line}: ${vuln.description}`);
          console.log(`    Severity: ${vuln.severity}`);
          console.log(`    Code: ${vuln.codeSnippet}`);
          console.log(`    Fix: ${vuln.recommendation}\n`);
        });
      }
    }
  }
}

async function runSecurityAudit() {
  console.log('🔍 Starting VitalLink Security Audit...\n');
  
  const auditor = new SecurityAuditor();
  
  // Scan client-side code
  console.log('Scanning client-side code...');
  await scanDirectory('../client/src', auditor);
  
  // Scan server-side code
  console.log('Scanning server-side code...');
  await scanDirectory('../server', auditor);
  
  // Scan shared code
  console.log('Scanning shared code...');
  await scanDirectory('../shared', auditor);
  
  // Generate comprehensive report
  console.log('\n📋 Generating security assessment report...');
  const report = await auditor.generateSecurityReport();
  
  // Save report to file
  fs.writeFileSync('./security-audit-report.md', report);
  
  console.log('\n✅ Security audit complete. Report saved to security-audit-report.md');
}

// Run if executed directly
runSecurityAudit().catch(console.error);

export { runSecurityAudit };