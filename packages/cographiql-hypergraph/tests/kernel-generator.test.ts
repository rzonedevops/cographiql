/**
 * Universal Kernel Generator Tests
 */

import {
  UniversalKernelGenerator,
  ElementaryDifferentialsGenerator,
  BSeriesEngine,
  DomainAnalyzer,
  GripOptimizer,
  GenerationContext,
  DomainSpecification,
} from '../src/kernel';

describe('ElementaryDifferentialsGenerator', () => {
  test('generates correct number of trees for order 1', () => {
    const trees = ElementaryDifferentialsGenerator.generate(1);
    expect(trees).toHaveLength(1);
    expect(trees[0].order).toBe(1);
    expect(trees[0].label).toBe('f');
  });

  test('generates correct number of trees for order 2', () => {
    const trees = ElementaryDifferentialsGenerator.generate(2);
    expect(trees).toHaveLength(1);
    expect(trees[0].order).toBe(2);
  });

  test('generates correct number of trees for order 3', () => {
    const trees = ElementaryDifferentialsGenerator.generate(3);
    expect(trees).toHaveLength(2);
  });

  test('generates correct number of trees for order 4', () => {
    const trees = ElementaryDifferentialsGenerator.generate(4);
    expect(trees).toHaveLength(5);
  });

  test('A000081 sequence counts', () => {
    expect(ElementaryDifferentialsGenerator.count(1)).toBe(1);
    expect(ElementaryDifferentialsGenerator.count(2)).toBe(1);
    expect(ElementaryDifferentialsGenerator.count(3)).toBe(2);
    expect(ElementaryDifferentialsGenerator.count(4)).toBe(4);
    expect(ElementaryDifferentialsGenerator.count(5)).toBe(9);
  });

  test('generates domain-specific trees', () => {
    const physicsTrees = ElementaryDifferentialsGenerator.generateDomainSpecific('physics', 2);
    expect(physicsTrees[0].label).toContain('H');
    
    const chemistryTrees = ElementaryDifferentialsGenerator.generateDomainSpecific('chemistry', 2);
    expect(chemistryTrees[0].label).toContain('R');
  });

  test('computes symmetry factors correctly', () => {
    const tree1 = ElementaryDifferentialsGenerator.generate(1)[0];
    expect(ElementaryDifferentialsGenerator.symmetryFactor(tree1)).toBe(1);
  });
});

describe('BSeriesEngine', () => {
  test('generates B-series expansion', () => {
    const domain: DomainSpecification = {
      type: 'physics',
      order: 2,
      treeType: 'hamiltonian',
      symmetry: 'Noether',
      preserves: ['energy'],
    };
    
    const grip = {
      contact: 1.0,
      coverage: 1.0,
      efficiency: 0.9,
      stability: 1.0,
      overall: 0.975,
    };
    
    const expansion = BSeriesEngine.generateExpansion(domain, grip);
    expect(expansion.terms.length).toBeGreaterThan(0);
    expect(expansion.convergenceOrder).toBe(2);
  });

  test('generates Runge-Kutta expansions', () => {
    const rk1 = BSeriesEngine.generateRungeKutta(1);
    expect(rk1.convergenceOrder).toBe(1);
    
    const rk2 = BSeriesEngine.generateRungeKutta(2);
    expect(rk2.convergenceOrder).toBe(2);
    
    const rk4 = BSeriesEngine.generateRungeKutta(4);
    expect(rk4.convergenceOrder).toBe(4);
  });

  test('chain composition', () => {
    const domain: DomainSpecification = {
      type: 'computing',
      order: 2,
      treeType: 'recursion',
      symmetry: 'Church-Rosser',
      preserves: ['termination'],
    };
    
    const grip = {
      contact: 0.8,
      coverage: 0.8,
      efficiency: 0.9,
      stability: 0.85,
      overall: 0.8375,
    };
    
    const f = BSeriesEngine.generateExpansion(domain, grip);
    const g = BSeriesEngine.generateExpansion(domain, grip);
    
    const composed = BSeriesEngine.chainCompose(f, g);
    expect(composed.terms.length).toBeGreaterThan(0);
  });

  test('product composition', () => {
    const domain: DomainSpecification = {
      type: 'computing',
      order: 2,
      treeType: 'recursion',
      symmetry: 'Church-Rosser',
      preserves: ['termination'],
    };
    
    const grip = {
      contact: 0.8,
      coverage: 0.8,
      efficiency: 0.9,
      stability: 0.85,
      overall: 0.8375,
    };
    
    const f = BSeriesEngine.generateExpansion(domain, grip);
    const g = BSeriesEngine.generateExpansion(domain, grip);
    
    const composed = BSeriesEngine.productCompose(f, g);
    expect(composed.terms.length).toBeGreaterThan(0);
  });
});

describe('DomainAnalyzer', () => {
  test('analyzes physics domain', () => {
    const context: GenerationContext = {
      domain: {
        type: 'physics',
        order: 3,
        treeType: 'hamiltonian',
        symmetry: 'Noether',
        preserves: ['energy', 'momentum'],
      },
      initialConditions: { energy: 1.0 },
      constraints: [],
      optimizationGoal: 'stability',
    };
    
    const analysis = DomainAnalyzer.analyzeDomain(context);
    expect(analysis.topology.manifoldDimension).toBe(4);
    expect(analysis.symmetries.lieGroups).toContain('SO(3)');
    expect(analysis.complexity).toBeGreaterThan(0);
  });

  test('analyzes consciousness domain', () => {
    const context: GenerationContext = {
      domain: {
        type: 'consciousness',
        order: 4,
        treeType: 'echo',
        symmetry: 'self-reference',
        preserves: ['identity', 'coherence'],
      },
      initialConditions: { awareness: 1.0 },
      constraints: [],
      optimizationGoal: 'balanced',
    };
    
    const analysis = DomainAnalyzer.analyzeDomain(context);
    expect(analysis.topology.manifoldDimension).toBe(776);
    expect(analysis.symmetries.lieGroups).toContain('self-reference');
  });

  test('validates domain specifications', () => {
    const validDomain: DomainSpecification = {
      type: 'physics',
      order: 3,
      treeType: 'hamiltonian',
      symmetry: 'Noether',
      preserves: ['energy'],
    };
    expect(DomainAnalyzer.validateDomain(validDomain)).toBe(true);
    
    const invalidDomain: DomainSpecification = {
      type: 'physics',
      order: 3,
      treeType: 'reaction' as any, // Wrong tree type for physics
      symmetry: 'Noether',
      preserves: ['energy'],
    };
    expect(DomainAnalyzer.validateDomain(invalidDomain)).toBe(false);
  });

  test('extracts domain features', () => {
    const context: GenerationContext = {
      domain: {
        type: 'biology',
        order: 2,
        treeType: 'metabolic',
        symmetry: 'homeostasis',
        preserves: ['biomass'],
      },
      initialConditions: {},
      constraints: [],
      optimizationGoal: 'balanced',
    };
    
    const analysis = DomainAnalyzer.analyzeDomain(context);
    const features = DomainAnalyzer.extractFeatures(analysis);
    expect(features).toHaveLength(8);
    expect(features[0]).toBe(2); // Manifold dimension
  });
});

describe('GripOptimizer', () => {
  test('measures grip', () => {
    const coeffs = [0.5, 0.3, 0.2];
    const domain: DomainSpecification = {
      type: 'physics',
      order: 3,
      treeType: 'hamiltonian',
      symmetry: 'Noether',
      preserves: ['energy'],
    };
    
    const grip = GripOptimizer.measureGrip(coeffs, domain);
    expect(grip.contact).toBeGreaterThanOrEqual(0);
    expect(grip.contact).toBeLessThanOrEqual(1);
    expect(grip.overall).toBeGreaterThanOrEqual(0);
    expect(grip.overall).toBeLessThanOrEqual(1);
  });

  test('optimizes grip', () => {
    const domain: DomainSpecification = {
      type: 'computing',
      order: 2,
      treeType: 'recursion',
      symmetry: 'Church-Rosser',
      preserves: ['termination'],
    };
    
    const initialGrip = {
      contact: 0.5,
      coverage: 0.5,
      efficiency: 0.5,
      stability: 0.5,
      overall: 0.5,
    };
    
    const expansion = BSeriesEngine.generateExpansion(domain, initialGrip);
    const optimized = GripOptimizer.optimize(expansion, 10);
    
    expect(optimized.iterations).toBeLessThanOrEqual(10);
    expect(optimized.coefficients.length).toBe(expansion.terms.length);
  });

  test('checks sufficient grip', () => {
    const goodGrip = {
      contact: 0.9,
      coverage: 0.9,
      efficiency: 0.9,
      stability: 0.9,
      overall: 0.9,
    };
    expect(GripOptimizer.isSufficientGrip(goodGrip)).toBe(true);
    
    const poorGrip = {
      contact: 0.5,
      coverage: 0.5,
      efficiency: 0.5,
      stability: 0.5,
      overall: 0.5,
    };
    expect(GripOptimizer.isSufficientGrip(poorGrip)).toBe(false);
  });
});

describe('UniversalKernelGenerator', () => {
  test('generates physics kernel', () => {
    const kernel = UniversalKernelGenerator.generatePhysicsKernel(3);
    expect(kernel.domain.type).toBe('physics');
    expect(kernel.order).toBe(3);
    expect(kernel.trees.length).toBeGreaterThan(0);
    expect(kernel.coefficients.length).toBe(kernel.trees.length);
  });

  test('generates chemistry kernel', () => {
    const kernel = UniversalKernelGenerator.generateChemistryKernel(2);
    expect(kernel.domain.type).toBe('chemistry');
    expect(kernel.order).toBe(2);
  });

  test('generates biology kernel', () => {
    const kernel = UniversalKernelGenerator.generateBiologyKernel(3);
    expect(kernel.domain.type).toBe('biology');
    expect(kernel.order).toBe(3);
  });

  test('generates computing kernel', () => {
    const kernel = UniversalKernelGenerator.generateComputingKernel(4);
    expect(kernel.domain.type).toBe('computing');
    expect(kernel.order).toBe(4);
  });

  test('generates consciousness kernel', () => {
    const kernel = UniversalKernelGenerator.generateConsciousnessKernel(4);
    expect(kernel.domain.type).toBe('consciousness');
    expect(kernel.order).toBe(4);
    expect(kernel.metadata.version).toBe('1.0.0');
  });

  test('generates Runge-Kutta kernels', () => {
    const rk1 = UniversalKernelGenerator.generateRungeKutta(1);
    expect(rk1.order).toBe(1);
    
    const rk4 = UniversalKernelGenerator.generateRungeKutta(4);
    expect(rk4.order).toBe(4);
  });

  test('applies chain rule operator', () => {
    const f = UniversalKernelGenerator.generatePhysicsKernel(2);
    const g = UniversalKernelGenerator.generatePhysicsKernel(2);
    
    const result = UniversalKernelGenerator.applyOperator('chain', f, g);
    expect(result.operator).toBe('chain');
    expect(result.result).toBeDefined();
  });

  test('applies product rule operator', () => {
    const f = UniversalKernelGenerator.generateComputingKernel(2);
    const g = UniversalKernelGenerator.generateComputingKernel(2);
    
    const result = UniversalKernelGenerator.applyOperator('product', f, g);
    expect(result.operator).toBe('product');
    expect(result.result).toBeDefined();
  });

  test('applies quotient rule operator', () => {
    const f = UniversalKernelGenerator.generatePhysicsKernel(2);
    const g = UniversalKernelGenerator.generatePhysicsKernel(2);
    
    const result = UniversalKernelGenerator.applyOperator('quotient', f, g);
    expect(result.operator).toBe('quotient');
    expect(result.result).toBeDefined();
  });

  test('verifies kernel validity', () => {
    const kernel = UniversalKernelGenerator.generatePhysicsKernel(2);
    const isValid = UniversalKernelGenerator.verify(kernel);
    expect(isValid).toBe(true);
  });

  test('exports kernel to JSON', () => {
    const kernel = UniversalKernelGenerator.generatePhysicsKernel(2);
    const json = UniversalKernelGenerator.export(kernel, 'json');
    expect(json).toContain('"domain"');
    expect(json).toContain('"physics"');
  });

  test('exports kernel to GGML', () => {
    const kernel = UniversalKernelGenerator.generatePhysicsKernel(2);
    const ggml = UniversalKernelGenerator.export(kernel, 'ggml');
    expect(ggml).toContain('GGML Kernel');
    expect(ggml).toContain('physics');
  });

  test('exports kernel to Scheme', () => {
    const kernel = UniversalKernelGenerator.generatePhysicsKernel(2);
    const scheme = UniversalKernelGenerator.export(kernel, 'scheme');
    expect(scheme).toContain('(define physics-kernel');
    expect(scheme).toContain('coefficients');
  });

  test('generates custom kernel', () => {
    const context: GenerationContext = {
      domain: {
        type: 'physics',
        order: 3,
        treeType: 'hamiltonian',
        symmetry: 'Noether',
        preserves: ['energy', 'momentum'],
      },
      initialConditions: { energy: 1.0 },
      constraints: [],
      optimizationGoal: 'accuracy',
    };
    
    const kernel = UniversalKernelGenerator.generate(context);
    expect(kernel.domain.type).toBe('physics');
    expect(kernel.order).toBe(3);
    expect(kernel.grip.overall).toBeGreaterThan(0);
  });
});

describe('Integration Tests', () => {
  test('complete workflow: generate, optimize, verify', () => {
    // Generate kernel
    const kernel = UniversalKernelGenerator.generateConsciousnessKernel(3);
    
    // Verify it's valid
    const isValid = UniversalKernelGenerator.verify(kernel);
    expect(isValid).toBe(true);
    
    // Export to different formats
    const json = UniversalKernelGenerator.export(kernel, 'json');
    expect(json).toBeTruthy();
    
    const ggml = UniversalKernelGenerator.export(kernel, 'ggml');
    expect(ggml).toBeTruthy();
    
    const scheme = UniversalKernelGenerator.export(kernel, 'scheme');
    expect(scheme).toBeTruthy();
  });

  test('compose multiple kernels', () => {
    const physics = UniversalKernelGenerator.generatePhysicsKernel(2);
    const computing = UniversalKernelGenerator.generateComputingKernel(2);
    
    // Chain composition
    const chained = UniversalKernelGenerator.applyOperator('chain', physics, computing);
    expect(chained.result).toBeDefined();
    
    // Product composition
    const product = UniversalKernelGenerator.applyOperator('product', physics, computing);
    expect(product.result).toBeDefined();
  });

  test('all domain kernels generate successfully', () => {
    const domains = [
      UniversalKernelGenerator.generatePhysicsKernel,
      UniversalKernelGenerator.generateChemistryKernel,
      UniversalKernelGenerator.generateBiologyKernel,
      UniversalKernelGenerator.generateComputingKernel,
      UniversalKernelGenerator.generateConsciousnessKernel,
    ];
    
    for (const generator of domains) {
      const kernel = generator(2);
      expect(kernel).toBeDefined();
      expect(kernel.trees.length).toBeGreaterThan(0);
      expect(UniversalKernelGenerator.verify(kernel)).toBe(true);
    }
  });
});
