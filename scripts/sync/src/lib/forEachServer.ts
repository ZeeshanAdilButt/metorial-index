import fs from 'fs-extra';
import PQueue from 'p-queue';
import path from 'path';

export let forEachServer = async <T>(
  callback: (d: { server: string; serverPath: string }) => Promise<T>
) => {
  let aggregatedDir = path.join(__dirname, '../../../../catalog');

  let queue = new PQueue({ concurrency: 30 });

  let outputs: T[] = [];

  let owners = (await fs.readdir(aggregatedDir)).sort();
  for (let owner of owners) {
    let ownerPath = path.join(aggregatedDir, owner);
    if (!(await fs.stat(ownerPath)).isDirectory()) continue;

    let repos = (await fs.readdir(ownerPath)).sort();
    for (let repo of repos) {
      let repoPath = path.join(ownerPath, repo);
      if (!(await fs.stat(repoPath)).isDirectory()) continue;

      let servers = (await fs.readdir(repoPath)).sort();
      for (let server of servers) {
        let serverPath = path.join(repoPath, server);
        if (!(await fs.stat(serverPath)).isDirectory()) continue;

        queue.add(async () => {
          let out = await callback({
            serverPath,
            server
          });

          outputs.push(out);
        });
      }
    }
  }

  await queue.onIdle();

  return outputs;
};
