"use strict";
/**
 * B-Series Expansion Engine
 * Generates B-series coefficients for domain-specific kernels
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BSeriesEngine = void 0;
const elementary_differentials_1 = require("./elementary-differentials");
/**
 * B-Series expansion generator
 */
class BSeriesEngine {
    /**
     * Generate B-series expansion for a domain
     */
    static generateExpansion(domain, gripMetric) {
        const trees = elementary_differentials_1.ElementaryDifferentialsGenerator.generate(domain.order);
        const tableau = this.getButcherTableau(domain);
        const terms = trees.map((tree, index) => {
            const coefficient = this.computeCoefficient(tree, tableau);
            const grip = this.computeGrip(tree, gripMetric);
            return {
                tree,
                coefficient,
                grip,
                order: tree.order,
            };
        });
        return {
            domain,
            terms,
            convergenceOrder: domain.order,
            grip: gripMetric,
        };
    }
    /**
     * Get Butcher tableau for domain
     */
    static getButcherTableau(domain) {
        switch (domain.order) {
            case 1:
                // Euler method
                return {
                    order: 1,
                    stages: 1,
                    a: [[0]],
                    b: [1],
                    c: [0],
                };
            case 2:
                // Midpoint method
                return {
                    order: 2,
                    stages: 2,
                    a: [
                        [0, 0],
                        [1 / 2, 0],
                    ],
                    b: [0, 1],
                    c: [0, 1 / 2],
                };
            case 3:
                // Kutta's third-order method
                return {
                    order: 3,
                    stages: 3,
                    a: [
                        [0, 0, 0],
                        [1 / 2, 0, 0],
                        [-1, 2, 0],
                    ],
                    b: [1 / 6, 2 / 3, 1 / 6],
                    c: [0, 1 / 2, 1],
                };
            case 4:
            default:
                // Classic RK4
                return {
                    order: 4,
                    stages: 4,
                    a: [
                        [0, 0, 0, 0],
                        [1 / 2, 0, 0, 0],
                        [0, 1 / 2, 0, 0],
                        [0, 0, 1, 0],
                    ],
                    b: [1 / 6, 1 / 3, 1 / 3, 1 / 6],
                    c: [0, 1 / 2, 1 / 2, 1],
                };
        }
    }
    /**
     * Compute B-series coefficient for a rooted tree
     */
    static computeCoefficient(tree, tableau) {
        const order = tree.order;
        const symmetry = elementary_differentials_1.ElementaryDifferentialsGenerator.symmetryFactor(tree);
        // Base coefficient from tableau
        let coefficient = 0;
        for (let i = 0; i < tableau.b.length; i++) {
            coefficient += tableau.b[i] * Math.pow(tableau.c[i], order - 1);
        }
        // Adjust for tree structure and symmetry
        coefficient /= (symmetry * order);
        return coefficient;
    }
    /**
     * Compute grip for a tree
     */
    static computeGrip(tree, gripMetric) {
        // Grip depends on tree structure and domain fitness
        const depthFactor = this.computeTreeDepth(tree) / tree.order;
        const balanceFactor = this.computeTreeBalance(tree);
        return (gripMetric.contact * depthFactor +
            gripMetric.coverage * balanceFactor +
            gripMetric.efficiency * (1 / tree.order) +
            gripMetric.stability * 0.8) / 4;
    }
    /**
     * Compute tree depth
     */
    static computeTreeDepth(tree) {
        if (tree.children.length === 0)
            return 1;
        return 1 + Math.max(...tree.children.map(c => this.computeTreeDepth(c)));
    }
    /**
     * Compute tree balance
     */
    static computeTreeBalance(tree) {
        if (tree.children.length === 0)
            return 1;
        const depths = tree.children.map(c => this.computeTreeDepth(c));
        const maxDepth = Math.max(...depths);
        const minDepth = Math.min(...depths);
        return minDepth / maxDepth;
    }
    /**
     * Generate Runge-Kutta specific B-series
     */
    static generateRungeKutta(order) {
        const domain = {
            type: 'computing',
            order,
            treeType: 'recursion',
            symmetry: 'time-reversible',
            preserves: ['energy', 'momentum'],
        };
        const gripMetric = {
            contact: 1.0,
            coverage: 1.0,
            efficiency: 0.9,
            stability: 1.0,
            overall: 0.975,
        };
        return this.generateExpansion(domain, gripMetric);
    }
    /**
     * Compose two B-series using chain rule
     */
    static chainCompose(f, g) {
        // (f∘g)' = f'(g(x)) · g'(x)
        const maxOrder = Math.max(f.convergenceOrder, g.convergenceOrder);
        const trees = elementary_differentials_1.ElementaryDifferentialsGenerator.generate(maxOrder);
        const terms = trees.map(tree => {
            // Chain rule: multiply coefficients appropriately
            const fCoeff = this.findCoefficient(tree, f.terms);
            const gCoeff = this.findCoefficient(tree, g.terms);
            const coefficient = fCoeff * gCoeff;
            const grip = (f.grip.overall + g.grip.overall) / 2;
            return {
                tree,
                coefficient,
                grip,
                order: tree.order,
            };
        });
        return {
            domain: f.domain,
            terms,
            convergenceOrder: maxOrder,
            grip: {
                contact: (f.grip.contact + g.grip.contact) / 2,
                coverage: (f.grip.coverage + g.grip.coverage) / 2,
                efficiency: f.grip.efficiency * g.grip.efficiency,
                stability: Math.min(f.grip.stability, g.grip.stability),
                overall: (f.grip.overall + g.grip.overall) / 2,
            },
        };
    }
    /**
     * Compose two B-series using product rule
     */
    static productCompose(f, g) {
        // (f·g)' = f'·g + f·g'
        const maxOrder = Math.max(f.convergenceOrder, g.convergenceOrder);
        const trees = elementary_differentials_1.ElementaryDifferentialsGenerator.generate(maxOrder);
        const terms = trees.map(tree => {
            const fCoeff = this.findCoefficient(tree, f.terms);
            const gCoeff = this.findCoefficient(tree, g.terms);
            const coefficient = fCoeff + gCoeff; // Product rule addition
            const grip = Math.max(f.grip.overall, g.grip.overall);
            return {
                tree,
                coefficient,
                grip,
                order: tree.order,
            };
        });
        return {
            domain: f.domain,
            terms,
            convergenceOrder: maxOrder,
            grip: {
                contact: Math.max(f.grip.contact, g.grip.contact),
                coverage: (f.grip.coverage + g.grip.coverage) / 2,
                efficiency: (f.grip.efficiency + g.grip.efficiency) / 2,
                stability: Math.min(f.grip.stability, g.grip.stability),
                overall: (f.grip.overall + g.grip.overall) / 2,
            },
        };
    }
    /**
     * Find coefficient for a tree in terms list
     */
    static findCoefficient(tree, terms) {
        for (let i = 0; i < terms.length; i++) {
            if (terms[i].tree.label === tree.label) {
                return terms[i].coefficient;
            }
        }
        return 0;
    }
    /**
     * Verify B-series satisfies order conditions
     */
    static verifyOrderConditions(expansion) {
        // Check that sum of coefficients equals expected values
        for (let order = 1; order <= expansion.convergenceOrder; order++) {
            const termsOfOrder = expansion.terms.filter(t => t.order === order);
            const sum = termsOfOrder.reduce((acc, t) => acc + t.coefficient, 0);
            // For order p, sum should equal 1/p!
            const expected = 1 / this.factorial(order);
            const tolerance = 1e-10;
            if (Math.abs(sum - expected) > tolerance) {
                return false;
            }
        }
        return true;
    }
    /**
     * Factorial helper
     */
    static factorial(n) {
        if (n <= 1)
            return 1;
        return n * this.factorial(n - 1);
    }
}
exports.BSeriesEngine = BSeriesEngine;
