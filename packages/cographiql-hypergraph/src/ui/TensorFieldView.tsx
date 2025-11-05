/**
 * Tensor Field View
 * Visualization of topological tensor framework (776 quantum states)
 */

import React, { useState, useEffect } from 'react';
import { TensorFrameworkManager } from '../tensor/framework';
import { TensorField } from '../types/cognitive-types';

interface TensorFieldViewProps {
  framework: TensorFrameworkManager;
}

/**
 * Tensor component visualization
 */
const TensorComponent: React.FC<{
  name: string;
  field: TensorField;
  color: string;
  expanded: boolean;
  onToggle: () => void;
}> = ({ name, field, color, expanded, onToggle }) => {
  const shape = field.shape.dimensions.join(' × ');
  const totalParams = field.shape.totalParams;

  // Compute statistics
  const data = Array.from(field.data);
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);
  const min = Math.min(...data);
  const max = Math.max(...data);

  return (
    <div style={{
      background: '#1a1a1a',
      borderRadius: '8px',
      padding: '10px',
      marginBottom: '10px',
      border: `2px solid ${color}`,
    }}>
      {/* Header */}
      <div
        onClick={onToggle}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          marginBottom: expanded ? '10px' : 0,
        }}
      >
        <div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color }}>
            {name.toUpperCase()}
          </div>
          <div style={{ fontSize: '11px', color: '#888' }}>
            {shape} = {totalParams} params
          </div>
        </div>
        <div style={{ fontSize: '20px' }}>
          {expanded ? '▼' : '▶'}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div>
          {/* Statistics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            marginBottom: '10px',
            fontSize: '11px',
          }}>
            <div>
              <div style={{ color: '#888' }}>Mean</div>
              <div style={{ color: '#fff', fontFamily: 'monospace' }}>
                {mean.toFixed(6)}
              </div>
            </div>
            <div>
              <div style={{ color: '#888' }}>Std Dev</div>
              <div style={{ color: '#fff', fontFamily: 'monospace' }}>
                {stdDev.toFixed(6)}
              </div>
            </div>
            <div>
              <div style={{ color: '#888' }}>Min</div>
              <div style={{ color: '#fff', fontFamily: 'monospace' }}>
                {min.toFixed(6)}
              </div>
            </div>
            <div>
              <div style={{ color: '#888' }}>Max</div>
              <div style={{ color: '#fff', fontFamily: 'monospace' }}>
                {max.toFixed(6)}
              </div>
            </div>
          </div>

          {/* Histogram */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '5px' }}>
              Distribution
            </div>
            <div style={{
              display: 'flex',
              height: '40px',
              background: '#0a0a0a',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              {createHistogram(data, 20).map((height, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    background: color,
                    opacity: 0.3 + (height * 0.7),
                    alignSelf: 'flex-end',
                    height: `${height * 100}%`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Prime factorization */}
          <div style={{ fontSize: '11px' }}>
            <div style={{ color: '#888', marginBottom: '3px' }}>
              Prime Factorization
            </div>
            <div style={{ color: '#fff', fontFamily: 'monospace' }}>
              {Object.entries(field.shape.primeFactorization)
                .map(([prime, power]) => `${prime}^${power}`)
                .join(' × ')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Create histogram from data
 */
function createHistogram(data: number[], bins: number): number[] {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const binSize = (max - min) / bins;
  const histogram = new Array(bins).fill(0);

  data.forEach(value => {
    const binIdx = Math.min(Math.floor((value - min) / binSize), bins - 1);
    histogram[binIdx]++;
  });

  // Normalize
  const maxCount = Math.max(...histogram);
  return histogram.map(count => count / maxCount);
}

/**
 * Main Tensor Field View component
 */
export const TensorFieldView: React.FC<TensorFieldViewProps> = ({ framework }) => {
  const [fields, setFields] = useState<Record<string, TensorField>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    gnn: true,
    das: false,
    esn: false,
    membrane: false,
    ecan: false,
  });
  const [autoRefresh, setAutoRefresh] = useState(false);

  /**
   * Load tensor fields
   */
  const loadFields = () => {
    const allFields = framework.getAllTensorFields();
    setFields(allFields);
  };

  /**
   * Toggle component expansion
   */
  const toggleExpanded = (component: string) => {
    setExpanded(prev => ({
      ...prev,
      [component]: !prev[component],
    }));
  };

  /**
   * Load fields on mount
   */
  useEffect(() => {
    loadFields();

    if (autoRefresh) {
      const interval = setInterval(loadFields, 2000);
      return () => clearInterval(interval);
    }
  }, [framework, autoRefresh]);

  /**
   * Verify framework integrity
   */
  const isValid = framework.verify();
  const frameworkData = framework.getFramework();

  const componentColors: Record<string, string> = {
    gnn: '#2196F3',
    das: '#4CAF50',
    esn: '#FF9800',
    membrane: '#9C27B0',
    ecan: '#F44336',
  };

  const componentDescriptions: Record<string, string> = {
    gnn: 'Graph Neural Network - Neural graph processing',
    das: 'Distributed AtomSpace - Symbolic reasoning',
    esn: 'Echo State Network - Temporal pattern recognition',
    membrane: 'P-System Membranes - Hierarchical computation',
    ecan: 'Economic Attention - Resource allocation',
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#0a0a0a',
      color: '#fff',
    }}>
      {/* Header */}
      <div style={{
        padding: '10px',
        background: '#2a2a2a',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>
          🔮 Tensor Field View
        </h3>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <label style={{ fontSize: '11px' }}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            {' '}Auto
          </label>
          <button
            onClick={loadFields}
            style={{
              padding: '4px 8px',
              background: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            🔄
          </button>
        </div>
      </div>

      {/* Framework overview */}
      <div style={{
        padding: '10px',
        background: '#1a1a1a',
        borderBottom: '1px solid #333',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
            Topological Tensor Framework
          </div>
          <div style={{
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '4px',
            background: isValid ? '#4CAF50' : '#F44336',
          }}>
            {isValid ? '✓ VALID' : '✗ INVALID'}
          </div>
        </div>
        
        <div style={{ fontSize: '11px', color: '#888' }}>
          Total States: <span style={{ color: '#fff', fontFamily: 'monospace' }}>
            {frameworkData.totalStates}
          </span>
          {' '}= 2³ × 97 (prime factorization)
        </div>
        
        <div style={{ fontSize: '11px', color: '#888' }}>
          Frame Problem: <span style={{
            color: frameworkData.frameProblemSolved ? '#4CAF50' : '#F44336',
            fontWeight: 'bold',
          }}>
            {frameworkData.frameProblemSolved ? 'SOLVED' : 'UNSOLVED'}
          </span>
        </div>
      </div>

      {/* Tensor components */}
      <div style={{ flex: 1, overflow: 'auto', padding: '10px' }}>
        {Object.entries(fields).map(([name, field]) => (
          <TensorComponent
            key={name}
            name={name}
            field={field}
            color={componentColors[name]}
            expanded={expanded[name]}
            onToggle={() => toggleExpanded(name)}
          />
        ))}

        {/* Component legend */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '8px',
          padding: '10px',
          marginTop: '10px',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
            Component Legend
          </div>
          {Object.entries(componentDescriptions).map(([name, desc]) => (
            <div
              key={name}
              style={{
                fontSize: '11px',
                marginBottom: '5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                background: componentColors[name],
              }} />
              <div>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>
                  {name.toUpperCase()}
                </span>
                {' - '}
                <span style={{ color: '#888' }}>
                  {desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '8px 10px',
        background: '#1a1a1a',
        fontSize: '11px',
        color: '#888',
        borderTop: '1px solid #333',
      }}>
        Version: {frameworkData.version} | 
        Unified Field: {frameworkData.unifiedField}
      </div>
    </div>
  );
};

export default TensorFieldView;
