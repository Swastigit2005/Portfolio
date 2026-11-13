/* ==========================================================
   Swasti Jain · portfolio
   Plain JS, no build step. Data lives at the top of the file.
   ========================================================== */

const GH = 'https://github.com/Swastigit2005';
const EMAIL = 'swastiworkspace@gmail.com';

/* ---------------- PROJECTS ---------------- */
// status: shipped | foundations   (High priority = shown under Featured)
// priority tag: High | Medium | Low  (what a recruiter should open first)
const PROJECTS = [
  {
    id: 'polygraph',
    title: 'Polygraph',
    emoji: '🕵️',
    tagline: 'Agentic RAG that grades its own retrieval, plus a harness that scores every decision.',
    desc: 'Self-correcting LangGraph RAG agent with a 70-question evaluation harness.',
    lists: ['agents'],
    status: 'shipped',
    priority: 'High',
    stack: ['LangGraph', 'Groq', 'ChromaDB', 'BM25', 'Ragas', 'DeepEval', 'Langfuse', 'Streamlit'],
    metrics: [['77→87%', 'Recall@k with hybrid search'], ['88→96%', 'accuracy with self-reflection'], ['70', 'eval questions']],
    thread: [
      ['me', 'Problem', 'Most RAG demos only check whether the final answer is right. I wanted to score each decision the agent makes along the way.'],
      ['bot', 'retrieve', 'Hybrid BM25 + dense search fused with RRF, then a cross-encoder reranks the results. The knowledge base is 242 pages of Docker docs.'],
      ['bot', 'grade_context', 'The agent returns a structured verdict on whether the context is relevant. If it isn\'t, it rewrites the query and retries, up to a limit.'],
      ['bot', 'refuse', 'Once the retries run out, it says "I couldn\'t find this in the knowledge base" instead of guessing.'],
      ['me', 'Result', 'Every node writes a trace. Ragas, DeepEval and Langfuse score those traces, which is how I measured the improvements above. Everything runs on free tiers.'],
    ],
    links: [['Live demo', 'https://polygraph-agentic-rag.vercel.app'], ['GitHub', `${GH}/Polygraph-An-Evaluation-Framework-for-Agentic`]],
  },
  {
    id: 'papertrail',
    title: 'PaperTrail',
    emoji: '🧾',
    tagline: 'Document AI that reads the bill and checks it against the prescription.',
    desc: 'Vision-LLM extraction plus cross-document validation for bills, prescriptions, GST invoices and POs.',
    lists: ['docs'],
    status: 'shipped',
    priority: 'High',
    stack: ['Groq Vision', 'Tesseract OCR', 'Pydantic', 'FastAPI', 'Docker', 'Vercel'],
    metrics: [['91–95%', 'extraction F1'], ['72–80%', 'OCR + LLM baseline'], ['120', 'document pairs']],
    thread: [
      ['me', 'Problem', 'Errors on real documents usually show up between two documents: a drug that\'s billed but was never prescribed, or a PO total that doesn\'t match the invoice.'],
      ['bot', 'extract', 'A vision LLM pulls typed, Pydantic-validated fields out of scanned bills, prescriptions, GST invoices and purchase orders.'],
      ['bot', 'cross_check', 'Related documents are checked against each other for unprescribed drugs, overbilling and invalid GSTINs, and anything suspicious is flagged for human review.'],
      ['me', 'Result', 'Benchmarked on 120 document pairs: 91–95% F1, compared with 72–80% for an OCR + LLM baseline. Served with FastAPI, containerised with Docker, deployed on Vercel.'],
    ],
    links: [['Live demo', 'https://paper-trail-jade.vercel.app'], ['GitHub', `${GH}/PaperTrail`]],
  },
  {
    id: 'handshake',
    title: 'Handshake',
    emoji: '🤝',
    tagline: 'Revenue recovery for checkouts where the buyer is an AI agent.',
    desc: 'Razorpay AI Buildathon (Track 03): diagnoses why AI shopping agents abandon checkout, repairs it and recovers the sale.',
    lists: ['agents', 'hack'],
    status: 'shipped',
    priority: 'High',
    stack: ['Python', 'FastAPI', 'Docker', 'GitHub Actions', 'Render'],
    metrics: [['11', 'diagnosis rules'], ['12', 'failure modes in the demo'], ['2', 'modes: recovery + prevention']],
    thread: [
      ['me', 'Problem', 'AI agents now shop for people, and they abandon checkout for reasons humans don\'t, like a missing field or a basket ₹180 over a spending cap. You can\'t email a bot a coupon.'],
      ['bot', 'recover', 'A one-line middleware streams agent journeys. When one stops, Handshake works out the cause from the HTTP trace alone, sends the merchant a signed webhook, and offers the agent a fix.'],
      ['bot', 'prevent', 'It also runs agent buyers against a catalogue on purpose, ranks defects by the basket value they lose, and re-runs the same buyers after a fix to measure the difference.'],
      ['me', 'Result', 'Fully offline and deterministic by default, with CI tests. Built for the Razorpay AI Buildathon.'],
    ],
    links: [['Live demo', 'https://handshake-console.onrender.com/'], ['GitHub', `${GH}/Handshake_razorpay`]],
  },
  {
    id: 'autopatch',
    title: 'AutoPatch',
    emoji: '🩹',
    tagline: 'A self-healing debugging agent that learns from the repo\'s own git history.',
    desc: 'Closed-loop agent: run tests, retrieve how a similar bug was fixed before, patch, re-run. Exposed as an MCP server.',
    lists: ['agents', 'mcp'],
    status: 'shipped',
    priority: 'High',
    stack: ['LangGraph', 'MCP', 'ChromaDB', 'Groq', 'pytest', 'Streamlit'],
    metrics: [['4', 'MCP tools'], ['pytest', 'real test feedback'], ['git log', 'used as memory']],
    thread: [
      ['me', 'Idea', 'Most repos already contain the fix for their next bug, buried in the commit history.'],
      ['bot', 'run_tests', 'Runs pytest. If everything passes, it stops.'],
      ['bot', 'retrieve_precedent', 'On a failure, it searches a ChromaDB index of the repo\'s commit messages and diffs for a similar past fix.'],
      ['bot', 'propose_patch', 'A Groq LLM writes a function-level patch based on that past fix, applies it, and re-runs the tests until they pass or the retry cap is reached.'],
      ['me', 'Result', 'The same loop is exposed as four MCP tools, so Claude Desktop, Cursor or a LangGraph agent can drive it.'],
    ],
    links: [['GitHub', `${GH}/Autopatch-MCP-server`]],
  },
  {
    id: 'ticket',
    title: 'Enterprise Ticket Resolution Assistant',
    emoji: '🎫',
    tagline: 'Step-by-step fixes for new IT tickets, grounded in tickets already solved.',
    desc: 'RAG system with FastAPI, MySQL storage and a Streamlit console for support engineers.',
    lists: ['agents'],
    status: 'shipped',
    priority: 'Medium',
    stack: ['LangChain', 'Groq', 'ChromaDB', 'Sentence-Transformers', 'MySQL', 'FastAPI', 'Streamlit'],
    metrics: [['RAG', 'over past tickets'], ['REST', 'FastAPI service'], ['UI', 'Streamlit console']],
    thread: [
      ['me', 'Problem', 'Support teams fix the same incidents over and over, and the answer usually already exists in an old ticket.'],
      ['bot', 'retrieve', 'Sentence-Transformer embeddings in ChromaDB find the most similar resolved tickets.'],
      ['bot', 'generate', 'A Groq LLM turns them into a step-by-step resolution for the new ticket.'],
      ['me', 'Result', 'Served over FastAPI with MySQL storage. This was the starting point for the LangGraph agent I later built at Persistent Systems.'],
    ],
    links: [['GitHub', `${GH}/Enterprise-Ticket-Resolution-Assistant`]],
  },
  {
    id: 'shakti',
    title: 'ShaktiAI',
    emoji: '🛡️',
    tagline: 'An AI safety, legal-aid and empowerment app for women in India.',
    desc: 'Finalist, Microsoft Hackathon. Android app with 8 specialised AI modules.',
    lists: ['hack'],
    status: 'shipped',
    priority: 'Medium',
    stack: ['Kotlin', 'Android', 'Gemini API', 'NLP', 'XGBoost'],
    metrics: [['Finalist', 'Microsoft Hackathon'], ['8', 'AI modules']],
    thread: [
      ['me', 'Why', 'Safety, legal help and financial literacy usually live in separate apps. ShaktiAI puts them in one place.'],
      ['bot', 'modules', 'Guardian AI raises distress alerts, Nyaya AI answers legal questions about women\'s rights, DhanShakti gives budgeting advice, and Sathi offers emotional support.'],
      ['me', 'Result', 'Reached the finals of the Microsoft Hackathon. Built as a native Android app with Gemini as the main AI service.'],
    ],
    links: [['GitHub', `${GH}/SHAKTI-AI`]],
  },
  {
    id: 'wedding',
    title: 'Wedding Photo Selector',
    emoji: '📸',
    tagline: 'Thousands of wedding shots, ranked down to the ones worth keeping.',
    desc: 'Built at Fotographiya: face detection, CLIP scoring and emotion recognition in one ranking pipeline.',
    lists: ['vision'],
    status: 'shipped',
    priority: 'Medium',
    stack: ['Python', 'OpenCV', 'CLIP', 'Face detection', 'Emotion recognition'],
    metrics: [['CLIP', 'aesthetic scoring'], ['dedupe', 'near-duplicate removal']],
    thread: [
      ['me', 'Context', 'Photographers spend days culling wedding shoots. This was my internship project at Fotographiya.'],
      ['bot', 'score', 'Each frame is scored on face quality, exposure, background, CLIP aesthetics and the emotions detected in faces.'],
      ['bot', 'dedupe', 'Near-duplicate bursts are collapsed so only the best frame from each moment remains.'],
    ],
    links: [['GitHub', `${GH}/Wedding-image-selector`], ['Related repo', `${GH}/Photo-selector`]],
  },
  {
    id: 'sculpture',
    title: 'Heritage Sculpture Damage AI',
    emoji: '🏛️',
    tagline: 'Finding and repairing damage in heritage sculpture images.',
    desc: 'IISc Bengaluru research: YOLO damage detection, semi-supervised texture classification, Stable Diffusion inpainting.',
    lists: ['vision'],
    status: 'shipped',
    priority: 'Medium',
    stack: ['PyTorch', 'YOLO', 'Stable Diffusion', 'Semi-supervised learning'],
    metrics: [['YOLO', 'multi-class damage'], ['SD', 'inpainting restore']],
    thread: [
      ['me', 'Context', 'A research internship at IISc Bengaluru on digitally preserving damaged heritage sculptures.'],
      ['bot', 'detect', 'Trained a YOLO model to detect several kinds of damage, plus a semi-supervised classifier for damaged vs. undamaged images and texture type.'],
      ['bot', 'restore', 'I surveyed image-completion methods, then used Stable Diffusion inpainting to restore the damaged regions.'],
    ],
    links: [['GitHub', `${GH}/Sculpture-classifier`]],
  },
  {
    id: 'chat',
    title: 'Chat AI Assistant',
    emoji: '💬',
    tagline: 'A LangGraph chat agent with tools, streaming and memory.',
    desc: 'Tool-using agent with web search, a calculator and stock prices, streaming responses and SQLite-backed threads.',
    lists: ['agents'],
    status: 'shipped',
    priority: 'Low',
    stack: ['LangGraph', 'LangChain', 'SQLite', 'Streamlit'],
    metrics: [['3', 'tools'], ['SQLite', 'checkpointing']],
    thread: [
      ['me', 'Why', 'I built this to learn LangGraph well, step by step.'],
      ['bot', 'build', 'Each version adds one feature: a basic chat, then streaming, then SQLite persistence, then multiple threads, then tool calling.'],
    ],
    links: [['GitHub', `${GH}/Chat-AI-Assistant`]],
  },
  {
    id: 'expense',
    title: 'Expense Tracker MCP',
    emoji: '💸',
    tagline: 'Track expenses by talking to Claude or Cursor.',
    desc: 'FastMCP server with tools to add, list and summarise expenses, stored locally in SQLite.',
    lists: ['mcp'],
    status: 'shipped',
    priority: 'Low',
    stack: ['FastMCP', 'MCP', 'SQLite', 'Python'],
    metrics: [['3', 'MCP tools'], ['1', 'MCP resource']],
    thread: [
      ['bot', 'tools', 'add_expense, list_expenses and summarize, plus a categories resource that clients can read.'],
      ['me', 'Note', 'It\'s local-first and portable. You can change the categories without restarting the server.'],
    ],
    links: [['GitHub', `${GH}/Expense-tracker-mcp-server`], ['Remote MCP variant', `${GH}/Remote-mcp-server`]],
  },
  {
    id: 'bert',
    title: 'Customer Service Chatbot',
    emoji: '🎧',
    tagline: 'A fine-tuned BERT model that routes electronics-store questions.',
    desc: 'Intent classification for recommendations, prices, order tracking, support and refunds.',
    lists: ['ml'],
    status: 'shipped',
    priority: 'Low',
    stack: ['Hugging Face', 'BERT', 'PyTorch', 'Flask'],
    metrics: [['6+', 'intents'], ['BERT', 'fine-tuned']],
    thread: [['bot', 'build', 'Fine-tuned BERT on store-specific intents and served it through a Flask REST API with a built-in chat UI.']],
    links: [['GitHub', `${GH}/Customer-service-AI-Chatbot`]],
  },
  {
    id: 'classics',
    title: 'Classic ML notebooks',
    emoji: '📊',
    tagline: 'The fundamentals, done by hand.',
    desc: 'Credit-card fraud, spam detection, diabetes prediction, insurance cost regression and face recognition.',
    lists: ['ml', 'vision'],
    status: 'foundations',
    priority: 'Low',
    stack: ['scikit-learn', 'Pandas', 'NumPy', 'OpenCV'],
    metrics: [['5', 'end-to-end notebooks']],
    thread: [['me', 'Why', 'Before working on agents, I built the basics: feature engineering, class imbalance, model evaluation and live face recognition.']],
    links: [
      ['Fraud detection', `${GH}/Credit-Card-Fraud-detection`],
      ['Spam mail', `${GH}/Spam-Mail-Prediction`],
      ['Insurance cost', `${GH}/Medical-Insurance-Cost-Prediction`],
      ['Live face recognition', `${GH}/Live-Face-Recognition`],
    ],
  },
];

const GROUPS = [
  { key: 'featured', label: 'Featured', ring: 'ring--live', test: (p) => p.status !== 'foundations' && p.priority === 'High' },
  { key: 'more', label: 'More projects', ring: 'ring--done', test: (p) => p.status !== 'foundations' && p.priority !== 'High' },
  { key: 'foundations', label: 'Foundations', ring: '', test: (p) => p.status === 'foundations' },
];
const LIST_NAMES = { all: 'All tasks', agents: 'Agents & RAG', docs: 'Document AI', mcp: 'MCP servers', vision: 'Computer vision', hack: 'Hackathons', ml: 'ML & NLP' };

/* ---------------- RECORD ---------------- */
const RECORD = [
  {
    icon: '⚙️', time: 'May 2026 – Jul 2026', kind: 'Internship · Pune', featured: true,
    title: 'Generative AI Intern', org: 'Persistent Systems, Pune',
    points: ['Built an autonomous LangGraph AI agent that turns past incidents into reusable ticket-resolution workflows.', 'Grounded the LLM in similar tickets retrieved from a ChromaDB vector database, and served it through FastAPI REST APIs.'],
    tags: ['LangGraph', 'ChromaDB', 'FastAPI', 'Agents'],
  },
  {
    icon: '🤖', time: 'Recent internship', kind: 'Internship',
    title: 'AI Intern', org: 'Sahajtha AI Private Limited',
    points: ['Built a Reddit AI agent.'],
    tags: ['AI Agents', 'LLMs'],
  },
  {
    icon: '🤝', time: '2026', kind: 'Buildathon',
    title: 'Handshake: agent-checkout recovery', org: 'Razorpay AI Buildathon · Track 03',
    points: ['Built recovery and prevention for checkouts abandoned by AI shopping agents, with recovered revenue attributed in rupees.'],
    tags: ['Agents', 'FastAPI', 'Payments'],
  },
  {
    icon: '🏆', time: 'Hackathon', kind: 'Finalist',
    title: 'Finalist', org: 'Microsoft Hackathon',
    points: ['Built ShaktiAI, an AI-powered app for women\'s safety and legal aid.'],
    tags: ['Android', 'Gemini', 'Social impact'],
  },
  {
    icon: '📸', time: 'Jun 2025 – Jul 2025', kind: 'Internship',
    title: 'AI/ML Intern', org: 'Fotographiya',
    points: ['Built a Python pipeline that ranks wedding photos using face detection, CLIP scoring and emotion recognition.', 'Added OpenCV checks for face quality, exposure and background, plus near-duplicate removal.'],
    tags: ['OpenCV', 'CLIP', 'Computer vision'],
  },
  {
    icon: '🏛️', time: 'Dec 2024 – Feb 2025', kind: 'Research',
    title: 'Machine Learning Research Intern', org: 'IISc Bengaluru',
    points: ['Trained a YOLO object detection model for multi-class damage detection in heritage-sculpture images.', 'Restored damaged regions with Stable Diffusion inpainting after surveying image-completion methods.'],
    tags: ['YOLO', 'Stable Diffusion', 'PyTorch', 'Research'],
  },
  {
    icon: '🌱', time: 'First internship', kind: 'Internship · Hybrid',
    title: 'Machine Learning Trainee', org: 'ThinkWave Technologies Limited',
    points: ['My first internship, where I learned Python and the fundamentals of machine learning.'],
    tags: ['Python', 'Machine learning'],
  },
  {
    icon: '🍱', time: 'Hackathon', kind: 'Finalist',
    title: 'Finalist', org: 'NIT Agartala Hackathon · North East Summit',
    points: ['Built a Food Management System to reduce food waste.'],
    tags: ['Social impact'],
  },
  {
    icon: '🎓', time: 'Expected 2027', kind: 'Education',
    title: 'B.Tech, Information Technology', org: 'Rajasthan Technical University, Kota',
    points: ['CGPA 9.0 / 10.'],
    tags: ['Education'],
  },
];

/* ---------------- STACK ----------------
   Drawn as an architecture stack, top layer first: [layer, purpose, colour, tools[[name, logo]]] */
const STACK = [
  ['Interface & delivery', 'how people use it', '#e9b9a3', [
    ['FastAPI', 'fastapi.svg'], ['Streamlit', 'streamlit.svg'], ['Pydantic', 'pydantic.svg'], ['Docker', 'docker.svg'],
    ['GitHub Actions', 'githubactions.svg'], ['Vercel', 'vercel.svg'], ['Render', 'render.svg'], ['Git', 'git.svg'],
  ]],
  ['Agents & orchestration', 'how it decides', '#a9cbc6', [
    ['LangGraph', 'langgraph.svg'], ['LangChain', 'langchain.svg'], ['MCP', 'modelcontextprotocol.svg'],
  ]],
  ['Models', 'how it thinks and sees', '#c9bde0', [
    ['Groq', 'groq.svg'], ['Gemini', 'googlegemini.svg'], ['OpenAI · CLIP', 'openai.svg'], ['Hugging Face', 'huggingface.svg'],
    ['PyTorch', 'pytorch.svg'], ['YOLO', 'ultralytics.svg'], ['Stable Diffusion', 'stability.png'], ['OpenCV', 'opencv.svg'], ['scikit-learn', 'scikitlearn.svg'],
  ]],
  ['Retrieval & memory', 'what it knows', '#ecd59a', [
    ['ChromaDB', 'chroma.svg'], ['MySQL', 'mysql.svg'], ['SQLite', 'sqlite.svg'],
  ]],
  ['Evaluation & tracing', 'how I prove it works', '#b9d0ad', [
    ['Ragas', 'ragas.png'], ['DeepEval', 'deepeval.svg'], ['Langfuse', 'langfuse.svg'],
  ]],
  ['Foundation', 'what it is written in', '#c4ccd3', [
    ['Python', 'python.svg'], ['NumPy', 'numpy.svg'], ['Pandas', 'pandas.svg'], ['C++', 'cplusplus.svg'], ['Kotlin', 'kotlin.svg'],
  ]],
];

/* ---------------- AGENT KNOWLEDGE BASE ---------------- */
const KB = [
  {
    keys: ['hire', 'why', 'stand out', 'different', 'strength', 'good fit', 'summary', 'about', 'who'],
    src: 'resume.summary',
    a: [
      'Three reasons. First, she ships complete systems, not notebooks: agentic RAG (<a href="#work" data-open="polygraph">Polygraph</a>), document AI (<a href="#work" data-open="papertrail">PaperTrail</a>), agent checkout recovery (<a href="#work" data-open="handshake">Handshake</a>) and MCP tooling (<a href="#work" data-open="autopatch">AutoPatch</a>).',
      'Second, she measures. She builds her own eval harnesses and reports before-and-after numbers, for example Recall@k going from 77% to 87%.',
      'Third, she has real industry experience: as a Generative AI Intern at <b>Persistent Systems, Pune</b>, she built an autonomous LangGraph agent for ticket resolution. She has also done ML research at IISc Bengaluru and computer vision at Fotographiya, across five internships, all with a 9.0 CGPA.',
    ],
  },
  {
    keys: ['best', 'favorite', 'favourite', 'proud', 'flagship', 'top project', 'polygraph', 'rag'],
    src: 'projects/polygraph',
    a: [
      'Probably <a href="#work" data-open="polygraph">Polygraph</a>. It\'s a LangGraph RAG agent that grades its own retrieved context, rewrites weak queries and refuses unanswerable questions rather than hallucinating.',
      'It also has a 70-question eval harness. Hybrid search raised Recall@k from 77% to 87%, and self-reflection raised accuracy from 88% to 96%. <a href="https://polygraph-agentic-rag.vercel.app" target="_blank" rel="noopener">Try it ↗</a>',
    ],
  },
  {
    keys: ['sahajtha', 'reddit', 'current', 'recent', 'latest', 'now'],
    src: 'record/sahajtha',
    a: ['Her most significant recent role was as a Generative AI Intern at <b>Persistent Systems, Pune</b> (May–Jul 2026), where she built an autonomous LangGraph agent for ticket resolution. After that she built a Reddit AI agent during a short internship at Sahajtha AI.'],
  },
  {
    keys: ['thinkwave', 'first internship', 'first job', 'started', 'begin', 'trainee'],
    src: 'record/thinkwave',
    a: ['Her first internship was at <b>ThinkWave Technologies Limited</b>, a hybrid role as a Machine Learning Trainee. That\'s where she learned Python and the fundamentals of machine learning.'],
  },
  {
    keys: ['internships', 'intern', 'experience', 'worked', 'companies', 'work history'],
    src: 'record/all',
    a: ['Five internships. The headline one is <b>Persistent Systems, Pune</b>, where she built a LangGraph ticket-resolution agent. The others are <b>IISc Bengaluru</b> (ML research), <b>Fotographiya</b> (computer vision), Sahajtha AI (a Reddit AI agent) and <b>ThinkWave Technologies</b> (ML trainee, where she started). <a href="#record">See the full record</a>.'],
  },
  {
    keys: ['persistent', 'job', 'industry'],
    src: 'record/persistent',
    a: [
      'At <b>Persistent Systems, Pune</b> (May–Jul 2026) she was a Generative AI Intern. She built an autonomous LangGraph agent that turns past incidents into reusable ticket-resolution workflows.',
      'The LLM is grounded in similar tickets retrieved from ChromaDB and served through FastAPI REST APIs.',
    ],
  },
  {
    keys: ['iisc', 'research', 'sculpture', 'yolo', 'stable diffusion', 'heritage', 'bengaluru', 'bangalore'],
    src: 'record/iisc',
    a: ['At <b>IISc Bengaluru</b> (Dec 2024 – Feb 2025) she trained a YOLO model for multi-class damage detection in heritage-sculpture images, then restored the damaged regions with Stable Diffusion inpainting after surveying image-completion methods.'],
  },
  {
    keys: ['fotographiya', 'wedding', 'photo', 'clip', 'opencv', 'vision'],
    src: 'record/fotographiya',
    a: ['At <b>Fotographiya</b> she built a pipeline that ranks wedding photos using face detection, CLIP scoring and emotion recognition. It includes OpenCV checks for face quality, exposure and background, and removes near-duplicates.'],
  },
  {
    keys: ['eval', 'evaluate', 'evaluation', 'test', 'measure', 'metric', 'ragas', 'deepeval', 'langfuse', 'hallucinat'],
    src: 'projects/polygraph/eval',
    a: [
      'She scores each decision the agent makes, not just the final answer. In Polygraph, every node writes a structured trace, and Ragas, DeepEval and Langfuse score it for refusals, retrieval quality and faithfulness.',
      'In PaperTrail she benchmarked against a baseline on 120 document pairs: 91–95% F1 for her system versus 72–80% for OCR + LLM.',
    ],
  },
  {
    keys: ['stack', 'tech', 'tools', 'skills', 'language', 'framework', 'python', 'know'],
    src: 'resume.skills',
    a: [
      '<b>Agents:</b> LangGraph, LangChain, MCP, tool calling, Groq, Gemini. <b>Retrieval and evals:</b> ChromaDB, BM25 hybrid search, Ragas, DeepEval, Langfuse.',
      '<b>ML:</b> PyTorch, Hugging Face, OpenCV, YOLO, CLIP, Stable Diffusion. <b>Shipping:</b> FastAPI, Docker, GitHub Actions, Vercel and Render. Python every day, plus SQL and C++. <a href="#stack">See the full stack</a>.',
    ],
  },
  {
    keys: ['document', 'papertrail', 'ocr', 'invoice', 'bill', 'gst', 'prescription'],
    src: 'projects/papertrail',
    a: ['<a href="#work" data-open="papertrail">PaperTrail</a> uses vision LLMs to extract validated fields from bills, prescriptions, GST invoices and POs. It then cross-checks related documents for unprescribed drugs, overbilling and GSTIN issues. It scores 91–95% F1, compared with 72–80% for an OCR + LLM baseline. <a href="https://paper-trail-jade.vercel.app" target="_blank" rel="noopener">Live demo ↗</a>'],
  },
  {
    keys: ['mcp', 'model context protocol', 'autopatch', 'debug', 'self-healing'],
    src: 'projects/mcp',
    a: ['She has built several MCP servers. <a href="#work" data-open="autopatch">AutoPatch</a> is a self-healing debugging agent: it runs tests, finds how a similar bug was fixed in the repo\'s git history, patches the code and re-runs the tests, all exposed as MCP tools. She also built an <a href="#work" data-open="expense">Expense Tracker MCP</a> server and a remote MCP server.'],
  },
  {
    keys: ['hackathon', 'award', 'achievement', 'microsoft', 'shakti', 'finalist', 'razorpay', 'handshake', 'buildathon'],
    src: 'record/achievements',
    a: ['She was a finalist at the <b>Microsoft Hackathon</b> with <a href="#work" data-open="shakti">ShaktiAI</a>, an app for women\'s safety and legal aid, and at the <b>NIT Agartala Hackathon</b> with a food-waste management system. She also built <a href="#work" data-open="handshake">Handshake</a> for the Razorpay AI Buildathon.'],
  },
  {
    keys: ['education', 'college', 'university', 'degree', 'cgpa', 'gpa', 'graduat', 'study', 'student'],
    src: 'resume.education',
    a: ['She is doing a B.Tech in Information Technology at Rajasthan Technical University, Kota, graduating in 2027, with a CGPA of 9.0/10.'],
  },
  {
    keys: ['contact', 'email', 'reach', 'linkedin', 'phone', 'call', 'interview', 'available', 'resume', 'cv'],
    src: 'contact',
    a: [`Email is fastest: <a href="mailto:${EMAIL}">${EMAIL}</a>. You can also find her on <a href="https://linkedin.com/in/swasti-jain2005" target="_blank" rel="noopener">LinkedIn ↗</a>, or <a href="assets/Swasti_Jain_Resume.pdf" target="_blank" rel="noopener">download her résumé ↗</a>. She's open to GenAI and ML engineering roles.`],
  },
  {
    keys: ['hi', 'hello', 'hey', 'namaste'],
    src: 'smalltalk',
    a: ['Hello! Ask me about Swasti\'s projects, internships, evals or stack. Or try "why hire her?"'],
  },
];

/* ==========================================================
   HELPERS
   ========================================================== */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('is-on');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('is-on'), 2200);
}

/* ==========================================================
   THEME
   ========================================================== */
$('#themeToggle').addEventListener('click', () => {
  const root = document.documentElement;
  const isDark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = isDark ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
});

/* ==========================================================
   NAV: scrolled state + active link
   ========================================================== */
const nav = $('#nav');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const navLinks = $$('.nav__links a');
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
['work', 'ask', 'record', 'numbers', 'stack'].forEach((id) => { const el = document.getElementById(id); if (el) spy.observe(el); });

/* ==========================================================
   COMMAND CENTER
   ========================================================== */
let currentList = 'all';
function countFor(list) { return list === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.lists.includes(list)).length; }
$$('[data-count]').forEach((el) => { el.textContent = countFor(el.dataset.count); });

function renderTasks() {
  const items = currentList === 'all' ? PROJECTS : PROJECTS.filter((p) => p.lists.includes(currentList));
  $('#appCount').textContent = `${LIST_NAMES[currentList]} · ${items.length} task${items.length === 1 ? '' : 's'}`;
  const html = GROUPS.map((g) => {
    const rows = items.filter(g.test);
    if (!rows.length) return '';
    return `<div class="group">
      <div class="group__head"><span class="ring ${g.ring}"></span>${g.label} <em>${rows.length}</em></div>
      ${rows.map((p, i) => `
        <button class="task" data-id="${p.id}" style="animation-delay:${i * 40}ms">
          <span class="task__check ${p.status === 'foundations' ? '' : 'is-done'}"></span>
          <span>
            <div class="task__title">${esc(p.title)}</div>
            <div class="task__desc">${esc(p.desc)}</div>
          </span>
          <span class="task__meta">
            <span class="tag ${p.priority === 'High' ? 'tag--high' : p.priority === 'Medium' ? 'tag--med' : 'tag--low'}">${p.priority}</span>
            <span class="emoji" aria-hidden="true">${p.emoji}</span>
          </span>
        </button>`).join('')}
    </div>`;
  }).join('');
  $('#taskList').innerHTML = html || '<div class="empty">No tasks in this list.</div>';
}
$$('.side__item').forEach((b) => b.addEventListener('click', () => {
  $$('.side__item').forEach((x) => x.classList.toggle('is-active', x === b));
  currentList = b.dataset.list;
  renderTasks();
}));
$('#taskList').addEventListener('click', (e) => {
  const t = e.target.closest('.task');
  if (t) openDrawer(t.dataset.id, t);
});
renderTasks();

/* ==========================================================
   DRAWER
   ========================================================== */
const drawer = $('#drawer');
const scrim = $('#scrim');
let lastFocus = null;

function openDrawer(id, from) {
  const p = PROJECTS.find((x) => x.id === id);
  if (!p) return;
  lastFocus = from || document.activeElement;
  const listLabels = p.lists.map((l) => `<span class="tag tag--neutral">${esc(LIST_NAMES[l])}</span>`).join('');
  $('#drawerInner').innerHTML = `
    <div class="drawer__top">
      <span class="drawer__crumb">workspace / ${esc(LIST_NAMES[p.lists[0]].toLowerCase())} / ${p.id}</span>
      <button class="icon-btn" id="drawerClose" aria-label="Close">✕</button>
    </div>
    <div style="font-size:2rem;margin-bottom:8px" aria-hidden="true">${p.emoji}</div>
    <h3 id="drawerTitle">${esc(p.title)}</h3>
    <p class="drawer__tagline">${esc(p.tagline)}</p>
    <dl class="drawer__props">
      <dt>Priority</dt><dd><span class="tag ${p.priority === 'High' ? 'tag--high' : p.priority === 'Medium' ? 'tag--med' : 'tag--low'}">${p.priority}</span></dd>
      <dt>Lists</dt><dd>${listLabels}</dd>
      <dt>Stack</dt><dd>${p.stack.map((s) => `<span class="tag tag--neutral">${esc(s)}</span>`).join('')}</dd>
    </dl>
    <div class="drawer__metrics">${p.metrics.map(([v, l]) => `<div class="dm"><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join('')}</div>
    <div class="thread__label">Thread</div>
    <ul class="thread">
      ${p.thread.map(([who, label, text], i) => `
        <li style="animation-delay:${i * 70}ms">
          <span class="who">${who === 'me' ? '<img src="assets/swasti.jpg" alt="Swasti" />' : '✶'}</span>
          <div class="bubble"><small>${who === 'me' ? 'Swasti' : 'agent'} · ${esc(label)}</small>${esc(text)}</div>
        </li>`).join('')}
    </ul>
    <div class="drawer__links">
      ${p.links.map(([l, u], i) => `<a class="btn ${i === 0 ? 'btn--dark' : 'btn--ghost'} btn--sm" href="${u}" target="_blank" rel="noopener">${esc(l)} ↗</a>`).join('')}
    </div>`;
  scrim.hidden = false;
  requestAnimationFrame(() => { scrim.classList.add('is-open'); drawer.classList.add('is-open'); });
  drawer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  drawer.scrollTop = 0;
  $('#drawerClose').addEventListener('click', closeDrawer);
  setTimeout(() => $('#drawerClose').focus(), 50);
  try { history.replaceState(null, '', '#' + p.id); } catch (e) {}
}
function closeDrawer() {
  if (!drawer.classList.contains('is-open')) return;
  drawer.classList.remove('is-open');
  scrim.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { scrim.hidden = true; }, 300);
  try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
scrim.addEventListener('click', closeDrawer);
drawer.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const f = $$('a, button', drawer);
  if (!f.length) return;
  if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
  else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
});
// deep link: /#polygraph opens the drawer
const deep = location.hash.slice(1);
if (PROJECTS.some((p) => p.id === deep)) setTimeout(() => { $('#work').scrollIntoView(); openDrawer(deep); }, 400);

// any [data-open] link anywhere opens a project
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-open]');
  if (!a) return;
  e.preventDefault();
  openDrawer(a.dataset.open, a);
});

/* ==========================================================
   ASK MY AGENT
   ========================================================== */
const chatLog = $('#chatLog');
let busy = false;

function retrieve(q) {
  const s = q.toLowerCase();
  let best = null; let bestScore = 0;
  KB.forEach((k) => {
    let score = 0;
    k.keys.forEach((key) => {
      const re = key.length <= 3 ? new RegExp(`\\b${key}\\b`) : null;
      if (re ? re.test(s) : s.includes(key)) score += key.length > 4 ? 2 : 1;
    });
    if (score > bestScore) { bestScore = score; best = k; }
  });
  return { best, score: bestScore };
}

function addMsg(html, who) {
  const d = document.createElement('div');
  d.className = `msg msg--${who}`;
  d.innerHTML = html;
  chatLog.appendChild(d);
  chatLog.scrollTop = chatLog.scrollHeight;
  return d;
}

async function ask(q) {
  q = q.trim();
  if (!q || busy) return;
  busy = true;
  addMsg(`<p>${esc(q)}</p>`, 'user');

  const bot = addMsg('', 'bot');
  const trace = document.createElement('div');
  trace.className = 'trace';
  bot.appendChild(trace);
  const step = async (html, ms = 380) => { await wait(ms); const d = document.createElement('div'); d.innerHTML = html; trace.appendChild(d); chatLog.scrollTop = chatLog.scrollHeight; };

  const { best, score } = retrieve(q);
  await step('<span class="ok">✓</span> retrieve · hybrid search over notes', 250);
  if (best && score > 0) {
    await step(`<span class="ok">✓</span> grade_context · relevant (${esc(best.src)})`);
    await step('<span class="ok">✓</span> generate · grounded answer');
  } else {
    await step('<span class="warn">↻</span> grade_context · not relevant, rewriting query');
    await step('<span class="warn">↻</span> retrieve · retry 1/1');
    await step('<span class="no">⊘</span> refuse · not in knowledge base');
  }

  const typing = document.createElement('div');
  typing.className = 'typing';
  typing.innerHTML = '<i></i><i></i><i></i>';
  bot.appendChild(typing);
  chatLog.scrollTop = chatLog.scrollHeight;
  await wait(650);
  typing.remove();

  const paras = best && score > 0
    ? best.a
    : [`I couldn't find that in my notes, so I won't guess. That's the same rule Polygraph follows. For anything else, email Swasti directly: <a href="mailto:${EMAIL}">${EMAIL}</a>.`];
  for (const p of paras) {
    const el = document.createElement('p');
    el.innerHTML = p;
    bot.appendChild(el);
    chatLog.scrollTop = chatLog.scrollHeight;
    await wait(220);
  }
  busy = false;
}

$('#chips').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (b) ask(b.dataset.q);
});
$('#chatForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const i = $('#chatInput');
  ask(i.value);
  i.value = '';
});

/* ==========================================================
   RECORD (activity log + search)
   ========================================================== */
function renderLog(filter = '') {
  const f = filter.trim().toLowerCase();
  const hi = (s) => {
    const safe = esc(s);
    if (!f) return safe;
    const re = new RegExp(`(${f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
    return safe.replace(re, '<mark>$1</mark>');
  };
  let shown = 0;
  $('#log').innerHTML = RECORD.map((r) => {
    const hay = [r.time, r.kind, r.title, r.org, ...r.points, ...r.tags].join(' ').toLowerCase();
    const hit = !f || hay.includes(f);
    if (hit) shown++;
    return `<li class="log__item ${hit ? '' : 'is-hidden'}">
      <span class="log__icon" aria-hidden="true">${r.icon}</span>
      <div class="log__card${r.featured ? ' log__card--featured' : ''}">
        ${r.featured ? '<span class="log__badge">★ Featured role</span>' : ''}
        <div class="log__time"><span>${hi(r.time)}</span><span>${hi(r.kind)}</span></div>
        <div class="log__title">${hi(r.title)}</div>
        <div class="log__org">${hi(r.org)}</div>
        <ul>${r.points.map((p) => `<li>${hi(p)}</li>`).join('')}</ul>
        <div class="log__tags">${r.tags.map((t) => `<span class="tag tag--neutral">${hi(t)}</span>`).join('')}</div>
      </div>
    </li>`;
  }).join('') + (shown ? '' : '<li class="empty">Nothing in the record matches that. Try "agents" or "vision".</li>');
}
renderLog();
$('#logSearch').addEventListener('input', (e) => renderLog(e.target.value));

/* ==========================================================
   STACK
   ========================================================== */
(() => {
  const rows = $('#stackGrid');
  const tower = $('#tower');
  if (!rows || !tower) return;
  const L = STACK.length;
  rows.innerHTML = STACK.map(([layer, sub, color, tools], i) => `
    <div class="layer" data-l="${i}" tabindex="0" style="--c:${color}">
      <div class="layer__label">
        <span class="layer__n mono">L${L - i}</span>
        <b>${esc(layer)}</b><em>${esc(sub)}</em>
      </div>
      <div class="layer__tools">
        ${tools.map(([name, logo], k) => `<span class="pill-tool" style="--k:${k}"><img src="assets/logos/${logo}" alt="" loading="lazy" />${esc(name)}</span>`).join('')}
      </div>
    </div>`).join('');
  // plates: foundation (last row) sits at the bottom of the tower
  tower.innerHTML = STACK.map(([layer, , color, tools], i) => {
    const level = L - 1 - i;
    const logos = tools.slice(0, 4).map(([, logo]) => `<i><img src="assets/logos/${logo}" alt="" /></i>`).join('');
    return `<div class="plate" data-l="${i}" style="--lvl:${level};--c:${color}">
      <div class="plate__top"><span class="plate__tag mono">L${level + 1}</span><span class="plate__logos">${logos}</span></div>
    </div>`;
  }).join('');
  const setActive = (i) => {
    $$('.layer', rows).forEach((el) => el.classList.toggle('is-active', el.dataset.l === String(i)));
    $$('.plate', tower).forEach((el) => {
      el.classList.toggle('is-active', el.dataset.l === String(i));
      el.classList.toggle('is-above', i !== null && +el.dataset.l < +i); // earlier rows = higher plates
    });
    tower.classList.toggle('has-active', i !== null);
  };
  const bind = (el) => {
    el.addEventListener('mouseenter', () => setActive(el.dataset.l));
    el.addEventListener('mouseleave', () => setActive(null));
    el.addEventListener('focus', () => setActive(el.dataset.l));
    el.addEventListener('blur', () => setActive(null));
  };
  $$('.layer', rows).forEach(bind);
  $$('.plate', tower).forEach(bind);
  new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return;
    o.disconnect();
    $('#stackWrap').classList.add('is-built');
  }, { threshold: 0.25 }).observe(rows);
})();

/* ==========================================================
   REVEAL + COUNTERS
   ========================================================== */
function countUp(el, to, dur = 1400) {
  if (reduceMotion) { el.textContent = to; return; }
  const start = performance.now();
  const from = +(el.dataset.from || 0);
  const tick = (t) => {
    const k = Math.max(0, Math.min(1, (t - start) / dur));
    const e = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(from + (to - from) * e);
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target;
    el.classList.add('is-in');
    if (el.classList.contains('metric') && el.dataset.to) {
      const c = $('.count', el);
      c.dataset.from = el.dataset.from;
      setTimeout(() => countUp(c, +el.dataset.to), 300);
    }
    $$('[data-count-to]', el).forEach((b) => countUp(b, +b.dataset.countTo));
    io.unobserve(el);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
$$('.reveal').forEach((el) => io.observe(el));

/* ==========================================================
   COPY EMAIL
   ========================================================== */
$('#copyEmail').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(EMAIL);
    toast('Email copied to clipboard ✓');
  } catch (e) {
    location.href = `mailto:${EMAIL}`;
  }
});

/* ==========================================================
   COMMAND PALETTE (⌘K / Ctrl+K)
   ========================================================== */
const palette = $('#palette');
const pInput = $('#paletteInput');
const pList = $('#paletteList');
const P_ITEMS = [
  ...PROJECTS.map((p) => ({ label: `${p.emoji}  ${p.title}`, hint: 'project', run: () => { $('#work').scrollIntoView(); openDrawer(p.id); } })),
  { label: '🧭  Work', hint: 'section', run: () => location.hash = '#work' },
  { label: '✶  Ask my agent', hint: 'section', run: () => { location.hash = '#ask'; setTimeout(() => $('#chatInput').focus(), 500); } },
  { label: '🗒️  Record', hint: 'section', run: () => location.hash = '#record' },
  { label: '📈  Numbers', hint: 'section', run: () => location.hash = '#numbers' },
  { label: '🧰  Stack', hint: 'section', run: () => location.hash = '#stack' },
  { label: '✉️  Copy email', hint: 'action', run: () => $('#copyEmail').click() },
  { label: '📄  Open résumé', hint: 'link', run: () => window.open('assets/Swasti_Jain_Resume.pdf', '_blank', 'noopener') },
  { label: '🐙  GitHub', hint: 'link', run: () => window.open(GH, '_blank', 'noopener') },
  { label: '💼  LinkedIn', hint: 'link', run: () => window.open('https://linkedin.com/in/swasti-jain2005', '_blank', 'noopener') },
  { label: '🌓  Toggle theme', hint: 'action', run: () => $('#themeToggle').click() },
];
let pSel = 0; let pFiltered = P_ITEMS;
function renderPalette() {
  const q = pInput.value.toLowerCase().trim();
  pFiltered = P_ITEMS.filter((i) => i.label.toLowerCase().includes(q) || i.hint.includes(q));
  pSel = Math.min(pSel, Math.max(0, pFiltered.length - 1));
  pList.innerHTML = pFiltered.map((i, n) => `<li class="${n === pSel ? 'is-sel' : ''}" data-n="${n}"><span>${esc(i.label)}</span><span>${i.hint}</span></li>`).join('') || '<li class="muted">No matches</li>';
  const sel = $('.is-sel', pList); if (sel) sel.scrollIntoView({ block: 'nearest' });
}
function openPalette() { palette.hidden = false; pInput.value = ''; pSel = 0; renderPalette(); setTimeout(() => pInput.focus(), 10); }
function closePalette() { palette.hidden = true; }
function runPalette(n) { const it = pFiltered[n]; if (!it) return; closePalette(); it.run(); }
$('#openPalette').addEventListener('click', openPalette);
pInput.addEventListener('input', () => { pSel = 0; renderPalette(); });
pInput.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') { e.preventDefault(); pSel = (pSel + 1) % Math.max(1, pFiltered.length); renderPalette(); }
  if (e.key === 'ArrowUp') { e.preventDefault(); pSel = (pSel - 1 + pFiltered.length) % Math.max(1, pFiltered.length); renderPalette(); }
  if (e.key === 'Enter') { e.preventDefault(); runPalette(pSel); }
});
pList.addEventListener('click', (e) => { const li = e.target.closest('[data-n]'); if (li) runPalette(+li.dataset.n); });
palette.addEventListener('click', (e) => { if (e.target === palette) closePalette(); });

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palette.hidden ? openPalette() : closePalette(); }
  if (e.key === 'Escape') { closePalette(); closeDrawer(); }
});

$('#year').textContent = new Date().getFullYear();
