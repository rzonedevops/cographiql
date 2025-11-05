/**
 * Example: Running GitHub API Awareness Assessment
 * 
 * This example demonstrates how to use the assessment tools to analyze
 * a GitHub repository and organization
 */

import { runCompleteAssessment, GitHubAwarenessAssessment } from '../../src/assessment';

/**
 * Example 1: Complete Assessment
 */
async function exampleCompleteAssessment() {
  console.log('Example 1: Complete Assessment\n');

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('GITHUB_TOKEN environment variable is required');
    return;
  }

  try {
    const results = await runCompleteAssessment(
      token,
      'graphql',    // Organization
      'graphiql'    // Repository
    );

    console.log('Assessment completed successfully!');
    console.log(`Reports saved to:`);
    results.outputFiles.forEach((file) => console.log(`  - ${file}`));
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example 2: Repository-Only Assessment
 */
async function exampleRepositoryAssessment() {
  console.log('\nExample 2: Repository-Only Assessment\n');

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('GITHUB_TOKEN environment variable is required');
    return;
  }

  const assessment = new GitHubAwarenessAssessment({ token });

  try {
    const repoData = await assessment.assessRepository('facebook', 'react');

    console.log(`Repository: ${repoData.owner}/${repoData.repository}`);
    console.log(`Visibility: ${repoData.visibility}`);
    console.log(`Stars: ${repoData.stars.toLocaleString()}`);
    console.log(`Forks: ${repoData.forks.toLocaleString()}`);
    console.log(`Contributors: ${repoData.contributors}`);
    console.log(`Languages: ${repoData.languages.join(', ')}`);
    console.log(`Topics: ${repoData.topics.slice(0, 5).join(', ')}...`);
    console.log(`Issues: ${repoData.issues}`);
    console.log(`Pull Requests: ${repoData.pullRequests}`);
    console.log(`License: ${repoData.license || 'None'}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example 3: Organization-Only Assessment
 */
async function exampleOrganizationAssessment() {
  console.log('\nExample 3: Organization-Only Assessment\n');

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('GITHUB_TOKEN environment variable is required');
    return;
  }

  const assessment = new GitHubAwarenessAssessment({ token });

  try {
    const orgData = await assessment.assessOrganization('microsoft');

    console.log(`Organization: ${orgData.organization}`);
    console.log(`Repositories: ${orgData.repositories.toLocaleString()}`);
    console.log(`Members: ${orgData.members.toLocaleString()}`);
    console.log(`Teams: ${orgData.teams}`);
    console.log(`Total Stars: ${orgData.totalStars.toLocaleString()}`);
    console.log(`Total Forks: ${orgData.totalForks.toLocaleString()}`);
    console.log(`Verified: ${orgData.isVerified ? 'Yes' : 'No'}`);
    
    const topLangs = Object.entries(orgData.topLanguages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    console.log('\nTop Languages:');
    topLangs.forEach(([lang, count]) => {
      console.log(`  ${lang}: ${count} repositories`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example 4: Custom Assessment with Reporting
 */
async function exampleCustomAssessment() {
  console.log('\nExample 4: Custom Assessment with Reporting\n');

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('GITHUB_TOKEN environment variable is required');
    return;
  }

  const assessment = new GitHubAwarenessAssessment({ token });

  try {
    // Run assessment for multiple repositories
    const repos = [
      { owner: 'graphql', repo: 'graphiql' },
      { owner: 'facebook', repo: 'react' },
      { owner: 'microsoft', repo: 'vscode' },
    ];

    console.log('Assessing multiple repositories...\n');

    for (const { owner, repo } of repos) {
      const data = await assessment.assessRepository(owner, repo);
      
      console.log(`📊 ${owner}/${repo}`);
      console.log(`   ⭐ ${data.stars.toLocaleString()} stars`);
      console.log(`   🍴 ${data.forks.toLocaleString()} forks`);
      console.log(`   👥 ${data.contributors} contributors`);
      console.log(`   🐛 ${data.issues} open issues`);
      console.log(`   📝 ${data.pullRequests} open PRs`);
      console.log('');
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example 5: Benchmark Comparison
 */
async function exampleBenchmark() {
  console.log('\nExample 5: Benchmark Comparison\n');

  const { GraphQLBenchmark } = await import('../../src/assessment');
  
  const benchmark = new GraphQLBenchmark(100);

  console.log('Running benchmark comparison...');
  const results = await benchmark.runComparison();

  console.log('\n📈 Benchmark Results:\n');

  console.log('GraphQL Performance:');
  results.graphql.forEach((bench) => {
    console.log(`  ${bench.queryName}:`);
    console.log(`    Avg Time: ${bench.metrics.queryTime.toFixed(2)}ms`);
    console.log(`    Throughput: ${bench.metrics.throughput.toFixed(2)} queries/sec`);
  });

  console.log('\nHyperGraphQL Performance:');
  results.hypergraphql.forEach((bench) => {
    console.log(`  ${bench.queryName}:`);
    console.log(`    Avg Time: ${bench.metrics.queryTime.toFixed(2)}ms`);
    console.log(`    Throughput: ${bench.metrics.throughput.toFixed(2)} queries/sec`);
  });

  console.log('\n💡 Key Insights:');
  console.log(results.comparison.performanceComparison.split('\n').slice(0, 6).join('\n'));
}

/**
 * Run all examples
 */
async function runAllExamples() {
  console.log('='.repeat(80));
  console.log('GitHub API Awareness Assessment - Examples');
  console.log('='.repeat(80));
  console.log('');

  // Check for token
  if (!process.env.GITHUB_TOKEN) {
    console.error('❌ GITHUB_TOKEN environment variable is required');
    console.error('');
    console.error('Get a token from: https://github.com/settings/tokens');
    console.error('Required scopes: repo, read:org');
    console.error('');
    console.error('Then set it:');
    console.error('  export GITHUB_TOKEN="your-token-here"');
    return;
  }

  // Run examples
  await exampleCompleteAssessment();
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await exampleRepositoryAssessment();
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await exampleOrganizationAssessment();
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await exampleCustomAssessment();
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await exampleBenchmark();

  console.log('\n');
  console.log('='.repeat(80));
  console.log('All examples completed!');
  console.log('='.repeat(80));
}

// Run if executed directly
if (require.main === module) {
  runAllExamples()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

// Export for use in other files
export {
  exampleCompleteAssessment,
  exampleRepositoryAssessment,
  exampleOrganizationAssessment,
  exampleCustomAssessment,
  exampleBenchmark,
  runAllExamples,
};
