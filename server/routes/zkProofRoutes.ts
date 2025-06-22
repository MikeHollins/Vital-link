import { Router } from "express";
import { db } from "../db";
import { environmentalData, zkHealthProofs, healthData } from "@shared/schema";
import { eq } from "drizzle-orm";
import { environmentalService } from "../services/environmentalService";
import { constraintService } from "../services/constraintService";
import { zkProofService } from "../services/zkProofService";
import { isAuthenticated } from "../replitAuth";

const router = Router();

// Generate environmental context for user location
router.post("/api/environmental-context", isAuthenticated, async (req: any, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.user.claims.sub;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude required" });
    }

    // Get comprehensive environmental context
    const environmentalContext = await environmentalService.getEnvironmentalContext(
      parseFloat(latitude),
      parseFloat(longitude)
    );

    // Store environmental data
    const [storedEnvData] = await db
      .insert(environmentalData)
      .values({
        userId,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        altitude: environmentalContext.weather.altitude,
        temperature: Math.round(environmentalContext.weather.temperature),
        humidity: Math.round(environmentalContext.weather.humidity),
        pressure: Math.round(environmentalContext.weather.pressure),
        timezone: environmentalContext.location.timezone,
      })
      .returning();

    // Assess environmental risks
    const riskAssessment = await environmentalService.assessEnvironmentalRisks(environmentalContext);

    res.json({
      environmentalContext,
      riskAssessment,
      dataId: storedEnvData.id
    });
  } catch (error) {
    console.error("Environmental context error:", error);
    res.status(500).json({ error: "Failed to generate environmental context" });
  }
});

// Generate ZK proof for biometric data with environmental constraints
router.post("/api/generate-proof", isAuthenticated, async (req: any, res) => {
  try {
    const { biometricData, environmentalDataId, proofType = 'compliance' } = req.body;
    const userId = req.user.claims.sub;

    if (!biometricData || !environmentalDataId) {
      return res.status(400).json({ error: "Biometric data and environmental context required" });
    }

    // Get environmental context
    const [envData] = await db
      .select()
      .from(environmentalData)
      .where(eq(environmentalData.id, parseInt(environmentalDataId)))
      .limit(1);

    if (!envData) {
      return res.status(404).json({ error: "Environmental data not found" });
    }

    // Reconstruct environmental context
    const environmentalContext = {
      location: {
        latitude: parseFloat(envData.latitude || "0"),
        longitude: parseFloat(envData.longitude || "0"),
        altitude: envData.altitude || 0,
        timezone: envData.timezone || "UTC+0"
      },
      weather: {
        temperature: envData.temperature || 20,
        humidity: envData.humidity || 60,
        pressure: envData.pressure || 1013,
        altitude: envData.altitude || 0
      },
      timestamp: envData.timestamp || new Date()
    };

    // Parse biometric readings
    const readings = Array.isArray(biometricData) ? biometricData : [biometricData];
    const biometricReadings = readings.map(reading => ({
      type: reading.type,
      value: parseFloat(reading.value),
      unit: reading.unit || '',
      timestamp: new Date(reading.timestamp || Date.now())
    }));

    // Get or generate constraint parameters
    const constraints = await constraintService.selectConstraintParameters(
      biometricReadings[0].type,
      environmentalContext,
      userId
    );

    // Generate ZK proof
    const zkProofRequest = {
      userId,
      biometricData: biometricReadings,
      constraints,
      environmentalContext,
      proofType
    };

    const proofResult = await zkProofService.generateZKProof(zkProofRequest);

    // Simulate blockchain anchoring
    const blockchainAnchor = await zkProofService.anchorProofToBlockchain(
      proofResult.proofHash,
      'ethereum-testnet'
    );

    res.json({
      proof: proofResult,
      blockchainAnchor,
      constraints,
      environmentalContext
    });
  } catch (error) {
    console.error("Proof generation error:", error);
    res.status(500).json({ error: "Failed to generate ZK proof" });
  }
});

// Verify ZK proof for third parties
router.post("/api/verify-proof", async (req, res) => {
  try {
    const { proofHash, verificationKey, publicInputs, requesterCredentials } = req.body;

    if (!proofHash || !verificationKey || !requesterCredentials) {
      return res.status(400).json({ error: "Missing required verification parameters" });
    }

    // Verify the proof
    const verificationResult = await zkProofService.verifyProof(
      proofHash,
      verificationKey,
      publicInputs || {}
    );

    res.json({
      isValid: verificationResult.isValid,
      verificationDetails: verificationResult.verificationDetails,
      timestamp: new Date(),
      requester: requesterCredentials.requesterId
    });
  } catch (error) {
    console.error("Proof verification error:", error);
    res.status(500).json({ error: "Failed to verify proof" });
  }
});

// Get constraint parameters for specific biometric type and environment
router.post("/api/constraint-parameters", isAuthenticated, async (req: any, res) => {
  try {
    const { biometricType, environmentalDataId } = req.body;
    const userId = req.user.claims.sub;

    if (!biometricType || !environmentalDataId) {
      return res.status(400).json({ error: "Biometric type and environmental data ID required" });
    }

    // Get environmental context
    const [envData] = await db
      .select()
      .from(environmentalData)
      .where(eq(environmentalData.id, parseInt(environmentalDataId)))
      .limit(1);

    if (!envData) {
      return res.status(404).json({ error: "Environmental data not found" });
    }

    // Reconstruct environmental context
    const environmentalContext = {
      location: {
        latitude: parseFloat(envData.latitude || "0"),
        longitude: parseFloat(envData.longitude || "0"),
        altitude: envData.altitude || 0,
        timezone: envData.timezone || "UTC+0"
      },
      weather: {
        temperature: envData.temperature || 20,
        humidity: envData.humidity || 60,
        pressure: envData.pressure || 1013,
        altitude: envData.altitude || 0
      },
      timestamp: envData.timestamp || new Date()
    };

    // Get constraint parameters
    const constraints = await constraintService.selectConstraintParameters(
      biometricType,
      environmentalContext,
      userId
    );

    // Special handling for altitude-based oxygen saturation (Patent Claim 3)
    if (biometricType === 'oxygen_saturation' && envData.altitude) {
      const altitudeAdjustedConstraints = await constraintService.adjustOxygenSaturationForAltitude(
        95, // baseline min
        100, // baseline max
        envData.altitude
      );
      
      res.json({
        constraints: altitudeAdjustedConstraints,
        environmentalContext,
        patentClaimImplemented: "Claim 3: Altitude-based oxygen saturation adjustment",
        altitudeAdjustment: {
          baselineRange: "95%-100%",
          adjustedRange: `${altitudeAdjustedConstraints.minValue}%-${altitudeAdjustedConstraints.maxValue}%`,
          altitude: `${envData.altitude}m`,
          adjustmentFactor: altitudeAdjustedConstraints.adjustmentFactor
        }
      });
    } else {
      res.json({
        constraints,
        environmentalContext,
        biometricType
      });
    }
  } catch (error) {
    console.error("Constraint parameters error:", error);
    res.status(500).json({ error: "Failed to get constraint parameters" });
  }
});

// Validate biometric reading against dynamic constraints
router.post("/api/validate-biometric", isAuthenticated, async (req: any, res) => {
  try {
    const { reading, environmentalDataId } = req.body;
    const userId = req.user.claims.sub;

    if (!reading || !environmentalDataId) {
      return res.status(400).json({ error: "Biometric reading and environmental data required" });
    }

    // Get environmental context (same as above)
    const [envData] = await db
      .select()
      .from(environmentalData)
      .where(eq(environmentalData.id, parseInt(environmentalDataId)))
      .limit(1);

    if (!envData) {
      return res.status(404).json({ error: "Environmental data not found" });
    }

    const environmentalContext = {
      location: {
        latitude: parseFloat(envData.latitude || "0"),
        longitude: parseFloat(envData.longitude || "0"),
        altitude: envData.altitude || 0,
        timezone: envData.timezone || "UTC+0"
      },
      weather: {
        temperature: envData.temperature || 20,
        humidity: envData.humidity || 60,
        pressure: envData.pressure || 1013,
        altitude: envData.altitude || 0
      },
      timestamp: envData.timestamp || new Date()
    };

    // Get constraint parameters
    const constraints = await constraintService.selectConstraintParameters(
      reading.type,
      environmentalContext,
      userId
    );

    // Parse biometric reading
    const biometricReading = {
      type: reading.type,
      value: parseFloat(reading.value),
      unit: reading.unit || '',
      timestamp: new Date(reading.timestamp || Date.now())
    };

    // Validate against constraints
    const validationResult = await constraintService.validateBiometricData(
      biometricReading,
      constraints,
      environmentalContext
    );

    // Perform circadian rhythm validation if applicable
    const circadianValidation = await constraintService.validateCircadianConstraints(
      biometricReading,
      environmentalContext,
      'unknown' // Would get from user profile in real implementation
    );

    res.json({
      validationResult,
      circadianValidation,
      constraints,
      environmentalContext
    });
  } catch (error) {
    console.error("Biometric validation error:", error);
    res.status(500).json({ error: "Failed to validate biometric data" });
  }
});

// Get user's ZK proofs history
router.get("/api/zk-proofs", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;

    const proofs = await db
      .select()
      .from(zkHealthProofs)
      .where(eq(zkHealthProofs.userId, userId))
      .orderBy(zkHealthProofs.createdAt);

    res.json({
      proofs,
      totalCount: proofs.length,
      verifiedCount: proofs.filter(p => p.isVerified).length
    });
  } catch (error) {
    console.error("ZK proofs history error:", error);
    res.status(500).json({ error: "Failed to get ZK proofs history" });
  }
});

// Aggregate multiple proofs
router.post("/api/aggregate-proofs", isAuthenticated, async (req: any, res) => {
  try {
    const { proofHashes } = req.body;
    const userId = req.user.claims.sub;

    if (!proofHashes || !Array.isArray(proofHashes)) {
      return res.status(400).json({ error: "Array of proof hashes required" });
    }

    const aggregatedProof = await zkProofService.aggregateProofs(proofHashes, userId);

    res.json({
      aggregatedProof,
      originalProofCount: proofHashes.length,
      compressionRatio: `${proofHashes.length}:1`
    });
  } catch (error) {
    console.error("Proof aggregation error:", error);
    res.status(500).json({ error: "Failed to aggregate proofs" });
  }
});

export default router;