#!/usr/bin/env node

/**
 * Simple Demo Script
 * 
 * Demonstrates the assessment tool without requiring a GitHub token
 * Shows sample output and explains capabilities
 */

console.log('='.repeat(80));
console.log('GitHub API Awareness Assessment & GraphQL Benchmark - DEMO');
console.log('='.repeat(80));
console.log('');

console.log('This tool provides comprehensive assessment of:');
console.log('  1. Repository-wide awareness (GitHub GraphQL API)');
console.log('  2. Organization-wide awareness (GitHub GraphQL API)');
console.log('  3. Enterprise-wide awareness (GitHub GraphQL API)');
console.log('  4. GraphQL vs HyperGraphQL performance benchmark');
console.log('');

console.log('='.repeat(80));
console.log('PART 1: GitHub API Awareness Levels');
console.log('='.repeat(80));
console.log('');

console.log('📊 REPOSITORY-WIDE AWARENESS');
console.log('-'.repeat(80));
console.log('');
console.log('Sample data for: graphql/graphiql');
console.log('');

const sampleRepoData = {
  repository: 'graphiql',
  owner: 'graphql',
  visibility: 'PUBLIC',
  languages: ['TypeScript', 'JavaScript', 'CSS', 'HTML'],
  topics: ['graphql', 'ide', 'editor', 'react', 'developer-tools'],
  stars: 15234,
  forks: 1542,
  watchers: 450,
  contributors: 234,
  issues: 87,
  pullRequests: 12,
  branches: 25,
  commits: 4521,
  releases: 157,
  dependencies: 85,
  license: 'MIT',
  codeOfConduct: 'Contributor Covenant',
  securityPolicy: true,
  hasWiki: true,
  hasProjects: true,
  hasDiscussions: true,
};

console.log('Repository Information:');
Object.entries(sampleRepoData).forEach(([key, value]) => {
  const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  const displayValue = Array.isArray(value) ? value.join(', ') : value;
  console.log(`  ${displayKey}: ${displayValue}`);
});

console.log('');
console.log('📈 ORGANIZATION-WIDE AWARENESS');
console.log('-'.repeat(80));
console.log('');
console.log('Sample data for: graphql organization');
console.log('');

const sampleOrgData = {
  organization: 'graphql',
  repositories: 50,
  members: 25,
  teams: 10,
  projects: 5,
  packages: 3,
  totalStars: 50000,
  totalForks: 5000,
  isVerified: true,
  topLanguages: {
    'TypeScript': 30,
    'JavaScript': 20,
    'Python': 5,
    'Go': 3,
    'Java': 2,
  },
  location: 'San Francisco, CA',
  websiteUrl: 'https://graphql.org',
  twitterUsername: 'graphql',
};

console.log('Organization Information:');
Object.entries(sampleOrgData).forEach(([key, value]) => {
  if (key === 'topLanguages') {
    console.log('  Top Languages:');
    Object.entries(value).forEach(([lang, count]) => {
      console.log(`    ${lang}: ${count} repositories`);
    });
  } else {
    const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    console.log(`  ${displayKey}: ${value}`);
  }
});

console.log('');
console.log('🏢 ENTERPRISE-WIDE AWARENESS');
console.log('-'.repeat(80));
console.log('');
console.log('(Requires enterprise access - typically not available)');
console.log('');

const sampleEnterpriseData = {
  organizations: 15,
  totalMembers: 500,
  totalRepositories: 750,
};

console.log('Enterprise Information:');
Object.entries(sampleEnterpriseData).forEach(([key, value]) => {
  const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  console.log(`  ${displayKey}: ${value}`);
});

console.log('');
console.log('='.repeat(80));
console.log('PART 2: GraphQL vs HyperGraphQL Benchmark');
console.log('='.repeat(80));
console.log('');

console.log('🏃 PERFORMANCE COMPARISON');
console.log('-'.repeat(80));
console.log('');

const benchmarkData = {
  graphql: {
    simpleQuery: { avgTime: 2.45, throughput: 408.16 },
    complexQuery: { avgTime: 4.82, throughput: 207.47 },
  },
  hypergraphql: {
    simpleQuery: { avgTime: 3.82, throughput: 261.78 },
    complexQuery: { avgTime: 7.15, throughput: 139.86 },
  },
};

console.log('GraphQL Performance:');
console.log(`  Simple Query: ${benchmarkData.graphql.simpleQuery.avgTime}ms avg, ${benchmarkData.graphql.simpleQuery.throughput.toFixed(2)} queries/sec`);
console.log(`  Complex Query: ${benchmarkData.graphql.complexQuery.avgTime}ms avg, ${benchmarkData.graphql.complexQuery.throughput.toFixed(2)} queries/sec`);
console.log('');

console.log('HyperGraphQL Performance:');
console.log(`  Simple Query: ${benchmarkData.hypergraphql.simpleQuery.avgTime}ms avg, ${benchmarkData.hypergraphql.simpleQuery.throughput.toFixed(2)} queries/sec`);
console.log(`  Complex Query: ${benchmarkData.hypergraphql.complexQuery.avgTime}ms avg, ${benchmarkData.hypergraphql.complexQuery.throughput.toFixed(2)} queries/sec`);
console.log('');

const perfDiff = ((benchmarkData.hypergraphql.simpleQuery.avgTime / benchmarkData.graphql.simpleQuery.avgTime - 1) * 100).toFixed(1);
console.log(`Performance Analysis: HyperGraphQL is ~${perfDiff}% slower but adds semantic capabilities`);

console.log('');
console.log('='.repeat(80));
console.log('PART 3: GraphQL vs HyperGraphQL - Key Differences');
console.log('='.repeat(80));
console.log('');

console.log('🔍 HOW THEY ARE THE SAME:');
console.log('-'.repeat(80));
const similarities = [
  'Both use GraphQL query syntax',
  'Both have strong type systems',
  'Both support introspection',
  'Both enable efficient data fetching',
  'Both support real-time subscriptions',
  'Both solve over-fetching and under-fetching problems',
];
similarities.forEach((sim, i) => console.log(`  ${i + 1}. ${sim}`));

console.log('');
console.log('🔬 HOW THEY ARE DIFFERENT:');
console.log('-'.repeat(80));
console.log('');

const differences = [
  ['Data Model', 'Directed graph (2-node edges)', 'Hypergraph (N-node edges)'],
  ['Backend', 'Any database', 'RDF/SPARQL stores'],
  ['Standards', 'Custom specification', 'W3C standards'],
  ['Data Format', 'Plain JSON', 'JSON-LD'],
  ['Semantics', 'Application-specific', 'Ontology-based'],
  ['Federation', 'Schema stitching', 'Native distributed'],
  ['Links', 'Static schema', 'Dynamic HATEOAS'],
  ['Use Case', 'Web/mobile apps', 'Knowledge graphs'],
];

console.log('Aspect'.padEnd(20) + 'GraphQL'.padEnd(30) + 'HyperGraphQL');
console.log('-'.repeat(80));
differences.forEach(([aspect, gql, hgql]) => {
  console.log(aspect.padEnd(20) + gql.padEnd(30) + hgql);
});

console.log('');
console.log('💡 WHEN TO USE EACH:');
console.log('-'.repeat(80));
console.log('');

console.log('Use GraphQL when:');
const graphqlUseCases = [
  'Building modern web or mobile applications',
  'Need simple, efficient API for any database',
  'Want extensive community support and tooling',
  'Performance is critical',
  'Working with relational or document databases',
];
graphqlUseCases.forEach(uc => console.log(`  ✅ ${uc}`));

console.log('');
console.log('Use HyperGraphQL when:');
const hyperGraphqlUseCases = [
  'Working with semantic web technologies',
  'Data sources are RDF/SPARQL endpoints',
  'Building knowledge graphs',
  'Need complex graph traversal (hyperedges)',
  'Require W3C standards compliance',
  'Integrating multiple semantic data sources',
];
hyperGraphqlUseCases.forEach(uc => console.log(`  ✅ ${uc}`));

console.log('');
console.log('='.repeat(80));
console.log('HOW TO USE THIS TOOL');
console.log('='.repeat(80));
console.log('');

console.log('Prerequisites:');
console.log('  1. Get a GitHub Personal Access Token from https://github.com/settings/tokens');
console.log('  2. Required scopes: repo, read:org');
console.log('');

console.log('Quick Start:');
console.log('  export GITHUB_TOKEN="your-token-here"');
console.log('  npm run assessment graphql graphiql');
console.log('');

console.log('Programmatic Usage:');
console.log('  import { runCompleteAssessment } from "cographiql-hypergraph/assessment";');
console.log('  const results = await runCompleteAssessment(token, "graphql", "graphiql");');
console.log('');

console.log('Output:');
console.log('  The tool generates 3 comprehensive markdown reports:');
console.log('  1. github-awareness-report.md - GitHub API analysis');
console.log('  2. graphql-benchmark-report.md - Performance comparison');
console.log('  3. graphql-vs-hypergraphql-explained.md - Educational guide');
console.log('');

console.log('='.repeat(80));
console.log('DEMO COMPLETE');
console.log('='.repeat(80));
console.log('');

console.log('📚 Documentation:');
console.log('  • README: src/assessment/README.md');
console.log('  • Full Guide: ASSESSMENT_DOCUMENTATION.md');
console.log('  • Summary: ASSESSMENT_SUMMARY.md');
console.log('');

console.log('🧪 Examples:');
console.log('  • Run examples: npm run examples');
console.log('  • View code: examples/assessment/run-examples.ts');
console.log('');

console.log('🧪 Tests:');
console.log('  • Run tests: npm test');
console.log('  • Test files: tests/assessment/*.test.ts');
console.log('');

console.log('💡 Next Steps:');
console.log('  1. Get your GitHub token');
console.log('  2. Run the real assessment on your repositories');
console.log('  3. Analyze the generated reports');
console.log('  4. Share insights with your team');
console.log('');

console.log('='.repeat(80));
