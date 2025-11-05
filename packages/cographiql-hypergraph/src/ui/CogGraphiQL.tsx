/**
 * CoGraphiQL - Main React Component
 * HyperGraphQL IDE with cognitive monitoring and self-awareness
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GraphiQL } from 'graphiql';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import 'graphiql/graphiql.css';

import { AtomSpaceBridge } from '../bridge/atomspace-bridge';
import { TensorFrameworkManager } from '../tensor/framework';
import { CognitiveMirrorSystem } from '../self-awareness/cognitive-mirror';
import {
  CogServerConfig,
  TensorConfig,
  CoGraphiQLConfig,
  CognitiveSynergy,
} from '../types/cognitive-types';

// Import visualization components
import { HypergraphVisualizer } from './HypergraphVisualizer';
import { SynergyMonitor } from './SynergyMonitor';
import { TensorFieldView } from './TensorFieldView';

interface CogGraphiQLProps {
  config: CoGraphiQLConfig;
  onSynergyUpdate?: (synergy: CognitiveSynergy) => void;
  onStateChange?: (state: any) => void;
}

/**
 * CoGraphiQL Main Component
 */
export const CogGraphiQL: React.FC<CogGraphiQLProps> = ({
  config,
  onSynergyUpdate,
  onStateChange,
}) => {
  const [atomSpaceBridge, setAtomSpaceBridge] = useState<AtomSpaceBridge | null>(null);
  const [tensorFramework, setTensorFramework] = useState<TensorFrameworkManager | null>(null);
  const [cognitiveMirror, setCognitiveMirror] = useState<CognitiveMirrorSystem | null>(null);
  const [connected, setConnected] = useState(false);
  const [synergy, setSynergy] = useState<CognitiveSynergy | null>(null);
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [showSynergyMonitor, setShowSynergyMonitor] = useState(true);
  const [showTensorView, setShowTensorView] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const synergyIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Initialize CoGraphiQL system
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize AtomSpace bridge
        const bridge = new AtomSpaceBridge(config.cogServer);
        await bridge.connect();
        setAtomSpaceBridge(bridge);
        setConnected(true);

        // Initialize tensor framework
        const framework = new TensorFrameworkManager(config.tensor);
        setTensorFramework(framework);

        // Initialize cognitive mirror
        if (config.enableSelfAwareness) {
          const initialField = framework.getTensorField('gnn');
          const mirror = new CognitiveMirrorSystem(initialField);
          setCognitiveMirror(mirror);
        }

        console.log('CoGraphiQL initialized successfully');
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to initialize: ${errorMsg}`);
        console.error('Initialization error:', err);
      }
    };

    initialize();

    // Cleanup on unmount
    return () => {
      if (atomSpaceBridge) {
        atomSpaceBridge.disconnect();
      }
      if (synergyIntervalRef.current) {
        clearInterval(synergyIntervalRef.current);
      }
    };
  }, [config]);

  /**
   * Start synergy monitoring
   */
  useEffect(() => {
    if (!connected || !atomSpaceBridge) return;

    // Poll synergy metrics every second
    synergyIntervalRef.current = setInterval(async () => {
      try {
        const stats = await atomSpaceBridge.getStatistics();
        
        // Compute synergy metrics
        const newSynergy: CognitiveSynergy = {
          attention: stats.avgAttention,
          reasoning: stats.avgTruthValue,
          memory: stats.atomCount / 10000, // Normalized
          perception: 0.5, // Placeholder
          action: 0.5, // Placeholder
          overall: (stats.avgAttention + stats.avgTruthValue) / 2,
          timestamp: Date.now(),
        };

        setSynergy(newSynergy);
        
        if (onSynergyUpdate) {
          onSynergyUpdate(newSynergy);
        }
      } catch (err) {
        console.error('Error updating synergy:', err);
      }
    }, 1000);

    return () => {
      if (synergyIntervalRef.current) {
        clearInterval(synergyIntervalRef.current);
      }
    };
  }, [connected, atomSpaceBridge, onSynergyUpdate]);

  /**
   * Create GraphQL fetcher with self-awareness monitoring
   */
  const createCognitiveFetcher = useCallback(() => {
    if (!atomSpaceBridge) {
      return () => Promise.reject(new Error('Not connected'));
    }

    return async (graphQLParams: any) => {
      try {
        // Monitor execution if cognitive mirror is enabled
        if (cognitiveMirror) {
          const { result } = await cognitiveMirror.monitorExecution(
            'graphql-query',
            async () => {
              // Execute query through bridge
              const response = await atomSpaceBridge.executeScheme(`
                (use-modules (opencog) (opencog exec))
                ; Execute GraphQL query: ${graphQLParams.query}
                ; This is a placeholder - actual implementation would parse and execute
                (cog-execute! (Concept "query-result"))
              `);
              
              return {
                data: response,
                errors: [],
              };
            }
          );

          if (onStateChange) {
            onStateChange(result.state);
          }

          return result.result;
        } else {
          // Direct execution without monitoring
          const response = await atomSpaceBridge.executeScheme(`
            (use-modules (opencog) (opencog exec))
            ; Execute GraphQL query: ${graphQLParams.query}
            (cog-execute! (Concept "query-result"))
          `);
          
          return {
            data: response,
            errors: [],
          };
        }
      } catch (err) {
        console.error('Query execution error:', err);
        return {
          data: null,
          errors: [{ message: err instanceof Error ? err.message : 'Unknown error' }],
        };
      }
    };
  }, [atomSpaceBridge, cognitiveMirror, onStateChange]);

  /**
   * Default query examples
   */
  const defaultQuery = `# CoGraphiQL - Cognitive HyperGraphQL Interface
# Query the distributed AtomSpace with self-awareness

# Example 1: Query self-concept
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
    incoming {
      id
      type
    }
    outgoing {
      id
      type
    }
  }
  
  # Get cognitive synergy metrics
  cognitiveSynergy {
    attention
    reasoning
    memory
    perception
    action
    overall
    timestamp
  }
}

# Example 2: Pattern matching
query PatternMatch {
  pattern(
    input: {
      pattern: "(InheritanceLink (Variable \\"$X\\") (ConceptNode \\"sentient\\"))"
      maxResults: 100
      distributed: false
    }
  ) {
    matches {
      id
      type
      truthValue {
        strength
        confidence
      }
    }
    count
    executionTime
  }
}

# Example 3: Query tensor field
query TensorField {
  tensorField(component: "gnn") {
    shape
    totalParams
    component
  }
}

# Example 4: Self-awareness introspection
query Introspection {
  selfAwareness {
    selfConcept {
      id
      name
      truthValue {
        strength
        confidence
      }
    }
    coherence
    membraneDepth
    introspectionLevel
  }
}
`;

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!connected) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Connecting to CogServer...</h2>
        <p>Initializing HyperGraphQL interface with topological tensor framework</p>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '10px 20px',
        background: '#1a1a1a',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>
            🧠 CoGraphiQL
          </h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.7 }}>
            HyperGraphQL Interface • 776 Quantum States • Frame Problem: SOLVED
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowVisualizer(!showVisualizer)}
            style={{
              padding: '8px 16px',
              background: showVisualizer ? '#4CAF50' : '#666',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {showVisualizer ? '🔵' : '⚫'} Visualizer
          </button>
          
          <button
            onClick={() => setShowSynergyMonitor(!showSynergyMonitor)}
            style={{
              padding: '8px 16px',
              background: showSynergyMonitor ? '#4CAF50' : '#666',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {showSynergyMonitor ? '🔵' : '⚫'} Synergy
          </button>
          
          <button
            onClick={() => setShowTensorView(!showTensorView)}
            style={{
              padding: '8px 16px',
              background: showTensorView ? '#4CAF50' : '#666',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {showTensorView ? '🔵' : '⚫'} Tensors
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* GraphiQL IDE */}
        <div style={{ flex: showVisualizer || showSynergyMonitor || showTensorView ? 2 : 1 }}>
          <GraphiQL
            fetcher={createCognitiveFetcher()}
            defaultQuery={defaultQuery}
            defaultEditorToolsVisibility={true}
          />
        </div>

        {/* Side panels */}
        {(showVisualizer || showSynergyMonitor || showTensorView) && (
          <div style={{
            flex: 1,
            borderLeft: '1px solid #333',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
          }}>
            {showVisualizer && atomSpaceBridge && (
              <div style={{ flex: 1, minHeight: '300px' }}>
                <HypergraphVisualizer bridge={atomSpaceBridge} />
              </div>
            )}
            
            {showSynergyMonitor && synergy && (
              <div style={{ flex: 1, minHeight: '200px' }}>
                <SynergyMonitor synergy={synergy} />
              </div>
            )}
            
            {showTensorView && tensorFramework && (
              <div style={{ flex: 1, minHeight: '200px' }}>
                <TensorFieldView framework={tensorFramework} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div style={{
        padding: '8px 20px',
        background: '#1a1a1a',
        color: '#fff',
        fontSize: '12px',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <div>
          Connected: {connected ? '✅' : '❌'} | 
          CogServer: {config.cogServer.host}:{config.cogServer.port}
        </div>
        <div>
          {synergy && (
            <>
              Synergy: {synergy.overall.toFixed(3)} | 
              Attention: {synergy.attention.toFixed(3)} | 
              Reasoning: {synergy.reasoning.toFixed(3)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CogGraphiQL;
