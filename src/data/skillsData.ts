export interface SkillItem {
  id: string;
  name: string;
  shortCode: string;
  statusText: string;
  isLearning?: boolean;
  isFocus?: boolean;
  category: string;
  tagline: string;
  description: string;
  tags: string[];
  level: number; // 1 to 5
  experienceMonths: string;
  codeSnippet: {
    language: string;
    code: string;
    explanation: string;
  };
  interactiveType?: 'dom' | 'css' | 'js' | 'react' | 'ts' | 'ai' | 'python' | 'c' | 'sql';
}

export const SIMPLE_SKILLS: SkillItem[] = [
  {
    id: 'html5',
    name: 'HTML5',
    shortCode: 'H5',
    statusText: 'Core Foundation',
    isLearning: false,
    category: 'Web Standards',
    tagline: 'Semantic markup, accessibility & accessible DOM architecture',
    description: 'Clean semantic structure, accessible DOM hierarchies, SEO-optimized metadata, ARIA compliance, and high-performance document rendering.',
    tags: ['Semantic Tags', 'ARIA & a11y', 'SEO Structure', 'Responsive Media', 'Modern Web APIs'],
    level: 5,
    experienceMonths: '18+ Months',
    codeSnippet: {
      language: 'html',
      code: '<main id="app-root" role="main" aria-label="Portfolio Content">\n  <section className="grid-layout" data-state="active">\n    <article className="card">\n      <header><h1>Semantic Web</h1></header>\n    </article>\n  </section>\n</main>',
      explanation: 'Production semantic tree with accessible labeling & SEO metadata'
    },
    interactiveType: 'dom'
  },
  {
    id: 'css',
    name: 'CSS',
    shortCode: 'C3',
    statusText: 'Core Foundation',
    isLearning: false,
    category: 'Styling & Layout',
    tagline: 'Modern responsive systems, CSS Grid, Flexbox & micro-animations',
    description: 'Mastery of responsive layouts, multi-column CSS Grid, Flexbox alignment, fluid typography, GPU-accelerated keyframe animations, and Tailwind styling.',
    tags: ['CSS Grid & Flex', 'Fluid Layouts', 'Keyframe Motion', 'Tailwind CSS', 'Design Systems'],
    level: 5,
    experienceMonths: '18+ Months',
    codeSnippet: {
      language: 'css',
      code: '.editorial-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: clamp(1rem, 2vw, 2.5rem);\n  backdrop-filter: blur(16px);\n  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);\n}',
      explanation: 'Fluid CSS Grid with dynamic clamp sizing & hardware-accelerated transitions'
    },
    interactiveType: 'css'
  },
  {
    id: 'js',
    name: 'JS',
    shortCode: 'ES',
    statusText: 'Core Foundation',
    isLearning: false,
    category: 'Core Programming',
    tagline: 'Modern ES6+, async event streams & DOM manipulation',
    description: 'Modern ES6+ JavaScript, event orchestration, asynchronous promises, Fetch API integration, modular architecture, and high-performance DOM updates.',
    tags: ['ES6+ Syntax', 'Async / Await', 'DOM Orchestration', 'Event Emitters', 'RESTful Fetch'],
    level: 4,
    experienceMonths: '18+ Months',
    codeSnippet: {
      language: 'javascript',
      code: 'async function fetchStudioTelemetry(endpoint) {\n  const res = await fetch(`/api/${endpoint}`);\n  if (!res.ok) throw new Error("Telemetry offline");\n  const data = await res.json();\n  return Object.freeze(data);\n}',
      explanation: 'Asynchronous API pipeline with error boundaries & immutable data structures'
    },
    interactiveType: 'js'
  },
  {
    id: 'react',
    name: 'REACT.JS',
    shortCode: 'RC',
    statusText: 'Learning & Building',
    isLearning: true,
    category: 'Frontend Library',
    tagline: 'Component hierarchy, hooks, and reactive UI state workflows',
    description: 'Actively building single-page applications with declarative component hierarchies, custom React hooks, state synchronization, and Vite build systems.',
    tags: ['Component Tree', 'useState & useEffect', 'Custom Hooks', 'Props & Events', 'Vite & SPA Tooling'],
    level: 3,
    experienceMonths: 'Active Study',
    codeSnippet: {
      language: 'tsx',
      code: 'export const DynamicCounter = () => {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    const timer = setInterval(() => setCount(c => c + 1), 1000);\n    return () => clearInterval(timer);\n  }, []);\n  return <span className="font-mono">{count}</span>;\n};',
      explanation: 'Reactive state synchronization with cleanup lifecycle handlers'
    },
    interactiveType: 'react'
  },
  {
    id: 'typescript',
    name: 'TYPESCRIPT',
    shortCode: 'TS',
    statusText: 'Learning & Building',
    isLearning: true,
    category: 'Type Safety',
    tagline: 'Static typing, strict interfaces & predictable codebases',
    description: 'Learning strict type narrowing, custom interfaces, generics, TypeScript compile validation, and constructing resilient, refactor-friendly codebases.',
    tags: ['Strict Typing', 'Interfaces & Types', 'Type Inference', 'Generics Basics', 'Compiler Safety'],
    level: 3,
    experienceMonths: 'Active Study',
    codeSnippet: {
      language: 'typescript',
      code: 'interface ClientSpecification {\n  readonly id: string;\n  name: string;\n  budgetTier: "starter" | "suite" | "enterprise";\n  isDelivered: boolean;\n}\n\ntype ProjectResponse<T> = { data: T; timestamp: number };',
      explanation: 'Strict read-only contract definitions & generic response typings'
    },
    interactiveType: 'ts'
  },
  {
    id: 'ai-engineering',
    name: 'AI ENGINEERING',
    shortCode: 'AI',
    statusText: 'Active Focus',
    isLearning: false,
    isFocus: true,
    category: 'Emerging Craft',
    tagline: 'LLM integration, structured prompt workflows & agentic tools',
    description: 'Integrating modern AI models, structured prompt engineering, agentic development, real-time API chaining, and intelligent automation into web interfaces.',
    tags: ['Prompt Engineering', 'LLM API Integrations', 'AI Orchestration', 'Structured JSON Output', 'Agentic Workflows'],
    level: 4,
    experienceMonths: '12+ Months',
    codeSnippet: {
      language: 'typescript',
      code: 'const aiResponse = await gemini.generateContent({\n  model: "gemini-2.5-flash",\n  contents: [{ role: "user", parts: [{ text: userQuery }] }],\n  generationConfig: { temperature: 0.2, responseMimeType: "application/json" }\n});',
      explanation: 'Deterministic JSON inference orchestration via modern generative models'
    },
    interactiveType: 'ai'
  },
  {
    id: 'python',
    name: 'PYTHON',
    shortCode: 'PY',
    statusText: 'Core Language',
    isLearning: false,
    category: 'Backend & Automation',
    tagline: 'Server scripts, data pipelines, API services & AI integration',
    description: 'Writing clean Python backend services, asynchronous tasks, REST API endpoints, web scrapers, data processing pipelines, and AI orchestration scripts.',
    tags: ['FastAPI & Flask', 'AsyncIO Pipelines', 'Data Transformation', 'REST APIs', 'Automation Scripts'],
    level: 4,
    experienceMonths: '12+ Months',
    codeSnippet: {
      language: 'python',
      code: 'def ingest_client_payload(data: dict) -> dict:\n    processed = {k: v for k, v in data.items() if v is not None}\n    return {"status": "ok", "count": len(processed), "payload": processed}',
      explanation: 'Clean type-hinted data serialization with automated attribute filtering'
    },
    interactiveType: 'python'
  },
  {
    id: 'c',
    name: 'C',
    shortCode: 'C',
    statusText: 'Systems Foundations',
    isLearning: false,
    category: 'Systems Programming',
    tagline: 'Memory management, pointers, data structures & computational efficiency',
    description: 'Deep foundational comprehension of low-level computer architecture, manual heap/stack memory management via pointers, algorithmic optimization, and compiled execution.',
    tags: ['Pointers & Addresses', 'Dynamic Memory', 'Data Structures', 'Algorithmic Speed', 'Standard Library'],
    level: 3,
    experienceMonths: 'Academic Foundations',
    codeSnippet: {
      language: 'c',
      code: 'void allocate_buffer(int **buf, size_t n) {\n    *buf = (int *)malloc(n * sizeof(int));\n    if (*buf == NULL) exit(EXIT_FAILURE);\n}',
      explanation: 'Explicit dynamic heap allocation with pointer dereferencing safety checks'
    },
    interactiveType: 'c'
  },
  {
    id: 'sql',
    name: 'SQL',
    shortCode: 'SQL',
    statusText: 'Data Architecture',
    isLearning: false,
    category: 'Relational Databases',
    tagline: 'Relational schemas, complex JOINs, query indexing & ACID storage',
    description: 'Designing normalized relational databases, optimizing complex multi-table queries, indexing foreign keys, and ensuring ACID consistency across client data stores.',
    tags: ['PostgreSQL & MySQL', 'Complex JOIN Queries', 'Index Optimization', 'Schema Normalization', 'ACID Transactions'],
    level: 4,
    experienceMonths: '12+ Months',
    codeSnippet: {
      language: 'sql',
      code: 'SELECT c.id, c.business_name, COUNT(o.id) AS total_orders\nFROM clients c\nJOIN orders o ON c.id = o.client_id\nWHERE o.status = "completed"\nGROUP BY c.id, c.business_name\nORDER BY total_orders DESC;',
      explanation: 'High-performance aggregated relation query with indexed foreign keys'
    },
    interactiveType: 'sql'
  }
];
