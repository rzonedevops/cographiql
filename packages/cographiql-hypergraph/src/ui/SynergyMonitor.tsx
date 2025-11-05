/**
 * Cognitive Synergy Monitor
 * Real-time dashboard for cognitive synergy metrics
 */

import React, { useEffect, useState, useRef } from 'react';
import { CognitiveSynergy } from '../types/cognitive-types';

interface SynergyMonitorProps {
  synergy: CognitiveSynergy;
  historySize?: number;
}

interface SynergyHistory {
  attention: number[];
  reasoning: number[];
  memory: number[];
  perception: number[];
  action: number[];
  overall: number[];
  timestamps: number[];
}

/**
 * Mini line chart component
 */
const MiniChart: React.FC<{
  data: number[];
  color: string;
  label: string;
  width?: number;
  height?: number;
}> = ({ data, color, label, width = 200, height = 60 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = (i / 4) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw data
    if (data.length < 2) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const xStep = width / (data.length - 1);
    const maxValue = Math.max(...data, 1);

    data.forEach((value, idx) => {
      const x = idx * xStep;
      const y = height - (value / maxValue) * height;

      if (idx === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw current value point
    const lastX = (data.length - 1) * xStep;
    const lastY = height - (data[data.length - 1] / maxValue) * height;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
    ctx.fill();

  }, [data, color, width, height]);

  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '5px',
        fontSize: '12px',
      }}>
        <span style={{ color: '#fff' }}>{label}</span>
        <span style={{ color, fontWeight: 'bold' }}>
          {data[data.length - 1]?.toFixed(3) || '0.000'}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width: '100%',
          height: 'auto',
          border: '1px solid #333',
          borderRadius: '4px',
        }}
      />
    </div>
  );
};

/**
 * Radial gauge component
 */
const RadialGauge: React.FC<{
  value: number;
  label: string;
  color: string;
  size?: number;
}> = ({ value, label, color, size = 80 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw background circle
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw value arc
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(
      centerX,
      centerY,
      radius,
      -Math.PI / 2,
      -Math.PI / 2 + (value * Math.PI * 2)
    );
    ctx.stroke();

    // Draw value text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(value.toFixed(2), centerX, centerY);

  }, [value, color, size]);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{ display: 'block', margin: '0 auto' }}
      />
      <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>
        {label}
      </div>
    </div>
  );
};

/**
 * Main Synergy Monitor component
 */
export const SynergyMonitor: React.FC<SynergyMonitorProps> = ({
  synergy,
  historySize = 100,
}) => {
  const [history, setHistory] = useState<SynergyHistory>({
    attention: [],
    reasoning: [],
    memory: [],
    perception: [],
    action: [],
    overall: [],
    timestamps: [],
  });

  const [showCharts, setShowCharts] = useState(true);
  const [showGauges, setShowGauges] = useState(true);

  /**
   * Update history when synergy changes
   */
  useEffect(() => {
    setHistory((prev) => {
      const newHistory = {
        attention: [...prev.attention, synergy.attention],
        reasoning: [...prev.reasoning, synergy.reasoning],
        memory: [...prev.memory, synergy.memory],
        perception: [...prev.perception, synergy.perception],
        action: [...prev.action, synergy.action],
        overall: [...prev.overall, synergy.overall],
        timestamps: [...prev.timestamps, synergy.timestamp],
      };

      // Trim to history size
      Object.keys(newHistory).forEach((key) => {
        const arr = newHistory[key as keyof SynergyHistory] as number[];
        if (arr.length > historySize) {
          newHistory[key as keyof SynergyHistory] = arr.slice(-historySize) as any;
        }
      });

      return newHistory;
    });
  }, [synergy, historySize]);

  /**
   * Compute statistics
   */
  const stats = {
    avgOverall: history.overall.length > 0
      ? history.overall.reduce((a, b) => a + b, 0) / history.overall.length
      : 0,
    maxOverall: history.overall.length > 0
      ? Math.max(...history.overall)
      : 0,
    minOverall: history.overall.length > 0
      ? Math.min(...history.overall)
      : 0,
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
          ⚡ Cognitive Synergy Monitor
        </h3>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button
            onClick={() => setShowCharts(!showCharts)}
            style={{
              padding: '4px 8px',
              background: showCharts ? '#4CAF50' : '#666',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            Charts
          </button>
          <button
            onClick={() => setShowGauges(!showGauges)}
            style={{
              padding: '4px 8px',
              background: showGauges ? '#4CAF50' : '#666',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            Gauges
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '10px' }}>
        {/* Overall synergy gauge */}
        <div style={{
          background: '#1a1a1a',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '15px',
          textAlign: 'center',
        }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
            Overall Cognitive Synergy
          </h4>
          <div style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: synergy.overall > 0.7 ? '#4CAF50' : synergy.overall > 0.4 ? '#FF9800' : '#F44336',
            marginBottom: '10px',
          }}>
            {synergy.overall.toFixed(3)}
          </div>
          <div style={{ fontSize: '11px', color: '#888' }}>
            Avg: {stats.avgOverall.toFixed(3)} | 
            Max: {stats.maxOverall.toFixed(3)} | 
            Min: {stats.minOverall.toFixed(3)}
          </div>
        </div>

        {/* Radial gauges */}
        {showGauges && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '10px',
            marginBottom: '15px',
          }}>
            <RadialGauge
              value={synergy.attention}
              label="Attention"
              color="#2196F3"
            />
            <RadialGauge
              value={synergy.reasoning}
              label="Reasoning"
              color="#4CAF50"
            />
            <RadialGauge
              value={synergy.memory}
              label="Memory"
              color="#FF9800"
            />
            <RadialGauge
              value={synergy.perception}
              label="Perception"
              color="#9C27B0"
            />
            <RadialGauge
              value={synergy.action}
              label="Action"
              color="#F44336"
            />
          </div>
        )}

        {/* Time series charts */}
        {showCharts && (
          <div>
            <MiniChart
              data={history.attention}
              color="#2196F3"
              label="Attention (ECAN)"
            />
            <MiniChart
              data={history.reasoning}
              color="#4CAF50"
              label="Reasoning (PLN)"
            />
            <MiniChart
              data={history.memory}
              color="#FF9800"
              label="Memory (AtomSpace)"
            />
            <MiniChart
              data={history.perception}
              color="#9C27B0"
              label="Perception"
            />
            <MiniChart
              data={history.action}
              color="#F44336"
              label="Action"
            />
            <MiniChart
              data={history.overall}
              color="#00BCD4"
              label="Overall Synergy"
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '8px 10px',
        background: '#1a1a1a',
        fontSize: '11px',
        color: '#888',
        borderTop: '1px solid #333',
      }}>
        Last update: {new Date(synergy.timestamp).toLocaleTimeString()} | 
        History: {history.overall.length}/{historySize} samples
      </div>
    </div>
  );
};

export default SynergyMonitor;
