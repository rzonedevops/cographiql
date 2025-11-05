/**
 * Tests for GitHub API Awareness Assessment
 */

import { GitHubAwarenessAssessment } from '../src/assessment/github-api-awareness';

describe('GitHubAwarenessAssessment', () => {
  let assessment: GitHubAwarenessAssessment;

  beforeEach(() => {
    assessment = new GitHubAwarenessAssessment({
      token: 'mock-token',
    });
  });

  describe('Constructor', () => {
    it('should create instance with valid config', () => {
      expect(assessment).toBeInstanceOf(GitHubAwarenessAssessment);
    });

    it('should accept enterprise config', () => {
      const enterpriseAssessment = new GitHubAwarenessAssessment({
        token: 'mock-token',
        enterprise: 'my-enterprise',
      });
      expect(enterpriseAssessment).toBeInstanceOf(GitHubAwarenessAssessment);
    });
  });

  describe('assessRepository', () => {
    it('should return repository awareness data structure', async () => {
      // Mock the GraphQL call
      const mockGraphql = jest.fn().mockResolvedValue({
        repository: {
          name: 'test-repo',
          owner: { login: 'test-owner' },
          visibility: 'PUBLIC',
          primaryLanguage: { name: 'TypeScript' },
          languages: { edges: [{ node: { name: 'TypeScript' } }] },
          repositoryTopics: { edges: [{ node: { topic: { name: 'graphql' } } }] },
          dependencyGraphManifests: { totalCount: 10 },
          mentionableUsers: { totalCount: 5 },
          issues: { totalCount: 20 },
          pullRequests: { totalCount: 3 },
          stargazerCount: 100,
          forkCount: 15,
          watchers: { totalCount: 50 },
          hasWikiEnabled: true,
          hasProjectsEnabled: false,
          hasDiscussionsEnabled: true,
          defaultBranchRef: {
            name: 'main',
            target: { history: { totalCount: 500 } },
          },
          refs: { totalCount: 5 },
          releases: { totalCount: 10 },
          licenseInfo: { name: 'MIT License', spdxId: 'MIT' },
          codeOfConduct: { name: 'Contributor Covenant' },
          securityPolicyUrl: 'https://github.com/test/SECURITY.md',
        },
      });

      (assessment as any).graphqlWithAuth = mockGraphql;

      const result = await assessment.assessRepository('test-owner', 'test-repo');

      expect(result).toMatchObject({
        repository: 'test-repo',
        owner: 'test-owner',
        visibility: 'PUBLIC',
        languages: ['TypeScript'],
        topics: ['graphql'],
        stars: 100,
        forks: 15,
        hasWiki: true,
        hasProjects: false,
        hasDiscussions: true,
        license: 'MIT License',
        securityPolicy: true,
      });

      expect(mockGraphql).toHaveBeenCalledWith(
        expect.any(String),
        { owner: 'test-owner', repo: 'test-repo' }
      );
    });
  });

  describe('assessOrganization', () => {
    it('should return organization awareness data structure', async () => {
      const mockGraphql = jest.fn().mockResolvedValue({
        organization: {
          login: 'test-org',
          repositories: { totalCount: 50, edges: [] },
          membersWithRole: { totalCount: 25 },
          teams: { totalCount: 10 },
          projects: { totalCount: 5 },
          packages: { totalCount: 3 },
          sponsorsListing: { id: 'sponsor-1' },
          pinnedItems: { totalCount: 6 },
          isVerified: true,
          location: 'San Francisco',
          websiteUrl: 'https://example.com',
          twitterUsername: 'testorg',
          email: 'info@example.com',
        },
      });

      (assessment as any).graphqlWithAuth = mockGraphql;

      const result = await assessment.assessOrganization('test-org');

      expect(result).toMatchObject({
        organization: 'test-org',
        repositories: 50,
        members: 25,
        teams: 10,
        projects: 5,
        packages: 3,
        isVerified: true,
        location: 'San Francisco',
      });
    });
  });

  describe('runAssessment', () => {
    it('should run complete assessment with all components', async () => {
      const mockGraphql = jest
        .fn()
        .mockResolvedValueOnce({
          repository: {
            name: 'test-repo',
            owner: { login: 'test-owner' },
            visibility: 'PUBLIC',
            languages: { edges: [] },
            repositoryTopics: { edges: [] },
            dependencyGraphManifests: { totalCount: 0 },
            mentionableUsers: { totalCount: 0 },
            issues: { totalCount: 0 },
            pullRequests: { totalCount: 0 },
            stargazerCount: 0,
            forkCount: 0,
            watchers: { totalCount: 0 },
            hasWikiEnabled: false,
            hasProjectsEnabled: false,
            hasDiscussionsEnabled: false,
            defaultBranchRef: { name: 'main', target: { history: { totalCount: 0 } } },
            refs: { totalCount: 0 },
            releases: { totalCount: 0 },
          },
        })
        .mockResolvedValueOnce({
          organization: {
            login: 'test-owner',
            repositories: { totalCount: 0, edges: [] },
            membersWithRole: { totalCount: 0 },
            teams: { totalCount: 0 },
            projects: { totalCount: 0 },
            packages: { totalCount: 0 },
            pinnedItems: { totalCount: 0 },
            isVerified: false,
          },
        });

      (assessment as any).graphqlWithAuth = mockGraphql;

      const result = await assessment.runAssessment('test-owner', 'test-repo', true, false);

      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('repo');
      expect(result).toHaveProperty('org');
      expect(result).toHaveProperty('queryTime');
      expect(result.queriesExecuted).toBe(2);
    });
  });

  describe('generateReport', () => {
    it('should generate markdown report', () => {
      const mockResults = {
        timestamp: '2025-01-01T00:00:00.000Z',
        queryTime: 1000,
        queriesExecuted: 2,
        repo: {
          repository: 'test-repo',
          owner: 'test-owner',
          visibility: 'PUBLIC',
          languages: ['TypeScript'],
          topics: ['graphql', 'api'],
          dependencies: 10,
          contributors: 5,
          issues: 20,
          pullRequests: 3,
          stars: 100,
          forks: 15,
          watchers: 50,
          hasWiki: true,
          hasProjects: false,
          hasDiscussions: true,
          defaultBranch: 'main',
          branches: 5,
          commits: 500,
          releases: 10,
          license: 'MIT',
          codeOfConduct: 'Contributor Covenant',
          securityPolicy: true,
        },
        org: {
          organization: 'test-owner',
          repositories: 50,
          members: 25,
          teams: 10,
          projects: 5,
          packages: 3,
          sponsorsListing: true,
          pinnedItems: 6,
          topLanguages: { TypeScript: 30, JavaScript: 20 },
          totalStars: 5000,
          totalForks: 500,
          isVerified: true,
          location: 'San Francisco',
          websiteUrl: 'https://example.com',
        },
      };

      const report = assessment.generateReport(mockResults);

      expect(report).toContain('# GitHub API Awareness Assessment Report');
      expect(report).toContain('## Repository-Wide Awareness');
      expect(report).toContain('## Organization-Wide Awareness');
      expect(report).toContain('test-repo');
      expect(report).toContain('test-owner');
      expect(report).toContain('TypeScript');
      expect(report).toContain('100'); // stars
    });

    it('should handle missing data gracefully', () => {
      const minimalResults = {
        timestamp: '2025-01-01T00:00:00.000Z',
        queryTime: 100,
        queriesExecuted: 1,
      };

      const report = assessment.generateReport(minimalResults);

      expect(report).toContain('# GitHub API Awareness Assessment Report');
      expect(report).not.toContain('## Repository-Wide Awareness');
      expect(report).not.toContain('## Organization-Wide Awareness');
    });
  });
});
