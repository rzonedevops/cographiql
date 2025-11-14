"use strict";
/**
 * Domain Analyzer
 * Analyzes context and extracts domain-specific differential structure
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainAnalyzer = void 0;
/**
 * Domain context analyzer
 */
class DomainAnalyzer {
    /**
     * Analyze domain from context
     */
    static analyzeDomain(context) {
        const topology = this.analyzeTopology(context);
        const symmetries = this.analyzeSymmetries(context);
        const flow = this.analyzeFlow(context);
        const complexity = this.computeComplexity(topology, symmetries, flow);
        return {
            topology,
            symmetries,
            flow,
            complexity,
        };
    }
    /**
     * Analyze topological structure
     */
    static analyzeTopology(context) {
        const domain = context.domain;
        // Determine manifold dimension based on domain type
        const manifoldDimension = this.getDomainDimension(domain.type);
        // Compute curvature based on constraints
        const curvature = this.computeCurvature(context);
        // Identify singularities from initial conditions
        const singularities = this.findSingularities(context);
        return {
            manifoldDimension,
            curvature,
            singularities,
        };
    }
    /**
     * Get domain dimension
     */
    static getDomainDimension(type) {
        const dimensions = {
            physics: 4, // Space-time
            chemistry: 3, // 3D molecular space
            biology: 2, // Network topology
            computing: 1, // Sequential execution
            consciousness: 776, // Quantum state space
        };
        return dimensions[type] || 3;
    }
    /**
     * Compute curvature
     */
    static computeCurvature(context) {
        // Curvature based on optimization goal
        const goalCurvature = {
            speed: 0.1, // Low curvature for fast computation
            accuracy: 0.5, // Moderate curvature for precision
            stability: 0.9, // High curvature for robust solutions
            balanced: 0.5, // Balanced approach
        };
        return goalCurvature[context.optimizationGoal] || 0.5;
    }
    /**
     * Find singularities
     */
    static findSingularities(context) {
        const singularities = [];
        // Check constraints for singular points
        for (const constraint of context.constraints) {
            if (constraint.type === 'singularity' || constraint.type === 'discontinuity') {
                singularities.push({
                    position: Array.isArray(constraint.value) ? constraint.value : [constraint.value],
                    type: constraint.type,
                });
            }
        }
        return singularities;
    }
    /**
     * Analyze symmetries
     */
    static analyzeSymmetries(context) {
        const domain = context.domain;
        // Domain-specific symmetries
        const domainSymmetries = this.getDomainSymmetries(domain);
        return domainSymmetries;
    }
    /**
     * Get domain-specific symmetries
     */
    static getDomainSymmetries(domain) {
        const symmetryMap = {
            physics: {
                lieGroups: ['SO(3)', 'SU(2)', 'Lorentz'],
                invariants: ['energy', 'momentum', 'angular-momentum'],
                conservedQuantities: ['energy', 'momentum', 'charge'],
            },
            chemistry: {
                lieGroups: ['C_n', 'D_n', 'T_d'],
                invariants: ['mass', 'charge', 'equilibrium'],
                conservedQuantities: ['mass', 'charge', 'energy'],
            },
            biology: {
                lieGroups: ['homeostasis', 'feedback'],
                invariants: ['fitness', 'population', 'energy-flow'],
                conservedQuantities: ['biomass', 'energy', 'information'],
            },
            computing: {
                lieGroups: ['Church-Rosser', 'confluence'],
                invariants: ['termination', 'correctness'],
                conservedQuantities: ['information', 'complexity'],
            },
            consciousness: {
                lieGroups: ['self-reference', 'recursion'],
                invariants: ['identity', 'coherence', 'awareness'],
                conservedQuantities: ['information', 'coherence', 'gestalt'],
            },
        };
        return symmetryMap[domain.type] || {
            lieGroups: [],
            invariants: [],
            conservedQuantities: [],
        };
    }
    /**
     * Analyze flow structure
     */
    static analyzeFlow(context) {
        const dim = this.getDomainDimension(context.domain.type);
        // Generate simple vector field
        const vectorField = [];
        for (let i = 0; i < Math.min(dim, 10); i++) {
            const row = [];
            for (let j = 0; j < Math.min(dim, 10); j++) {
                row.push(i === j ? 1 : 0);
            }
            vectorField.push(row);
        }
        // Generate integral curves
        const integralCurves = [
            [[0], [1], [2], [3]],
        ];
        // Identify fixed points
        const fixedPoints = [
            { position: [0], stability: 'stable' },
        ];
        return {
            vectorField,
            integralCurves,
            fixedPoints,
        };
    }
    /**
     * Compute complexity
     */
    static computeComplexity(topology, symmetries, flow) {
        const topologyComplexity = topology.manifoldDimension * (1 + topology.curvature);
        const symmetryComplexity = symmetries.lieGroups.length + symmetries.invariants.length;
        const flowComplexity = flow.fixedPoints.length;
        return Math.round(topologyComplexity + symmetryComplexity + flowComplexity);
    }
    /**
     * Validate domain compatibility
     */
    static validateDomain(domain) {
        // Check if domain type is valid
        const validTypes = ['physics', 'chemistry', 'biology', 'computing', 'consciousness'];
        let isValidType = false;
        for (let i = 0; i < validTypes.length; i++) {
            if (validTypes[i] === domain.type) {
                isValidType = true;
                break;
            }
        }
        if (!isValidType) {
            return false;
        }
        // Check if order is reasonable
        if (domain.order < 1 || domain.order > 10) {
            return false;
        }
        // Check if tree type matches domain
        const validTreeTypes = {
            physics: ['hamiltonian'],
            chemistry: ['reaction'],
            biology: ['metabolic'],
            computing: ['recursion'],
            consciousness: ['echo'],
        };
        const allowedTypes = validTreeTypes[domain.type] || [];
        let isValidTreeType = false;
        for (let i = 0; i < allowedTypes.length; i++) {
            if (allowedTypes[i] === domain.treeType) {
                isValidTreeType = true;
                break;
            }
        }
        if (!isValidTreeType) {
            return false;
        }
        return true;
    }
    /**
     * Extract domain features for ML/GNN processing
     */
    static extractFeatures(analysis) {
        return [
            analysis.topology.manifoldDimension,
            analysis.topology.curvature,
            analysis.topology.singularities.length,
            analysis.symmetries.lieGroups.length,
            analysis.symmetries.invariants.length,
            analysis.symmetries.conservedQuantities.length,
            analysis.flow.fixedPoints.length,
            analysis.complexity,
        ];
    }
}
exports.DomainAnalyzer = DomainAnalyzer;
