import { OpenAI } from 'openai';

export let ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
