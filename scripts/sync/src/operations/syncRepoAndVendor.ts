import { ensureRepo, ensureVendor } from '../db';
import { withGhSafe } from '../github';
import type { ServerManifest } from '../types';

export let syncRepoAndVendor = async ({ server }: { server: ServerManifest }) => {
  let ghOwner = await withGhSafe(gh =>
    gh.rest.users.getByUsername({
      username: server.repo.owner
    })
  );

  let ghRepo = await withGhSafe(gh =>
    gh.rest.repos.get({
      owner: server.repo.owner,
      repo: server.repo.name
    })
  );

  let vendor = await ensureVendor(() => ({
    identifier: (ghOwner?.data.login ?? server.repo.owner).toLowerCase(),
    name: ghOwner?.data.name ?? server.repo.owner,
    description: ghOwner?.data.bio,
    imageUrl: ghOwner ? `https://github.com/${ghOwner.data.login}.png` : undefined,
    websiteUrl: ghOwner?.data.blog
  }));

  let repository = await ensureRepo(() => ({
    identifier:
      `github.com/${ghRepo?.data.owner.login ?? server.repo.owner}/${ghRepo?.data.name ?? server.repo.name}`.toLowerCase(),
    name: ghRepo?.data.name ?? server.repo.name,
    slug: ghRepo?.data.name ?? server.repo.name,

    description: ghRepo?.data.description,
    providerUrl:
      ghRepo?.data.html_url ?? `https://github.com/${server.repo.owner}/${server.repo.name}`,
    websiteUrl: ghRepo?.data.homepage,
    provider: 'github.com',

    providerId: ghRepo?.data.id?.toString(),
    providerFullIdentifier: ghRepo?.data.full_name,
    providerIdentifier: ghRepo?.data.name,

    providerOwnerId: ghRepo?.data.owner.id?.toString(),
    providerOwnerIdentifier: ghRepo?.data.owner.login,
    providerOwnerUrl: ghOwner?.data.html_url,

    isFork: !!ghRepo?.data.fork,
    isArchived: !!ghRepo?.data.archived,

    starCount: ghRepo?.data.stargazers_count ?? 0,
    forkCount: ghRepo?.data.forks_count ?? 0,
    watcherCount: ghRepo?.data.watchers_count ?? 0,
    openIssuesCount: ghRepo?.data.open_issues_count ?? 0,
    subscriptionCount: ghRepo?.data.subscribers_count ?? 0,
    size: ghRepo?.data.size ?? 0,

    defaultBranch: ghRepo?.data.default_branch ?? 'main',

    licenseName: ghRepo?.data.license?.name,
    licenseUrl: ghRepo?.data.license?.url,
    licenseSpdxId: ghRepo?.data.license?.spdx_id,

    topics: ghRepo?.data.topics?.sort() ?? [],
    language: ghRepo?.data.language,

    createdAt: ghRepo?.data.created_at ?? new Date('2025-01-01'),
    updatedAt: ghRepo?.data.updated_at ?? new Date('2025-01-01'),
    pushedAt: ghRepo?.data.pushed_at
  }));

  return {
    vendor,
    repository
  };
};
