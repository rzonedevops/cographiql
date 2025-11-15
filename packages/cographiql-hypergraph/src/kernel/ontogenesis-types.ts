/**
 * Ontogenesis Types
 * Types for self-generating, evolving kernels
 */

import { GeneratedKernel, DifferentialOperator, GripMetric } from './types';

/**
 * Kernel genome - the "DNA" of a kernel
 */
export interface KernelGenome {
  id: string;
  generation: number;
  lineage: string[]; // Parent IDs
  genes: KernelGene[];
  fitness: number;
  age: number;
}

/**
 * Individual gene in kernel genome
 */
export interface KernelGene {
  type: 'operator' | 'coefficient' | 'symmetry' | 'preservation';
  value: any;
  expressionStrength: number; // 0-1, how strongly this gene is expressed
  mutable: boolean;
}

/**
 * Kernel with ontogenetic capabilities
 */
export interface OntogeneticKernel extends GeneratedKernel {
  genome: KernelGenome;
  ontogeneticState: OntogeneticState;
}

/**
 * State of kernel's ontogenetic development
 */
export interface OntogeneticState {
  stage: DevelopmentStage;
  maturity: number; // 0-1
  reproductiveCapability: number; // 0-1
  mutations: MutationRecord[];
  developmentHistory: DevelopmentEvent[];
}

/**
 * Stages of kernel development
 */
export type DevelopmentStage =
  | 'embryonic'    // Just generated, basic structure
  | 'juvenile'     // Developing, optimizing
  | 'mature'       // Fully developed, capable of reproduction
  | 'senescent';   // Declining, ready for replacement

/**
 * Record of a mutation event
 */
export interface MutationRecord {
  timestamp: Date;
  geneIndex: number;
  oldValue: any;
  newValue: any;
  impact: number; // -1 to 1, negative is harmful
}

/**
 * Development event in kernel's life
 */
export interface DevelopmentEvent {
  timestamp: Date;
  type: 'mutation' | 'crossover' | 'optimization' | 'stage-transition';
  description: string;
  fitnessChange: number;
}

/**
 * Population of kernels
 */
export interface KernelPopulation {
  generation: number;
  individuals: OntogeneticKernel[];
  populationSize: number;
  averageFitness: number;
  bestFitness: number;
  diversity: number;
}

/**
 * Evolution parameters
 */
export interface EvolutionParameters {
  populationSize: number;
  mutationRate: number;
  crossoverRate: number;
  elitismRate: number;
  maxGenerations: number;
  fitnessThreshold: number;
  diversityPressure: number;
}

/**
 * Fitness evaluation result
 */
export interface FitnessEvaluation {
  kernel: OntogeneticKernel;
  scores: {
    grip: number;
    stability: number;
    efficiency: number;
    novelty: number;
    symmetry: number;
  };
  overall: number;
  rank: number;
}

/**
 * Reproduction result
 */
export interface ReproductionResult {
  parents: [OntogeneticKernel, OntogeneticKernel];
  offspring: OntogeneticKernel[];
  method: 'crossover' | 'mutation' | 'cloning';
}

/**
 * Ontogenesis configuration
 */
export interface OntogenesisConfig {
  evolution: EvolutionParameters;
  seedKernels?: GeneratedKernel[];
  fitnessFunction?: (kernel: OntogeneticKernel) => number;
  developmentSchedule?: DevelopmentSchedule;
}

/**
 * Schedule for kernel development stages
 */
export interface DevelopmentSchedule {
  embryonicDuration: number;  // Generations
  juvenileDuration: number;   // Generations
  matureDuration: number;     // Generations
  maturityThreshold: number;  // Fitness threshold for maturity
}

/**
 * Lineage tree node
 */
export interface LineageNode {
  kernel: OntogeneticKernel;
  generation: number;
  parents: LineageNode[];
  children: LineageNode[];
  isAlive: boolean;
}

/**
 * Ontogenetic operation
 */
export interface OntogeneticOperation {
  type: 'self-generate' | 'self-optimize' | 'self-reproduce' | 'self-mutate';
  input: OntogeneticKernel;
  output: OntogeneticKernel | OntogeneticKernel[];
  timestamp: Date;
}
