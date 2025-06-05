import UserAgent from 'user-agents';
import type { ServerManifest } from '../types';

export let fetchReadme = async ({
  server,
  repo,
  defaultBranch
}: ServerManifest & { defaultBranch: string }) => {
  let dirs = ['', ...server.subdirectory.split('/').filter(Boolean)];
  let userAgent = new UserAgent();

  while (dirs.length) {
    let dir = dirs.filter(Boolean).join('/');

    if (!dir) dir = '/';
    if (!dir.endsWith('/')) dir += '/';
    if (!dir.startsWith('/')) dir = '/' + dir;

    let res = await fetch(
      `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${defaultBranch}${dir}README.md`,
      {
        headers: {
          'User-Agent': userAgent.toString()
        }
      }
    );

    if (res.status === 200) return await await res.text();

    dirs.pop();
  }
};
