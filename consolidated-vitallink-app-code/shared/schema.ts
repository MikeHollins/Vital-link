import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  serial,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Devices table
export const devices = pgTable(
  "devices",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").notNull().references(() => users.id),
    type: varchar("type").notNull(), // 'apple_health', 'fitbit', 'google_fit', etc.
    name: varchar("name").notNull(),
    status: varchar("status").notNull(), // 'connected', 'disconnected', 'error'
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    tokenExpiry: timestamp("token_expiry"),
    lastSynced: timestamp("last_synced"),
    permissions: jsonb("permissions").notNull().default({}), // JSON object with permissions
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("user_device_type_idx").on(table.userId, table.type),
  ]
);

// Health data table
export const healthData = pgTable(
  "health_data",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").notNull().references(() => users.id),
    deviceId: integer("device_id").references(() => devices.id),
    type: varchar("type").notNull(), // 'steps', 'heart_rate', 'sleep', 'screen_time', etc.
    value: jsonb("value").notNull(), // Flexible JSON structure for different data types
    timestamp: timestamp("timestamp").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("health_data_user_id_type_idx").on(table.userId, table.type),
    index("health_data_timestamp_idx").on(table.timestamp),
  ]
);

// Digital wellness and screen time tracking
export const digitalWellness = pgTable(
  "digital_wellness",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").notNull().references(() => users.id),
    date: timestamp("date").notNull(),
    totalScreenTime: integer("total_screen_time").notNull(), // minutes
    appUsage: jsonb("app_usage").notNull(), // { appName: minutes }
    pickupCount: integer("pickup_count"), // number of times device was picked up
    notificationCount: integer("notification_count"),
    firstPickup: timestamp("first_pickup"),
    lastActivity: timestamp("last_activity"),
    categories: jsonb("categories"), // { social: minutes, productivity: minutes, etc. }
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("digital_wellness_user_date_idx").on(table.userId, table.date),
    index("digital_wellness_date_idx").on(table.date),
  ]
);

// AI correlation insights for health metrics
export const aiCorrelationInsights = pgTable(
  "ai_correlation_insights",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").notNull().references(() => users.id),
    primaryMetric: varchar("primary_metric", { length: 50 }).notNull(),
    secondaryMetric: varchar("secondary_metric", { length: 50 }).notNull(),
    correlationCoefficient: integer("correlation_coefficient").notNull(), // -100 to 100
    strength: varchar("strength", { length: 20 }).notNull(), // weak, moderate, strong
    direction: varchar("direction", { length: 20 }).notNull(), // positive, negative
    insight: text("insight").notNull(),
    confidence: integer("confidence").notNull(), // 0-100
    actionableRecommendation: text("actionable_recommendation").notNull(),
    dataPoints: integer("data_points").notNull(), // number of data points used
    timeWindow: integer("time_window").notNull(), // days analyzed
    lastCalculated: timestamp("last_calculated").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("ai_correlations_user_idx").on(table.userId),
    index("ai_correlations_primary_idx").on(table.primaryMetric),
    index("ai_correlations_active_idx").on(table.isActive),
  ]
);

// Health insights table
export const insights = pgTable(
  "insights",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").notNull().references(() => users.id),
    title: varchar("title").notNull(),
    description: text("description").notNull(),
    type: varchar("type").notNull(), // 'activity', 'sleep', 'heart_rate', etc.
    priority: integer("priority").notNull().default(0),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow(),
  }
);

// Privacy settings table
export const privacySettings = pgTable(
  "privacy_settings",
  {
    userId: varchar("user_id").primaryKey().notNull().references(() => users.id),
    localFirstStorage: boolean("local_first_storage").notNull().default(true),
    encryptedCloudSync: boolean("encrypted_cloud_sync").notNull().default(true),
    anonymizedResearchSharing: boolean("anonymized_research_sharing").notNull().default(false),
    thirdPartyAppAccess: boolean("third_party_app_access").notNull().default(false),
    twoFactorAuth: boolean("two_factor_auth").notNull().default(false),
    biometricAuth: boolean("biometric_auth").notNull().default(false),
    autoLogout: boolean("auto_logout").notNull().default(false),
    updatedAt: timestamp("updated_at").defaultNow(),
  }
);

// NFT Health Achievements table
export const nftAchievements = pgTable(
  "nft_achievements",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").notNull().references(() => users.id),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    imageUrl: varchar("image_url", { length: 512 }),
    category: varchar("category", { length: 100 }).notNull(), // e.g., "fitness", "nutrition", "sleep"
    rarity: varchar("rarity", { length: 50 }).notNull(), // "common", "rare", "epic", "legendary"
    healthMetricType: varchar("health_metric_type", { length: 100 }), // e.g., "steps", "heart_rate", "sleep"
    thresholdValue: integer("threshold_value"), // value achieved to earn the NFT
    thresholdUnit: varchar("threshold_unit", { length: 50 }), // e.g., "steps", "bpm", "hours"
    blockchainId: varchar("blockchain_id", { length: 255 }), // blockchain transaction ID
    tokenId: varchar("token_id", { length: 255 }), // NFT token ID on blockchain
    isMinted: boolean("is_minted").notNull().default(false),
    isShared: boolean("is_shared").notNull().default(false),
    mintedAt: timestamp("minted_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("nft_achievements_user_id_idx").on(table.userId),
    index("nft_achievements_category_idx").on(table.category),
    index("nft_achievements_rarity_idx").on(table.rarity),
  ]
);

// Zero-Knowledge Health Proofs table for privacy-preserving verification
export const zkHealthProofs = pgTable(
  "zk_health_proofs",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").notNull().references(() => users.id),
    proofType: varchar("proof_type", { length: 100 }).notNull(), // "fitness_threshold", "health_range", "compliance"
    circuitId: varchar("circuit_id", { length: 100 }).notNull(), // ZK circuit identifier
    proofHash: varchar("proof_hash", { length: 256 }).notNull(), // cryptographic proof hash
    publicInputs: jsonb("public_inputs").notNull(), // public parameters (thresholds, ranges)
    verificationKey: text("verification_key").notNull(), // ZK verification key
    isVerified: boolean("is_verified").notNull().default(false),
    verifiedAt: timestamp("verified_at"),
    expiresAt: timestamp("expires_at"), // proof validity period
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("zk_proofs_user_id_idx").on(table.userId),
    index("zk_proofs_type_idx").on(table.proofType),
    index("zk_proofs_verified_idx").on(table.isVerified),
  ]
);

// Security audit logs table for HIPAA compliance
export const securityAuditLogs = pgTable(
  "security_audit_logs",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").references(() => users.id),
    eventType: varchar("event_type", { length: 100 }).notNull(),
    description: text("description").notNull(),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    metadata: jsonb("metadata"),
    severity: varchar("severity", { length: 20 }).notNull().default("INFO"), // INFO, WARNING, ERROR, CRITICAL
    timestamp: timestamp("timestamp").defaultNow(),
  },
  (table) => [
    index("audit_logs_user_id_idx").on(table.userId),
    index("audit_logs_event_type_idx").on(table.eventType),
    index("audit_logs_timestamp_idx").on(table.timestamp),
    index("audit_logs_severity_idx").on(table.severity),
  ]
);

// Regulatory compliance table for dynamic jurisdiction handling
export const regulatoryCompliance = pgTable(
  "regulatory_compliance",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").notNull().references(() => users.id),
    detectedJurisdiction: varchar("detected_jurisdiction", { length: 10 }).notNull(), // ISO country codes
    complianceFramework: varchar("compliance_framework", { length: 50 }).notNull(), // HIPAA, GDPR, PDPA, etc.
    geoLocation: jsonb("geo_location"), // lat/lng coordinates
    ipAddress: varchar("ip_address", { length: 45 }),
    userPreferences: jsonb("user_preferences"), // user-defined regulatory preferences
    dataRetentionPeriod: integer("data_retention_period").notNull(), // days
    consentStatus: varchar("consent_status", { length: 20 }).notNull().default("pending"), // pending, granted, withdrawn
    consentTimestamp: timestamp("consent_timestamp"),
    lastUpdated: timestamp("last_updated").defaultNow(),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => [
    index("regulatory_user_idx").on(table.userId),
    index("regulatory_jurisdiction_idx").on(table.detectedJurisdiction),
    index("regulatory_framework_idx").on(table.complianceFramework),
  ]
);

// Health constraint parameters for ZK proof generation (Patent Figure 4 - Component 400-480)
export const healthConstraints = pgTable(
  "health_constraints",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").notNull().references(() => users.id),
    metricType: varchar("metric_type", { length: 50 }).notNull(), // heart_rate, steps, blood_pressure
    minValue: integer("min_value"),
    maxValue: integer("max_value"),
    temporalWindow: integer("temporal_window").notNull(), // hours
    validityPeriod: integer("validity_period").notNull().default(24), // hours
    demographicFactors: jsonb("demographic_factors"), // age, gender, medical history adjustments
    regulatoryRequirements: jsonb("regulatory_requirements"), // jurisdiction-specific constraints
    biometricSparsity: integer("biometric_sparsity").notNull().default(85), // optimization percentage
    circadianProfile: jsonb("circadian_profile"), // chronotype-aware validation (420)
    environmentalFactors: jsonb("environmental_factors"), // altitude, climate adjustments (430)
    temporalSequence: jsonb("temporal_sequence"), // cryptographic time-lock mechanisms (440)
    complianceSelector: varchar("compliance_selector", { length: 50 }), // multi-jurisdictional selector (450)
    adaptiveThreshold: jsonb("adaptive_threshold"), // ML-based calibration parameters (460)
    hardwareSecurityConfig: jsonb("hardware_security_config"), // HSM integration settings (470)
    performanceMetrics: jsonb("performance_metrics"), // monitoring and feedback data (480)
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("constraints_user_metric_idx").on(table.userId, table.metricType),
    index("constraints_active_idx").on(table.isActive),
    index("constraints_compliance_idx").on(table.complianceSelector),
  ]
);

// AI-powered data normalization engine (Patent Figure 3 - Component 322-328)
export const aiNormalizationResults = pgTable(
  "ai_normalization_results",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").notNull().references(() => users.id),
    sourceDataId: integer("source_data_id").notNull().references(() => healthData.id),
    normalizedData: jsonb("normalized_data").notNull(), // standardized output (324)
    temporalConsistency: jsonb("temporal_consistency"), // validation results (326)
    fusionMetadata: jsonb("fusion_metadata"), // intelligent data fusion (328)
    qualityScore: integer("quality_score").notNull(), // AI assessment score (0-100)
    anomalyFlags: jsonb("anomaly_flags"), // detected inconsistencies
    platformStandardization: jsonb("platform_standardization"), // cross-platform mapping
    aiModelVersion: varchar("ai_model_version", { length: 50 }).notNull(),
    processingDuration: integer("processing_duration"), // milliseconds
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("ai_norm_user_idx").on(table.userId),
    index("ai_norm_source_idx").on(table.sourceDataId),
    index("ai_norm_quality_idx").on(table.qualityScore),
  ]
);

// Blockchain storage layer for ZK proof anchoring (Patent Figure 7 - Component 700-786)
export const blockchainAnchors = pgTable(
  "blockchain_anchors",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").notNull().references(() => users.id),
    proofId: integer("proof_id").notNull().references(() => zkHealthProofs.id),
    storageType: varchar("storage_type", { length: 20 }).notNull(), // on_chain, hybrid, cross_chain (710-730)
    blockchainNetwork: varchar("blockchain_network", { length: 50 }).notNull(), // ethereum, polygon, avalanche (732-738)
    transactionHash: varchar("transaction_hash", { length: 255 }),
    blockNumber: integer("block_number"),
    merkleRoot: varchar("merkle_root", { length: 255 }), // hybrid storage (726)
    ipfsHash: varchar("ipfs_hash", { length: 255 }), // off-chain storage (722)
    layer2Solution: varchar("layer2_solution", { length: 50 }), // polygon_pos, arbitrum, optimism (752-756)
    crossChainBridge: jsonb("cross_chain_bridge"), // bridge protocols (740-742)
    quantumResistant: boolean("quantum_resistant").notNull().default(false), // post-quantum crypto (770-776)
    gasCost: integer("gas_cost"), // wei
    verificationStatus: varchar("verification_status", { length: 20 }).notNull().default("pending"),
    createdAt: timestamp("created_at").defaultNow(),
    confirmedAt: timestamp("confirmed_at"),
  },
  (table) => [
    index("blockchain_user_idx").on(table.userId),
    index("blockchain_proof_idx").on(table.proofId),
    index("blockchain_network_idx").on(table.blockchainNetwork),
    index("blockchain_tx_idx").on(table.transactionHash),
  ]
);

// Edge deployment configurations for resource-constrained environments
export const edgeDeployments = pgTable(
  "edge_deployments",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").notNull().references(() => users.id),
    deploymentType: varchar("deployment_type", { length: 50 }).notNull(), // military, field_medical, remote, spacecraft
    networkStatus: varchar("network_status", { length: 20 }).notNull().default("intermittent"), // connected, intermittent, offline
    resourceConstraints: jsonb("resource_constraints").notNull(), // CPU, memory, bandwidth limits
    lastSyncTimestamp: timestamp("last_sync_timestamp"),
    pendingProofs: jsonb("pending_proofs").notNull().default('[]'), // queue for offline generation
    encryptionLevel: varchar("encryption_level", { length: 20 }).notNull().default("standard"), // standard, military_grade
    hardwareSecurityModule: boolean("hardware_security_module").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("edge_user_idx").on(table.userId),
    index("edge_type_idx").on(table.deploymentType),
    index("edge_network_idx").on(table.networkStatus),
  ]
);

// Schema types and insert schemas

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertDeviceSchema = createInsertSchema(devices).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type Device = typeof devices.$inferSelect;

export const insertHealthDataSchema = createInsertSchema(healthData).omit({
  id: true,
  createdAt: true
});
export type InsertHealthData = z.infer<typeof insertHealthDataSchema>;
export type HealthData = typeof healthData.$inferSelect;

export const insertInsightSchema = createInsertSchema(insights).omit({
  id: true,
  createdAt: true
});
export type InsertInsight = z.infer<typeof insertInsightSchema>;
export type Insight = typeof insights.$inferSelect;

export const privacySettingsSchema = createInsertSchema(privacySettings).omit({
  updatedAt: true
});
export type PrivacySettings = typeof privacySettings.$inferSelect;
export type UpsertPrivacySettings = typeof privacySettings.$inferInsert;

// Digital wellness schema and types
export const insertDigitalWellnessSchema = createInsertSchema(digitalWellness).omit({
  id: true,
  createdAt: true
});
export type InsertDigitalWellness = z.infer<typeof insertDigitalWellnessSchema>;
export type DigitalWellness = typeof digitalWellness.$inferSelect;

// AI correlation insights schema and types
export const insertAiCorrelationSchema = createInsertSchema(aiCorrelationInsights).omit({
  id: true,
  createdAt: true
});
export type InsertAiCorrelation = z.infer<typeof insertAiCorrelationSchema>;
export type AiCorrelationInsight = typeof aiCorrelationInsights.$inferSelect;

// NFT Achievement schema and types
export const insertNftAchievementSchema = createInsertSchema(nftAchievements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  mintedAt: true
});
export type InsertNftAchievement = z.infer<typeof insertNftAchievementSchema>;
export type NftAchievement = typeof nftAchievements.$inferSelect;

// Zero-Knowledge Proof schema and types
export const insertZkProofSchema = createInsertSchema(zkHealthProofs).omit({
  id: true,
  createdAt: true,
  verifiedAt: true
});
export type InsertZkProof = z.infer<typeof insertZkProofSchema>;
export type ZkHealthProof = typeof zkHealthProofs.$inferSelect;

// Security Audit Log schema and types
export const insertSecurityLogSchema = createInsertSchema(securityAuditLogs).omit({
  id: true,
  timestamp: true
});
export type InsertSecurityLog = z.infer<typeof insertSecurityLogSchema>;
export type SecurityAuditLog = typeof securityAuditLogs.$inferSelect;

// Regulatory Compliance schema and types
export const insertRegulatoryComplianceSchema = createInsertSchema(regulatoryCompliance).omit({
  id: true,
  lastUpdated: true
});
export type InsertRegulatoryCompliance = z.infer<typeof insertRegulatoryComplianceSchema>;
export type RegulatoryCompliance = typeof regulatoryCompliance.$inferSelect;

// Health Constraints schema and types
export const insertHealthConstraintsSchema = createInsertSchema(healthConstraints).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export type InsertHealthConstraints = z.infer<typeof insertHealthConstraintsSchema>;
export type HealthConstraints = typeof healthConstraints.$inferSelect;

// Edge Deployment schema and types
export const insertEdgeDeploymentSchema = createInsertSchema(edgeDeployments).omit({
  id: true,
  createdAt: true
});
export type InsertEdgeDeployment = z.infer<typeof insertEdgeDeploymentSchema>;
export type EdgeDeployment = typeof edgeDeployments.$inferSelect;

// AI Normalization Results schema and types
export const insertAiNormalizationSchema = createInsertSchema(aiNormalizationResults).omit({
  id: true,
  createdAt: true
});
export type InsertAiNormalization = z.infer<typeof insertAiNormalizationSchema>;
export type AiNormalizationResult = typeof aiNormalizationResults.$inferSelect;

// Blockchain Anchors schema and types
export const insertBlockchainAnchorSchema = createInsertSchema(blockchainAnchors).omit({
  id: true,
  createdAt: true,
  confirmedAt: true
});
export type InsertBlockchainAnchor = z.infer<typeof insertBlockchainAnchorSchema>;
export type BlockchainAnchor = typeof blockchainAnchors.$inferSelect;
