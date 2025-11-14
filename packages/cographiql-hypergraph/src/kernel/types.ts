/**
 * Universal Kernel Generator Types
 * Core type definitions for B-series expansion and differential operators
 */

/**
 * Rooted tree representation for elementary differentials (A000081)
 */
export interface RootedTree {
  order: number;
  label: string;
  children: RootedTree[];
  weight?: number;
}

/**
 * Elementary differential - fundamental building block
 */
export interface ElementaryDifferential {
  tree: RootedTree;
  coefficient: number;
  grip: number;
  order: number;
}

/**
 * Butcher tableau for Runge-Kutta methods
 */
export interface ButcherTableau {
  order: number;
  stages: number;
  a: number[][]; // Runge-Kutta matrix
  b: number[];   // Weights
  c: number[];   // Nodes
}

/**
 * Domain specification for kernel generation
 */
export type DomainType = 'physics' | 'chemistry' | 'biology' | 'computing' | 'consciousness';

export interface DomainSpecification {
  type: DomainType;
  order: number;
  treeType: 'hamiltonian' | 'reaction' | 'metabolic' | 'recursion' | 'echo';
  symmetry: string;
  preserves: string[];
}

/**
 * Context analysis for domain topology
 */
export interface TopologyAnalysis {
  manifoldDimension: number;
  curvature: number;
  singularities: Array<{ position: number[]; type: string }>;
}

export interface SymmetryAnalysis {
  lieGroups: string[];
  invariants: string[];
  conservedQuantities: string[];
}

export interface FlowAnalysis {
  vectorField: number[][];
  integralCurves: number[][][];
  fixedPoints: Array<{ position: number[]; stability: string }>;
}

export interface DomainAnalysis {
  topology: TopologyAnalysis;
  symmetries: SymmetryAnalysis;
  flow: FlowAnalysis;
  complexity: number;
}

/**
 * Grip optimization metrics
 */
export interface GripMetric {
  contact: number;    // How well kernel touches domain
  coverage: number;   // Completeness of span
  efficiency: number; // Computational cost
  stability: number;  // Numerical properties
  overall: number;    // Combined metric
}

/**
 * B-Series expansion result
 */
export interface BSeriesExpansion {
  domain: DomainSpecification;
  terms: ElementaryDifferential[];
  convergenceOrder: number;
  grip: GripMetric;
}

/**
 * Generated kernel output
 */
export interface GeneratedKernel {
  domain: DomainSpecification;
  order: number;
  trees: RootedTree[];
  coefficients: number[];
  grip: GripMetric;
  bSeries: BSeriesExpansion;
  metadata: {
    generatedAt: Date;
    version: string;
    optimizationIterations: number;
  };
}

/**
 * Differential operator types
 */
export type DifferentialOperator = 'chain' | 'product' | 'quotient';

export interface OperatorApplication {
  operator: DifferentialOperator;
  leftOperand: GeneratedKernel | number;
  rightOperand: GeneratedKernel | number;
  result: GeneratedKernel;
}

/**
 * Context for kernel generation
 */
export interface GenerationContext {
  domain: DomainSpecification;
  initialConditions: Record<string, any>;
  constraints: Array<{ type: string; value: any }>;
  optimizationGoal: 'speed' | 'accuracy' | 'stability' | 'balanced';
}
