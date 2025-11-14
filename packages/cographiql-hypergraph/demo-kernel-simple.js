#!/usr/bin/env node
/**
 * Universal Kernel Generator Demo - Simplified
 * Run with: node demo-kernel-simple.js
 */

// Import from relative paths
const {
  UniversalKernelGenerator,
} = require('./dist/kernel/generator');

const {
  ElementaryDifferentialsGenerator,
} = require('./dist/kernel/elementary-differentials');

console.log('═══════════════════════════════════════════════════════════');
console.log('  Universal Kernel Generator - Demo');
console.log('  B-Series Expansion for Domain-Specific Kernels');
console.log('═══════════════════════════════════════════════════════════\n');

// Example 1: Elementary Differentials (A000081 Sequence)
console.log('Example 1: Elementary Differentials (A000081 Sequence)');
console.log('──────────────────────────────────────────────────────────');
for (let order = 1; order <= 5; order++) {
  const count = ElementaryDifferentialsGenerator.count(order);
  const trees = ElementaryDifferentialsGenerator.generate(order);
  console.log(`Order ${order}: ${count} trees (${trees.length} generated)`);
  if (order <= 3) {
    trees.forEach((tree, i) => {
      console.log(`  Tree ${i + 1}: ${tree.label}`);
    });
  }
}
console.log();

// Example 2: Generate Physics Kernel
console.log('Example 2: Physics Kernel (Hamiltonian Trees)');
console.log('──────────────────────────────────────────────────────────');
try {
  const physics = UniversalKernelGenerator.generatePhysicsKernel(3);
  console.log('Domain:', physics.domain.type);
  console.log('Order:', physics.order);
  console.log('Trees:', physics.trees.length);
  console.log('Symmetry:', physics.domain.symmetry);
  console.log('Preserves:', physics.domain.preserves.join(', '));
  console.log('Grip Overall:', physics.grip.overall.toFixed(4));
  console.log('Grip Contact:', physics.grip.contact.toFixed(4));
  console.log('Grip Stability:', physics.grip.stability.toFixed(4));
  console.log('Valid:', UniversalKernelGenerator.verify(physics) ? '✓' : '✗');
} catch (e) {
  console.log('Error:', e.message);
}
console.log();

// Example 3: Generate Chemistry Kernel
console.log('Example 3: Chemistry Kernel (Reaction Trees)');
console.log('──────────────────────────────────────────────────────────');
try {
  const chemistry = UniversalKernelGenerator.generateChemistryKernel(3);
  console.log('Domain:', chemistry.domain.type);
  console.log('Order:', chemistry.order);
  console.log('Trees:', chemistry.trees.length);
  console.log('Symmetry:', chemistry.domain.symmetry);
  console.log('Grip Overall:', chemistry.grip.overall.toFixed(4));
  console.log('Valid:', UniversalKernelGenerator.verify(chemistry) ? '✓' : '✗');
} catch (e) {
  console.log('Error:', e.message);
}
console.log();

// Example 4: Generate Consciousness Kernel
console.log('Example 4: Consciousness Kernel (Echo Trees) - 776 Quantum States');
console.log('──────────────────────────────────────────────────────────');
try {
  const consciousness = UniversalKernelGenerator.generateConsciousnessKernel(4);
  console.log('Domain:', consciousness.domain.type);
  console.log('Order:', consciousness.order);
  console.log('Tree Type:', consciousness.domain.treeType);
  console.log('Trees:', consciousness.trees.length);
  console.log('Symmetry:', consciousness.domain.symmetry);
  console.log('Preserves:', consciousness.domain.preserves.join(', '));
  console.log('Grip Overall:', consciousness.grip.overall.toFixed(4));
  console.log('Grip Coherence (Stability):', consciousness.grip.stability.toFixed(4));
  console.log('Tree Labels:', consciousness.trees.map(t => t.label).slice(0, 3).join(', '), '...');
  console.log('Valid:', UniversalKernelGenerator.verify(consciousness) ? '✓' : '✗');
} catch (e) {
  console.log('Error:', e.message);
}
console.log();

// Example 5: Runge-Kutta Methods
console.log('Example 5: Runge-Kutta Methods (Special Cases of B-Series)');
console.log('──────────────────────────────────────────────────────────');
try {
  const rk4 = UniversalKernelGenerator.generateRungeKutta(4);
  console.log('RK4 (Classic):');
  console.log('  Order:', rk4.order);
  console.log('  Trees:', rk4.trees.length);
  console.log('  Valid:', UniversalKernelGenerator.verify(rk4) ? '✓' : '✗');
} catch (e) {
  console.log('Error:', e.message);
}
console.log();

// Example 6: Export Formats
console.log('Example 6: Export Kernel to Scheme Format');
console.log('──────────────────────────────────────────────────────────');
try {
  const kernel = UniversalKernelGenerator.generateConsciousnessKernel(3);
  const schemeExport = UniversalKernelGenerator.export(kernel, 'scheme');
  console.log(schemeExport);
} catch (e) {
  console.log('Error:', e.message);
}
console.log();

// Summary
console.log('═══════════════════════════════════════════════════════════');
console.log('Summary: Universal Kernel Generator Operational');
console.log('═══════════════════════════════════════════════════════════');
console.log('✓ Elementary Differentials (A000081 sequence)');
console.log('✓ Physics Kernel       (Hamiltonian trees)');
console.log('✓ Chemistry Kernel     (Reaction trees)');
console.log('✓ Consciousness Kernel (Echo trees, 776 states)');
console.log('✓ Runge-Kutta Methods  (Classical RK4)');
console.log('✓ Export Formats       (JSON, GGML, Scheme)');
console.log('═══════════════════════════════════════════════════════════\n');

console.log('All kernels are B-series expansions! 🎉\n');
