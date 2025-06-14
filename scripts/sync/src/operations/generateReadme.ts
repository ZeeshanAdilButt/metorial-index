import { storedCategories } from '../definitions/categories';
import type { ReadmeItem } from '../types';

let shortenString = (str: string, maxLength: number) => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

let getServerListItem = (item: ReadmeItem) => {
  return `- <img src="https://github.com/${item.repository.providerOwnerIdentifier}.png?size=120" width="12px" height="12px" /> **[${item.server.name}](${item.repository.providerUrl})** - ${shortenString(item.server.description?.split('\n').join(' ') ?? '', 1000)}`;
};

let getServerList = (name: string, items: ReadmeItem[]) => {
  let list = items.map(getServerListItem).join('\n\n');

  return `## ${name}\n\n${list}`;
};

export let generateReadme = async (items: ReadmeItem[]) => {
  let officialServer = getServerList(
    'Official Servers',
    items.filter(i => i.server.isOfficial)
  );

  let serversByCategory = storedCategories.map(c => {
    let servers = items.filter(i => i.categories.some(cat => cat.identifier == c.identifier));
    return getServerList(c.name, servers);
  });

  let servers = [officialServer, ...serversByCategory].join('\n\n');

  return `${header}\n\n${servers}\n\n${footer}`;
};

let header = `
<img src="./assets/repo-header.png" alt="MCP Index" width="100%" />

<h1 align="center">MCP Index</h1>

<p align="center">An ever growing list of <a href="https://modelcontextprotocol.io">MCP servers</a> 📡 📁</p>

> [!TIP]
> *Hosted MCP Containers:* Skip local setup and go hosted. [Metorial's](https://metorial.com) serverless hosted MCP service allows you to integrate the MCP servers listed in this repo in a single line of code. Built for devs; with logging, monitoring and SDKs included.
> 
> ➡️ **[Get Early Access (with free tier)](https://metorial.com/early-access)**
`;

let footer = `
# License

The code of this project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 
The source code of the linked MPC Servers is licensed under the respective licenses of the projects. 
See the linked project repositories for more information.

## Contributing

Contributions are welcome! If you want to contribute an MCP server, please use the [Contributing Guide](CONTRIBUTING.md) to get started.
If you have any questions or suggestions, feel free to open an issue or a pull request.

<div align="center">
  <sub>Built with ❤️ by <a href="https://metorial.com">Metorial</a></sub>
</div>
  
`;
