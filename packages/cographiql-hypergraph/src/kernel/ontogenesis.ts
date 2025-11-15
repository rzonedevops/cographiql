/**
 * Ontogenesis Engine
 * Self-generating, evolving kernels through recursive differential operators
 */

import { UniversalKernelGenerator } from './generator';
import { GripOptimizer } from './grip-optimizer';
import { BSeriesEngine } from './b-series';
import {
  GeneratedKernel,
  DomainSpecification,
  DifferentialOperator,
  GripMetric,
} from './types';
import {
  OntogeneticKernel,
  KernelGenome,
  KernelGene,
  OntogeneticState,
  DevelopmentStage,
  KernelPopulation,
  EvolutionParameters,
  FitnessEvaluation,
  ReproductionResult,
  OntogenesisConfig,
  DevelopmentSchedule,
  LineageNode,
  OntogeneticOperation,
  MutationRecord,
  DevelopmentEvent,
} from './ontogenesis-types';

/**
 * Ontogenesis Engine - Self-generating kernels
 */
export class OntogenesisEngine {
  private static readonly VERSION = '1.0.0';
  private static lineageTree: Map<string, LineageNode> = new Map();
  private static operationHistory: OntogeneticOperation[] = [];

  /**
   * Initialize a kernel with ontogenetic capabilities
   */
  static initialize(kernel: GeneratedKernel, config?: Partial<OntogenesisConfig>): OntogeneticKernel {
    const genome = this.extractGenome(kernel);
    const state = this.createInitialState();

    return {
      ...kernel,
      genome,
      ontogeneticState: state,
    };
  }

  /**
   * Self-generate: Kernel generates a new kernel through recursive application
   */
  static selfGenerate(parent: OntogeneticKernel): OntogeneticKernel {
    // Use the parent kernel's differential structure to generate offspring
    const operation: DifferentialOperator = this.selectOperator(parent);
    
    // Self-compose using chain rule (recursive self-reference)
    const composed = UniversalKernelGenerator.applyOperator(
      operation,
      parent,
      parent
    );

    const offspring = this.initialize(composed.result);
    offspring.genome.generation = parent.genome.generation + 1;
    offspring.genome.lineage = [parent.genome.id];

    this.recordOperation({
      type: 'self-generate',
      input: parent,
      output: offspring,
      timestamp: new Date(),
    });

    return offspring;
  }

  /**
   * Self-optimize: Kernel optimizes itself through iterative grip improvement
   */
  static selfOptimize(kernel: OntogeneticKernel, iterations: number = 10): OntogeneticKernel {
    let current = kernel;
    
    for (let i = 0; i < iterations; i++) {
      // Optimize grip
      const optimized = GripOptimizer.optimize(current.bSeries);
      
      // Update kernel
      current = {
        ...current,
        coefficients: optimized.coefficients,
        grip: optimized.grip,
        bSeries: {
          ...current.bSeries,
          grip: optimized.grip,
        },
        metadata: {
          ...current.metadata,
          optimizationIterations: current.metadata.optimizationIterations + 1,
        },
      };

      // Update ontogenetic state
      current.ontogeneticState.maturity = Math.min(
        1.0,
        current.ontogeneticState.maturity + 0.1
      );

      // Record development event
      current.ontogeneticState.developmentHistory.push({
        timestamp: new Date(),
        type: 'optimization',
        description: `Self-optimization iteration ${i + 1}`,
        fitnessChange: optimized.grip.overall - kernel.grip.overall,
      });
    }

    this.recordOperation({
      type: 'self-optimize',
      input: kernel,
      output: current,
      timestamp: new Date(),
    });

    return current;
  }

  /**
   * Self-reproduce: Two kernels combine to create offspring
   */
  static selfReproduce(
    parent1: OntogeneticKernel,
    parent2: OntogeneticKernel,
    method: 'crossover' | 'mutation' | 'cloning' = 'crossover'
  ): ReproductionResult {
    const offspring: OntogeneticKernel[] = [];

    switch (method) {
      case 'crossover':
        offspring.push(...this.crossover(parent1, parent2));
        break;
      case 'mutation':
        offspring.push(this.mutate(parent1));
        offspring.push(this.mutate(parent2));
        break;
      case 'cloning':
        offspring.push(this.clone(parent1));
        break;
    }

    return {
      parents: [parent1, parent2],
      offspring,
      method,
    };
  }

  /**
   * Evolve a population of kernels
   */
  static evolve(
    population: KernelPopulation,
    params: EvolutionParameters
  ): KernelPopulation {
    // Evaluate fitness
    const evaluations = this.evaluateFitness(population.individuals);
    
    // Sort by fitness
    const sorted = evaluations.sort((a, b) => b.overall - a.overall);
    
    // Select elite (best individuals preserved)
    const eliteCount = Math.floor(params.populationSize * params.elitismRate);
    const elite = sorted.slice(0, eliteCount).map(e => e.kernel);
    
    // Generate offspring
    const offspring: OntogeneticKernel[] = [];
    while (offspring.length < params.populationSize - eliteCount) {
      // Select parents using tournament selection
      const parent1 = this.tournamentSelect(sorted, 3);
      const parent2 = this.tournamentSelect(sorted, 3);
      
      // Reproduce
      if (Math.random() < params.crossoverRate) {
        const result = this.selfReproduce(parent1.kernel, parent2.kernel, 'crossover');
        offspring.push(...result.offspring);
      } else {
        offspring.push(this.clone(parent1.kernel));
      }
      
      // Mutate
      if (Math.random() < params.mutationRate) {
        const last = offspring[offspring.length - 1];
        offspring[offspring.length - 1] = this.mutate(last);
      }
    }
    
    // Combine elite and offspring
    const nextGeneration = [...elite, ...offspring].slice(0, params.populationSize);
    
    // Update development stages
    nextGeneration.forEach(k => this.updateDevelopmentStage(k));
    
    // Calculate statistics
    const fitness = nextGeneration.map(k => this.calculateFitness(k));
    const avgFitness = fitness.reduce((a, b) => a + b, 0) / fitness.length;
    const bestFitness = Math.max(...fitness);
    const diversity = this.calculateDiversity(nextGeneration);
    
    return {
      generation: population.generation + 1,
      individuals: nextGeneration,
      populationSize: nextGeneration.length,
      averageFitness: avgFitness,
      bestFitness,
      diversity,
    };
  }

  /**
   * Run complete ontogenesis from seed kernels
   */
  static runOntogenesis(config: OntogenesisConfig): KernelPopulation[] {
    const generations: KernelPopulation[] = [];
    
    // Initialize population
    let population = this.initializePopulation(config);
    generations.push(population);
    
    // Evolve
    for (let gen = 0; gen < config.evolution.maxGenerations; gen++) {
      population = this.evolve(population, config.evolution);
      generations.push(population);
      
      // Check termination
      if (population.bestFitness >= config.evolution.fitnessThreshold) {
        console.log(`Target fitness reached at generation ${gen}`);
        break;
      }
    }
    
    return generations;
  }

  /**
   * Extract genome from kernel
   */
  private static extractGenome(kernel: GeneratedKernel): KernelGenome {
    const genes: KernelGene[] = [
      // Coefficient genes
      ...kernel.coefficients.map((coeff, i) => ({
        type: 'coefficient' as const,
        value: coeff,
        expressionStrength: 1.0,
        mutable: true,
      })),
      // Symmetry gene
      {
        type: 'symmetry' as const,
        value: kernel.domain.symmetry,
        expressionStrength: 0.8,
        mutable: false,
      },
      // Preservation genes
      ...kernel.domain.preserves.map(p => ({
        type: 'preservation' as const,
        value: p,
        expressionStrength: 0.9,
        mutable: false,
      })),
    ];

    return {
      id: this.generateId(),
      generation: 0,
      lineage: [],
      genes,
      fitness: kernel.grip.overall,
      age: 0,
    };
  }

  /**
   * Create initial ontogenetic state
   */
  private static createInitialState(): OntogeneticState {
    return {
      stage: 'embryonic',
      maturity: 0.0,
      reproductiveCapability: 0.0,
      mutations: [],
      developmentHistory: [],
    };
  }

  /**
   * Select differential operator based on kernel state
   */
  private static selectOperator(kernel: OntogeneticKernel): DifferentialOperator {
    const maturity = kernel.ontogeneticState.maturity;
    
    // Young kernels use chain rule (self-composition)
    if (maturity < 0.5) return 'chain';
    
    // Mature kernels use product rule (combination)
    if (maturity < 0.8) return 'product';
    
    // Older kernels use quotient rule (refinement)
    return 'quotient';
  }

  /**
   * Crossover two kernels
   */
  private static crossover(
    parent1: OntogeneticKernel,
    parent2: OntogeneticKernel
  ): OntogeneticKernel[] {
    // Single-point crossover on coefficients
    const point = Math.floor(Math.random() * parent1.coefficients.length);
    
    const offspring1Coeffs = [
      ...parent1.coefficients.slice(0, point),
      ...parent2.coefficients.slice(point),
    ];
    
    const offspring2Coeffs = [
      ...parent2.coefficients.slice(0, point),
      ...parent1.coefficients.slice(point),
    ];
    
    // Create offspring kernels
    const offspring1 = this.createOffspring(parent1, parent2, offspring1Coeffs);
    const offspring2 = this.createOffspring(parent1, parent2, offspring2Coeffs);
    
    return [offspring1, offspring2];
  }

  /**
   * Mutate a kernel
   */
  private static mutate(kernel: OntogeneticKernel): OntogeneticKernel {
    const mutated = { ...kernel };
    mutated.coefficients = [...kernel.coefficients];
    
    // Mutate random coefficient
    const idx = Math.floor(Math.random() * mutated.coefficients.length);
    const oldValue = mutated.coefficients[idx];
    const mutation = (Math.random() - 0.5) * 0.2; // ±10% mutation
    mutated.coefficients[idx] += mutation;
    
    // Record mutation
    const record: MutationRecord = {
      timestamp: new Date(),
      geneIndex: idx,
      oldValue,
      newValue: mutated.coefficients[idx],
      impact: mutation,
    };
    
    mutated.ontogeneticState = {
      ...kernel.ontogeneticState,
      mutations: [...kernel.ontogeneticState.mutations, record],
    };
    
    // Update grip after mutation
    const newGrip = this.recalculateGrip(mutated);
    mutated.grip = newGrip;
    mutated.bSeries.grip = newGrip;
    
    return mutated;
  }

  /**
   * Clone a kernel
   */
  private static clone(kernel: OntogeneticKernel): OntogeneticKernel {
    return {
      ...kernel,
      genome: {
        ...kernel.genome,
        id: this.generateId(),
        generation: kernel.genome.generation + 1,
        lineage: [kernel.genome.id],
        age: 0,
      },
      ontogeneticState: this.createInitialState(),
    };
  }

  /**
   * Create offspring from parents
   */
  private static createOffspring(
    parent1: OntogeneticKernel,
    parent2: OntogeneticKernel,
    coefficients: number[]
  ): OntogeneticKernel {
    const offspring: OntogeneticKernel = {
      ...parent1,
      coefficients,
      genome: {
        id: this.generateId(),
        generation: Math.max(parent1.genome.generation, parent2.genome.generation) + 1,
        lineage: [parent1.genome.id, parent2.genome.id],
        genes: this.mergeGenes(parent1.genome.genes, parent2.genome.genes),
        fitness: 0,
        age: 0,
      },
      ontogeneticState: this.createInitialState(),
    };
    
    // Recalculate grip
    offspring.grip = this.recalculateGrip(offspring);
    offspring.bSeries.grip = offspring.grip;
    
    return offspring;
  }

  /**
   * Merge genes from two parents
   */
  private static mergeGenes(genes1: KernelGene[], genes2: KernelGene[]): KernelGene[] {
    const merged: KernelGene[] = [];
    const maxLength = Math.max(genes1.length, genes2.length);
    
    for (let i = 0; i < maxLength; i++) {
      if (i < genes1.length && i < genes2.length) {
        // Average expression strength
        merged.push({
          ...genes1[i],
          expressionStrength: (genes1[i].expressionStrength + genes2[i].expressionStrength) / 2,
        });
      } else if (i < genes1.length) {
        merged.push(genes1[i]);
      } else {
        merged.push(genes2[i]);
      }
    }
    
    return merged;
  }

  /**
   * Recalculate grip after changes
   */
  private static recalculateGrip(kernel: OntogeneticKernel): GripMetric {
    // Simple grip recalculation based on coefficients
    const coeffSum = kernel.coefficients.reduce((a, b) => a + Math.abs(b), 0);
    const coeffVariance = this.variance(kernel.coefficients);
    
    const contact = Math.min(1.0, coeffSum / kernel.coefficients.length);
    const coverage = Math.min(1.0, 1.0 / (1.0 + coeffVariance));
    const efficiency = kernel.grip.efficiency * 0.95; // Slight degradation
    const stability = Math.min(1.0, 1.0 - coeffVariance / 10);
    const overall = (contact + coverage + efficiency + stability) / 4;
    
    return { contact, coverage, efficiency, stability, overall };
  }

  /**
   * Calculate variance
   */
  private static variance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Evaluate fitness of kernels
   */
  private static evaluateFitness(kernels: OntogeneticKernel[]): FitnessEvaluation[] {
    return kernels.map((kernel, rank) => {
      const scores = {
        grip: kernel.grip.overall,
        stability: kernel.grip.stability,
        efficiency: kernel.grip.efficiency,
        novelty: this.calculateNovelty(kernel, kernels),
        symmetry: this.evaluateSymmetry(kernel),
      };
      
      const overall = this.calculateFitness(kernel, scores);
      
      return { kernel, scores, overall, rank };
    });
  }

  /**
   * Calculate overall fitness
   */
  private static calculateFitness(
    kernel: OntogeneticKernel,
    scores?: FitnessEvaluation['scores']
  ): number {
    if (!scores) {
      scores = {
        grip: kernel.grip.overall,
        stability: kernel.grip.stability,
        efficiency: kernel.grip.efficiency,
        novelty: 0.5,
        symmetry: 0.5,
      };
    }
    
    // Weighted combination
    return (
      scores.grip * 0.4 +
      scores.stability * 0.2 +
      scores.efficiency * 0.2 +
      scores.novelty * 0.1 +
      scores.symmetry * 0.1
    );
  }

  /**
   * Calculate novelty - how different this kernel is from others
   */
  private static calculateNovelty(
    kernel: OntogeneticKernel,
    population: OntogeneticKernel[]
  ): number {
    const distances = population
      .filter(k => k.genome.id !== kernel.genome.id)
      .map(k => this.geneticDistance(kernel, k));
    
    if (distances.length === 0) return 1.0;
    
    const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
    return Math.min(1.0, avgDistance);
  }

  /**
   * Calculate genetic distance between kernels
   */
  private static geneticDistance(k1: OntogeneticKernel, k2: OntogeneticKernel): number {
    const coeffDiff = k1.coefficients.map((c, i) =>
      Math.abs(c - (k2.coefficients[i] || 0))
    );
    return coeffDiff.reduce((a, b) => a + b, 0) / coeffDiff.length;
  }

  /**
   * Evaluate symmetry preservation
   */
  private static evaluateSymmetry(kernel: OntogeneticKernel): number {
    // Check if symmetry is preserved in coefficients
    const symmetryGene = kernel.genome.genes.find(g => g.type === 'symmetry');
    if (!symmetryGene) return 0.5;
    
    return symmetryGene.expressionStrength;
  }

  /**
   * Tournament selection
   */
  private static tournamentSelect(
    evaluations: FitnessEvaluation[],
    tournamentSize: number
  ): FitnessEvaluation {
    const tournament = [];
    for (let i = 0; i < tournamentSize; i++) {
      const idx = Math.floor(Math.random() * evaluations.length);
      tournament.push(evaluations[idx]);
    }
    return tournament.reduce((best, curr) => curr.overall > best.overall ? curr : best);
  }

  /**
   * Update development stage based on maturity and age
   */
  private static updateDevelopmentStage(kernel: OntogeneticKernel): void {
    kernel.genome.age++;
    
    const maturity = kernel.ontogeneticState.maturity;
    const age = kernel.genome.age;
    
    let newStage: DevelopmentStage = kernel.ontogeneticState.stage;
    
    if (maturity >= 0.8 && age >= 5) {
      newStage = 'mature';
      kernel.ontogeneticState.reproductiveCapability = 1.0;
    } else if (maturity >= 0.5 && age >= 3) {
      newStage = 'juvenile';
      kernel.ontogeneticState.reproductiveCapability = 0.5;
    } else if (age >= 20) {
      newStage = 'senescent';
      kernel.ontogeneticState.reproductiveCapability = 0.2;
    }
    
    if (newStage !== kernel.ontogeneticState.stage) {
      kernel.ontogeneticState.stage = newStage;
      kernel.ontogeneticState.developmentHistory.push({
        timestamp: new Date(),
        type: 'stage-transition',
        description: `Transitioned to ${newStage}`,
        fitnessChange: 0,
      });
    }
  }

  /**
   * Calculate population diversity
   */
  private static calculateDiversity(population: OntogeneticKernel[]): number {
    if (population.length < 2) return 0;
    
    let totalDistance = 0;
    let comparisons = 0;
    
    for (let i = 0; i < population.length; i++) {
      for (let j = i + 1; j < population.length; j++) {
        totalDistance += this.geneticDistance(population[i], population[j]);
        comparisons++;
      }
    }
    
    return comparisons > 0 ? totalDistance / comparisons : 0;
  }

  /**
   * Initialize population from config
   */
  private static initializePopulation(config: OntogenesisConfig): KernelPopulation {
    const individuals: OntogeneticKernel[] = [];
    
    if (config.seedKernels && config.seedKernels.length > 0) {
      // Initialize from seed kernels
      config.seedKernels.forEach(seed => {
        individuals.push(this.initialize(seed, config));
      });
    }
    
    // Fill remaining slots with variations
    while (individuals.length < config.evolution.populationSize) {
      if (individuals.length > 0) {
        // Create variation of existing kernel
        const parent = individuals[Math.floor(Math.random() * individuals.length)];
        individuals.push(this.mutate(parent));
      } else {
        // Create random kernel
        const randomKernel = UniversalKernelGenerator.generateConsciousnessKernel(4);
        individuals.push(this.initialize(randomKernel, config));
      }
    }
    
    const fitness = individuals.map(k => this.calculateFitness(k));
    const avgFitness = fitness.reduce((a, b) => a + b, 0) / fitness.length;
    const bestFitness = Math.max(...fitness);
    const diversity = this.calculateDiversity(individuals);
    
    return {
      generation: 0,
      individuals,
      populationSize: individuals.length,
      averageFitness: avgFitness,
      bestFitness,
      diversity,
    };
  }

  /**
   * Generate unique ID
   */
  private static generateId(): string {
    return `kernel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Record operation in history
   */
  private static recordOperation(operation: OntogeneticOperation): void {
    this.operationHistory.push(operation);
    
    // Keep only last 1000 operations
    if (this.operationHistory.length > 1000) {
      this.operationHistory.shift();
    }
  }

  /**
   * Get operation history
   */
  static getOperationHistory(): OntogeneticOperation[] {
    return [...this.operationHistory];
  }

  /**
   * Get lineage tree
   */
  static getLineageTree(): Map<string, LineageNode> {
    return new Map(this.lineageTree);
  }

  /**
   * Clear history and lineage
   */
  static reset(): void {
    this.operationHistory = [];
    this.lineageTree.clear();
  }
}
