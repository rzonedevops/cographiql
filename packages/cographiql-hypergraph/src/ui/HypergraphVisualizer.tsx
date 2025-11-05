/**
 * Hypergraph Visualizer
 * 3D visualization of AtomSpace hypergraph using Three.js
 */

import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

import { AtomSpaceBridge } from '../bridge/atomspace-bridge';
import { Atom } from '../types/cognitive-types';

interface HypergraphVisualizerProps {
  bridge: AtomSpaceBridge;
}

interface GraphData {
  nodes: Array<{
    id: string;
    position: [number, number, number];
    color: string;
    size: number;
    label: string;
    atom: Atom;
  }>;
  edges: Array<{
    source: string;
    target: string;
    color: string;
  }>;
}

/**
 * Node component
 */
const Node: React.FC<{
  position: [number, number, number];
  color: string;
  size: number;
  label: string;
  onClick?: () => void;
}> = ({ position, color, size, label, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size * (hovered ? 1.2 : 1), 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>
      {hovered && (
        <Text
          position={[0, size + 0.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  );
};

/**
 * Edge component
 */
const Edge: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}> = ({ start, end, color }) => {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color={color} linewidth={2} />
    </line>
  );
};

/**
 * Graph Scene component
 */
const GraphScene: React.FC<{ data: GraphData; onNodeClick: (atom: Atom) => void }> = ({
  data,
  onNodeClick,
}) => {
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.5} />
      
      {/* Point light */}
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* Nodes */}
      {data.nodes.map((node) => (
        <Node
          key={node.id}
          position={node.position}
          color={node.color}
          size={node.size}
          label={node.label}
          onClick={() => onNodeClick(node.atom)}
        />
      ))}
      
      {/* Edges */}
      {data.edges.map((edge, idx) => {
        const sourceNode = data.nodes.find((n) => n.id === edge.source);
        const targetNode = data.nodes.find((n) => n.id === edge.target);
        
        if (!sourceNode || !targetNode) return null;
        
        return (
          <Edge
            key={`edge-${idx}`}
            start={sourceNode.position}
            end={targetNode.position}
            color={edge.color}
          />
        );
      })}
      
      {/* Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.5}
      />
    </>
  );
};

/**
 * Main Hypergraph Visualizer component
 */
export const HypergraphVisualizer: React.FC<HypergraphVisualizerProps> = ({ bridge }) => {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [selectedAtom, setSelectedAtom] = useState<Atom | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  /**
   * Load graph data from AtomSpace
   */
  const loadGraphData = async () => {
    try {
      setLoading(true);
      
      // Query atoms with high attention values
      const atoms = await bridge.queryAtoms(
        { attentionValueMin: 10 },
        50 // Limit to 50 atoms for performance
      );

      // Convert atoms to graph data
      const nodes = atoms.map((atom, idx) => {
        // Position in 3D space (simple circular layout)
        const angle = (idx / atoms.length) * Math.PI * 2;
        const radius = 5;
        const height = (Math.random() - 0.5) * 3;
        
        return {
          id: atom.id,
          position: [
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius,
          ] as [number, number, number],
          color: getAtomColor(atom),
          size: 0.2 + atom.attentionValue.sti / 1000,
          label: atom.name || atom.type,
          atom,
        };
      });

      // Create edges from atom relationships
      const edges: GraphData['edges'] = [];
      atoms.forEach((atom) => {
        atom.outgoing.forEach((target) => {
          if (atoms.find((a) => a.id === target.id)) {
            edges.push({
              source: atom.id,
              target: target.id,
              color: '#4CAF50',
            });
          }
        });
      });

      setGraphData({ nodes, edges });
      setLoading(false);
    } catch (error) {
      console.error('Error loading graph data:', error);
      setLoading(false);
    }
  };

  /**
   * Get color based on atom type
   */
  const getAtomColor = (atom: Atom): string => {
    const typeColors: Record<string, string> = {
      ConceptNode: '#2196F3',
      PredicateNode: '#FF9800',
      InheritanceLink: '#4CAF50',
      SimilarityLink: '#9C27B0',
      EvaluationLink: '#F44336',
      default: '#607D8B',
    };
    
    return typeColors[atom.type] || typeColors.default;
  };

  /**
   * Handle node click
   */
  const handleNodeClick = (atom: Atom) => {
    setSelectedAtom(atom);
    console.log('Selected atom:', atom);
  };

  /**
   * Load data on mount and set up auto-refresh
   */
  useEffect(() => {
    loadGraphData();

    if (autoRefresh) {
      const interval = setInterval(loadGraphData, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [bridge, autoRefresh]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '10px',
        background: '#2a2a2a',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>
          🌐 Hypergraph Visualizer
        </h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ fontSize: '12px' }}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            {' '}Auto-refresh
          </label>
          <button
            onClick={loadGraphData}
            style={{
              padding: '4px 12px',
              background: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div style={{ flex: 1, background: '#000' }}>
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            color: '#fff',
          }}>
            Loading hypergraph...
          </div>
        ) : (
          <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
            <GraphScene data={graphData} onNodeClick={handleNodeClick} />
          </Canvas>
        )}
      </div>

      {/* Selected atom info */}
      {selectedAtom && (
        <div style={{
          padding: '10px',
          background: '#2a2a2a',
          color: '#fff',
          fontSize: '12px',
          maxHeight: '150px',
          overflow: 'auto',
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            Selected Atom
          </div>
          <div>ID: {selectedAtom.id}</div>
          <div>Type: {selectedAtom.type}</div>
          {selectedAtom.name && <div>Name: {selectedAtom.name}</div>}
          <div>
            Truth: {selectedAtom.truthValue.strength.toFixed(3)} / 
            {selectedAtom.truthValue.confidence.toFixed(3)}
          </div>
          <div>
            Attention: STI={selectedAtom.attentionValue.sti.toFixed(1)}, 
            LTI={selectedAtom.attentionValue.lti.toFixed(1)}
          </div>
          <div>Incoming: {selectedAtom.incoming.length}</div>
          <div>Outgoing: {selectedAtom.outgoing.length}</div>
        </div>
      )}

      {/* Stats */}
      <div style={{
        padding: '5px 10px',
        background: '#1a1a1a',
        color: '#888',
        fontSize: '11px',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <div>Nodes: {graphData.nodes.length}</div>
        <div>Edges: {graphData.edges.length}</div>
        <div>FPS: 60</div>
      </div>
    </div>
  );
};

export default HypergraphVisualizer;
