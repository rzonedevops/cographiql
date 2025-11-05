/**
 * Tensor Framework Test Suite
 * Tests for topological tensor framework with 776 quantum states
 */

import { TensorFrameworkManager, createDefaultTensorFramework } from '../src/tensor/framework';
import { TensorConfig } from '../src/types/cognitive-types';

describe('TensorFrameworkManager', () => {
  let framework: TensorFrameworkManager;

  beforeEach(() => {
    framework = createDefaultTensorFramework();
  });

  describe('Initialization', () => {
    test('should initialize with correct total states', () => {
      const frameworkData = framework.getFramework();
      expect(frameworkData.totalStates).toBe(776);
    });

    test('should have correct prime factorization', () => {
      const frameworkData = framework.getFramework();
      expect(frameworkData.primeFactorization).toEqual({ 2: 3, 97: 1 });
    });

    test('should initialize all 5 components', () => {
      const frameworkData = framework.getFramework();
      expect(frameworkData.components.gnn).toBeDefined();
      expect(frameworkData.components.das).toBeDefined();
      expect(frameworkData.components.esn).toBeDefined();
      expect(frameworkData.components.membrane).toBeDefined();
      expect(frameworkData.components.ecan).toBeDefined();
    });

    test('should mark frame problem as solved', () => {
      const frameworkData = framework.getFramework();
      expect(frameworkData.frameProblemSolved).toBe(true);
    });
  });

  describe('GNN Component', () => {
    test('should have correct tensor shape [7×7×7]', () => {
      const gnnField = framework.getTensorField('gnn');
      expect(gnnField.shape.dimensions).toEqual([7, 7, 7]);
    });

    test('should have 343 parameters', () => {
      const gnnField = framework.getTensorField('gnn');
      expect(gnnField.shape.totalParams).toBe(343);
    });

    test('should have correct data array size', () => {
      const gnnField = framework.getTensorField('gnn');
      expect(gnnField.data.length).toBe(343);
    });
  });

  describe('DAS Component', () => {
    test('should have correct tensor shape [11×5×2]', () => {
      const dasField = framework.getTensorField('das');
      expect(dasField.shape.dimensions).toEqual([11, 5, 2]);
    });

    test('should have 110 parameters', () => {
      const dasField = framework.getTensorField('das');
      expect(dasField.shape.totalParams).toBe(110);
    });

    test('should have 11 shards (prime number)', () => {
      const frameworkData = framework.getFramework();
      expect(frameworkData.components.das.shards).toBe(11);
    });
  });

  describe('ESN Component', () => {
    test('should have correct tensor shape [13×3×3]', () => {
      const esnField = framework.getTensorField('esn');
      expect(esnField.shape.dimensions).toEqual([13, 3, 3]);
    });

    test('should have 117 parameters', () => {
      const esnField = framework.getTensorField('esn');
      expect(esnField.shape.totalParams).toBe(117);
    });

    test('should have spectral radius < 1 for stability', () => {
      const frameworkData = framework.getFramework();
      expect(frameworkData.components.esn.spectralRadius).toBeLessThan(1);
    });
  });

  describe('Membrane Component', () => {
    test('should have correct tensor shape [5×5×5]', () => {
      const membraneField = framework.getTensorField('membrane');
      expect(membraneField.shape.dimensions).toEqual([5, 5, 5]);
    });

    test('should have 125 parameters', () => {
      const membraneField = framework.getTensorField('membrane');
      expect(membraneField.shape.totalParams).toBe(125);
    });
  });

  describe('ECAN Component', () => {
    test('should have correct tensor shape [3×3×3×3]', () => {
      const ecanField = framework.getTensorField('ecan');
      expect(ecanField.shape.dimensions).toEqual([3, 3, 3, 3]);
    });

    test('should have 81 parameters', () => {
      const ecanField = framework.getTensorField('ecan');
      expect(ecanField.shape.totalParams).toBe(81);
    });

    test('should have initial budget', () => {
      const frameworkData = framework.getFramework();
      expect(frameworkData.components.ecan.budget).toBeGreaterThan(0);
    });
  });

  describe('Verification', () => {
    test('should pass integrity verification', () => {
      const isValid = framework.verify();
      expect(isValid).toBe(true);
    });

    test('should verify total state count', () => {
      const frameworkData = framework.getFramework();
      const total = 343 + 110 + 117 + 125 + 81;
      expect(frameworkData.totalStates).toBe(total);
    });

    test('should verify prime factorization: 776 = 2³ × 97', () => {
      const frameworkData = framework.getFramework();
      const { primeFactorization } = frameworkData;
      const reconstructed = Math.pow(2, primeFactorization[2]) * Math.pow(97, primeFactorization[97]);
      expect(reconstructed).toBe(776);
    });
  });

  describe('Tensor Field Operations', () => {
    test('should get all tensor fields', () => {
      const allFields = framework.getAllTensorFields();
      expect(Object.keys(allFields)).toHaveLength(5);
      expect(allFields.gnn).toBeDefined();
      expect(allFields.das).toBeDefined();
      expect(allFields.esn).toBeDefined();
      expect(allFields.membrane).toBeDefined();
      expect(allFields.ecan).toBeDefined();
    });

    test('should update tensor field', () => {
      const newData = new Float32Array(343).fill(1.0);
      framework.updateTensorField('gnn', newData);
      const gnnField = framework.getTensorField('gnn');
      expect(gnnField.data[0]).toBe(1.0);
    });

    test('should throw error for unknown component', () => {
      expect(() => {
        framework.getTensorField('unknown');
      }).toThrow('Unknown component: unknown');
    });
  });

  describe('GGML Export/Import', () => {
    test('should export to GGML format', () => {
      const ggml = framework.exportToGGML();
      const parsed = JSON.parse(ggml);
      
      expect(parsed.version).toBeDefined();
      expect(parsed.tensor_field).toBeDefined();
      expect(parsed.tensor_field.shape).toEqual([776]);
      expect(parsed.tensor_field.prime_factorization).toEqual({ '2': 3, '97': 1 });
      expect(parsed.unified_field).toBe('graphql-neural-hypergraph-membrane');
      expect(parsed.frame_problem).toBe('SOLVED');
    });

    test('should export correct component shapes', () => {
      const ggml = framework.exportToGGML();
      const parsed = JSON.parse(ggml);
      const components = parsed.tensor_field.components;
      
      expect(components.gnn.shape).toEqual([7, 7, 7]);
      expect(components.gnn.params).toBe(343);
      
      expect(components.das.shape).toEqual([11, 5, 2]);
      expect(components.das.params).toBe(110);
      
      expect(components.esn.shape).toEqual([13, 3, 3]);
      expect(components.esn.params).toBe(117);
      
      expect(components.membrane.shape).toEqual([5, 5, 5]);
      expect(components.membrane.params).toBe(125);
      
      expect(components.ecan.shape).toEqual([3, 3, 3, 3]);
      expect(components.ecan.params).toBe(81);
    });

    test('should import from GGML format', () => {
      const ggml = framework.exportToGGML();
      expect(() => {
        framework.importFromGGML(ggml);
      }).not.toThrow();
    });
  });

  describe('Configuration', () => {
    test('should get current configuration', () => {
      const config = framework.getConfig();
      expect(config.precision).toBe('float32');
      expect(config.device).toBe('cpu');
      expect(config.batchSize).toBe(32);
      expect(config.optimizationLevel).toBe(2);
    });

    test('should update configuration', () => {
      framework.updateConfig({ batchSize: 64 });
      const config = framework.getConfig();
      expect(config.batchSize).toBe(64);
    });
  });

  describe('Performance', () => {
    test('should complete verification in < 10ms', () => {
      const start = Date.now();
      framework.verify();
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(10);
    });

    test('should get tensor field in < 5ms', () => {
      const start = Date.now();
      framework.getTensorField('gnn');
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(5);
    });

    test('should export to GGML in < 50ms', () => {
      const start = Date.now();
      framework.exportToGGML();
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(50);
    });
  });
});

describe('createDefaultTensorFramework', () => {
  test('should create framework with default config', () => {
    const framework = createDefaultTensorFramework();
    expect(framework).toBeInstanceOf(TensorFrameworkManager);
    
    const config = framework.getConfig();
    expect(config.precision).toBe('float32');
    expect(config.device).toBe('cpu');
  });
});
