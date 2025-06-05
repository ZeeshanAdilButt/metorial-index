import type {
  PublicRepository,
  PublicServer,
  PublicServerCategory
} from '../prisma/generated';

export interface ServerManifest {
  identifier: string;
  repo: {
    provider: 'github.com';
    owner: string;
    name: string;
    url: string;
  };
  server: {
    subdirectory: string;
    name: string;
    description: string | null;
    flags: {
      isOfficial: boolean;
      isCommunity: boolean;
      isHostable: boolean;
    };
  };
}

export interface ReadmeItem {
  server: PublicServer;
  repository: PublicRepository;
  categories: PublicServerCategory[];
}
