/**
 * Tests for GraphQL Benchmark
 */

import { GraphQLBenchmark } from '../src/assessment/graphql-benchmark';

describe('GraphQLBenchmark', () => {
  let benchmark: GraphQLBenchmark;

  beforeEach(() => {
    benchmark = new GraphQLBenchmark(10); // Use fewer iterations for tests
  });

  describe('Constructor', () => {
    it('should create instance with default iterations', () => {
      const defaultBenchmark = new GraphQLBenchmark();
      expect(defaultBenchmark).toBeInstanceOf(GraphQLBenchmark);
    });

    it('should create instance with custom iterations', () => {
      const customBenchmark = new GraphQLBenchmark(50);
      expect(customBenchmark).toBeInstanceOf(GraphQLBenchmark);
    });
  });

  describe('benchmarkGraphQL', () => {
    it('should benchmark a GraphQL query', async () => {
      const mockQuery = jest.fn().mockResolvedValue({ data: { test: 'value' } });

      const result = await benchmark.benchmarkGraphQL('test-query', mockQuery);

      expect(result.type).toBe('GraphQL');
      expect(result.queryName).toBe('test-query');
      expect(result.iterations).toBe(10);
      expect(result.metrics.queryTime).toBeGreaterThan(0);
      expect(result.metrics.throughput).toBeGreaterThan(0);
      expect(result.features).toContain('Single endpoint');
      expect(result.features).toContain('Strongly typed schema');
      expect(mockQuery).toHaveBeenCalledTimes(10);
    });

    it('should handle slow queries', async () => {
      const slowQuery = jest.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: {} }), 10))
      );

      const result = await benchmark.benchmarkGraphQL('slow-query', slowQuery);

      expect(result.metrics.queryTime).toBeGreaterThanOrEqual(10);
    });

    it('should handle fast queries', async () => {
      const fastQuery = jest.fn().mockResolvedValue({ data: {} });

      const result = await benchmark.benchmarkGraphQL('fast-query', fastQuery);

      expect(result.metrics.queryTime).toBeLessThan(100);
    });
  });

  describe('benchmarkHyperGraphQL', () => {
    it('should benchmark a HyperGraphQL query', async () => {
      const mockQuery = jest.fn().mockResolvedValue({
        data: { test: 'value', _links: {} },
      });

      const result = await benchmark.benchmarkHyperGraphQL('test-query', mockQuery);

      expect(result.type).toBe('HyperGraphQL');
      expect(result.queryName).toBe('test-query');
      expect(result.iterations).toBe(10);
      expect(result.metrics.queryTime).toBeGreaterThan(0);
      expect(result.features).toContain('Distributed data sources');
      expect(result.features).toContain('Hypergraph traversal');
      expect(result.features).toContain('SPARQL backend support');
      expect(mockQuery).toHaveBeenCalledTimes(10);
    });
  });

  describe('runComparison', () => {
    it('should run complete comparison', async () => {
      const result = await benchmark.runComparison();

      expect(result).toHaveProperty('graphql');
      expect(result).toHaveProperty('hypergraphql');
      expect(result).toHaveProperty('comparison');
      expect(result).toHaveProperty('timestamp');

      expect(result.graphql.length).toBeGreaterThan(0);
      expect(result.hypergraphql.length).toBeGreaterThan(0);

      expect(result.comparison).toHaveProperty('performanceComparison');
      expect(result.comparison).toHaveProperty('featureComparison');
      expect(result.comparison).toHaveProperty('useCaseComparison');
      expect(result.comparison).toHaveProperty('recommendations');
    });

    it('should include simple and complex query benchmarks', async () => {
      const result = await benchmark.runComparison();

      const queryNames = result.graphql.map((b) => b.queryName);
      expect(queryNames).toContain('simple-query');
      expect(queryNames).toContain('complex-nested-query');
    });

    it('should measure performance metrics', async () => {
      const result = await benchmark.runComparison();

      result.graphql.forEach((bench) => {
        expect(bench.metrics.queryTime).toBeGreaterThan(0);
        expect(bench.metrics.throughput).toBeGreaterThan(0);
        expect(bench.metrics.memoryUsage).toBeGreaterThanOrEqual(0);
      });

      result.hypergraphql.forEach((bench) => {
        expect(bench.metrics.queryTime).toBeGreaterThan(0);
        expect(bench.metrics.throughput).toBeGreaterThan(0);
        expect(bench.metrics.memoryUsage).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('generateReport', () => {
    it('should generate markdown report', async () => {
      const benchmarkResults = await benchmark.runComparison();
      const report = benchmark.generateReport(benchmarkResults);

      expect(report).toContain('# GraphQL vs HyperGraphQL Benchmark Report');
      expect(report).toContain('## Performance Metrics');
      expect(report).toContain('### GraphQL Benchmarks');
      expect(report).toContain('### HyperGraphQL Benchmarks');
      expect(report).toContain('## Comparison Analysis');
    });

    it('should include all benchmark queries', async () => {
      const benchmarkResults = await benchmark.runComparison();
      const report = benchmark.generateReport(benchmarkResults);

      expect(report).toContain('simple-query');
      expect(report).toContain('complex-nested-query');
    });

    it('should include comparison analysis', async () => {
      const benchmarkResults = await benchmark.runComparison();
      const report = benchmark.generateReport(benchmarkResults);

      expect(report).toContain('Performance Analysis');
      expect(report).toContain('Feature Comparison');
      expect(report).toContain('Use Case Recommendations');
      expect(report).toContain('Recommendations');
    });
  });

  describe('Comparison Analysis', () => {
    it('should generate performance comparison', async () => {
      const result = await benchmark.runComparison();

      expect(result.comparison.performanceComparison).toContain('Performance Analysis');
      expect(result.comparison.performanceComparison).toContain('Average GraphQL query time');
      expect(result.comparison.performanceComparison).toContain('Average HyperGraphQL query time');
    });

    it('should generate feature comparison', async () => {
      const result = await benchmark.runComparison();

      expect(result.comparison.featureComparison).toContain('Feature Comparison');
      expect(result.comparison.featureComparison).toContain('Data Model');
      expect(result.comparison.featureComparison).toContain('Backend');
      expect(result.comparison.featureComparison).toContain('Similarities');
      expect(result.comparison.featureComparison).toContain('Differences');
    });

    it('should generate use case comparison', async () => {
      const result = await benchmark.runComparison();

      expect(result.comparison.useCaseComparison).toContain('Use Case Recommendations');
      expect(result.comparison.useCaseComparison).toContain('Choose GraphQL when');
      expect(result.comparison.useCaseComparison).toContain('Choose HyperGraphQL when');
    });

    it('should generate recommendations', async () => {
      const result = await benchmark.runComparison();

      expect(result.comparison.recommendations).toContain('Recommendations');
      expect(result.comparison.recommendations).toContain('GitHub-like APIs');
      expect(result.comparison.recommendations).toContain('Knowledge Graphs');
      expect(result.comparison.recommendations).toContain('Performance Optimization');
    });
  });

  describe('Feature Lists', () => {
    it('should include GraphQL features', async () => {
      const mockQuery = jest.fn().mockResolvedValue({ data: {} });
      const result = await benchmark.benchmarkGraphQL('test', mockQuery);

      expect(result.features).toEqual(
        expect.arrayContaining([
          'Single endpoint',
          'Strongly typed schema',
          'Client-specified queries',
          'Efficient data fetching',
          'Introspection support',
        ])
      );
    });

    it('should include HyperGraphQL features', async () => {
      const mockQuery = jest.fn().mockResolvedValue({ data: {} });
      const result = await benchmark.benchmarkHyperGraphQL('test', mockQuery);

      expect(result.features).toEqual(
        expect.arrayContaining([
          'Distributed data sources',
          'Linked Data integration',
          'SPARQL backend support',
          'Semantic web compatibility',
          'Hypergraph traversal',
          'RDF/OWL support',
          'Federated queries',
        ])
      );
    });
  });
});
