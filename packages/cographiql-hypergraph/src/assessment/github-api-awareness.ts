/**
 * GitHub API Awareness Assessment Tool
 * 
 * Tests repository-wide, organization-wide, and enterprise-wide awareness
 * using GitHub's GraphQL API
 */

import { graphql } from '@octokit/graphql';

export interface GitHubConfig {
  token: string;
  enterprise?: string;
}

export interface RepoAwareness {
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

export interface OrgAwareness {
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

export interface EnterpriseAwareness {
  enterprise?: string;
  organizations: number;
  totalRepositories: number;
  totalMembers: number;
  billingEmail?: string;
  slug?: string;
  url?: string;
}

export interface AwarenessResults {
  timestamp: string;
  repo?: RepoAwareness;
  org?: OrgAwareness;
  enterprise?: EnterpriseAwareness;
  queryTime: number;
  queriesExecuted: number;
}

export class GitHubAwarenessAssessment {
  private graphqlWithAuth: typeof graphql;
  private config: GitHubConfig;

  constructor(config: GitHubConfig) {
    this.config = config;
    this.graphqlWithAuth = graphql.defaults({
      headers: {
        authorization: `token ${config.token}`,
      },
    });
  }

  /**
   * Assess repository-wide awareness
   */
  async assessRepository(owner: string, repo: string): Promise<RepoAwareness> {
    const query = `
      query($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          name
          owner {
            login
          }
          visibility
          primaryLanguage {
            name
          }
          languages(first: 10) {
            edges {
              node {
                name
              }
              size
            }
          }
          repositoryTopics(first: 20) {
            edges {
              node {
                topic {
                  name
                }
              }
            }
          }
          dependencyGraphManifests {
            totalCount
          }
          mentionableUsers {
            totalCount
          }
          issues {
            totalCount
          }
          pullRequests {
            totalCount
          }
          stargazerCount
          forkCount
          watchers {
            totalCount
          }
          hasWikiEnabled
          hasProjectsEnabled
          hasDiscussionsEnabled
          defaultBranchRef {
            name
            target {
              ... on Commit {
                history {
                  totalCount
                }
              }
            }
          }
          refs(refPrefix: "refs/heads/") {
            totalCount
          }
          releases {
            totalCount
          }
          licenseInfo {
            name
            spdxId
          }
          codeOfConduct {
            name
          }
          securityPolicyUrl
        }
      }
    `;

    const result: any = await this.graphqlWithAuth(query, { owner, repo });
    const repoData = result.repository;

    return {
      repository: repoData.name,
      owner: repoData.owner.login,
      visibility: repoData.visibility,
      languages: repoData.languages.edges.map((e: any) => e.node.name),
      topics: repoData.repositoryTopics.edges.map((e: any) => e.node.topic.name),
      dependencies: repoData.dependencyGraphManifests?.totalCount || 0,
      contributors: repoData.mentionableUsers?.totalCount || 0,
      issues: repoData.issues.totalCount,
      pullRequests: repoData.pullRequests.totalCount,
      stars: repoData.stargazerCount,
      forks: repoData.forkCount,
      watchers: repoData.watchers.totalCount,
      hasWiki: repoData.hasWikiEnabled,
      hasProjects: repoData.hasProjectsEnabled,
      hasDiscussions: repoData.hasDiscussionsEnabled,
      defaultBranch: repoData.defaultBranchRef?.name || 'main',
      branches: repoData.refs?.totalCount || 0,
      commits: repoData.defaultBranchRef?.target?.history?.totalCount || 0,
      releases: repoData.releases.totalCount,
      license: repoData.licenseInfo?.name,
      codeOfConduct: repoData.codeOfConduct?.name,
      securityPolicy: !!repoData.securityPolicyUrl,
    };
  }

  /**
   * Assess organization-wide awareness
   */
  async assessOrganization(org: string): Promise<OrgAwareness> {
    const query = `
      query($org: String!) {
        organization(login: $org) {
          login
          repositories {
            totalCount
          }
          membersWithRole {
            totalCount
          }
          teams {
            totalCount
          }
          projects {
            totalCount
          }
          packages {
            totalCount
          }
          sponsorsListing {
            id
          }
          pinnedItems {
            totalCount
          }
          repositories(first: 100) {
            edges {
              node {
                primaryLanguage {
                  name
                }
                stargazerCount
                forkCount
              }
            }
          }
          isVerified
          location
          websiteUrl
          twitterUsername
          email
        }
      }
    `;

    const result: any = await this.graphqlWithAuth(query, { org });
    const orgData = result.organization;

    // Aggregate language statistics
    const langStats: Record<string, number> = {};
    let totalStars = 0;
    let totalForks = 0;

    orgData.repositories.edges.forEach((edge: any) => {
      const lang = edge.node.primaryLanguage?.name;
      if (lang) {
        langStats[lang] = (langStats[lang] || 0) + 1;
      }
      totalStars += edge.node.stargazerCount;
      totalForks += edge.node.forkCount;
    });

    return {
      organization: orgData.login,
      repositories: orgData.repositories.totalCount,
      members: orgData.membersWithRole.totalCount,
      teams: orgData.teams.totalCount,
      projects: orgData.projects.totalCount,
      packages: orgData.packages.totalCount,
      sponsorsListing: !!orgData.sponsorsListing,
      pinnedItems: orgData.pinnedItems.totalCount,
      topLanguages: langStats,
      totalStars,
      totalForks,
      isVerified: orgData.isVerified,
      location: orgData.location,
      websiteUrl: orgData.websiteUrl,
      twitterUsername: orgData.twitterUsername,
      email: orgData.email,
    };
  }

  /**
   * Assess enterprise-wide awareness (requires enterprise access)
   */
  async assessEnterprise(enterpriseSlug?: string): Promise<EnterpriseAwareness> {
    if (!enterpriseSlug && !this.config.enterprise) {
      return {
        organizations: 0,
        totalRepositories: 0,
        totalMembers: 0,
      };
    }

    const slug = enterpriseSlug || this.config.enterprise;

    try {
      const query = `
        query($slug: String!) {
          enterprise(slug: $slug) {
            slug
            name
            billingInfo {
              billingEmail
            }
            url
            organizations {
              totalCount
            }
            ownerInfo {
              ... on EnterpriseOwnerInfo {
                organizationMemberships {
                  totalCount
                }
              }
            }
          }
        }
      `;

      const result: any = await this.graphqlWithAuth(query, { slug });
      const enterpriseData = result.enterprise;

      return {
        enterprise: enterpriseData.name,
        organizations: enterpriseData.organizations.totalCount,
        totalRepositories: 0, // Would need additional queries
        totalMembers: enterpriseData.ownerInfo?.organizationMemberships?.totalCount || 0,
        billingEmail: enterpriseData.billingInfo?.billingEmail,
        slug: enterpriseData.slug,
        url: enterpriseData.url,
      };
    } catch (error) {
      // Enterprise access may not be available
      return {
        organizations: 0,
        totalRepositories: 0,
        totalMembers: 0,
      };
    }
  }

  /**
   * Run comprehensive awareness assessment
   */
  async runAssessment(
    owner: string,
    repo?: string,
    includeOrg = true,
    includeEnterprise = false
  ): Promise<AwarenessResults> {
    const startTime = Date.now();
    let queriesExecuted = 0;

    const results: AwarenessResults = {
      timestamp: new Date().toISOString(),
      queryTime: 0,
      queriesExecuted: 0,
    };

    // Repo assessment
    if (repo) {
      results.repo = await this.assessRepository(owner, repo);
      queriesExecuted++;
    }

    // Org assessment
    if (includeOrg) {
      results.org = await this.assessOrganization(owner);
      queriesExecuted++;
    }

    // Enterprise assessment
    if (includeEnterprise) {
      results.enterprise = await this.assessEnterprise();
      queriesExecuted++;
    }

    results.queryTime = Date.now() - startTime;
    results.queriesExecuted = queriesExecuted;

    return results;
  }

  /**
   * Generate awareness report
   */
  generateReport(results: AwarenessResults): string {
    let report = '# GitHub API Awareness Assessment Report\n\n';
    report += `**Timestamp**: ${results.timestamp}\n`;
    report += `**Query Time**: ${results.queryTime}ms\n`;
    report += `**Queries Executed**: ${results.queriesExecuted}\n\n`;

    if (results.repo) {
      report += '## Repository-Wide Awareness\n\n';
      report += `- **Repository**: ${results.repo.owner}/${results.repo.repository}\n`;
      report += `- **Visibility**: ${results.repo.visibility}\n`;
      report += `- **Default Branch**: ${results.repo.defaultBranch}\n`;
      report += `- **Languages**: ${results.repo.languages.join(', ')}\n`;
      report += `- **Topics**: ${results.repo.topics.join(', ')}\n`;
      report += `- **Stars**: ${results.repo.stars}\n`;
      report += `- **Forks**: ${results.repo.forks}\n`;
      report += `- **Watchers**: ${results.repo.watchers}\n`;
      report += `- **Contributors**: ${results.repo.contributors}\n`;
      report += `- **Issues**: ${results.repo.issues}\n`;
      report += `- **Pull Requests**: ${results.repo.pullRequests}\n`;
      report += `- **Branches**: ${results.repo.branches}\n`;
      report += `- **Commits**: ${results.repo.commits}\n`;
      report += `- **Releases**: ${results.repo.releases}\n`;
      report += `- **Dependencies**: ${results.repo.dependencies}\n`;
      report += `- **License**: ${results.repo.license || 'None'}\n`;
      report += `- **Code of Conduct**: ${results.repo.codeOfConduct || 'None'}\n`;
      report += `- **Security Policy**: ${results.repo.securityPolicy ? 'Yes' : 'No'}\n`;
      report += `- **Wiki**: ${results.repo.hasWiki ? 'Enabled' : 'Disabled'}\n`;
      report += `- **Projects**: ${results.repo.hasProjects ? 'Enabled' : 'Disabled'}\n`;
      report += `- **Discussions**: ${results.repo.hasDiscussions ? 'Enabled' : 'Disabled'}\n\n`;
    }

    if (results.org) {
      report += '## Organization-Wide Awareness\n\n';
      report += `- **Organization**: ${results.org.organization}\n`;
      report += `- **Repositories**: ${results.org.repositories}\n`;
      report += `- **Members**: ${results.org.members}\n`;
      report += `- **Teams**: ${results.org.teams}\n`;
      report += `- **Projects**: ${results.org.projects}\n`;
      report += `- **Packages**: ${results.org.packages}\n`;
      report += `- **Total Stars**: ${results.org.totalStars}\n`;
      report += `- **Total Forks**: ${results.org.totalForks}\n`;
      report += `- **Verified**: ${results.org.isVerified ? 'Yes' : 'No'}\n`;
      report += `- **Sponsors Listing**: ${results.org.sponsorsListing ? 'Yes' : 'No'}\n`;
      report += `- **Pinned Items**: ${results.org.pinnedItems}\n`;
      
      const topLangs = Object.entries(results.org.topLanguages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([lang, count]) => `${lang} (${count})`)
        .join(', ');
      report += `- **Top Languages**: ${topLangs}\n`;
      
      if (results.org.location) report += `- **Location**: ${results.org.location}\n`;
      if (results.org.websiteUrl) report += `- **Website**: ${results.org.websiteUrl}\n`;
      if (results.org.twitterUsername) report += `- **Twitter**: @${results.org.twitterUsername}\n`;
      report += '\n';
    }

    if (results.enterprise) {
      report += '## Enterprise-Wide Awareness\n\n';
      if (results.enterprise.enterprise) {
        report += `- **Enterprise**: ${results.enterprise.enterprise}\n`;
        report += `- **Organizations**: ${results.enterprise.organizations}\n`;
        report += `- **Total Members**: ${results.enterprise.totalMembers}\n`;
        if (results.enterprise.url) report += `- **URL**: ${results.enterprise.url}\n`;
        if (results.enterprise.slug) report += `- **Slug**: ${results.enterprise.slug}\n`;
      } else {
        report += '*Enterprise access not available*\n';
      }
      report += '\n';
    }

    return report;
  }
}
