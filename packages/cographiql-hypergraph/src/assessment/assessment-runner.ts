/**
 * Runnable Assessment Example
 * 
 * Demonstrates GitHub API awareness assessment and GraphQL vs HyperGraphQL benchmarking
 */

import { GitHubAwarenessAssessment } from './github-api-awareness';
import { GraphQLBenchmark, GRAPHQL_VS_HYPERGRAPHQL_EXPLANATION } from './graphql-benchmark';

/**
 * Main assessment runner
 */
export async function runCompleteAssessment(githubToken: string, owner: string, repo?: string) {
  console.log('='.repeat(80));
  console.log('GitHub API Awareness & GraphQL Benchmarking Assessment');
  console.log('='.repeat(80));
  console.log('');

  // Part 1: GitHub API Awareness Assessment
  console.log('PART 1: GitHub API Awareness Assessment');
  console.log('-'.repeat(80));
  console.log('');

  const awarenessAssessment = new GitHubAwarenessAssessment({ token: githubToken });

  try {
    const results = await awarenessAssessment.runAssessment(
      owner,
      repo,
      true,  // Include org assessment
      false  // Include enterprise (usually requires special access)
    );

    const report = awarenessAssessment.generateReport(results);
    console.log(report);
    
    // Also save to file
    const fs = require('fs');
    const path = require('path');
    const outputDir = path.join(__dirname, '../../output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const reportPath = path.join(outputDir, 'github-awareness-report.md');
    fs.writeFileSync(reportPath, report);
    console.log(`\n✅ Awareness report saved to: ${reportPath}\n`);
  } catch (error) {
    console.error('Error running awareness assessment:', error);
    console.error('Make sure your GitHub token is valid and has appropriate permissions.\n');
  }

  // Part 2: GraphQL vs HyperGraphQL Benchmark
  console.log('\n');
  console.log('PART 2: GraphQL vs HyperGraphQL Benchmark');
  console.log('-'.repeat(80));
  console.log('');

  const benchmark = new GraphQLBenchmark(100);

  console.log('Running benchmark with 100 iterations...\n');
  const benchmarkResults = await benchmark.runComparison();

  const benchmarkReport = benchmark.generateReport(benchmarkResults);
  console.log(benchmarkReport);

  // Save benchmark report
  const fs = require('fs');
  const path = require('path');
  const outputDir = path.join(__dirname, '../../output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const benchmarkPath = path.join(outputDir, 'graphql-benchmark-report.md');
  fs.writeFileSync(benchmarkPath, benchmarkReport);
  console.log(`\n✅ Benchmark report saved to: ${benchmarkPath}\n`);

  // Part 3: Educational Explanation
  console.log('\n');
  console.log('PART 3: GraphQL vs HyperGraphQL - Educational Guide');
  console.log('-'.repeat(80));
  console.log('');
  console.log(GRAPHQL_VS_HYPERGRAPHQL_EXPLANATION);

  const explanationPath = path.join(outputDir, 'graphql-vs-hypergraphql-explained.md');
  fs.writeFileSync(explanationPath, GRAPHQL_VS_HYPERGRAPHQL_EXPLANATION);
  console.log(`\n✅ Explanation saved to: ${explanationPath}\n`);

  // Summary
  console.log('\n');
  console.log('='.repeat(80));
  console.log('Assessment Complete!');
  console.log('='.repeat(80));
  console.log('');
  console.log('Summary:');
  console.log(`  • GitHub API queries executed: ${results.queriesExecuted}`);
  console.log(`  • Total query time: ${results.queryTime}ms`);
  console.log(`  • Benchmark iterations: ${benchmarkResults.graphql[0]?.iterations || 0}`);
  console.log(`  • Reports generated: 3`);
  console.log('');
  console.log('Output files:');
  console.log(`  1. ${reportPath}`);
  console.log(`  2. ${benchmarkPath}`);
  console.log(`  3. ${explanationPath}`);
  console.log('');

  return {
    awarenessResults: results,
    benchmarkResults,
    outputFiles: [reportPath, benchmarkPath, explanationPath],
  };
}

/**
 * Example usage function
 */
export function printUsageExample() {
  const example = `
# GitHub API Awareness Assessment - Usage Examples

## Basic Usage

\`\`\`typescript
import { runCompleteAssessment } from './assessment/assessment-runner';

// Run complete assessment
const results = await runCompleteAssessment(
  'your-github-token',
  'graphql',      // organization or owner
  'graphiql'      // repository (optional)
);
\`\`\`

## Individual Components

### 1. GitHub API Awareness Only

\`\`\`typescript
import { GitHubAwarenessAssessment } from './assessment/github-api-awareness';

const assessment = new GitHubAwarenessAssessment({
  token: 'your-github-token'
});

// Repository-wide awareness
const repoAwareness = await assessment.assessRepository('graphql', 'graphiql');

// Organization-wide awareness
const orgAwareness = await assessment.assessOrganization('graphql');

// Enterprise-wide awareness (requires enterprise access)
const enterpriseAwareness = await assessment.assessEnterprise('my-enterprise');

// Full assessment
const results = await assessment.runAssessment('graphql', 'graphiql', true, false);
const report = assessment.generateReport(results);
console.log(report);
\`\`\`

### 2. GraphQL Benchmark Only

\`\`\`typescript
import { GraphQLBenchmark } from './assessment/graphql-benchmark';

const benchmark = new GraphQLBenchmark(100); // 100 iterations

const results = await benchmark.runComparison();
const report = benchmark.generateReport(results);
console.log(report);
\`\`\`

### 3. Custom Benchmarks

\`\`\`typescript
import { GraphQLBenchmark } from './assessment/graphql-benchmark';

const benchmark = new GraphQLBenchmark(1000); // 1000 iterations for precise results

// Benchmark a custom GraphQL query
const graphqlResult = await benchmark.benchmarkGraphQL(
  'my-custom-query',
  async () => {
    // Your GraphQL query execution
    return fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { 'Authorization': 'bearer TOKEN' },
      body: JSON.stringify({ query: '{ viewer { login } }' })
    });
  }
);

// Benchmark a custom HyperGraphQL query
const hyperResult = await benchmark.benchmarkHyperGraphQL(
  'my-custom-hypergraph-query',
  async () => {
    // Your HyperGraphQL query execution
    return fetch('https://hypergraphql-endpoint.com/graphql', {
      method: 'POST',
      body: JSON.stringify({ query: '{ ... }' })
    });
  }
);
\`\`\`

## Environment Setup

1. Get a GitHub Personal Access Token:
   - Go to https://github.com/settings/tokens
   - Generate new token with appropriate scopes:
     - \`repo\` - for repository access
     - \`read:org\` - for organization access
     - \`read:enterprise\` - for enterprise access (if needed)

2. Set environment variable:
   \`\`\`bash
   export GITHUB_TOKEN="your-token-here"
   \`\`\`

3. Run the assessment:
   \`\`\`bash
   npm run assessment
   # or
   yarn assessment
   \`\`\`

## Example Output

The assessment generates three comprehensive reports:

1. **github-awareness-report.md** - Detailed GitHub API analysis
2. **graphql-benchmark-report.md** - Performance comparison
3. **graphql-vs-hypergraphql-explained.md** - Educational guide

## Command-Line Usage

\`\`\`bash
# Run with environment variable
GITHUB_TOKEN=your-token npm run assessment

# Or create a script
node -r ts-node/register examples/run-assessment.ts \\
  --token YOUR_TOKEN \\
  --owner graphql \\
  --repo graphiql
\`\`\`

## Integration with CI/CD

\`\`\`yaml
# .github/workflows/awareness-assessment.yml
name: Awareness Assessment

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly
  workflow_dispatch:

jobs:
  assess:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run assessment
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
      - uses: actions/upload-artifact@v3
        with:
          name: assessment-reports
          path: packages/cographiql-hypergraph/output/*.md
\`\`\`
`;

  console.log(example);
  return example;
}

// Export for CLI usage
if (require.main === module) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.argv[2] || 'graphql';
  const repo = process.argv[3] || 'graphiql';

  if (!token) {
    console.error('Error: GITHUB_TOKEN environment variable is required');
    console.error('');
    console.error('Usage:');
    console.error('  GITHUB_TOKEN=your-token node assessment-runner.js [owner] [repo]');
    console.error('');
    console.error('Example:');
    console.error('  GITHUB_TOKEN=ghp_xxx node assessment-runner.js graphql graphiql');
    console.error('');
    printUsageExample();
    process.exit(1);
  }

  runCompleteAssessment(token, owner, repo)
    .then(() => {
      console.log('✅ Assessment completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Assessment failed:', error);
      process.exit(1);
    });
}
