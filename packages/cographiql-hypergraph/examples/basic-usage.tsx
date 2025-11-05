/**
 * CoGraphiQL Basic Usage Example
 * Demonstrates how to use the HyperGraphQL interface with topological tensor framework
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  CogGraphiQL,
  createDefaultConfig,
  initializeCoGraphiQL,
  METADATA,
} from '../src/index';

/**
 * Example 1: Basic CoGraphiQL Usage
 */
function BasicExample() {
  const config = createDefaultConfig();
  
  // Override default configuration
  config.cogServer.host = 'localhost';
  config.cogServer.port = 17001;
  config.enableSelfAwareness = true;
  config.enableVisualization = true;

  return (
    <div style={{ height: '100vh' }}>
      <CogGraphiQL
        config={config}
        onSynergyUpdate={(synergy) => {
          console.log('Cognitive Synergy Update:');
          console.log('  Overall:', synergy.overall.toFixed(3));
          console.log('  Attention:', synergy.attention.toFixed(3));
          console.log('  Reasoning:', synergy.reasoning.toFixed(3));
          console.log('  Memory:', synergy.memory.toFixed(3));
        }}
        onStateChange={(state) => {
          console.log('Execution State Change:');
          console.log('  Operation:', state.operation);
          console.log('  Coherence Before:', state.before.coherence.toFixed(3));
          console.log('  Coherence After:', state.after.coherence.toFixed(3));
        }}
      />
    </div>
  );
}

/**
 * Example 2: Programmatic Usage
 */
async function programmaticExample() {
  console.log('=== CoGraphiQL Initialization ===');
  console.log('Total Quantum States:', METADATA.totalStates);
  console.log('Prime Factorization:', METADATA.primeFactorization);
  console.log('Frame Problem Solved:', METADATA.frameProblemSolved);
  console.log('');

  // Initialize system
  const config = createDefaultConfig();
  const { bridge, framework, mirror, schema } = await initializeCoGraphiQL(config);

  console.log('=== System Initialized ===');
  console.log('Bridge connected:', bridge.isConnected());
  console.log('Framework valid:', framework.verify());
  console.log('');

  // Query atoms
  console.log('=== Querying Atoms ===');
  const atoms = await bridge.queryAtoms(
    { attentionValueMin: 10 },
    10
  );
  console.log(`Found ${atoms.length} atoms with high attention`);
  atoms.forEach((atom, idx) => {
    console.log(`  ${idx + 1}. ${atom.name || atom.id} (${atom.type})`);
    console.log(`     Truth: ${atom.truthValue.strength.toFixed(3)}`);
    console.log(`     STI: ${atom.attentionValue.sti.toFixed(1)}`);
  });
  console.log('');

  // Pattern matching
  console.log('=== Pattern Matching ===');
  const patternResult = await bridge.patternMatch({
    pattern: {
      pattern: '(InheritanceLink (Variable "$X") (ConceptNode "sentient"))',
      variables: ['$X'],
      maxResults: 5,
    },
    distributed: false,
  });
  console.log(`Found ${patternResult.count} matches`);
  console.log(`Execution time: ${patternResult.executionTime}ms`);
  console.log('');

  // Tensor framework
  console.log('=== Tensor Framework ===');
  const allFields = framework.getAllTensorFields();
  Object.entries(allFields).forEach(([name, field]) => {
    console.log(`${name.toUpperCase()}:`);
    console.log(`  Shape: ${field.shape.dimensions.join(' × ')}`);
    console.log(`  Params: ${field.shape.totalParams}`);
    console.log(`  Prime Factors: ${Object.entries(field.shape.primeFactorization)
      .map(([p, e]) => `${p}^${e}`)
      .join(' × ')}`);
  });
  console.log('');

  // Self-awareness
  console.log('=== Self-Awareness ===');
  const selfAwareness = mirror.getSelfAwareness();
  console.log('Self-Concept:', selfAwareness.selfConcept.name);
  console.log('Coherence:', selfAwareness.coherence.toFixed(3));
  console.log('Membrane Depth:', selfAwareness.membraneDepth);
  console.log('Introspection Level:', selfAwareness.introspectionLevel);
  console.log('');

  // Monitored execution
  console.log('=== Monitored Execution ===');
  const { result, state } = await mirror.monitorExecution(
    'example-query',
    async () => {
      const stats = await bridge.getStatistics();
      return stats;
    }
  );
  console.log('Result:', result);
  console.log('Cognitive Delta:');
  console.log('  Mean delta:', 
    Array.from(state.delta.data).reduce((a, b) => a + b, 0) / state.delta.data.length
  );
  console.log('');

  // Recursive introspection
  console.log('=== Recursive Introspection ===');
  const mirrors = await mirror.recursiveIntrospection(3);
  mirrors.forEach((m, idx) => {
    console.log(`Level ${idx + 1}:`);
    console.log(`  Coherence: ${m.coherence.toFixed(3)}`);
    console.log(`  Introspection: ${m.introspectionLevel}`);
  });
  console.log('');

  // Export to GGML
  console.log('=== GGML Export ===');
  const ggml = framework.exportToGGML();
  console.log('Exported to GGML format:');
  console.log(ggml.substring(0, 200) + '...');
  console.log('');

  // Cleanup
  bridge.disconnect();
  console.log('=== Cleanup Complete ===');
}

/**
 * Example 3: Custom GraphQL Queries
 */
const exampleQueries = {
  // Self-awareness query
  selfAwareness: `
    query SelfAwareness {
      atom(id: "self-concept") {
        id
        type
        name
        truthValue {
          strength
          confidence
        }
        attentionValue {
          sti
          lti
          vlti
        }
      }
      
      cognitiveSynergy {
        attention
        reasoning
        memory
        overall
        timestamp
      }
      
      selfAwareness {
        coherence
        membraneDepth
        introspectionLevel
      }
    }
  `,

  // Pattern matching query
  patternMatch: `
    query PatternMatch($pattern: String!, $maxResults: Int) {
      pattern(
        input: {
          pattern: $pattern
          maxResults: $maxResults
          distributed: false
        }
      ) {
        matches {
          id
          type
          name
          truthValue {
            strength
            confidence
          }
        }
        count
        executionTime
      }
    }
  `,

  // Tensor field query
  tensorFields: `
    query TensorFields {
      gnn: tensorField(component: "gnn") {
        shape
        totalParams
        component
      }
      das: tensorField(component: "das") {
        shape
        totalParams
        component
      }
      esn: tensorField(component: "esn") {
        shape
        totalParams
        component
      }
      membrane: tensorField(component: "membrane") {
        shape
        totalParams
        component
      }
      ecan: tensorField(component: "ecan") {
        shape
        totalParams
        component
      }
    }
  `,

  // Subscription for attention updates
  attentionUpdates: `
    subscription AttentionUpdates($minSTI: Float) {
      attentionUpdates(minSTI: $minSTI) {
        id
        name
        type
        attentionValue {
          sti
          lti
          vlti
        }
        truthValue {
          strength
          confidence
        }
      }
    }
  `,

  // Mutation to create atom
  createAtom: `
    mutation CreateAtom($type: AtomType!, $name: String, $outgoing: [String!]) {
      createAtom(type: $type, name: $name, outgoing: $outgoing) {
        id
        type
        name
        truthValue {
          strength
          confidence
        }
      }
    }
  `,

  // Mutation to update truth value
  updateTruthValue: `
    mutation UpdateTruthValue($id: String!, $strength: Float!, $confidence: Float!) {
      updateTruthValue(id: $id, strength: $strength, confidence: $confidence) {
        id
        truthValue {
          strength
          confidence
        }
      }
    }
  `,
};

/**
 * Example 4: Performance Monitoring
 */
async function performanceExample() {
  const config = createDefaultConfig();
  const { bridge, framework } = await initializeCoGraphiQL(config);

  console.log('=== Performance Benchmarks ===');

  // Query throughput
  const queryStart = Date.now();
  const queryPromises = [];
  for (let i = 0; i < 100; i++) {
    queryPromises.push(bridge.queryAtoms({}, 10));
  }
  await Promise.all(queryPromises);
  const queryDuration = Date.now() - queryStart;
  const queryThroughput = 100 / (queryDuration / 1000);
  console.log(`Query Throughput: ${queryThroughput.toFixed(2)} queries/sec`);

  // Pattern match latency
  const patternStart = Date.now();
  await bridge.patternMatch({
    pattern: {
      pattern: '(InheritanceLink (Variable "$X") (ConceptNode "test"))',
      variables: ['$X'],
      maxResults: 100,
    },
    distributed: false,
  });
  const patternLatency = Date.now() - patternStart;
  console.log(`Pattern Match Latency: ${patternLatency}ms`);

  // Tensor operations
  const tensorStart = Date.now();
  framework.getAllTensorFields();
  const tensorDuration = Date.now() - tensorStart;
  console.log(`Tensor Field Access: ${tensorDuration}ms`);

  // Verification
  const verifyStart = Date.now();
  framework.verify();
  const verifyDuration = Date.now() - verifyStart;
  console.log(`Framework Verification: ${verifyDuration}ms`);

  console.log('');
  console.log('Target Metrics:');
  console.log('  Query Throughput: >500 queries/sec', queryThroughput > 500 ? '✓' : '✗');
  console.log('  Pattern Match Latency: <100ms', patternLatency < 100 ? '✓' : '✗');
  console.log('  Tensor Access: <5ms', tensorDuration < 5 ? '✓' : '✗');
  console.log('  Verification: <10ms', verifyDuration < 10 ? '✓' : '✗');

  bridge.disconnect();
}

/**
 * Main entry point
 */
async function main() {
  // Run programmatic example
  try {
    await programmaticExample();
    await performanceExample();
  } catch (error) {
    console.error('Error:', error);
  }

  // Render React component
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.createRoot(root).render(<BasicExample />);
  }
}

// Export for use in other modules
export {
  BasicExample,
  programmaticExample,
  performanceExample,
  exampleQueries,
};

// Run if executed directly
if (typeof window !== 'undefined') {
  main();
}
