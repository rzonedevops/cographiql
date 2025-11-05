/**
 * Assessment Module Index
 * 
 * Exports all assessment-related functionality for GitHub API awareness
 * and GraphQL vs HyperGraphQL benchmarking
 */

export {
  GitHubAwarenessAssessment,
  GitHubConfig,
  RepoAwareness,
  OrgAwareness,
  EnterpriseAwareness,
  AwarenessResults,
} from './github-api-awareness';

export {
  GraphQLBenchmark,
  BenchmarkMetrics,
  BenchmarkResults,
  ComparisonAnalysis,
  GRAPHQL_VS_HYPERGRAPHQL_EXPLANATION,
} from './graphql-benchmark';

export {
  runCompleteAssessment,
  printUsageExample,
} from './assessment-runner';
