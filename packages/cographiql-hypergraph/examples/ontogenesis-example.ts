/**
 * Ontogenesis Example
 * Demonstrates self-generating, evolving kernels
 */

import {
  UniversalKernelGenerator,
  OntogenesisEngine,
  initializeOntogeneticKernel,
  selfGenerate,
  selfOptimize,
  selfReproduce,
  runOntogenesis,
} from '../src/kernel';

import type {
  OntogenesisConfig,
  KernelPopulation,
} from '../src/kernel/ontogenesis-types';

console.log('=== Ontogenesis Example ===\n');

// Example 1: Self-Generation
console.log('1. Self-Generation: Kernel generates itself through recursion\n');

const parentKernel = UniversalKernelGenerator.generateConsciousnessKernel(4);
console.log('Parent Kernel:');
console.log(`  - Order: ${parentKernel.order}`);
console.log(`  - Grip: ${parentKernel.grip.overall.toFixed(4)}`);
console.log(`  - Symmetry: ${parentKernel.domain.symmetry}`);

const ontogeneticParent = initializeOntogeneticKernel(parentKernel);
console.log(`  - Genome ID: ${ontogeneticParent.genome.id}`);
console.log(`  - Generation: ${ontogeneticParent.genome.generation}`);
console.log(`  - Stage: ${ontogeneticParent.ontogeneticState.stage}`);

const offspring = selfGenerate(ontogeneticParent);
console.log('\nOffspring (Self-Generated):');
console.log(`  - Genome ID: ${offspring.genome.id}`);
console.log(`  - Generation: ${offspring.genome.generation}`);
console.log(`  - Parent: ${offspring.genome.lineage[0]}`);
console.log(`  - Grip: ${offspring.grip.overall.toFixed(4)}`);

// Example 2: Self-Optimization
console.log('\n2. Self-Optimization: Kernel optimizes itself iteratively\n');

const unoptimized = UniversalKernelGenerator.generateConsciousnessKernel(4);
const ontoUnoptimized = initializeOntogeneticKernel(unoptimized);

console.log('Before Optimization:');
console.log(`  - Grip: ${ontoUnoptimized.grip.overall.toFixed(4)}`);
console.log(`  - Maturity: ${ontoUnoptimized.ontogeneticState.maturity.toFixed(4)}`);
console.log(`  - Optimization iterations: ${ontoUnoptimized.metadata.optimizationIterations}`);

const optimized = selfOptimize(ontoUnoptimized, 10);

console.log('\nAfter 10 Self-Optimization Iterations:');
console.log(`  - Grip: ${optimized.grip.overall.toFixed(4)}`);
console.log(`  - Maturity: ${optimized.ontogeneticState.maturity.toFixed(4)}`);
console.log(`  - Optimization iterations: ${optimized.metadata.optimizationIterations}`);
console.log(`  - Development events: ${optimized.ontogeneticState.developmentHistory.length}`);

// Example 3: Self-Reproduction
console.log('\n3. Self-Reproduction: Two kernels combine to create offspring\n');

const parent1Kernel = UniversalKernelGenerator.generatePhysicsKernel(4);
const parent2Kernel = UniversalKernelGenerator.generateChemistryKernel(4);

const parent1 = initializeOntogeneticKernel(parent1Kernel);
const parent2 = initializeOntogeneticKernel(parent2Kernel);

console.log('Parent 1 (Physics):');
console.log(`  - Domain: ${parent1.domain.type}`);
console.log(`  - Symmetry: ${parent1.domain.symmetry}`);
console.log(`  - Grip: ${parent1.grip.overall.toFixed(4)}`);

console.log('\nParent 2 (Chemistry):');
console.log(`  - Domain: ${parent2.domain.type}`);
console.log(`  - Symmetry: ${parent2.domain.symmetry}`);
console.log(`  - Grip: ${parent2.grip.overall.toFixed(4)}`);

const reproductionResult = selfReproduce(parent1, parent2, 'crossover');

console.log(`\nReproduction Method: ${reproductionResult.method}`);
console.log(`Offspring Count: ${reproductionResult.offspring.length}`);

reproductionResult.offspring.forEach((child, idx) => {
  console.log(`\nOffspring ${idx + 1}:`);
  console.log(`  - Genome ID: ${child.genome.id}`);
  console.log(`  - Generation: ${child.genome.generation}`);
  console.log(`  - Parents: ${child.genome.lineage.join(', ')}`);
  console.log(`  - Grip: ${child.grip.overall.toFixed(4)}`);
  console.log(`  - Genes: ${child.genome.genes.length}`);
});

// Example 4: Complete Ontogenesis Evolution
console.log('\n4. Complete Ontogenesis: Population evolution over generations\n');

const seedKernels = [
  UniversalKernelGenerator.generateConsciousnessKernel(4),
  UniversalKernelGenerator.generatePhysicsKernel(4),
  UniversalKernelGenerator.generateBiologyKernel(4),
];

const config: OntogenesisConfig = {
  evolution: {
    populationSize: 10,
    mutationRate: 0.1,
    crossoverRate: 0.7,
    elitismRate: 0.2,
    maxGenerations: 5,
    fitnessThreshold: 0.85,
    diversityPressure: 0.1,
  },
  seedKernels,
};

console.log('Evolution Configuration:');
console.log(`  - Population Size: ${config.evolution.populationSize}`);
console.log(`  - Mutation Rate: ${config.evolution.mutationRate}`);
console.log(`  - Crossover Rate: ${config.evolution.crossoverRate}`);
console.log(`  - Max Generations: ${config.evolution.maxGenerations}`);
console.log(`  - Seed Kernels: ${config.seedKernels?.length || 0}`);

const generations = runOntogenesis(config);

console.log(`\nEvolution Results: ${generations.length} generations\n`);

generations.forEach((gen: KernelPopulation, idx: number) => {
  console.log(`Generation ${gen.generation}:`);
  console.log(`  - Population: ${gen.populationSize}`);
  console.log(`  - Average Fitness: ${gen.averageFitness.toFixed(4)}`);
  console.log(`  - Best Fitness: ${gen.bestFitness.toFixed(4)}`);
  console.log(`  - Diversity: ${gen.diversity.toFixed(4)}`);
  
  if (idx > 0) {
    const prevGen = generations[idx - 1];
    const fitnessImprovement = gen.bestFitness - prevGen.bestFitness;
    console.log(`  - Fitness Improvement: ${fitnessImprovement > 0 ? '+' : ''}${fitnessImprovement.toFixed(4)}`);
  }
});

// Show best kernel from final generation
const finalGeneration = generations[generations.length - 1];
const bestKernel = finalGeneration.individuals.reduce((best, current) =>
  current.grip.overall > best.grip.overall ? current : best
);

console.log('\nBest Kernel from Final Generation:');
console.log(`  - Genome ID: ${bestKernel.genome.id}`);
console.log(`  - Generation: ${bestKernel.genome.generation}`);
console.log(`  - Age: ${bestKernel.genome.age}`);
console.log(`  - Stage: ${bestKernel.ontogeneticState.stage}`);
console.log(`  - Maturity: ${bestKernel.ontogeneticState.maturity.toFixed(4)}`);
console.log(`  - Fitness: ${bestKernel.genome.fitness.toFixed(4)}`);
console.log(`  - Grip: ${bestKernel.grip.overall.toFixed(4)}`);
console.log(`  - Mutations: ${bestKernel.ontogeneticState.mutations.length}`);
console.log(`  - Development Events: ${bestKernel.ontogeneticState.developmentHistory.length}`);
console.log(`  - Lineage Depth: ${bestKernel.genome.lineage.length}`);

// Show developmental history
if (bestKernel.ontogeneticState.developmentHistory.length > 0) {
  console.log('\nDevelopmental History (last 5 events):');
  const recentEvents = bestKernel.ontogeneticState.developmentHistory.slice(-5);
  recentEvents.forEach((event, idx) => {
    console.log(`  ${idx + 1}. ${event.type}: ${event.description}`);
    console.log(`     Fitness change: ${event.fitnessChange > 0 ? '+' : ''}${event.fitnessChange.toFixed(4)}`);
  });
}

// Example 5: Multi-Generation Lineage
console.log('\n5. Multi-Generation Lineage: Tracking ancestry\n');

const ancestor = initializeOntogeneticKernel(
  UniversalKernelGenerator.generateConsciousnessKernel(4)
);

let current = ancestor;
const lineage = [current];

for (let i = 0; i < 5; i++) {
  current = selfGenerate(current);
  lineage.push(current);
}

console.log('Lineage Tree (6 generations):');
lineage.forEach((kernel, gen) => {
  const indent = '  '.repeat(gen);
  console.log(`${indent}Gen ${gen}: ${kernel.genome.id.slice(0, 20)}...`);
  console.log(`${indent}  Grip: ${kernel.grip.overall.toFixed(4)}`);
  console.log(`${indent}  Stage: ${kernel.ontogeneticState.stage}`);
});

// Example 6: Operation History
console.log('\n6. Operation History: Tracking all ontogenetic operations\n');

const history = OntogenesisEngine.getOperationHistory();
console.log(`Total Operations Recorded: ${history.length}`);

const operationCounts = history.reduce((counts, op) => {
  counts[op.type] = (counts[op.type] || 0) + 1;
  return counts;
}, {} as Record<string, number>);

console.log('\nOperation Breakdown:');
Object.entries(operationCounts).forEach(([type, count]) => {
  console.log(`  - ${type}: ${count}`);
});

console.log('\n=== Ontogenesis Complete ===\n');

console.log('Key Insights:');
console.log('1. Kernels can self-generate through recursive differential operators');
console.log('2. Self-optimization increases grip and maturity over iterations');
console.log('3. Reproduction combines genetic information from two parents');
console.log('4. Evolution improves fitness across generations');
console.log('5. Lineage tracking preserves complete ancestry information');
console.log('6. Development stages reflect kernel maturity and capability\n');

console.log('Ontogenesis demonstrates that kernels are living mathematical structures');
console.log('that can generate, optimize, and evolve themselves through B-series expansion.');
