/**
 * Grip Optimizer
 * Optimizes kernel coefficients for maximum domain grip
 */

import { BSeriesExpansion, DomainSpecification, GripMetric } from './types';

/**
 * Grip optimization engine
 */
export class GripOptimizer {
  /**
   * Optimize grip for a B-series expansion
   */
  static optimize(
    expansion: BSeriesExpansion,
    maxIterations: number = 100,
    tolerance: number = 1e-6
  ): { coefficients: number[]; grip: GripMetric; iterations: number } {
    let currentCoeffs = expansion.terms.map(t => t.coefficient);
    let currentGrip = expansion.grip;
    let iteration = 0;
    
    while (iteration < maxIterations) {
      // Compute gradient
      const gradient = this.computeGradient(currentCoeffs, expansion.domain);
      
      // Check convergence
      const gradientNorm = this.vectorNorm(gradient);
      if (gradientNorm < tolerance) {
        break;
      }
      
      // Gradient ascent step
      const learningRate = this.adaptiveLearningRate(iteration, maxIterations);
      currentCoeffs = this.gradientAscentStep(currentCoeffs, gradient, learningRate);
      
      // Update grip metric
      currentGrip = this.measureGrip(currentCoeffs, expansion.domain);
      
      iteration++;
    }
    
    return {
      coefficients: currentCoeffs,
      grip: currentGrip,
      iterations: iteration,
    };
  }

  /**
   * Compute gradient of grip with respect to coefficients
   */
  private static computeGradient(coeffs: number[], domain: DomainSpecification): number[] {
    const gradient: number[] = [];
    const epsilon = 1e-8;
    
    for (let i = 0; i < coeffs.length; i++) {
      // Numerical gradient
      const coeffsPlus = [...coeffs];
      coeffsPlus[i] += epsilon;
      const gripPlus = this.measureGrip(coeffsPlus, domain);
      
      const coeffsMinus = [...coeffs];
      coeffsMinus[i] -= epsilon;
      const gripMinus = this.measureGrip(coeffsMinus, domain);
      
      gradient.push((gripPlus.overall - gripMinus.overall) / (2 * epsilon));
    }
    
    return gradient;
  }

  /**
   * Measure grip for coefficients
   */
  static measureGrip(coeffs: number[], domain: DomainSpecification): GripMetric {
    // Contact: How well kernel touches domain
    const contact = this.computeContact(coeffs, domain);
    
    // Coverage: Completeness of span
    const coverage = this.computeCoverage(coeffs);
    
    // Efficiency: Computational cost
    const efficiency = this.computeEfficiency(coeffs);
    
    // Stability: Numerical properties
    const stability = this.computeStability(coeffs);
    
    // Overall metric (weighted combination)
    const overall = (
      0.3 * contact +
      0.3 * coverage +
      0.2 * efficiency +
      0.2 * stability
    );
    
    return {
      contact,
      coverage,
      efficiency,
      stability,
      overall,
    };
  }

  /**
   * Compute contact metric
   */
  private static computeContact(coeffs: number[], domain: DomainSpecification): number {
    // Contact measures alignment with domain structure
    const domainWeights = this.getDomainWeights(domain);
    
    let dotProduct = 0;
    for (let i = 0; i < Math.min(coeffs.length, domainWeights.length); i++) {
      dotProduct += coeffs[i] * domainWeights[i];
    }
    
    const coeffNorm = this.vectorNorm(coeffs);
    const weightNorm = this.vectorNorm(domainWeights);
    
    if (coeffNorm === 0 || weightNorm === 0) return 0;
    
    // Cosine similarity
    return Math.abs(dotProduct / (coeffNorm * weightNorm));
  }

  /**
   * Get domain-specific weight expectations
   */
  private static getDomainWeights(domain: DomainSpecification): number[] {
    // Different domains have different expected coefficient patterns
    const order = domain.order;
    const weights: number[] = [];
    
    switch (domain.type) {
      case 'physics':
        // Physics: energy-preserving methods favor symmetric patterns
        for (let i = 0; i < order; i++) {
          weights.push(Math.pow(-1, i) / (i + 1));
        }
        break;
      
      case 'chemistry':
        // Chemistry: reaction rates decay exponentially
        for (let i = 0; i < order; i++) {
          weights.push(Math.exp(-i / 2));
        }
        break;
      
      case 'biology':
        // Biology: homeostatic feedback patterns
        for (let i = 0; i < order; i++) {
          weights.push(1 / (1 + i * i));
        }
        break;
      
      case 'computing':
        // Computing: recursive structures
        for (let i = 0; i < order; i++) {
          weights.push(1 / Math.pow(2, i));
        }
        break;
      
      case 'consciousness':
        // Consciousness: self-referential patterns
        for (let i = 0; i < order; i++) {
          weights.push(Math.sin(i * Math.PI / order));
        }
        break;
      
      default:
        for (let i = 0; i < order; i++) {
          weights.push(1 / (i + 1));
        }
    }
    
    return weights;
  }

  /**
   * Compute coverage metric
   */
  private static computeCoverage(coeffs: number[]): number {
    // Coverage measures how many coefficients are non-zero
    const nonZero = coeffs.filter(c => Math.abs(c) > 1e-10).length;
    return nonZero / coeffs.length;
  }

  /**
   * Compute efficiency metric
   */
  private static computeEfficiency(coeffs: number[]): number {
    // Efficiency favors sparse representations
    const sparsity = coeffs.filter(c => Math.abs(c) < 1e-10).length / coeffs.length;
    const magnitude = this.vectorNorm(coeffs);
    
    // Balance sparsity with magnitude
    return (0.5 * sparsity + 0.5 / (1 + magnitude));
  }

  /**
   * Compute stability metric
   */
  private static computeStability(coeffs: number[]): number {
    // Stability measures boundedness and smoothness
    const maxCoeff = Math.max(...coeffs.map(Math.abs));
    const variance = this.computeVariance(coeffs);
    
    // Penalize large coefficients and high variance
    const boundedness = 1 / (1 + maxCoeff);
    const smoothness = 1 / (1 + variance);
    
    return (boundedness + smoothness) / 2;
  }

  /**
   * Gradient ascent step
   */
  private static gradientAscentStep(
    coeffs: number[],
    gradient: number[],
    learningRate: number
  ): number[] {
    return coeffs.map((c, i) => c + learningRate * gradient[i]);
  }

  /**
   * Adaptive learning rate
   */
  private static adaptiveLearningRate(iteration: number, maxIterations: number): number {
    // Decay learning rate over iterations
    const initialRate = 0.1;
    const decayRate = 0.95;
    return initialRate * Math.pow(decayRate, iteration / 10);
  }

  /**
   * Vector norm
   */
  private static vectorNorm(v: number[]): number {
    return Math.sqrt(v.reduce((sum, x) => sum + x * x, 0));
  }

  /**
   * Compute variance
   */
  private static computeVariance(v: number[]): number {
    const mean = v.reduce((sum, x) => sum + x, 0) / v.length;
    return v.reduce((sum, x) => sum + (x - mean) ** 2, 0) / v.length;
  }

  /**
   * Check if grip is sufficient
   */
  static isSufficientGrip(grip: GripMetric, threshold: number = 0.8): boolean {
    return grip.overall >= threshold;
  }

  /**
   * Conjugate gradient optimization (more advanced)
   */
  static conjugateGradientOptimize(
    expansion: BSeriesExpansion,
    maxIterations: number = 100
  ): { coefficients: number[]; grip: GripMetric; iterations: number } {
    let coeffs = expansion.terms.map(t => t.coefficient);
    let gradient = this.computeGradient(coeffs, expansion.domain);
    let direction = [...gradient];
    let iteration = 0;
    
    while (iteration < maxIterations) {
      // Line search for optimal step size
      const stepSize = this.lineSearch(coeffs, direction, expansion.domain);
      
      // Update coefficients
      const newCoeffs = coeffs.map((c, i) => c + stepSize * direction[i]);
      
      // New gradient
      const newGradient = this.computeGradient(newCoeffs, expansion.domain);
      
      // Check convergence
      if (this.vectorNorm(newGradient) < 1e-6) {
        coeffs = newCoeffs;
        break;
      }
      
      // Conjugate direction (Polak-Ribière)
      const beta = this.vectorDot(newGradient, this.vectorSubtract(newGradient, gradient)) /
                   this.vectorDot(gradient, gradient);
      
      direction = this.vectorAdd(newGradient, this.vectorScale(direction, Math.max(0, beta)));
      
      coeffs = newCoeffs;
      gradient = newGradient;
      iteration++;
    }
    
    return {
      coefficients: coeffs,
      grip: this.measureGrip(coeffs, expansion.domain),
      iterations: iteration,
    };
  }

  /**
   * Line search for optimal step size
   */
  private static lineSearch(
    coeffs: number[],
    direction: number[],
    domain: DomainSpecification
  ): number {
    let stepSize = 1.0;
    const initialGrip = this.measureGrip(coeffs, domain).overall;
    
    for (let i = 0; i < 10; i++) {
      const testCoeffs = coeffs.map((c, j) => c + stepSize * direction[j]);
      const testGrip = this.measureGrip(testCoeffs, domain).overall;
      
      if (testGrip > initialGrip) {
        return stepSize;
      }
      
      stepSize *= 0.5;
    }
    
    return stepSize;
  }

  /**
   * Vector operations
   */
  private static vectorDot(a: number[], b: number[]): number {
    return a.reduce((sum, x, i) => sum + x * b[i], 0);
  }

  private static vectorAdd(a: number[], b: number[]): number[] {
    return a.map((x, i) => x + b[i]);
  }

  private static vectorSubtract(a: number[], b: number[]): number[] {
    return a.map((x, i) => x - b[i]);
  }

  private static vectorScale(v: number[], s: number): number[] {
    return v.map(x => x * s);
  }
}
