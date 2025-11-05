/**
 * HyperGraphQL Schema Generator
 * Dynamically generates GraphQL schema from AtomSpace structure
 */

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLFieldConfig,
} from 'graphql';
import { AtomType, TruthValue, AttentionValue, Atom } from '../types/cognitive-types';

/**
 * GraphQL Type for TruthValue
 */
const TruthValueType = new GraphQLObjectType({
  name: 'TruthValue',
  description: 'Probabilistic truth value with strength and confidence',
  fields: {
    strength: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'Truth strength in range [0, 1]',
    },
    confidence: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'Confidence in the truth value [0, 1]',
    },
    count: {
      type: GraphQLInt,
      description: 'Evidence count supporting this truth value',
    },
  },
});

/**
 * GraphQL Type for AttentionValue
 */
const AttentionValueType = new GraphQLObjectType({
  name: 'AttentionValue',
  description: 'ECAN attention allocation values',
  fields: {
    sti: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'Short-term importance',
    },
    lti: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'Long-term importance',
    },
    vlti: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'Very long-term importance',
    },
  },
});

/**
 * GraphQL Enum for AtomType
 */
const AtomTypeEnum = new GraphQLEnumType({
  name: 'AtomType',
  description: 'Types of atoms in the AtomSpace',
  values: Object.keys(AtomType).reduce((acc, key) => {
    acc[key] = { value: AtomType[key as keyof typeof AtomType] };
    return acc;
  }, {} as Record<string, { value: string }>),
});

/**
 * GraphQL Type for Atom (with recursive structure)
 */
const AtomType_GraphQL: GraphQLObjectType = new GraphQLObjectType({
  name: 'Atom',
  description: 'Hypergraph atom (node or link)',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Unique atom identifier',
    },
    type: {
      type: new GraphQLNonNull(AtomTypeEnum),
      description: 'Atom type',
    },
    name: {
      type: GraphQLString,
      description: 'Atom name (for nodes)',
    },
    truthValue: {
      type: new GraphQLNonNull(TruthValueType),
      description: 'Probabilistic truth value',
    },
    attentionValue: {
      type: new GraphQLNonNull(AttentionValueType),
      description: 'ECAN attention values',
    },
    incoming: {
      type: new GraphQLList(AtomType_GraphQL),
      description: 'Incoming links (atoms that reference this atom)',
      args: {
        depth: {
          type: GraphQLInt,
          defaultValue: 1,
          description: 'Traversal depth',
        },
      },
    },
    outgoing: {
      type: new GraphQLList(AtomType_GraphQL),
      description: 'Outgoing links (atoms referenced by this atom)',
      args: {
        depth: {
          type: GraphQLInt,
          defaultValue: 1,
          description: 'Traversal depth',
        },
      },
    },
    metadata: {
      type: GraphQLString,
      description: 'Additional metadata as JSON string',
    },
  }),
});

/**
 * GraphQL Type for Cognitive Synergy
 */
const CognitiveSynergyType = new GraphQLObjectType({
  name: 'CognitiveSynergy',
  description: 'Real-time cognitive synergy metrics',
  fields: {
    attention: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'ECAN total stimulus',
    },
    reasoning: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'PLN inference strength',
    },
    memory: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'AtomSpace connectivity metric',
    },
    perception: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'Sensory integration level',
    },
    action: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'Motor output coherence',
    },
    overall: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'Combined synergy score',
    },
    timestamp: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'Unix timestamp',
    },
  },
});

/**
 * GraphQL Type for Tensor Field
 */
const TensorFieldType = new GraphQLObjectType({
  name: 'TensorField',
  description: 'Topological tensor field representation',
  fields: {
    shape: {
      type: new GraphQLList(GraphQLInt),
      description: 'Tensor dimensions',
    },
    totalParams: {
      type: GraphQLInt,
      description: 'Total number of parameters',
    },
    component: {
      type: GraphQLString,
      description: 'Component name (gnn, das, esn, membrane, ecan)',
    },
    data: {
      type: new GraphQLList(GraphQLFloat),
      description: 'Tensor data (flattened)',
    },
  },
});

/**
 * GraphQL Type for Pattern Match Result
 */
const PatternMatchResultType = new GraphQLObjectType({
  name: 'PatternMatchResult',
  description: 'Result of hypergraph pattern matching',
  fields: {
    matches: {
      type: new GraphQLList(AtomType_GraphQL),
      description: 'Matched atoms',
    },
    count: {
      type: GraphQLInt,
      description: 'Number of matches',
    },
    executionTime: {
      type: GraphQLFloat,
      description: 'Execution time in milliseconds',
    },
  },
});

/**
 * Input type for pattern matching
 */
const PatternMatchInputType = new GraphQLInputObjectType({
  name: 'PatternMatchInput',
  description: 'Input for hypergraph pattern matching',
  fields: {
    pattern: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Scheme pattern expression',
    },
    maxResults: {
      type: GraphQLInt,
      defaultValue: 100,
      description: 'Maximum number of results',
    },
    timeout: {
      type: GraphQLInt,
      defaultValue: 5000,
      description: 'Timeout in milliseconds',
    },
    distributed: {
      type: GraphQLBoolean,
      defaultValue: false,
      description: 'Execute on distributed CogServer network',
    },
  },
});

/**
 * Input type for atom queries
 */
const AtomQueryInputType = new GraphQLInputObjectType({
  name: 'AtomQueryInput',
  description: 'Input for querying atoms',
  fields: {
    id: {
      type: GraphQLString,
      description: 'Atom ID',
    },
    type: {
      type: AtomTypeEnum,
      description: 'Atom type filter',
    },
    name: {
      type: GraphQLString,
      description: 'Atom name filter',
    },
    truthValueMin: {
      type: GraphQLFloat,
      description: 'Minimum truth value strength',
    },
    attentionValueMin: {
      type: GraphQLFloat,
      description: 'Minimum attention value (STI)',
    },
  },
});

/**
 * Generate HyperGraphQL Schema
 */
export function generateHyperGraphQLSchema(): GraphQLSchema {
  const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root query type for HyperGraphQL',
    fields: {
      // Atom queries
      atom: {
        type: AtomType_GraphQL,
        description: 'Query single atom by ID',
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Atom ID',
          },
        },
        resolve: async (_, { id }, context) => {
          return context.atomSpaceBridge.getAtom(id);
        },
      },

      atoms: {
        type: new GraphQLList(AtomType_GraphQL),
        description: 'Query multiple atoms with filters',
        args: {
          query: {
            type: AtomQueryInputType,
            description: 'Query filters',
          },
          limit: {
            type: GraphQLInt,
            defaultValue: 100,
            description: 'Maximum number of results',
          },
        },
        resolve: async (_, { query, limit }, context) => {
          return context.atomSpaceBridge.queryAtoms(query, limit);
        },
      },

      // Pattern matching
      pattern: {
        type: PatternMatchResultType,
        description: 'Execute hypergraph pattern matching',
        args: {
          input: {
            type: new GraphQLNonNull(PatternMatchInputType),
            description: 'Pattern match input',
          },
        },
        resolve: async (_, { input }, context) => {
          return context.atomSpaceBridge.patternMatch(input);
        },
      },

      // Cognitive synergy
      cognitiveSynergy: {
        type: CognitiveSynergyType,
        description: 'Get current cognitive synergy metrics',
        resolve: async (_, __, context) => {
          return context.synergyMonitor.getCurrentSynergy();
        },
      },

      // Tensor field queries
      tensorField: {
        type: TensorFieldType,
        description: 'Query tensor field by component',
        args: {
          component: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Component name (gnn, das, esn, membrane, ecan)',
          },
        },
        resolve: async (_, { component }, context) => {
          return context.tensorFramework.getTensorField(component);
        },
      },

      // Self-awareness query
      selfAwareness: {
        type: new GraphQLObjectType({
          name: 'SelfAwareness',
          fields: {
            selfConcept: { type: AtomType_GraphQL },
            coherence: { type: GraphQLFloat },
            membraneDepth: { type: GraphQLInt },
            introspectionLevel: { type: GraphQLFloat },
          },
        }),
        description: 'Query self-awareness state',
        resolve: async (_, __, context) => {
          return context.cognitiveMirror.getSelfAwareness();
        },
      },
    },
  });

  const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root mutation type for HyperGraphQL',
    fields: {
      createAtom: {
        type: AtomType_GraphQL,
        description: 'Create new atom in AtomSpace',
        args: {
          type: {
            type: new GraphQLNonNull(AtomTypeEnum),
            description: 'Atom type',
          },
          name: {
            type: GraphQLString,
            description: 'Atom name (for nodes)',
          },
          outgoing: {
            type: new GraphQLList(GraphQLString),
            description: 'IDs of outgoing atoms (for links)',
          },
        },
        resolve: async (_, args, context) => {
          return context.atomSpaceBridge.createAtom(args);
        },
      },

      updateTruthValue: {
        type: AtomType_GraphQL,
        description: 'Update atom truth value',
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Atom ID',
          },
          strength: {
            type: new GraphQLNonNull(GraphQLFloat),
            description: 'Truth strength',
          },
          confidence: {
            type: new GraphQLNonNull(GraphQLFloat),
            description: 'Confidence',
          },
        },
        resolve: async (_, { id, strength, confidence }, context) => {
          return context.atomSpaceBridge.updateTruthValue(id, { strength, confidence });
        },
      },

      allocateAttention: {
        type: AtomType_GraphQL,
        description: 'Allocate ECAN attention to atom',
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Atom ID',
          },
          sti: {
            type: GraphQLFloat,
            description: 'Short-term importance',
          },
          lti: {
            type: GraphQLFloat,
            description: 'Long-term importance',
          },
        },
        resolve: async (_, { id, sti, lti }, context) => {
          return context.atomSpaceBridge.allocateAttention(id, { sti, lti });
        },
      },
    },
  });

  const SubscriptionType = new GraphQLObjectType({
    name: 'Subscription',
    description: 'Root subscription type for real-time updates',
    fields: {
      attentionUpdates: {
        type: AtomType_GraphQL,
        description: 'Subscribe to attention value changes',
        args: {
          minSTI: {
            type: GraphQLFloat,
            defaultValue: 0,
            description: 'Minimum STI threshold',
          },
        },
        subscribe: async (_, { minSTI }, context) => {
          return context.atomSpaceBridge.subscribeToAttention(minSTI);
        },
      },

      synergyUpdates: {
        type: CognitiveSynergyType,
        description: 'Subscribe to cognitive synergy updates',
        subscribe: async (_, __, context) => {
          return context.synergyMonitor.subscribe();
        },
      },

      atomCreated: {
        type: AtomType_GraphQL,
        description: 'Subscribe to atom creation events',
        subscribe: async (_, __, context) => {
          return context.atomSpaceBridge.subscribeToCreation();
        },
      },
    },
  });

  return new GraphQLSchema({
    query: QueryType,
    mutation: MutationType,
    subscription: SubscriptionType,
  });
}

/**
 * Schema generator class with dynamic schema updates
 */
export class HyperGraphQLSchemaGenerator {
  private schema: GraphQLSchema;
  private version: string;

  constructor() {
    this.schema = generateHyperGraphQLSchema();
    this.version = '1.0.0';
  }

  /**
   * Get current schema
   */
  getSchema(): GraphQLSchema {
    return this.schema;
  }

  /**
   * Get schema version
   */
  getVersion(): string {
    return this.version;
  }

  /**
   * Regenerate schema (for dynamic updates)
   */
  regenerate(): void {
    this.schema = generateHyperGraphQLSchema();
    this.version = `${this.version}.${Date.now()}`;
  }

  /**
   * Export schema as SDL (Schema Definition Language)
   */
  exportSDL(): string {
    // This would use graphql's printSchema function
    // For now, return a placeholder
    return '# HyperGraphQL Schema\n# Version: ' + this.version;
  }
}
