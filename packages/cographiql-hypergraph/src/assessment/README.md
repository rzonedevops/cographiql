# GitHub API Awareness Assessment & GraphQL Benchmark

A comprehensive tool for assessing repository-wide, organization-wide, and enterprise-wide awareness using GitHub's GraphQL API, along with detailed benchmarking comparing standard GraphQL and HyperGraphQL implementations.

## Overview

This assessment tool provides:

### 1. **GitHub API Awareness Testing**
- **Repository-wide awareness**: Comprehensive introspection of a single repository
- **Organization-wide awareness**: Aggregate analysis across all organization repositories
- **Enterprise-wide awareness**: Enterprise-level insights (requires enterprise access)

### 2. **GraphQL vs HyperGraphQL Benchmark**
- Performance comparison with multiple query types
- Feature comparison matrix
- Use case recommendations
- Detailed architectural differences

### 3. **Educational Documentation**
- Comprehensive explanation of GraphQL and HyperGraphQL
- Similarities and differences breakdown
- Real-world use case guidance

## Features

### GitHub API Awareness Assessment

The tool queries the GitHub GraphQL API to collect:

#### Repository Level:
- Repository metadata (name, owner, visibility)
- Programming languages and topics
- Community metrics (stars, forks, watchers)
- Contributor information
- Issue and pull request counts
- Branch and commit statistics
- Releases and dependencies
- Security policies and documentation

#### Organization Level:
- Total repositories, members, and teams
- Organization projects and packages
- Aggregate language statistics
- Total stars and forks across repos
- Verification status
- Contact information and social links

#### Enterprise Level (when available):
- Number of organizations
- Total member count
- Billing information
- Enterprise metadata

### GraphQL Benchmark

Compares performance between:
- Standard GraphQL implementations
- HyperGraphQL implementations

Metrics include:
- Query execution time
- Throughput (queries/second)
- Memory usage
- Feature comparisons

## Installation

```bash
# Install dependencies
npm install @octokit/graphql

# Or with yarn
yarn add @octokit/graphql
```

## Quick Start

### 1. Set up GitHub Token

```bash
export GITHUB_TOKEN="your-github-personal-access-token"
```

Required token scopes:
- `repo` - for repository access
- `read:org` - for organization access
- `read:enterprise` - for enterprise access (optional)

### 2. Run Complete Assessment

```typescript
import { runCompleteAssessment } from 'cographiql-hypergraph/assessment';

const results = await runCompleteAssessment(
  process.env.GITHUB_TOKEN!,
  'graphql',    // owner/organization
  'graphiql'    // repository (optional)
);
```

### 3. View Reports

The assessment generates three markdown reports in the `output/` directory:
1. `github-awareness-report.md` - GitHub API analysis
2. `graphql-benchmark-report.md` - Performance benchmarks
3. `graphql-vs-hypergraphql-explained.md` - Educational guide

## Usage Examples

### Repository Awareness Only

```typescript
import { GitHubAwarenessAssessment } from 'cographiql-hypergraph/assessment';

const assessment = new GitHubAwarenessAssessment({
  token: process.env.GITHUB_TOKEN!
});

const repoData = await assessment.assessRepository('graphql', 'graphiql');

console.log(`Repository: ${repoData.repository}`);
console.log(`Stars: ${repoData.stars}`);
console.log(`Languages: ${repoData.languages.join(', ')}`);
console.log(`Contributors: ${repoData.contributors}`);
```

### Organization Awareness Only

```typescript
import { GitHubAwarenessAssessment } from 'cographiql-hypergraph/assessment';

const assessment = new GitHubAwarenessAssessment({
  token: process.env.GITHUB_TOKEN!
});

const orgData = await assessment.assessOrganization('graphql');

console.log(`Organization: ${orgData.organization}`);
console.log(`Repositories: ${orgData.repositories}`);
console.log(`Members: ${orgData.members}`);
console.log(`Top Languages:`, orgData.topLanguages);
```

### Custom Benchmark

```typescript
import { GraphQLBenchmark } from 'cographiql-hypergraph/assessment';

const benchmark = new GraphQLBenchmark(100); // 100 iterations

// Benchmark a custom query
const result = await benchmark.benchmarkGraphQL(
  'custom-query',
  async () => {
    // Your query implementation
    return { data: { /* ... */ } };
  }
);

console.log(`Avg time: ${result.metrics.queryTime}ms`);
console.log(`Throughput: ${result.metrics.throughput} queries/sec`);
```

## API Reference

### GitHubAwarenessAssessment

```typescript
class GitHubAwarenessAssessment {
  constructor(config: GitHubConfig);
  
  assessRepository(owner: string, repo: string): Promise<RepoAwareness>;
  assessOrganization(org: string): Promise<OrgAwareness>;
  assessEnterprise(slug?: string): Promise<EnterpriseAwareness>;
  
  runAssessment(
    owner: string,
    repo?: string,
    includeOrg?: boolean,
    includeEnterprise?: boolean
  ): Promise<AwarenessResults>;
  
  generateReport(results: AwarenessResults): string;
}
```

### GraphQLBenchmark

```typescript
class GraphQLBenchmark {
  constructor(iterations?: number);
  
  benchmarkGraphQL(
    queryName: string,
    queryFn: () => Promise<any>
  ): Promise<GraphQLBenchmark>;
  
  benchmarkHyperGraphQL(
    queryName: string,
    queryFn: () => Promise<any>
  ): Promise<GraphQLBenchmark>;
  
  runComparison(): Promise<BenchmarkResults>;
  generateReport(results: BenchmarkResults): string;
}
```

### Helper Functions

```typescript
// Run complete assessment with all components
function runCompleteAssessment(
  githubToken: string,
  owner: string,
  repo?: string
): Promise<{
  awarenessResults: AwarenessResults;
  benchmarkResults: BenchmarkResults;
  outputFiles: string[];
}>;

// Print usage examples
function printUsageExample(): string;
```

## Data Structures

### RepoAwareness

```typescript
interface RepoAwareness {
  repository: string;
  owner: string;
  visibility: string;
  languages: string[];
  topics: string[];
  dependencies: number;
  contributors: number;
  issues: number;
  pullRequests: number;
  stars: number;
  forks: number;
  watchers: number;
  hasWiki: boolean;
  hasProjects: boolean;
  hasDiscussions: boolean;
  defaultBranch: string;
  branches: number;
  commits: number;
  releases: number;
  license?: string;
  codeOfConduct?: string;
  securityPolicy: boolean;
}
```

### OrgAwareness

```typescript
interface OrgAwareness {
  organization: string;
  repositories: number;
  members: number;
  teams: number;
  projects: number;
  packages: number;
  sponsorsListing?: boolean;
  pinnedItems: number;
  topLanguages: Record<string, number>;
  totalStars: number;
  totalForks: number;
  isVerified: boolean;
  location?: string;
  websiteUrl?: string;
  twitterUsername?: string;
  email?: string;
}
```

### BenchmarkMetrics

```typescript
interface BenchmarkMetrics {
  queryTime: number;           // Average query time in ms
  throughput: number;          // Queries per second
  memoryUsage: number;         // Memory delta in bytes
}
```

## Command-Line Usage

Run from command line:

```bash
# Basic usage
GITHUB_TOKEN=your-token node dist/assessment/assessment-runner.js graphql graphiql

# Just organization
GITHUB_TOKEN=your-token node dist/assessment/assessment-runner.js graphql

# Help
node dist/assessment/assessment-runner.js
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Weekly Awareness Assessment

on:
  schedule:
    - cron: '0 0 * * 0'  # Every Sunday
  workflow_dispatch:      # Manual trigger

jobs:
  assess:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      
      - run: npm run build
      
      - name: Run Assessment
        run: |
          node dist/assessment/assessment-runner.js graphql graphiql
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Upload Reports
        uses: actions/upload-artifact@v3
        with:
          name: assessment-reports
          path: packages/cographiql-hypergraph/output/*.md
          retention-days: 30
      
      - name: Create Issue with Results
        uses: peter-evans/create-issue-from-file@v4
        with:
          title: Weekly Awareness Assessment
          content-filepath: packages/cographiql-hypergraph/output/github-awareness-report.md
```

## GraphQL vs HyperGraphQL: Key Differences

### Similarities
1. Both use GraphQL query syntax
2. Both have strong type systems
3. Both support introspection
4. Both enable efficient data fetching
5. Both support real-time subscriptions

### Differences

| Aspect | GraphQL | HyperGraphQL |
|--------|---------|--------------|
| **Data Model** | Directed graph | Hypergraph |
| **Backend** | Any database | RDF/SPARQL stores |
| **Semantics** | Application-specific | W3C standards (OWL, RDF) |
| **Data Format** | JSON | JSON-LD |
| **Links** | Schema-defined | HATEOAS, dynamic |
| **Federation** | Schema stitching | Native distributed |
| **Use Case** | Web/mobile apps | Knowledge graphs |

### When to Use Each

**Use GraphQL for:**
- Modern web and mobile applications
- RESTful API replacement
- Microservices architecture
- Developer productivity focus
- Standard databases (SQL, NoSQL)

**Use HyperGraphQL for:**
- Semantic web applications
- Knowledge graph queries
- Linked open data
- RDF/SPARQL backends
- W3C standard compliance
- Complex graph relationships

## Output Examples

### Repository Assessment Output
```
## Repository-Wide Awareness

- **Repository**: graphql/graphiql
- **Visibility**: PUBLIC
- **Stars**: 15,234
- **Forks**: 1,542
- **Languages**: TypeScript, JavaScript, CSS
- **Contributors**: 234
- **Issues**: 87
- **Pull Requests**: 12
```

### Benchmark Output
```
## Performance Metrics

### GraphQL Benchmarks
- Avg Query Time: 2.45ms
- Throughput: 408.16 queries/sec

### HyperGraphQL Benchmarks
- Avg Query Time: 3.82ms
- Throughput: 261.78 queries/sec
```

## Contributing

Contributions are welcome! Please ensure:
1. All tests pass
2. Code follows existing style
3. Documentation is updated
4. Examples demonstrate new features

## License

MIT License - see LICENSE file for details

## Related Documentation

- [GitHub GraphQL API](https://docs.github.com/en/graphql)
- [GraphQL Specification](https://spec.graphql.org/)
- [HyperGraphQL](http://www.hypergraphql.org/)
- [RDF/SPARQL](https://www.w3.org/TR/sparql11-query/)

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/rzonedevops/cographiql/issues)
- Documentation: See `/docs` directory
- Examples: See `/examples` directory
