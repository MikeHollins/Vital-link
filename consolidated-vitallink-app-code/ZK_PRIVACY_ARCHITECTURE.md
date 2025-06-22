# Zero-Knowledge Privacy Architecture - Data Flow Diagrams

## System Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌──────────────────┐
│   User Device   │    │  ZK Proof Gen    │    │  Verification   │    │   Third Party    │
│                 │    │                  │    │    Network      │    │   Verifiers      │
├─────────────────┤    ├──────────────────┤    ├─────────────────┤    ├──────────────────┤
│ Raw Health Data │───▶│ Circuit Compiler │───▶│ Blockchain/IPFS │───▶│ Insurance/Trials │
│ • Steps: 10,247 │    │ • Constraints    │    │ • Proof Storage │    │ • Employment     │
│ • HR: 72 bpm    │    │ • Witnesses      │    │ • Verification  │    │ • Government     │
│ • Sleep: 7.5h   │    │ • Proof Output   │    │ • Public Access │    │ • Healthcare     │
└─────────────────┘    └──────────────────┘    └─────────────────┘    └──────────────────┘
     (PRIVATE)              (PRIVATE)              (PUBLIC)              (PUBLIC)
```

## Detailed Privacy Flow

### Stage 1: Local Health Data Processing

```
┌─────────────────────────────────────┐
│           User Device               │
│                                     │
│  ┌─────────────┐  ┌─────────────┐   │
│  │   Apple     │  │   Fitbit    │   │
│  │  HealthKit  │  │    API      │   │
│  └─────┬───────┘  └─────┬───────┘   │
│        │                │           │
│        ▼                ▼           │
│  ┌─────────────────────────────┐    │
│  │    Health Data Aggregator   │    │
│  │                             │    │
│  │  • Normalize formats        │    │
│  │  • Validate ranges          │    │
│  │  • Detect anomalies         │    │
│  │  • Encrypt locally          │    │
│  └─────────────┬───────────────┘    │
│                ▼                    │
│  ┌─────────────────────────────┐    │
│  │   Privacy-Preserving        │    │
│  │   Data Preparation          │    │
│  │                             │    │
│  │  • Remove identifiers       │    │
│  │  • Add noise (optional)     │    │
│  │  • Create commitments       │    │
│  └─────────────┬───────────────┘    │
│                ▼                    │
│        NEVER LEAVES DEVICE          │
└─────────────────────────────────────┘
```

### Stage 2: Zero-Knowledge Proof Generation

```
┌─────────────────────────────────────┐
│       ZK Circuit Execution          │
│                                     │
│  Public Inputs:                     │
│  ┌─────────────────────────────┐    │
│  │ • Achievement Threshold     │    │
│  │ • Time Period (30 days)     │    │
│  │ • User Identity Commitment  │    │
│  └─────────────────────────────┘    │
│                                     │
│  Private Inputs (Witnesses):        │
│  ┌─────────────────────────────┐    │
│  │ • Daily step counts [...]   │    │
│  │ • Timestamps [...]          │    │
│  │ • User secret key           │    │
│  │ • Randomness values         │    │
│  └─────────────┬───────────────┘    │
│                ▼                    │
│  ┌─────────────────────────────┐    │
│  │     Circuit Constraints     │    │
│  │                             │    │
│  │ For each day i:             │    │
│  │   steps[i] ≥ 10,000        │    │
│  │                             │    │
│  │ Temporal consistency:       │    │
│  │   timestamps in order       │    │
│  │                             │    │
│  │ Identity verification:      │    │
│  │   hash(secret) = commitment │    │
│  └─────────────┬───────────────┘    │
│                ▼                    │
│  ┌─────────────────────────────┐    │
│  │      Proof Generation       │    │
│  │                             │    │
│  │ π = Prove(circuit, public,  │    │
│  │            private)         │    │
│  │                             │    │
│  │ Output: 200-byte proof      │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### Stage 3: Public Verification Network

```
┌─────────────────────────────────────┐
│        Verification Layer           │
│                                     │
│  ┌─────────────────────────────┐    │
│  │      Blockchain Storage     │    │
│  │                             │    │
│  │  • Proof: π (200 bytes)     │    │
│  │  • Public inputs            │    │
│  │  • Verification key         │    │
│  │  • Timestamp                │    │
│  └─────────────┬───────────────┘    │
│                ▼                    │
│  ┌─────────────────────────────┐    │
│  │    Smart Contract Verifier  │    │
│  │                             │    │
│  │  function verify(           │    │
│  │    proof,                   │    │
│  │    publicInputs             │    │
│  │  ) returns (bool)           │    │
│  │                             │    │
│  │  ✓ Mathematical validity    │    │
│  │  ✓ Public input consistency │    │
│  │  ✓ Proof authenticity       │    │
│  └─────────────┬───────────────┘    │
│                ▼                    │
│  ┌─────────────────────────────┐    │
│  │     Verification Result     │    │
│  │                             │    │
│  │  TRUE:  Achievement proven  │    │
│  │  FALSE: Claim invalid       │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

## Privacy Guarantees by Design

### 1. Data Isolation Architecture

```
┌─────────────────────────────────────┐
│             Privacy Layers          │
│                                     │
│  Layer 4: Verification Results      │
│  ┌─────────────────────────────┐    │
│  │ ✓ Achievement confirmed     │    │
│  │ ✗ No health data exposed    │    │
│  └─────────────────────────────┘    │
│                ▲                    │
│  Layer 3: Cryptographic Proofs     │
│  ┌─────────────────────────────┐    │
│  │ • Mathematical proof only   │    │
│  │ • No reversible operations  │    │
│  └─────────────────────────────┘    │
│                ▲                    │
│  Layer 2: Local Processing         │
│  ┌─────────────────────────────┐    │
│  │ • Encrypted computations    │    │
│  │ • Memory protection         │    │
│  └─────────────────────────────┘    │
│                ▲                    │
│  Layer 1: Raw Health Data          │
│  ┌─────────────────────────────┐    │
│  │ • Device-only storage       │    │
│  │ • Hardware encryption       │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### 2. Multi-Party Verification Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Insurance  │    │   Employer   │    │  Healthcare  │
│   Company    │    │   Wellness   │    │   Provider   │
│              │    │   Program    │    │              │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────┐
│           Verification Smart Contract               │
│                                                     │
│  function verifyHealthAchievement(                  │
│    proof: ZKProof,                                  │
│    publicInputs: PublicClaims                       │
│  ) public view returns (bool verified) {            │
│                                                     │
│    // Cryptographic verification only               │
│    return zkVerifier.verify(proof, publicInputs);   │
│                                                     │
│    // NO ACCESS TO:                                 │
│    // • Actual step counts                          │
│    // • Heart rate data                             │
│    // • Sleep patterns                              │
│    // • Location information                        │
│    // • Device identifiers                          │
│  }                                                  │
└─────────────────────────────────────────────────────┘
```

## Use Case Privacy Flows

### Insurance Premium Verification

```
User Health Journey:
┌─────────────────┐
│ 30 days of      │ ──┐
│ 10K+ steps      │   │
└─────────────────┘   │
                      │ LOCAL PROCESSING
┌─────────────────┐   │ (Never transmitted)
│ Daily step data:│   │
│ [10247, 12100,  │ ──┘
│  9800, 11500,   │
│  ...]           │
└─────────────────┘
          │
          ▼ ZK PROOF GENERATION
┌─────────────────┐
│ Proof: π        │ ── TRANSMITTED ──┐
│ "User achieved  │                  │
│  fitness goal"  │                  │
└─────────────────┘                  │
                                     ▼
                           ┌─────────────────┐
                           │ Insurance       │
                           │ Verification    │
                           │                 │
                           │ ✓ Goal achieved │
                           │ ✗ No data seen  │
                           │ → Lower premium │
                           └─────────────────┘
```

### Clinical Trial Eligibility

```
Patient Privacy Flow:
┌─────────────────┐
│ Medical History │ ── STAYS LOCAL
│ • BP readings   │
│ • Heart rate    │
│ • Medications   │
└─────────────────┘
          │
          ▼ CRITERIA MATCHING
┌─────────────────┐
│ Eligibility     │ ── TRANSMITTED
│ Proof: π        │
│ "Meets criteria"│
└─────────────────┘
          │
          ▼ RESEARCH VERIFICATION
┌─────────────────┐
│ Research Team   │
│                 │
│ ✓ Eligible      │
│ ✗ No PHI access │
│ → Study invite  │
└─────────────────┘
```

## Security Properties

### Cryptographic Guarantees

1. **Completeness**: If statement is true, honest prover convinces verifier
2. **Soundness**: If statement is false, no prover can convince verifier
3. **Zero-Knowledge**: Verifier learns nothing beyond statement validity
4. **Non-Malleability**: Proofs cannot be modified or replayed maliciously

### Implementation Security

- **Trusted Setup**: Multi-party ceremony eliminates single points of failure
- **Circuit Auditing**: Formal verification of constraint logic
- **Side-Channel Protection**: Constant-time operations prevent timing attacks
- **Memory Safety**: Secure erasure of sensitive computation intermediates

This privacy architecture ensures that health data never leaves user devices while enabling powerful verification capabilities for various stakeholders.