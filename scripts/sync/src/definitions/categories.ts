import { ensureServerCategory } from '../db';

export let categories = [
  {
    name: 'Web Search',
    description:
      'Tools that allow models to search and retrieve real-time information from the internet.'
  },
  {
    name: 'Memory Management',
    description:
      'Services that provide persistent or contextual memory for models across sessions.'
  },
  {
    name: 'Browser Automation',
    description:
      'Servers enabling models to interact with and control web browsers programmatically.'
  },
  {
    name: 'Weather and Location Data',
    description: 'Access to current, forecast, or historical weather and geographic data.'
  },
  {
    name: 'Git Workflow Management',
    description:
      'Integrations that support version control operations, repositories, and collaborative coding workflows.'
  },
  {
    name: 'Business Tools',
    description:
      'Interfaces to common business platforms like CRMs, ERPs, and productivity suites.'
  },
  {
    name: 'Developer Tools',
    description:
      'Resources and utilities to assist with programming, debugging, and code generation.'
  },
  {
    name: 'Data Analytics',
    description:
      'Tools for querying, transforming, and visualizing structured and unstructured data.'
  },
  {
    name: 'Databases',
    description:
      'Connectors to various SQL and NoSQL databases for data access and manipulation.'
  },
  {
    name: 'Cloud Services',
    description:
      'Integrations with major cloud providers for computing, storage, and service orchestration.'
  },
  {
    name: 'Task and Project Management',
    description: 'Support for managing to-do lists, tasks, and complex project workflows.'
  },
  {
    name: 'Financial Data and Stock Market',
    description:
      'Real-time and historical financial market data, analytics, and trading interfaces.'
  },
  {
    name: 'APIs and HTTP Requests',
    description:
      'General-purpose tools for calling external APIs and handling HTTP requests and responses.'
  },
  {
    name: 'Email and Messaging',
    description: 'Send, receive, and analyze communications through email and chat platforms.'
  },
  {
    name: 'Scheduling and Calendars',
    description: 'Access and manage events, calendars, and meeting scheduling systems.'
  },
  {
    name: 'Document Processing',
    description:
      'Read, write, summarize, or edit documents in various formats like PDF, DOCX, and TXT.'
  },
  {
    name: 'File Management',
    description:
      'Upload, download, browse, and organize files across different storage systems.'
  },
  {
    name: 'Image and Video Generation',
    description:
      'Create, manipulate, or analyze visual content using AI models or third-party services.'
  },
  {
    name: 'Code Execution',
    description:
      'Run code snippets securely in isolated environments for testing or demonstration.'
  },
  {
    name: 'IoT and Device Control',
    description: 'Interact with and control smart devices, sensors, and embedded systems.'
  },
  {
    name: 'Security',
    description:
      'Tools for monitoring, analyzing, and responding to security threats and incidents.'
  },
  {
    name: 'Speech Recognition and Synthesis',
    description: 'Convert speech to text or text to speech using voice processing services.'
  },
  {
    name: 'Legal and Compliance',
    description:
      'Tools for understanding regulations, generating contracts, or performing legal research.'
  },
  {
    name: 'Healthcare and Medical',
    description: 'Access to clinical data, symptom checkers, or medical knowledge bases.'
  },
  {
    name: 'Education and Learning',
    description: 'Resources for tutoring, course content delivery, and educational data.'
  },
  {
    name: 'News and Media',
    description:
      'Retrieve and analyze news articles, headlines, and media mentions in real time.'
  },
  {
    name: 'E-commerce and Retail',
    description: 'Access product catalogs, inventory systems, and order management tools.'
  },
  {
    name: 'Language Translation',
    description: 'Services for translating text or speech between different languages.'
  },
  {
    name: 'CRM and Sales Tools',
    description: 'Manage customer relationships, leads, and sales pipelines.'
  },
  {
    name: 'HR and Recruiting',
    description:
      'Support for hiring workflows, resume analysis, and employee management systems.'
  },
  {
    name: 'Note-Taking and Knowledge Bases',
    description: 'Capture and organize ideas, documents, and structured notes.'
  },
  {
    name: 'Smart Home and Automation',
    description: 'Interact with home automation systems, sensors, and appliances.'
  },
  {
    name: 'Gaming and Game Development',
    description:
      'Tools and APIs related to game mechanics, content generation, and player data.'
  },
  {
    name: 'Simulation and Modeling',
    description: 'Run simulations or mathematical models for research or engineering purposes.'
  },
  {
    name: 'Scientific Research Tools',
    description: 'Access research databases, papers, and computational science services.'
  },
  {
    name: 'Content Creation',
    description: 'Assistance in creating blogs, articles, social posts, or creative writing.'
  },
  {
    name: 'Virtual Assistants',
    description: 'Agent-oriented tools for multi-modal task management and coordination.'
  },
  {
    name: 'Blockchain and Crypto',
    description: 'Query blockchain networks, manage wallets, or track cryptocurrency data.'
  },
  {
    name: 'Math and Statistics',
    description: 'Perform mathematical operations, analysis, and symbolic computation.'
  },
  {
    name: 'Digital Marketing',
    description: 'Plan, track, and optimize campaigns across email, search, and social media.'
  },
  {
    name: 'Social Media',
    description: 'Manage and analyze content and engagement across social platforms.'
  },
  {
    name: 'Open Source Data',
    description: 'Integrations with open-source platforms for data engineering and analytics.'
  },
  {
    name: 'Real-Time Collaboration',
    description: 'Work together in live sessions with shared tools, editors, or whiteboards.'
  },
  {
    name: 'Live Audio and Video',
    description: 'Capture, stream, or analyze real-time audio/video content.'
  },
  {
    name: 'Monitoring and Logging',
    description:
      'Collect and review system logs, application metrics, and alerting information.'
  },
  {
    name: 'DevOps and CI/CD',
    description: 'Integrate and automate software deployment pipelines and operations tooling.'
  },
  {
    name: 'File Conversion',
    description: 'Convert between file types such as CSV to JSON, image formats, and more.'
  },
  {
    name: 'Data Labeling and Annotation',
    description: 'Prepare training datasets with structured labels for machine learning.'
  },
  {
    name: 'Multimodal Input Processing',
    description:
      'Handle inputs that combine text, images, audio, and video in a single context.'
  }
];

export let storedCategories = await Promise.all(
  categories.map(async category =>
    ensureServerCategory(() => ({
      identifier: category.name.toLowerCase().replace(/\s+/g, '-'),
      name: category.name,
      description: category.description
    }))
  )
);

export let getStoredCategory = (name: string) =>
  storedCategories.find(c => c.name.toLowerCase() === name.toLowerCase());
