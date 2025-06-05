import { req } from './req';

export let McpContainers = {
  list: async () => {
    let res: ContainerServer[] = await req.get(
      `https://mcp-containers-index.pages.dev/servers/list.json`
    );

    return res;
  },

  get: async (fullId: string) => {
    let res: ContainerServer = await req.get(
      `https://mcp-containers-index.pages.dev/servers/${fullId}/info.json`
    );

    return res;
  },

  getVersions: async (fullId: string) => {
    let res: ContainerServerVersion[] = await req.get(
      `https://mcp-containers-index.pages.dev/servers/${fullId}/versions.json`
    );

    return res;
  },

  getVersion: async (fullId: string, version: string) => {
    let versions = await McpContainers.getVersions(fullId);

    let serverVersion = versions.find(v => v.version === version);
    if (!serverVersion) {
      throw new Error(`Server version ${version} not found`);
    }

    return serverVersion;
  }
};

export interface ContainerServer {
  id: string;
  fullId: string;
  repo: {
    provider: 'github.com';
    owner: string;
    repo: string;
    branch: string;
    url: string;
  };
  config: {
    argumentsTemplate: string | null;
    configValues: {
      title: string;
      description: string | null;
      default: string | null;
      required: boolean;

      fields: {
        type: 'environment' | 'cli' | 'file';
        key: string;
      }[];
    }[];
  };
  subdirectory: string;
  title: string;
  description: string | null;
  build: {
    startCommand: string | null;
    buildCommand: string | null;
    installCommand: string | null;

    nodeVersion: string | null;
    pythonVersion: string | null;

    buildDir: string | null;

    nixPackages: string[] | null;
    aptPackages: string[] | null;

    platforms: 'linux/arm64' | 'linux/amd64' | null;
  } | null;
}

export interface NixpacksPlan {
  providers: string[];
  buildImage: string;
  variables: Record<string, string>;
  phases: Record<
    string,
    {
      dependsOn: string[];
      cmds: string[];
      cacheDirectories: string[];
      paths: string[];
      nixPkgs: string[];
      nixOverlays: string[];
      nixpkgsArchive: string;
    }
  >;
  start: {
    cmd: string;
  };
}

export interface ContainerServerVersion {
  serverId: string;
  version: string;
  manifest: ContainerServer;
  manifestHash: string;
  createdAt: string;
  builder: { type: 'nixpacks'; plan: NixpacksPlan }[];
}
