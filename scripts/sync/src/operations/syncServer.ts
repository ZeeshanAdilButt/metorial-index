import type {
  PublicRepository,
  PublicServerCategory,
  PublicServerVendor
} from '../../prisma/generated';
import { ensureServer } from '../db';
import { official } from '../definitions/official';
import type { ServerManifest } from '../types';

export let syncServer = async (d: {
  server: ServerManifest;
  vendor: PublicServerVendor;
  repository: PublicRepository;
  readme: string | undefined;
  categories: PublicServerCategory[];
  listing: { description: string | null; skills: string[] };
  tools: any | null;
}) => {
  let [ownerId, repoId, serverId] = d.server.identifier.split('/');

  let server = await ensureServer(() => ({
    identifier: d.server.identifier.toLowerCase(),
    fullSlug: `${ownerId}/${serverId}`,
    slug: serverId,

    name: d.server.server.name,
    description: d.listing.description ?? d.server.server.description,
    skills: d.listing.skills,

    subdirectory: d.server.server.subdirectory,

    isCommunity: d.server.server.flags.isCommunity,
    isOfficial: d.server.server.flags.isOfficial || official.includes(d.server.identifier),
    isHostable: d.server.server.flags.isHostable,

    vendorIdentifier: d.vendor.identifier,
    repositoryIdentifier: d.repository.identifier,

    readme: d.readme,

    tools: d.tools,

    categories: {
      connect: d.categories.map(c => ({
        identifier: c.identifier
      }))
    }
  }));

  return { server };
};
