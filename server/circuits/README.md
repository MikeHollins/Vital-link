
# ZK Circuits Directory

This directory contains the compiled zero-knowledge circuits used by the ZKProofService.

## Required Files for Production

For each circuit (e.g., `healthCheck`), you need:

1. `healthCheck.zkey` - The proving key file
2. `healthCheck_js/healthCheck.wasm` - The compiled WebAssembly circuit
3. `healthCheck_verification_key.json` - The verification key

## Compilation Process

To compile circuits, you would typically:

1. Write a circom circuit file (e.g., `healthCheck.circom`)
2. Compile with: `circom healthCheck.circom --r1cs --wasm --sym`
3. Generate proving key with snarkjs ceremony
4. Export verification key

## Development Mode

The ZKProofService includes deterministic mock implementations when circuit files are not present, allowing development and testing without full circuit compilation.

## Example Circuit Structure

```circom
pragma circom 2.0.0;

template HealthCheck() {
    // Private inputs (biometric values)
    signal private input biometricValues[10];
    
    // Public inputs (constraints)
    signal input constraintMin;
    signal input constraintMax;
    signal input dataPointCount;
    signal input timestamp;
    
    // Output
    signal output valid;
    
    // Constraint validation logic
    component validationChecks[10];
    
    var validCount = 0;
    for (var i = 0; i < 10; i++) {
        validationChecks[i] = LessEqThan(32);
        validationChecks[i].in[0] <== biometricValues[i];
        validationChecks[i].in[1] <== constraintMax;
        
        // Additional logic for constraint validation
    }
    
    valid <== validCount;
}

component main = HealthCheck();
```
