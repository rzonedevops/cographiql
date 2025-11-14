/**
 * Universal Kernel Generator Module
 * Main exports for B-series based kernel generation
 */

// Main generator
export { UniversalKernelGenerator } from './generator';

// Core components
export { ElementaryDifferentialsGenerator } from './elementary-differentials';
export { BSeriesEngine } from './b-series';
export { DomainAnalyzer } from './domain-analyzer';
export { GripOptimizer } from './grip-optimizer';

// Types
export * from './types';

// Convenience functions
import { UniversalKernelGenerator } from './generator';
import {
  DomainSpecification,
  GeneratedKernel,
  GenerationContext,
  DifferentialOperator,
} from './types';

/**
 * Quick generate for each domain type
 */
export const generatePhysicsKernel = (order?: number) =>
  UniversalKernelGenerator.generatePhysicsKernel(order);

export const generateChemistryKernel = (order?: number) =>
  UniversalKernelGenerator.generateChemistryKernel(order);

export const generateBiologyKernel = (order?: number) =>
  UniversalKernelGenerator.generateBiologyKernel(order);

export const generateComputingKernel = (order?: number) =>
  UniversalKernelGenerator.generateComputingKernel(order);

export const generateConsciousnessKernel = (order?: number) =>
  UniversalKernelGenerator.generateConsciousnessKernel(order);

/**
 * Generate custom kernel
 */
export const generateKernel = (context: GenerationContext): GeneratedKernel =>
  UniversalKernelGenerator.generate(context);

/**
 * Generate Runge-Kutta kernel
 */
export const generateRungeKutta = (order: 1 | 2 | 3 | 4): GeneratedKernel =>
  UniversalKernelGenerator.generateRungeKutta(order);

/**
 * Apply differential operator
 */
export const applyOperator = (
  operator: DifferentialOperator,
  left: GeneratedKernel,
  right: GeneratedKernel
) => UniversalKernelGenerator.applyOperator(operator, left, right);

/**
 * Verify kernel
 */
export const verifyKernel = (kernel: GeneratedKernel): boolean =>
  UniversalKernelGenerator.verify(kernel);

/**
 * Export kernel
 */
export const exportKernel = (
  kernel: GeneratedKernel,
  format: 'json' | 'ggml' | 'scheme'
): string => UniversalKernelGenerator.export(kernel, format);
