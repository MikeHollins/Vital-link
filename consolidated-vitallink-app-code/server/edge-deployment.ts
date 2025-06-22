import { edgeDeployments, zkHealthProofs } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { regulatoryService } from "./regulatory-compliance";
import { zkProofService } from "./zk-proof-service";

export interface EdgeEnvironment {
  type: 'military' | 'field_medical' | 'remote' | 'spacecraft' | 'humanitarian';
  networkStatus: 'connected' | 'intermittent' | 'offline';
  resourceConstraints: {
    cpuLimit: number; // percentage
    memoryLimit: number; // MB
    bandwidthLimit: number; // kbps
    powerConstraint: boolean;
  };
  securityLevel: 'standard' | 'military_grade' | 'classified';
  encryptionRequired: boolean;
}

export interface OfflineProofQueue {
  id: string;
  userId: string;
  metricType: string;
  timestamp: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  resourceEstimate: {
    computationTime: number;
    memoryUsage: number;
    energyConsumption: number;
  };
}

export class EdgeDeploymentService {
  
  async configureEdgeEnvironment(
    userId: string,
    environment: EdgeEnvironment
  ) {
    // Patent Claim 1 & 5: Configure for resource-constrained environments
    
    const deployment = await db.insert(edgeDeployments).values({
      userId,
      deploymentType: environment.type,
      networkStatus: environment.networkStatus,
      resourceConstraints: environment.resourceConstraints,
      encryptionLevel: environment.securityLevel === 'military_grade' ? 'military_grade' : 'standard',
      hardwareSecurityModule: environment.securityLevel === 'military_grade',
      isActive: true,
    }).onConflictDoUpdate({
      target: edgeDeployments.userId,
      set: {
        deploymentType: environment.type,
        networkStatus: environment.networkStatus,
        resourceConstraints: environment.resourceConstraints,
        encryptionLevel: environment.securityLevel === 'military_grade' ? 'military_grade' : 'standard',
        hardwareSecurityModule: environment.securityLevel === 'military_grade',
      },
    }).returning();

    await regulatoryService.logSecurityEvent(
      userId,
      'EDGE_DEPLOYMENT_CONFIGURED',
      {
        type: environment.type,
        networkStatus: environment.networkStatus,
        securityLevel: environment.securityLevel,
      }
    );

    return deployment[0];
  }

  async queueOfflineProof(
    userId: string,
    metricType: string,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<OfflineProofQueue> {
    // Patent Claim 1: Handle intermittently connected edge hardware
    
    const deployment = await this.getActiveDeployment(userId);
    if (!deployment) {
      throw new Error('No active edge deployment found');
    }

    // Estimate resource requirements based on deployment type
    const resourceEstimate = this.estimateResourceRequirements(
      metricType,
      deployment.deploymentType,
      deployment.resourceConstraints
    );

    const queueItem: OfflineProofQueue = {
      id: `${userId}_${metricType}_${Date.now()}`,
      userId,
      metricType,
      timestamp: Date.now(),
      priority,
      resourceEstimate,
    };

    // Add to pending proofs queue
    const currentQueue = deployment.pendingProofs as OfflineProofQueue[] || [];
    currentQueue.push(queueItem);
    
    // Sort by priority and resource efficiency
    const sortedQueue = this.optimizeProofQueue(currentQueue, deployment.resourceConstraints);

    await db.update(edgeDeployments)
      .set({
        pendingProofs: sortedQueue,
      })
      .where(eq(edgeDeployments.userId, userId));

    await regulatoryService.logSecurityEvent(
      userId,
      'PROOF_QUEUED_OFFLINE',
      {
        metricType,
        priority,
        queueLength: sortedQueue.length,
        resourceEstimate,
      }
    );

    return queueItem;
  }

  async processOfflineQueue(userId: string): Promise<void> {
    // Patent Claim 1: Process queued proofs when connectivity is restored
    
    const deployment = await this.getActiveDeployment(userId);
    if (!deployment || deployment.networkStatus === 'offline') {
      return;
    }

    const queue = deployment.pendingProofs as OfflineProofQueue[] || [];
    if (queue.length === 0) {
      return;
    }

    const processedProofs: string[] = [];
    
    for (const item of queue) {
      try {
        // Check if we have enough resources
        if (!this.hasSufficientResources(item.resourceEstimate, deployment.resourceConstraints)) {
          continue;
        }

        // Generate the proof
        const proofResult = await zkProofService.generateHealthProof({
          userId: item.userId,
          metricType: item.metricType,
          timeWindow: 24,
          deploymentType: deployment.deploymentType as any,
        });

        processedProofs.push(item.id);

        await regulatoryService.logSecurityEvent(
          userId,
          'OFFLINE_PROOF_PROCESSED',
          {
            proofId: item.id,
            metricType: item.metricType,
            proofHash: proofResult.proofHash,
          }
        );

      } catch (error) {
        await regulatoryService.logSecurityEvent(
          userId,
          'OFFLINE_PROOF_FAILED',
          {
            proofId: item.id,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
          'ERROR'
        );
      }
    }

    // Remove processed items from queue
    const remainingQueue = queue.filter(item => !processedProofs.includes(item.id));
    
    await db.update(edgeDeployments)
      .set({
        pendingProofs: remainingQueue,
        lastSyncTimestamp: new Date(),
      })
      .where(eq(edgeDeployments.userId, userId));
  }

  async updateNetworkStatus(
    userId: string, 
    networkStatus: 'connected' | 'intermittent' | 'offline'
  ) {
    await db.update(edgeDeployments)
      .set({
        networkStatus,
      })
      .where(eq(edgeDeployments.userId, userId));

    // If connectivity restored, process offline queue
    if (networkStatus === 'connected') {
      await this.processOfflineQueue(userId);
    }

    await regulatoryService.logSecurityEvent(
      userId,
      'NETWORK_STATUS_CHANGED',
      { networkStatus }
    );
  }

  async getActiveDeployment(userId: string) {
    const [deployment] = await db.select()
      .from(edgeDeployments)
      .where(
        and(
          eq(edgeDeployments.userId, userId),
          eq(edgeDeployments.isActive, true)
        )
      );

    return deployment;
  }

  private estimateResourceRequirements(
    metricType: string,
    deploymentType: string,
    constraints: any
  ) {
    // Base resource requirements
    const baseRequirements = {
      heart_rate: { cpu: 15, memory: 64, energy: 10 },
      steps: { cpu: 10, memory: 32, energy: 5 },
      blood_pressure: { cpu: 20, memory: 96, energy: 15 },
      sleep: { cpu: 25, memory: 128, energy: 20 },
    };

    const base = baseRequirements[metricType as keyof typeof baseRequirements] || 
                 { cpu: 20, memory: 64, energy: 15 };

    // Adjust for deployment type
    let multiplier = 1.0;
    if (deploymentType === 'military' || deploymentType === 'spacecraft') {
      multiplier = 0.7; // Optimized for these environments
    } else if (deploymentType === 'field_medical') {
      multiplier = 0.85;
    }

    return {
      computationTime: Math.floor(base.cpu * multiplier), // seconds
      memoryUsage: Math.floor(base.memory * multiplier), // MB
      energyConsumption: Math.floor(base.energy * multiplier), // arbitrary units
    };
  }

  private optimizeProofQueue(
    queue: OfflineProofQueue[],
    resourceConstraints: any
  ): OfflineProofQueue[] {
    // Sort by priority first, then by resource efficiency
    return queue.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      
      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      // If same priority, prefer lower resource usage
      const aResourceScore = a.resourceEstimate.computationTime + a.resourceEstimate.memoryUsage;
      const bResourceScore = b.resourceEstimate.computationTime + b.resourceEstimate.memoryUsage;
      
      return aResourceScore - bResourceScore;
    });
  }

  private hasSufficientResources(
    required: { computationTime: number; memoryUsage: number; energyConsumption: number },
    available: any
  ): boolean {
    const memoryAvailable = available.memoryLimit || 1024; // MB
    const cpuAvailable = available.cpuLimit || 100; // percentage
    
    // Simple resource check (in production, use more sophisticated resource monitoring)
    return required.memoryUsage <= memoryAvailable * 0.8 && // Leave 20% buffer
           required.computationTime <= 60; // Max 60 seconds per proof
  }

  async getDeploymentMetrics(userId: string) {
    const deployment = await this.getActiveDeployment(userId);
    if (!deployment) {
      return null;
    }

    const queueLength = (deployment.pendingProofs as OfflineProofQueue[] || []).length;
    const lastSync = deployment.lastSyncTimestamp;
    
    return {
      deploymentType: deployment.deploymentType,
      networkStatus: deployment.networkStatus,
      queueLength,
      lastSync,
      encryptionLevel: deployment.encryptionLevel,
      hardwareSecurityModule: deployment.hardwareSecurityModule,
      resourceConstraints: deployment.resourceConstraints,
    };
  }
}

export const edgeDeploymentService = new EdgeDeploymentService();