
const fs = require('fs');
const path = require('path');

class CircuitGenerator {
  constructor() {
    this.rulesPath = path.join(__dirname, 'rules.json');
    this.circuitOutputPath = path.join(__dirname, '../circuits');
  }

  loadRules() {
    try {
      const rulesData = fs.readFileSync(this.rulesPath, 'utf8');
      return JSON.parse(rulesData);
    } catch (error) {
      throw new Error(`Failed to load rules: ${error.message}`);
    }
  }

  generateAgeVerificationCircuit(userDateOfBirth, currentDate) {
    const rules = this.loadRules();
    const ageRequirement = rules.age_requirement;

    // Calculate age in days for circuit computation
    const birthDate = new Date(userDateOfBirth);
    const now = new Date(currentDate);
    const ageInDays = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24));
    const requiredDays = ageRequirement * 365;

    const circuitCode = `
pragma circom 2.0.0;

template AgeVerification() {
    signal input age_in_days;
    signal input required_days;
    signal output valid;
    
    // Constraint: age_in_days >= required_days
    component gte = GreaterEqThan(32);
    gte.in[0] <== age_in_days;
    gte.in[1] <== required_days;
    
    valid <== gte.out;
}

template GreaterEqThan(n) {
    assert(n <= 252);
    signal input in[2];
    signal output out;
    
    component lt = LessThan(n+1);
    lt.in[0] <== in[1];
    lt.in[1] <== in[0] + 1;
    out <== lt.out;
}

template LessThan(n) {
    assert(n <= 252);
    signal input in[2];
    signal output out;
    
    component n2b = Num2Bits(n+1);
    n2b.in <== in[0] + (1<<n) - in[1];
    out <== 1 - n2b.out[n];
}

template Num2Bits(n) {
    signal input in;
    signal output out[n];
    var lc1=0;
    var e2=1;
    for (var i = 0; i<n; i++) {
        out[i] <-- (in >> i) & 1;
        out[i] * (out[i] -1 ) === 0;
        lc1 += out[i] * e2;
        e2 = e2+e2;
    }
    lc1 === in;
}

component main = AgeVerification();
`;

    // Write circuit to file
    const circuitPath = path.join(this.circuitOutputPath, 'age_check.circom');
    fs.writeFileSync(circuitPath, circuitCode);

    return {
      circuitPath,
      inputs: {
        age_in_days: ageInDays,
        required_days: requiredDays
      },
      isValid: ageInDays >= requiredDays
    };
  }

  generateHealthComplianceCircuit(healthMetrics, thresholds) {
    const circuitCode = `
pragma circom 2.0.0;

template HealthCompliance() {
    signal input health_score;
    signal input threshold;
    signal input fitness_level;
    signal input min_fitness;
    signal output compliance_valid;
    
    // Health score check
    component gte1 = GreaterEqThan(8);
    gte1.in[0] <== health_score;
    gte1.in[1] <== threshold;
    
    // Fitness level check  
    component gte2 = GreaterEqThan(8);
    gte2.in[0] <== fitness_level;
    gte2.in[1] <== min_fitness;
    
    // Both conditions must be true
    compliance_valid <== gte1.out * gte2.out;
}

// Include supporting templates...
${this.getSupportingTemplates()}

component main = HealthCompliance();
`;

    const circuitPath = path.join(this.circuitOutputPath, 'health_compliance.circom');
    fs.writeFileSync(circuitPath, circuitCode);

    return { circuitPath, inputs: healthMetrics };
  }

  getSupportingTemplates() {
    return `
template GreaterEqThan(n) {
    signal input in[2];
    signal output out;
    component lt = LessThan(n+1);
    lt.in[0] <== in[1];
    lt.in[1] <== in[0] + 1;
    out <== lt.out;
}

template LessThan(n) {
    signal input in[2];
    signal output out;
    component n2b = Num2Bits(n+1);
    n2b.in <== in[0] + (1<<n) - in[1];
    out <== 1 - n2b.out[n];
}

template Num2Bits(n) {
    signal input in;
    signal output out[n];
    var lc1=0;
    var e2=1;
    for (var i = 0; i<n; i++) {
        out[i] <-- (in >> i) & 1;
        out[i] * (out[i] -1 ) === 0;
        lc1 += out[i] * e2;
        e2 = e2+e2;
    }
    lc1 === in;
}`;
  }
}

module.exports = CircuitGenerator;
