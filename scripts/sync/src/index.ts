import fs from 'fs-extra';
import path from 'path';
import { parse } from 'yaml';
import { forEachServer } from './lib/forEachServer';
import { fetchReadme } from './lib/readme';
import { generateReadme } from './operations/generateReadme';
import { syncCategories } from './operations/syncCategories';
import { syncListings } from './operations/syncListing';
import { syncRepoAndVendor } from './operations/syncRepoAndVendor';
import { syncServer } from './operations/syncServer';
import { syncMcpContainers } from './providers/mcp-containers';
import type { ReadmeItem, ServerManifest } from './types';

let readmeItems: ReadmeItem[] = [];

await forEachServer(async ({ serverPath }) => {
  let serverYamlPath = path.join(serverPath, 'server.yaml');
  let serverYaml = await fs.readFile(serverYamlPath, 'utf-8');
  let serverDefinition: ServerManifest = parse(serverYaml);

  let toolsPath = path.join(serverPath, 'tools.yaml');
  let tools = (await fs.exists(toolsPath))
    ? parse(await fs.readFile(toolsPath, 'utf-8'))
    : null;

  let variantsPath = path.join(serverPath, 'variants');
  let variants = await fs.readdir(variantsPath);

  let generatedPath = path.join(serverPath, 'generated');
  await fs.ensureDir(generatedPath);

  console.log(`Syncing ${serverDefinition.identifier}...`);

  let { vendor, repository } = await syncRepoAndVendor({ server: serverDefinition });

  let readme = await fetchReadme({
    ...serverDefinition,
    defaultBranch: repository.defaultBranch
  });

  let listing = await syncListings({
    serverPath,
    readme,
    server: serverDefinition
  });

  let categories = await syncCategories({
    server: serverDefinition,
    readme,
    serverPath
  });

  let { server } = await syncServer({
    server: serverDefinition,
    vendor,
    repository,
    readme,
    categories,
    listing,
    tools
  });

  for (let variant of variants) {
    let variantPath = path.join(variantsPath, variant);
    if (!(await fs.stat(variantPath)).isFile()) continue;

    if (variant == 'mcp-containers.yaml') {
      await syncMcpContainers({
        variantPath,
        server
      });
    } else {
      console.warn(
        `Variant ${variant} is not supported for ${serverDefinition.identifier}. Skipping.`
      );
    }
  }

  readmeItems.push({ server, repository, categories });
});

let readmePath = path.join(__dirname, '../../../README.md');
await fs.writeFile(readmePath, await generateReadme(readmeItems), 'utf-8');
