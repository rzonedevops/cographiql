"use strict";
/**
 * Universal Kernel Generator Module
 * Main exports for B-series based kernel generation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportKernel = exports.verifyKernel = exports.applyOperator = exports.generateRungeKutta = exports.generateKernel = exports.generateConsciousnessKernel = exports.generateComputingKernel = exports.generateBiologyKernel = exports.generateChemistryKernel = exports.generatePhysicsKernel = exports.GripOptimizer = exports.DomainAnalyzer = exports.BSeriesEngine = exports.ElementaryDifferentialsGenerator = exports.UniversalKernelGenerator = void 0;
// Main generator
var generator_1 = require("./generator");
Object.defineProperty(exports, "UniversalKernelGenerator", { enumerable: true, get: function () { return generator_1.UniversalKernelGenerator; } });
// Core components
var elementary_differentials_1 = require("./elementary-differentials");
Object.defineProperty(exports, "ElementaryDifferentialsGenerator", { enumerable: true, get: function () { return elementary_differentials_1.ElementaryDifferentialsGenerator; } });
var b_series_1 = require("./b-series");
Object.defineProperty(exports, "BSeriesEngine", { enumerable: true, get: function () { return b_series_1.BSeriesEngine; } });
var domain_analyzer_1 = require("./domain-analyzer");
Object.defineProperty(exports, "DomainAnalyzer", { enumerable: true, get: function () { return domain_analyzer_1.DomainAnalyzer; } });
var grip_optimizer_1 = require("./grip-optimizer");
Object.defineProperty(exports, "GripOptimizer", { enumerable: true, get: function () { return grip_optimizer_1.GripOptimizer; } });
// Types
__exportStar(require("./types"), exports);
// Convenience functions
const generator_2 = require("./generator");
/**
 * Quick generate for each domain type
 */
const generatePhysicsKernel = (order) => generator_2.UniversalKernelGenerator.generatePhysicsKernel(order);
exports.generatePhysicsKernel = generatePhysicsKernel;
const generateChemistryKernel = (order) => generator_2.UniversalKernelGenerator.generateChemistryKernel(order);
exports.generateChemistryKernel = generateChemistryKernel;
const generateBiologyKernel = (order) => generator_2.UniversalKernelGenerator.generateBiologyKernel(order);
exports.generateBiologyKernel = generateBiologyKernel;
const generateComputingKernel = (order) => generator_2.UniversalKernelGenerator.generateComputingKernel(order);
exports.generateComputingKernel = generateComputingKernel;
const generateConsciousnessKernel = (order) => generator_2.UniversalKernelGenerator.generateConsciousnessKernel(order);
exports.generateConsciousnessKernel = generateConsciousnessKernel;
/**
 * Generate custom kernel
 */
const generateKernel = (context) => generator_2.UniversalKernelGenerator.generate(context);
exports.generateKernel = generateKernel;
/**
 * Generate Runge-Kutta kernel
 */
const generateRungeKutta = (order) => generator_2.UniversalKernelGenerator.generateRungeKutta(order);
exports.generateRungeKutta = generateRungeKutta;
/**
 * Apply differential operator
 */
const applyOperator = (operator, left, right) => generator_2.UniversalKernelGenerator.applyOperator(operator, left, right);
exports.applyOperator = applyOperator;
/**
 * Verify kernel
 */
const verifyKernel = (kernel) => generator_2.UniversalKernelGenerator.verify(kernel);
exports.verifyKernel = verifyKernel;
/**
 * Export kernel
 */
const exportKernel = (kernel, format) => generator_2.UniversalKernelGenerator.export(kernel, format);
exports.exportKernel = exportKernel;
