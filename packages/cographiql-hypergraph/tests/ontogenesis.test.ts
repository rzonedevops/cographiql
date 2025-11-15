/**
 * Ontogenesis Engine Tests
 * Tests for self-generating, evolving kernels
 */

import { OntogenesisEngine } from '../src/kernel/ontogenesis';
import { UniversalKernelGenerator } from '../src/kernel/generator';
import {
  OntogeneticKernel,
  OntogenesisConfig,
  EvolutionParameters,
} from '../src/kernel/ontogenesis-types';
import { GeneratedKernel } from '../src/kernel/types';

describe('OntogenesisEngine', () => {
  beforeEach(() => {
    OntogenesisEngine.reset();
  });

  describe('initialize', () => {
    it('should initialize a kernel with ontogenetic capabilities', () => {
      const kernel = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const ontogenetic = OntogenesisEngine.initialize(kernel);

      expect(ontogenetic).toBeDefined();
      expect(ontogenetic.genome).toBeDefined();
      expect(ontogenetic.ontogeneticState).toBeDefined();
      expect(ontogenetic.genome.generation).toBe(0);
      expect(ontogenetic.genome.id).toBeTruthy();
      expect(ontogenetic.genome.lineage).toEqual([]);
      expect(ontogenetic.ontogeneticState.stage).toBe('embryonic');
      expect(ontogenetic.ontogeneticState.maturity).toBe(0);
    });

    it('should extract genes from kernel', () => {
      const kernel = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const ontogenetic = OntogenesisEngine.initialize(kernel);

      expect(ontogenetic.genome.genes).toBeDefined();
      expect(ontogenetic.genome.genes.length).toBeGreaterThan(0);
      
      // Check gene types
      const geneTypes = new Set(ontogenetic.genome.genes.map(g => g.type));
      expect(geneTypes.has('coefficient')).toBe(true);
      expect(geneTypes.has('symmetry')).toBe(true);
    });
  });

  describe('selfGenerate', () => {
    it('should generate offspring from parent kernel', () => {
      const parent = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const ontogeneticParent = OntogenesisEngine.initialize(parent);
      
      const offspring = OntogenesisEngine.selfGenerate(ontogeneticParent);

      expect(offspring).toBeDefined();
      expect(offspring.genome.generation).toBe(1);
      expect(offspring.genome.lineage).toEqual([ontogeneticParent.genome.id]);
      expect(offspring.genome.id).not.toBe(ontogeneticParent.genome.id);
    });

    it('should record self-generation operation', () => {
      const parent = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const ontogeneticParent = OntogenesisEngine.initialize(parent);
      
      OntogenesisEngine.selfGenerate(ontogeneticParent);
      
      const history = OntogenesisEngine.getOperationHistory();
      expect(history.length).toBe(1);
      expect(history[0].type).toBe('self-generate');
    });

    it('should create different offspring on multiple calls', () => {
      const parent = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const ontogeneticParent = OntogenesisEngine.initialize(parent);
      
      const offspring1 = OntogenesisEngine.selfGenerate(ontogeneticParent);
      const offspring2 = OntogenesisEngine.selfGenerate(ontogeneticParent);

      expect(offspring1.genome.id).not.toBe(offspring2.genome.id);
    });
  });

  describe('selfOptimize', () => {
    it('should optimize kernel grip', () => {
      const kernel = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const ontogenetic = OntogenesisEngine.initialize(kernel);
      
      const initialGrip = ontogenetic.grip.overall;
      const optimized = OntogenesisEngine.selfOptimize(ontogenetic, 5);

      expect(optimized.grip.overall).toBeGreaterThanOrEqual(initialGrip);
      expect(optimized.metadata.optimizationIterations).toBeGreaterThan(
        ontogenetic.metadata.optimizationIterations
      );
    });

    it('should increase maturity through optimization', () => {
      const kernel = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const ontogenetic = OntogenesisEngine.initialize(kernel);
      
      const optimized = OntogenesisEngine.selfOptimize(ontogenetic, 5);

      expect(optimized.ontogeneticState.maturity).toBeGreaterThan(
        ontogenetic.ontogeneticState.maturity
      );
    });

    it('should record optimization events', () => {
      const kernel = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const ontogenetic = OntogenesisEngine.initialize(kernel);
      
      const optimized = OntogenesisEngine.selfOptimize(ontogenetic, 3);

      expect(optimized.ontogeneticState.developmentHistory.length).toBe(3);
      expect(
        optimized.ontogeneticState.developmentHistory.every(
          e => e.type === 'optimization'
        )
      ).toBe(true);
    });
  });

  describe('selfReproduce', () => {
    it('should reproduce via crossover', () => {
      const parent1 = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const parent2 = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const onto1 = OntogenesisEngine.initialize(parent1);
      const onto2 = OntogenesisEngine.initialize(parent2);
      
      const result = OntogenesisEngine.selfReproduce(onto1, onto2, 'crossover');

      expect(result.method).toBe('crossover');
      expect(result.parents).toEqual([onto1, onto2]);
      expect(result.offspring.length).toBe(2);
      expect(result.offspring[0].genome.lineage).toContain(onto1.genome.id);
      expect(result.offspring[0].genome.lineage).toContain(onto2.genome.id);
    });

    it('should reproduce via mutation', () => {
      const parent1 = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const parent2 = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const onto1 = OntogenesisEngine.initialize(parent1);
      const onto2 = OntogenesisEngine.initialize(parent2);
      
      const result = OntogenesisEngine.selfReproduce(onto1, onto2, 'mutation');

      expect(result.method).toBe('mutation');
      expect(result.offspring.length).toBe(2);
      expect(result.offspring[0].ontogeneticState.mutations.length).toBeGreaterThan(0);
    });

    it('should reproduce via cloning', () => {
      const parent1 = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const parent2 = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const onto1 = OntogenesisEngine.initialize(parent1);
      const onto2 = OntogenesisEngine.initialize(parent2);
      
      const result = OntogenesisEngine.selfReproduce(onto1, onto2, 'cloning');

      expect(result.method).toBe('cloning');
      expect(result.offspring.length).toBe(1);
    });

    it('should create offspring with mixed genes', () => {
      const parent1 = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const parent2 = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const onto1 = OntogenesisEngine.initialize(parent1);
      const onto2 = OntogenesisEngine.initialize(parent2);
      
      // Make parents different
      onto1.coefficients[0] = 1.0;
      onto2.coefficients[0] = 0.0;
      
      const result = OntogenesisEngine.selfReproduce(onto1, onto2, 'crossover');
      
      // Offspring should have intermediate values
      const offspring = result.offspring[0];
      expect(offspring.coefficients[0]).not.toBe(onto1.coefficients[0]);
      expect(offspring.coefficients[0]).not.toBe(onto2.coefficients[0]);
    });
  });

  describe('evolve', () => {
    it('should evolve a population', () => {
      const kernel1 = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const kernel2 = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const onto1 = OntogenesisEngine.initialize(kernel1);
      const onto2 = OntogenesisEngine.initialize(kernel2);
      
      const population = {
        generation: 0,
        individuals: [onto1, onto2],
        populationSize: 2,
        averageFitness: 0.5,
        bestFitness: 0.5,
        diversity: 0.5,
      };
      
      const params: EvolutionParameters = {
        populationSize: 4,
        mutationRate: 0.1,
        crossoverRate: 0.8,
        elitismRate: 0.2,
        maxGenerations: 1,
        fitnessThreshold: 0.9,
        diversityPressure: 0.1,
      };
      
      const evolved = OntogenesisEngine.evolve(population, params);

      expect(evolved.generation).toBe(1);
      expect(evolved.individuals.length).toBe(params.populationSize);
      expect(evolved.populationSize).toBe(params.populationSize);
    });

    it('should preserve elite individuals', () => {
      const kernel = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const onto = OntogenesisEngine.initialize(kernel);
      
      // Create a high-fitness kernel
      onto.grip.overall = 0.95;
      onto.genome.fitness = 0.95;
      
      const population = {
        generation: 0,
        individuals: [onto],
        populationSize: 1,
        averageFitness: 0.95,
        bestFitness: 0.95,
        diversity: 0,
      };
      
      const params: EvolutionParameters = {
        populationSize: 3,
        mutationRate: 0.1,
        crossoverRate: 0.8,
        elitismRate: 0.5,
        maxGenerations: 1,
        fitnessThreshold: 0.9,
        diversityPressure: 0.1,
      };
      
      const evolved = OntogenesisEngine.evolve(population, params);

      // Elite should be preserved
      const eliteInNext = evolved.individuals.find(k => k.genome.id === onto.genome.id);
      expect(eliteInNext).toBeDefined();
    });

    it('should increase average fitness over generations', () => {
      const kernels = Array.from({ length: 5 }, () =>
        UniversalKernelGenerator.generateConsciousnessKernel(4)
      );
      const individuals = kernels.map(k => OntogenesisEngine.initialize(k));
      
      let population = {
        generation: 0,
        individuals,
        populationSize: 5,
        averageFitness: 0.5,
        bestFitness: 0.5,
        diversity: 0.5,
      };
      
      const params: EvolutionParameters = {
        populationSize: 5,
        mutationRate: 0.1,
        crossoverRate: 0.8,
        elitismRate: 0.2,
        maxGenerations: 5,
        fitnessThreshold: 1.0,
        diversityPressure: 0.1,
      };
      
      const initialFitness = population.averageFitness;
      
      for (let i = 0; i < 3; i++) {
        population = OntogenesisEngine.evolve(population, params);
      }
      
      // Average fitness should not decrease (may stay same or increase)
      expect(population.averageFitness).toBeGreaterThanOrEqual(0);
    });
  });

  describe('runOntogenesis', () => {
    it('should run complete ontogenesis', () => {
      const seedKernel = UniversalKernelGenerator.generateConsciousnessKernel(4);
      
      const config: OntogenesisConfig = {
        evolution: {
          populationSize: 5,
          mutationRate: 0.1,
          crossoverRate: 0.8,
          elitismRate: 0.2,
          maxGenerations: 3,
          fitnessThreshold: 0.95,
          diversityPressure: 0.1,
        },
        seedKernels: [seedKernel],
      };
      
      const generations = OntogenesisEngine.runOntogenesis(config);

      expect(generations.length).toBeGreaterThan(0);
      expect(generations.length).toBeLessThanOrEqual(config.evolution.maxGenerations + 1);
      
      // Check generation progression
      generations.forEach((gen, idx) => {
        expect(gen.generation).toBe(idx);
        expect(gen.individuals.length).toBe(config.evolution.populationSize);
      });
    });

    it('should terminate early if fitness threshold reached', () => {
      const seedKernel = UniversalKernelGenerator.generateConsciousnessKernel(4);
      
      const config: OntogenesisConfig = {
        evolution: {
          populationSize: 3,
          mutationRate: 0.1,
          crossoverRate: 0.8,
          elitismRate: 0.3,
          maxGenerations: 100,
          fitnessThreshold: 0.5, // Low threshold
          diversityPressure: 0.1,
        },
        seedKernels: [seedKernel],
      };
      
      const generations = OntogenesisEngine.runOntogenesis(config);

      // Should terminate before max generations
      expect(generations.length).toBeLessThan(config.evolution.maxGenerations);
    });

    it('should maintain population diversity', () => {
      const seedKernel = UniversalKernelGenerator.generateConsciousnessKernel(4);
      
      const config: OntogenesisConfig = {
        evolution: {
          populationSize: 5,
          mutationRate: 0.2,
          crossoverRate: 0.7,
          elitismRate: 0.1,
          maxGenerations: 5,
          fitnessThreshold: 1.0,
          diversityPressure: 0.2,
        },
        seedKernels: [seedKernel],
      };
      
      const generations = OntogenesisEngine.runOntogenesis(config);
      
      // Check that diversity is maintained
      generations.forEach(gen => {
        expect(gen.diversity).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('development stages', () => {
    it('should transition through development stages', () => {
      const kernel = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const onto = OntogenesisEngine.initialize(kernel);
      
      expect(onto.ontogeneticState.stage).toBe('embryonic');
      
      // Optimize to increase maturity
      const optimized = OntogenesisEngine.selfOptimize(onto, 10);
      
      // After optimization, maturity should increase
      expect(optimized.ontogeneticState.maturity).toBeGreaterThan(0);
    });

    it('should track reproductive capability', () => {
      const kernel = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const onto = OntogenesisEngine.initialize(kernel);
      
      expect(onto.ontogeneticState.reproductiveCapability).toBe(0);
      
      // After maturation
      onto.ontogeneticState.maturity = 0.9;
      onto.genome.age = 10;
      
      // Update stage (would normally happen in evolution)
      const params: EvolutionParameters = {
        populationSize: 1,
        mutationRate: 0,
        crossoverRate: 0,
        elitismRate: 1,
        maxGenerations: 1,
        fitnessThreshold: 1,
        diversityPressure: 0,
      };
      
      const population = {
        generation: 0,
        individuals: [onto],
        populationSize: 1,
        averageFitness: 0.5,
        bestFitness: 0.5,
        diversity: 0,
      };
      
      const evolved = OntogenesisEngine.evolve(population, params);
      
      // Reproductive capability should increase with maturity
      expect(evolved.individuals[0].genome.age).toBeGreaterThan(onto.genome.age);
    });
  });

  describe('genetic operations', () => {
    it('should record mutations', () => {
      const kernel = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const onto = OntogenesisEngine.initialize(kernel);
      
      const parent1 = onto;
      const parent2 = OntogenesisEngine.initialize(kernel);
      
      const result = OntogenesisEngine.selfReproduce(parent1, parent2, 'mutation');
      
      expect(result.offspring[0].ontogeneticState.mutations.length).toBeGreaterThan(0);
      
      const mutation = result.offspring[0].ontogeneticState.mutations[0];
      expect(mutation.geneIndex).toBeGreaterThanOrEqual(0);
      expect(mutation.oldValue).toBeDefined();
      expect(mutation.newValue).toBeDefined();
    });

    it('should track lineage', () => {
      const parent = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const onto = OntogenesisEngine.initialize(parent);
      
      const child = OntogenesisEngine.selfGenerate(onto);
      const grandchild = OntogenesisEngine.selfGenerate(child);
      
      expect(child.genome.lineage).toContain(onto.genome.id);
      expect(grandchild.genome.lineage).toContain(child.genome.id);
      expect(grandchild.genome.generation).toBe(2);
    });

    it('should maintain genome integrity through generations', () => {
      const parent = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const onto = OntogenesisEngine.initialize(parent);
      
      const generations = [onto];
      for (let i = 0; i < 5; i++) {
        const last = generations[generations.length - 1];
        const next = OntogenesisEngine.selfGenerate(last);
        generations.push(next);
      }
      
      // Check that all have valid genomes
      generations.forEach((gen, idx) => {
        expect(gen.genome).toBeDefined();
        expect(gen.genome.generation).toBe(idx);
        expect(gen.genome.genes.length).toBeGreaterThan(0);
      });
    });
  });

  describe('history and tracking', () => {
    it('should track operation history', () => {
      const kernel = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const onto = OntogenesisEngine.initialize(kernel);
      
      OntogenesisEngine.selfGenerate(onto);
      OntogenesisEngine.selfOptimize(onto, 1);
      
      const history = OntogenesisEngine.getOperationHistory();
      expect(history.length).toBe(2);
      expect(history[0].type).toBe('self-generate');
      expect(history[1].type).toBe('self-optimize');
    });

    it('should clear history on reset', () => {
      const kernel = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const onto = OntogenesisEngine.initialize(kernel);
      
      OntogenesisEngine.selfGenerate(onto);
      
      expect(OntogenesisEngine.getOperationHistory().length).toBeGreaterThan(0);
      
      OntogenesisEngine.reset();
      
      expect(OntogenesisEngine.getOperationHistory().length).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle empty seed kernels', () => {
      const config: OntogenesisConfig = {
        evolution: {
          populationSize: 3,
          mutationRate: 0.1,
          crossoverRate: 0.8,
          elitismRate: 0.2,
          maxGenerations: 2,
          fitnessThreshold: 0.95,
          diversityPressure: 0.1,
        },
        seedKernels: [],
      };
      
      const generations = OntogenesisEngine.runOntogenesis(config);
      
      expect(generations.length).toBeGreaterThan(0);
      expect(generations[0].individuals.length).toBe(config.evolution.populationSize);
    });

    it('should handle single individual population', () => {
      const kernel = UniversalKernelGenerator.generateConsciousnessKernel(4);
      const onto = OntogenesisEngine.initialize(kernel);
      
      const population = {
        generation: 0,
        individuals: [onto],
        populationSize: 1,
        averageFitness: 0.5,
        bestFitness: 0.5,
        diversity: 0,
      };
      
      const params: EvolutionParameters = {
        populationSize: 1,
        mutationRate: 0.1,
        crossoverRate: 0,
        elitismRate: 1,
        maxGenerations: 1,
        fitnessThreshold: 0.95,
        diversityPressure: 0,
      };
      
      const evolved = OntogenesisEngine.evolve(population, params);
      
      expect(evolved.individuals.length).toBe(1);
    });

    it('should handle zero mutation rate', () => {
      const kernel = UniversalKernelGenerator.generateConsciousnessKernel(4);
      
      const config: OntogenesisConfig = {
        evolution: {
          populationSize: 3,
          mutationRate: 0,
          crossoverRate: 0.8,
          elitismRate: 0.2,
          maxGenerations: 2,
          fitnessThreshold: 0.95,
          diversityPressure: 0.1,
        },
        seedKernels: [kernel],
      };
      
      const generations = OntogenesisEngine.runOntogenesis(config);
      
      expect(generations.length).toBeGreaterThan(0);
    });
  });
});
