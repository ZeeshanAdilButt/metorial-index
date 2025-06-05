import fs from 'fs-extra';
import path from 'path';
import { parse, stringify } from 'yaml';
import { categories, getStoredCategory } from '../definitions/categories';
import { ai } from '../openAi';
import type { ServerManifest } from '../types';

export let syncCategories = async (d: {
  serverPath: string;
  readme: string | undefined;
  server: ServerManifest;
}) => {
  let categoriesPath = path.join(d.serverPath, 'categories.yaml');
  if (await fs.pathExists(categoriesPath)) {
    let categories = await fs.readFile(categoriesPath, 'utf-8');
    let parsedCategories: string[] = parse(categories);

    return parsedCategories.map(category => getStoredCategory(category)!).filter(Boolean);
  }

  if (!d.readme) return [];

  let response = await ai.responses.create({
    model: 'gpt-4o-mini',
    input: `The Model Context Protocol (MCP) is a protocol for connecting AI models, like Chat GPT, to arbitrary tools or data sources. We are creating a list of open source MCP servers.

We have defined the following categories:

\`\`\`json
${JSON.stringify(
  categories.map(c => c.name),
  null,
  2
)}
\`\`\`

You are given a readme of an MCP server called "${d.server.server.name}".

\`\`\`md
${d.readme?.substring(0, 800)}
\`\`\`

Based on the readme, please list all categories that the MCP server belongs to.
Your response MUST have format: \`{categories: ["Cloud Services", "Business Tools"]}\`. 
The categories array MUST contain valid category names from the list above.`,
    text: {
      format: {
        type: 'json_schema',
        name: 'categories',
        schema: {
          type: 'object',
          properties: {
            categories: {
              type: 'array',
              items: {
                type: 'string',
                enum: categories.map(c => c.name)
              },
              additionalProperties: false
            }
          },
          required: ['categories'],
          additionalProperties: false
        }
      }
    }
  });

  let parsedCategories: { categories: string[] } = JSON.parse(response.output_text.trim());

  let outputCategories = parsedCategories.categories
    .map(category => getStoredCategory(category)!)
    .filter(Boolean);

  await fs.writeFile(categoriesPath, stringify(outputCategories.map(c => c.name)));

  return outputCategories;
};
