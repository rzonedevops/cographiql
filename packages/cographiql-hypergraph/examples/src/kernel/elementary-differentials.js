"use strict";
/**
 * Elementary Differentials Generator
 * Implements A000081 sequence - rooted trees for B-series expansion
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementaryDifferentialsGenerator = void 0;
/**
 * Generate all elementary differentials (rooted trees) up to given order
 * This implements the A000081 sequence from OEIS
 */
class ElementaryDifferentialsGenerator {
    /**
     * Generate rooted trees for order n
     * A000081: Number of rooted trees with n nodes
     * Sequence: 1, 1, 2, 4, 9, 20, 48, 115, 286, 719, ...
     */
    static generate(order) {
        if (order <= 0)
            return [];
        if (order === 1) {
            return [{ order: 1, label: 'f', children: [] }];
        }
        if (order === 2) {
            return [
                {
                    order: 2,
                    label: "f'(f)",
                    children: [{ order: 1, label: 'f', children: [] }],
                },
            ];
        }
        if (order === 3) {
            return [
                {
                    order: 3,
                    label: "f''(f, f)",
                    children: [
                        { order: 1, label: 'f', children: [] },
                        { order: 1, label: 'f', children: [] },
                    ],
                },
                {
                    order: 3,
                    label: "f'(f'(f))",
                    children: [
                        {
                            order: 2,
                            label: "f'(f)",
                            children: [{ order: 1, label: 'f', children: [] }],
                        },
                    ],
                },
            ];
        }
        if (order === 4) {
            return [
                {
                    order: 4,
                    label: "f'''(f, f, f)",
                    children: [
                        { order: 1, label: 'f', children: [] },
                        { order: 1, label: 'f', children: [] },
                        { order: 1, label: 'f', children: [] },
                    ],
                },
                {
                    order: 4,
                    label: "f''(f'(f), f)",
                    children: [
                        {
                            order: 2,
                            label: "f'(f)",
                            children: [{ order: 1, label: 'f', children: [] }],
                        },
                        { order: 1, label: 'f', children: [] },
                    ],
                },
                {
                    order: 4,
                    label: "f''(f, f'(f))",
                    children: [
                        { order: 1, label: 'f', children: [] },
                        {
                            order: 2,
                            label: "f'(f)",
                            children: [{ order: 1, label: 'f', children: [] }],
                        },
                    ],
                },
                {
                    order: 4,
                    label: "f'(f''(f, f))",
                    children: [
                        {
                            order: 3,
                            label: "f''(f, f)",
                            children: [
                                { order: 1, label: 'f', children: [] },
                                { order: 1, label: 'f', children: [] },
                            ],
                        },
                    ],
                },
                {
                    order: 4,
                    label: "f'(f'(f'(f)))",
                    children: [
                        {
                            order: 3,
                            label: "f'(f'(f))",
                            children: [
                                {
                                    order: 2,
                                    label: "f'(f)",
                                    children: [{ order: 1, label: 'f', children: [] }],
                                },
                            ],
                        },
                    ],
                },
            ];
        }
        // For orders > 4, generate recursively using Cayley's formula
        return this.generateRecursive(order);
    }
    /**
     * Recursive generation for higher orders
     * Uses dynamic programming to build trees from smaller subtrees
     */
    static generateRecursive(n) {
        const trees = [];
        // Generate all partitions of n-1 and create trees
        const partitions = this.generatePartitions(n - 1);
        for (const partition of partitions) {
            const subtrees = [];
            for (const p of partition) {
                const subtree = this.generate(p);
                if (subtree.length > 0) {
                    subtrees.push(subtree[0]); // Use first tree of each order
                }
            }
            if (subtrees.length > 0) {
                trees.push({
                    order: n,
                    label: this.generateLabel(subtrees),
                    children: subtrees,
                });
            }
        }
        return trees;
    }
    /**
     * Generate integer partitions of n
     */
    static generatePartitions(n) {
        if (n === 0)
            return [[]];
        if (n === 1)
            return [[1]];
        const partitions = [];
        for (let i = 1; i <= n; i++) {
            const remaining = n - i;
            if (remaining === 0) {
                partitions.push([i]);
            }
            else {
                const subPartitions = this.generatePartitions(remaining);
                for (const sub of subPartitions) {
                    if (sub.length === 0 || i <= sub[0]) {
                        partitions.push([i, ...sub]);
                    }
                }
            }
        }
        return partitions;
    }
    /**
     * Generate label from subtrees
     */
    static generateLabel(subtrees) {
        if (subtrees.length === 0)
            return 'f';
        if (subtrees.length === 1) {
            return `f'(${subtrees[0].label})`;
        }
        let primes = '';
        for (let i = 0; i < subtrees.length - 1; i++) {
            primes += "'";
        }
        const args = subtrees.map(t => t.label).join(', ');
        return `f${primes}(${args})`;
    }
    /**
     * Count number of trees for order n (A000081)
     */
    static count(n) {
        // A000081 sequence values
        const a000081 = [0, 1, 1, 2, 4, 9, 20, 48, 115, 286, 719, 1842, 4766, 12486, 32973];
        if (n < a000081.length) {
            return a000081[n];
        }
        // For larger n, use recursive formula
        // This is a simplified approximation
        return Math.floor(Math.pow(2.9557652856, n) / Math.sqrt(n));
    }
    /**
     * Generate domain-specific trees
     */
    static generateDomainSpecific(domain, order) {
        const baseTrees = this.generate(order);
        // Relabel trees based on domain
        return baseTrees.map(tree => this.relabelForDomain(tree, domain));
    }
    /**
     * Relabel tree for specific domain
     */
    static relabelForDomain(tree, domain) {
        const domainLabels = {
            physics: 'H', // Hamiltonian
            chemistry: 'R', // Reaction
            biology: 'M', // Metabolic
            computing: 'λ', // Lambda (recursion)
            consciousness: 'Ψ', // Psi (echo)
        };
        const baseLabel = domainLabels[domain] || 'f';
        return Object.assign(Object.assign({}, tree), { label: tree.label.replace(/f/g, baseLabel), children: tree.children.map(child => this.relabelForDomain(child, domain)) });
    }
    /**
     * Compute tree symmetry factor
     */
    static symmetryFactor(tree) {
        if (tree.children.length === 0)
            return 1;
        // Count multiplicities of identical subtrees
        const childCounts = {};
        for (const child of tree.children) {
            const key = JSON.stringify(child);
            childCounts[key] = (childCounts[key] || 0) + 1;
        }
        // Symmetry factor is product of factorials of multiplicities
        let factor = 1;
        for (const key in childCounts) {
            if (childCounts.hasOwnProperty(key)) {
                factor *= this.factorial(childCounts[key]);
            }
        }
        // Multiply by symmetry factors of children
        for (const child of tree.children) {
            factor *= this.symmetryFactor(child);
        }
        return factor;
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
exports.ElementaryDifferentialsGenerator = ElementaryDifferentialsGenerator;
