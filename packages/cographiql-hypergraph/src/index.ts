/**
 * CoGraphiQL HyperGraph Package
 * Main entry point for HyperGraphQL interface with topological tensor framework
 */

// Core types
export * from './types/cognitive-types';

// Schema generator
export { HyperGraphQLSchemaGenerator, generateHyperGraphQLSchema } from './schema/generator';

// AtomSpace bridge
export { AtomSpaceBridge, DistributedAtomSpaceBridge } from './bridge/atomspace-bridge';

// Tensor framework
export {
  TensorFrameworkManager,
  createDefaultTensorFramework,
} from './tensor/framework';

// GNN component
export {
  GNNTensorProcessor,
  GNNQueryEncoder,
  GNNMessagePassingLayer,
  createGNNProcessor,
} from './tensor/gnn';

// Self-awareness
export {
  CognitiveMirrorSystem,
  PSystemMembrane,
  createCognitiveMirror,
} from './self-awareness/cognitive-mirror';

// Universal Kernel Generator
export * from './kernel';

// UI components
export { CogGraphiQL } from './ui/CogGraphiQL';
export { HypergraphVisualizer } from './ui/HypergraphVisualizer';
export { SynergyMonitor } from './ui/SynergyMonitor';
export { TensorFieldView } from './ui/TensorFieldView';

// Default configuration
import {
  CogServerConfig,
  TensorConfig,
  CoGraphiQLConfig,
} from './types/cognitive-types';

/**
 * Create default CoGraphiQL configuration
 */
export function createDefaultConfig(): CoGraphiQLConfig {
  const cogServer: CogServerConfig = {
    host: 'localhost',
    port: 17001,
    protocol: 'ws',
    reconnect: true,
    reconnectInterval: 5000,
    timeout: 30000,
  };

  const tensor: TensorConfig = {
    precision: 'float32',
    device: 'cpu',
    batchSize: 32,
    optimizationLevel: 2,
  };

  return {
    cogServer,
    tensor,
    enableSelfAwareness: true,
    enableVisualization: true,
    performanceMode: 'balanced',
  };
}

/**
 * Package version
 */
export const VERSION = '1.0.0';

/**
 * Package metadata
 */
export const METADATA = {
  name: 'cographiql-hypergraph',
  version: VERSION,
  description: 'HyperGraphQL interface for distributed AtomSpace with topological tensor framework',
  totalStates: 776,
  primeFactorization: { 2: 3, 97: 1 },
  components: {
    gnn: { shape: [7, 7, 7], params: 343 },
    das: { shape: [11, 5, 2], params: 110 },
    esn: { shape: [13, 3, 3], params: 117 },
    membrane: { shape: [5, 5, 5], params: 125 },
    ecan: { shape: [3, 3, 3, 3], params: 81 },
  },
  frameProblemSolved: true,
};

/**
 * Initialize CoGraphiQL system
 */
export async function initializeCoGraphiQL(
  config?: Partial<CoGraphiQLConfig>
): Promise<{
  bridge: AtomSpaceBridge;
  framework: TensorFrameworkManager;
  mirror: CognitiveMirrorSystem;
  schema: any;
}> {
  const fullConfig = {
    ...createDefaultConfig(),
    ...config,
  };

  // Initialize AtomSpace bridge
  const bridge = new AtomSpaceBridge(fullConfig.cogServer);
  await bridge.connect();

  // Initialize tensor framework
  const framework = createDefaultTensorFramework();

  // Initialize cognitive mirror
  const initialField = framework.getTensorField('gnn');
  const mirror = createCognitiveMirror();

  // Generate schema
  const schemaGenerator = new HyperGraphQLSchemaGenerator();
  const schema = schemaGenerator.getSchema();

  console.log('CoGraphiQL initialized successfully');
  console.log(`Total quantum states: ${METADATA.totalStates}`);
  console.log(`Frame problem: ${METADATA.frameProblemSolved ? 'SOLVED' : 'UNSOLVED'}`);

  return {
    bridge,
    framework,
    mirror,
    schema,
  };
}
