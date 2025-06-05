import fs from 'fs-extra';
import path from 'path';
import { parse, stringify } from 'yaml';
import { ai } from '../openAi';
import type { ServerManifest } from '../types';

export let syncListings = async (d: {
  serverPath: string;
  readme: string | undefined;
  server: ServerManifest;
}): Promise<{
  description: string | null;
  skills: string[];
}> => {
  let listingPath = path.join(d.serverPath, 'listing.yaml');
  if (await fs.pathExists(listingPath)) {
    let listing = await fs.readFile(listingPath, 'utf-8');
    return parse(listing);
  }

  if (!d.readme) {
    return {
      description: d.server.server.description,
      skills: []
    };
  }

  let response = await ai.responses.create({
    model: 'gpt-4o-mini',
    input: `The Model Context Protocol (MCP) is a protocol for connecting AI models, like Chat GPT, to arbitrary tools or data sources. We are creating a list of open source MCP servers.

MCP Server info provided by Vendor:

NAME: "${d.server.server.name}"

DESCRIPTION: "${d.server.server.description}"

README:

\`\`\`md
${d.readme?.substring(0, 800)}
\`\`\`

Based on the information above, respond with a JSON object that contains the following fields:
1) A description of the server. This should be a short, one/two-sentence description of the server. Avoid marketing language and focus on the server's functionality. Avoid phrases like "This server can...", "The ... Server allows ...", "A server for ...", etc. Just describe the server's functionality in a few sentences, like "Interact with GitHub repositories, manage issues, and automate workflows.".
2) A list of skills that the server can perform. Examples may be "Generate images", "Read the content of a PDF", "Execute Python code", etc.
`,
    text: {
      format: {
        type: 'json_schema',
        name: 'listing',
        schema: {
          type: 'object',
          properties: {
            description: {
              type: 'string'
            },
            skills: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          },
          required: ['description', 'skills'],
          additionalProperties: false
        }
      }
    }
  });

  let parsedListing: {
    description: string | null;
    skills: string[];
  } = JSON.parse(response.output_text.trim());

  await fs.writeFile(listingPath, stringify(parsedListing));

  return parsedListing;
};
