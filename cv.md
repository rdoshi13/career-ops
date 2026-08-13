# CV -- Rishabh Doshi

**Location:** United States
**Email:** rishdoshi9@gmail.com
**Phone:** 480-521-4050
**LinkedIn:** linkedin.com/in/rishabhdoshi9
**Portfolio:** rishabhdoshi.me
**GitHub:** github.com/rdoshi13

## Professional Summary

Software engineer with 2+ years building consumer-facing web apps, real-time data platforms, and scalable back-end services. MS in Computer Software Engineering (Arizona State University, 2025). Currently the primary engineer at Bar Capital Global, where I architected Barcode (a retail-analytics and purchasing platform running against a live dispensary) and Bartender (a 12-dashboard internal analytics and CRM platform), and led a security audit that surfaced 17 severity-ranked findings including 26 investor contact records exposed to unauthenticated users. Strong in React/TypeScript and Next.js front-ends with Node.js and FastAPI back-ends, and a track record of measurable impact (93% compute-cost reduction, 40% LCP cut, 50% perceived-latency reduction, 30% fewer post-merge defects).

## Work Experience

### Bar Capital Global -- Camden, NJ

**Software Engineer**
Jun 2026 - Present

- Architected Barcode, a retail-analytics and purchasing platform (React, Vite, Cloudflare Workers, Supabase) for a live dispensary, backfilling 3 years of POS history and automating a daily ingest of 600+ vendor menu items that replaced manual spreadsheet reporting.
- Built a demand-first reorder engine ranking the full vendor catalog by days-of-supply and sales velocity, with category-aware filters and one-click order-form generation across 3 distributors.
- Delivered Bartender, an internal Next.js/TypeScript platform of 12 dashboards, wiring live GA4, Meta Ads, and Search Console feeds and a CRM with HubSpot migration, deduplication, and an access-gated deal room.
- Led a security audit of the production platform that produced 17 severity-ranked findings and caught 26 investor contact records reachable by unauthenticated users in public build bundles; scoped the remediation plan and added CI test gates.
- Extended the internal platform with deal pipelines and a task manager that live-syncs from Gmail, Slack, and Notion, plus an Obsidian mind-map view; consolidated marketing data from the POS, Google Search Console, Google Business Profile, GA4, Meta Ads, and Instagram Insights into a single analytics layer.

### RoundTechSquare -- San Francisco, CA

**Software Engineer Intern**
Feb 2025 - May 2025

- Built reusable React + Tailwind components and integrated them with backend APIs, cutting LCP by 40% across the Aligned Rewards platform.
- Developed dashboard flows using React, SWR, and REST/GraphQL endpoints, reducing perceived latency by 50% and improving real-time user interactions.
- Collaborated with backend, product, and design teams to debug API contracts, handle loading/error states, and deliver pixel-perfect UI/UX.
- Improved engineering reliability by adopting Git-flow branching and CI checks for linting/testing, reducing post-merge defects by 30%.

### Whirlwind -- Vadodara, India

**Software Developer**
Dec 2020 - Dec 2022

- Built and maintained client-facing web applications using JavaScript, HTML5, CSS3, and backend API integrations for reporting and campaign workflows.
- Developed Python/JavaScript automation scripts to process campaign data, reduce manual operations by 30%, and improve reporting reliability.
- Integrated Google Analytics, Facebook Ads, LinkedIn Ads, and Google Tag Manager APIs into internal dashboards, cutting reporting time from hours to minutes.

### VRSSPL -- Vadodara, India

**Android Intern**
May 2019 - Jul 2019

- Created Android apps ("Gujarati Lipi" and "Color Filler") using XML and Java, reducing load times by 30%.
- Improved app stability by integrating advanced Android features such as Fragment Lifecycle and Custom Adapters.
- Implemented a test suite contributing to a 25% reduction in bugs.

## Projects

- **RAG Code Analyzer** -- Local Retrieval-Augmented Generation code analyzer (FastAPI, React, Docker) that turns local folders and GitHub repos into a searchable knowledge base. Background ingestion with filtering, language detection, chunking, and SQLite metadata storage. Persistent embeddings in ChromaDB for fast semantic retrieval and reuse. Ollama + LangChain for semantic search, architecture summaries, and grounded Q&A with file/line citations. React dashboard plus an interactive dependency graph to explore files and import relationships. [GitHub](https://github.com/rdoshi13/RAG-Powered-Agentic-AI-Code-Analyzer)

- **Real-Time Segmentation Query Engine** -- Real-time segmentation engine with a custom DSL parser, AST optimization, and incremental recomputation (93% reduction in compute cost). Rule-based query optimizer (predicate pushdown, constant folding, selectivity-based reordering), AST evaluation engine with boolean logic, and shared-predicate multi-segment optimization. Custom recursive-descent parser and visitor-pattern AST traversal. Benchmarked on 100k+ synthetic profiles. [GitHub]

- **Personal Financial Tracker** -- Full-stack personal finance app (React, Express, MongoDB Atlas, Vercel) with production CI/CD from GitHub. JWT auth with per-user data isolation on all transaction CRUD/report endpoints. Monthly analytics and PDF reporting with category breakdowns and transaction tables. [GitHub](https://github.com/rdoshi13/Personal-finance-tracker) [Live](https://budget.rishabhdoshi.me/)

- **Guard Patrol Manager** -- React Native + Expo hybrid app for guard shifts, QR patrols, and visitor logs. Night-patrol window enforcement, duplicate-scan blocking, hourly completion/miss tracking, offline-first storage, and Google Sheets sync via Apps Script with retries. Admin PIN-gated management and visitor profiles with photos. [GitHub] [Release]

## Education

- MS Computer Software Engineering, Arizona State University (May 2025)
- BS Computer Science Engineering, Indian Institute of Information Technology Ranchi (Jun 2020)

## Skills

- **Languages:** Java, Python, C++, JavaScript (ES6), TypeScript, HTML/CSS
- **Front-end:** React.js, Next.js, React Native, Vue.js, Tailwind CSS, Vite
- **Back-end:** Node.js, Express.js, FastAPI, Spring Boot, REST, GraphQL
- **Databases:** PostgreSQL, MongoDB, MySQL, SQLite, ChromaDB
- **Cloud/Infra:** AWS (Lambda, DynamoDB, SQS), Cloudflare Workers & Pages, Supabase, Vercel, Docker, Kubernetes, GitHub Actions, CI/CD
- **AI/ML:** Retrieval-Augmented Generation (RAG), LangChain, Ollama, vector embeddings
- **Integrations/Analytics:** GA4, Google Search Console, Google Business Profile, Meta Ads, Instagram Insights, HubSpot, Gmail, Slack, Notion APIs
- **Tools:** Git/GitHub, Maven, JIRA, Postman, Protege, SonarQube, Selenium
