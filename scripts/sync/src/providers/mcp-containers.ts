import fs from 'fs-extra';
import { parse } from 'yaml';
import type { PublicServer } from '../../prisma/generated';
import { ensureProvider, ensureServerVariant, ensureServerVersion } from '../db';
import { Cases } from '../lib/cases';
import { format } from '../lib/format';
import { McpContainers } from '../lib/mcpContainers';

export let syncMcpContainers = async (d: { variantPath: string; server: PublicServer }) => {
  let definition: {
    identifier: string;
    provider: {
      identifier: string;
      name: string;
      website: string;
      imageUrl: string;
      description: string;
    };
    source: {
      type: 'docker';
      image: string;

      provider: {
        identifier: string;
      };
    };
  } = parse(await fs.readFile(d.variantPath, 'utf-8'));

  let provider = await ensureProvider(() => ({
    identifier: definition.provider.identifier,
    name: definition.provider.name,
    websiteUrl: definition.provider.website,
    description: definition.provider.description,
    imageUrl: definition.provider.imageUrl
  }));

  let variant = await ensureServerVariant(() => ({
    identifier: definition.identifier.toLowerCase(),

    sourceType: 'docker',
    dockerImage: definition.source.image,

    providerIdentifier: provider.identifier,
    serverIdentifier: d.server.identifier
  }));

  let versions = await McpContainers.getVersions(definition.source.provider.identifier);
  let latestVersion = versions[0];

  for (let version of versions) {
    if (new Date(version.createdAt) > new Date(latestVersion.createdAt)) {
      latestVersion = version;
    }

    let command = version.builder[0]?.plan?.start?.cmd ?? '';
    if (version.manifest.config.argumentsTemplate) {
      command += ' ' + version.manifest.config.argumentsTemplate;
    }
    let commandParts = command
      .split(' ')
      .map(s => s.trim())
      .filter(Boolean);
    command = commandParts.join(' ');

    let args = new Map(
      version.manifest.config.configValues.flatMap(v =>
        v.fields
          .filter(f => f.type == 'cli')
          .map(f => [f.key, Cases.toKebabCase(v.title)] as const)
      )
    );

    let env = version.manifest.config.configValues.flatMap(v =>
      v.fields
        .filter(f => f.type == 'environment')
        .map(f => [f.key, Cases.toKebabCase(v.title)] as const)
    );

    let flagArgs = Object.fromEntries(
      version.manifest.config.configValues.flatMap(v =>
        v.fields
          .filter(f => f.type == 'cli' && f.key.startsWith('-'))
          .map(f => [f.key, Cases.toKebabCase(v.title)] as const)
      )
    );

    await ensureServerVersion(async () => ({
      identifier: version.version,
      variantIdentifier: variant.identifier,

      sourceType: 'docker',
      dockerImage: definition.source.image,
      dockerTag: version.version,

      createdAt: version.createdAt,

      config: {
        type: 'object',
        properties: Object.fromEntries(
          version.manifest.config.configValues.map(v => {
            let fields = v.fields.filter(f => f.type == 'cli' || f.type == 'environment');
            if (fields.length == 0) return [];

            return [
              Cases.toKebabCase(v.title),
              {
                title: Cases.toTitleCase(v.title),
                description: v.description ?? null,
                default: v.default ?? null,
                required: v.required,
                type: 'string'
              }
            ] as const;
          })
        )
      },

      getLaunchParams: await format(`
        (config, ctx) => ({
          command: ${commandParts[0] ? `'${commandParts[0]}'` : 'undefined'},
          args: [
            ${commandParts
              .slice(1)
              .map(arg => {
                for (let [flag, title] of args.entries()) {
                  if (arg.includes(flag)) {
                    if (arg == flag) return `config['${title}'],`;

                    let parts = arg.split(flag);
                    return `'${parts[0]}' + config['${title}'] + '${parts[1]}',`;
                  }
                }

                return `'${arg}',`;
              })
              .join(' ')}

            ${
              Object.keys(flagArgs).length > 0
                ? `
                ...ctx.args.flags({
                  args: ${JSON.stringify(flagArgs)},
                  config
                })
              `
                : ''
            }
          ],
          env: {
            ${env
              .map(([key, title]) => {
                return `${key}: config['${title}'],`;
              })
              .join(' ')}
          }
        })
      `)
    }));
  }
};
