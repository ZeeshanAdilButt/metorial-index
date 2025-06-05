import { Octokit } from 'octokit';

let tokens = process.env.GITHUB_TOKEN!.split(',');

let apis = tokens.map(token => new Octokit({ auth: token }));
let currentIndex = 0;

export let useGh = () => apis[currentIndex++ % apis.length];

export let withGhSafe = async <T>(fn: (gh: Octokit) => Promise<T | null>) => {
  let gh = useGh();

  try {
    return await fn(gh);
  } catch (e) {
    if (e instanceof Error && e.message.includes('Bad credentials')) {
      currentIndex++;
      gh = useGh();
      return await fn(gh);
    }

    return null;
  }
};
