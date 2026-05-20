export const projects = [
  {
    id: 1,
    slug: 'ai-invoice-extractor',
    title: 'AI-Powered Invoice Extractor',
    client: 'Industrial Client',
    category: 'AI & Automation',
    stack: ['Gemini LLM', 'React', 'Node.js', 'MongoDB', 'OCR'],
    desc: 'An end-to-end automated extraction system using Gemini LLM and OCR to process unstructured invoice data.',
    problem: 'The client was manually processing thousands of unstructured PDF invoices weekly, leading to high error rates and significant administrative overhead. Traditional OCR systems failed to handle varying layouts and complex line items.',
    solution: 'We engineered a sophisticated pipeline leveraging Google’s Gemini Pro Vision model. The system intelligently "reads" the document layout, extracts line-item data with over 98% accuracy, and classifies tax structures automatically.',
    features: [
      { title: 'Intelligent OCR', description: 'Advanced text recognition that understands document structure, not just characters.' },
      { title: 'Gemini Integration', description: 'Leveraging LLMs for semantic understanding of invoice fields and line items.' },
      { title: 'Validation Dashboard', description: 'A sleek React interface for human-in-the-loop verification of low-confidence extractions.' },
      { title: 'ERP Integration', description: 'Direct API export to major accounting software and enterprise resource planning systems.' }
    ],
    impact: 'Reduced processing time by 85% and eliminated manual data entry errors. The studio saved the client over 40 hours of manual labor per week.',
    image: 'bg-surface',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=1200&auto=format&fit=crop', title: 'Invoice Dashboard' },
      { src: 'https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=1200&auto=format&fit=crop', title: 'Extraction Analytics' },
      { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop', title: 'System Logs' }
    ]
  },
  {
    id: 2,
    slug: 'textile-operations-management',
    title: 'Textile Operations Management',
    client: 'Manufacturing Firm',
    category: 'Industrial Solutions',
    stack: ['Flutter', 'Spring Boot', 'MySQL', 'REST API'],
    desc: 'A comprehensive manufacturing operations management system streamlining production workflows.',
    problem: 'A textile manufacturer was relying on paper-based logs to track production stages, inventory, and machine maintenance. This caused massive blind spots in the supply chain and delayed order fulfillment.',
    solution: 'We built a cross-platform Flutter application connected to a robust Spring Boot backend. The system tracks every bale of fabric from raw material to final shipment, providing real-time production visibility.',
    features: [
      { title: 'Live Inventory Tracking', description: 'Real-time updates on raw materials and finished goods across multiple warehouses.' },
      { title: 'Production Analytics', description: 'Visual dashboards showing machine uptime, operator efficiency, and scrap rates.' },
      { title: 'Mobile-First Design', description: 'Optimized for tablets used on the factory floor with offline-sync capabilities.' },
      { title: 'Automated Reporting', description: 'One-click generation of compliance and performance reports for management.' }
    ],
    impact: 'Increased production efficiency by 22% within the first three months. Order fulfillment accuracy reached an all-time high of 99.8%.',
    image: 'bg-surface',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1200&auto=format&fit=crop', title: 'Production Floor' },
      { src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop', title: 'Inventory App' },
      { src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop', title: 'Analytics Dashboard' }
    ]
  },
  {
    id: 3,
    slug: 'agentic-ai-monitoring',
    title: 'Agentic AI Monitoring System',
    client: 'Venture Studio',
    category: 'AI & Automation',
    stack: ['Gemini API', 'Make.com', 'Zapier', 'Telegram Bot API'],
    desc: 'Autonomous AI agents leveraging the Gemini API to automate complex system-monitoring workflows.',
    problem: 'The client needed to monitor multiple social signals and server health metrics across various platforms but found traditional alerting systems too noisy and non-actionable.',
    solution: 'We developed a fleet of "Agentic" AI workers. These agents don’t just alert; they analyze the context of an issue using the Gemini API, attempt a first-level resolution, and provide a summarized executive brief via Telegram.',
    features: [
      { title: 'Self-Healing Agents', description: 'AI agents capable of executing predefined scripts to resolve common server issues autonomously.' },
      { title: 'Contextual Alerting', description: 'Filters out noise by only escalating alerts that the AI determines as critical business threats.' },
      { title: 'Multi-Channel Input', description: 'Monitors RSS feeds, Twitter API, server logs, and webhooks simultaneously.' },
      { title: 'Actionable Summaries', description: 'Instead of raw logs, founders receive concise, AI-generated reports on daily system health.' }
    ],
    impact: 'Reduced "alert fatigue" by 90% while improving incident response time for critical failures from hours to seconds.',
    image: 'bg-surface',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop', title: 'Agent Logs' },
      { src: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=1200&auto=format&fit=crop', title: 'Monitoring View' },
      { src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop', title: 'Telegram Integration' }
    ]
  },
  {
    id: 4,
    slug: 'ai-video-surveillance',
    title: 'AI Video Surveillance System',
    client: 'Security Tech Startup',
    category: 'AI & Automation',
    stack: ['TensorFlow', 'OpenCV', 'LSTM', 'Streamlit'],
    desc: 'A real-time surveillance system detecting suspicious behavior using deep learning.',
    problem: 'Monitoring hundreds of security camera feeds manually is impossible. The client needed a way to flag "suspicious behavior" (e.g., loitering, unattended bags) without requiring human eyes on every screen.',
    solution: 'Implemented a deep learning pipeline using LSTM (Long Short-Term Memory) networks to analyze temporal patterns in video frames. The system identifies anomalies in motion that suggest security risks.',
    features: [
      { title: 'Behavior Analysis', description: 'Goes beyond simple motion detection to understand the "intent" of movement patterns.' },
      { title: 'Real-Time Inference', description: 'Highly optimized OpenCV pipeline capable of processing 30fps on edge hardware.' },
      { title: 'Live Dashboard', description: 'A Streamlit-based monitoring station for security personnel with instant playback of flagged events.' },
      { title: 'Privacy First', description: 'Automated face-blurring and anonymization features for GDPR/privacy compliance.' }
    ],
    impact: 'Successfully identified 95% of simulated security breaches in testing. Deployment reduced security personnel requirements by 40%.',
    image: 'bg-surface',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1557597774-9d2739f85a94?q=80&w=1200&auto=format&fit=crop', title: 'Camera Feed Analysis' },
      { src: 'https://images.unsplash.com/photo-1504194104404-4cd3c27c242c?q=80&w=1200&auto=format&fit=crop', title: 'Deep Learning Model' },
      { src: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop', title: 'Live Alerts' }
    ]
  },
  {
    id: 5,
    slug: 'pincode-validator',
    title: 'PIN Code Validator App',
    client: 'Logistics Aggregator',
    category: 'Mobile Apps',
    stack: ['Kotlin', 'Jetpack Compose', 'REST API', 'SQLite'],
    desc: 'An optimized Android application for 6,000+ Indian pincodes, achieving 100% validation accuracy.',
    problem: 'Last-mile delivery failures were surging due to incorrect pincode entries by customers. The client needed a lightweight, lightning-fast validator that worked offline for delivery agents.',
    solution: 'Developed a native Android app using Jetpack Compose. We optimized a local SQLite database containing every Indian pincode, allowing for sub-millisecond lookups and instant validation.',
    features: [
      { title: 'Jetpack Compose UI', description: 'Modern, declarative UI that is both beautiful and high-performance.' },
      { title: 'Offline-First', description: 'Works in remote areas with zero connectivity by leveraging an encrypted local data store.' },
      { title: 'Smart Suggestions', description: 'Autocompletes city and state based on pincode entry to minimize user input errors.' },
      { title: 'Batch Validation', description: 'Allows logistics managers to upload and validate thousands of addresses in seconds via the app.' }
    ],
    impact: 'Delivery failure rates due to address errors dropped by 14% in the first month. The app has processed over 1M+ validations to date.',
    image: 'bg-surface',
    gallery: [
      { src: 'https://images.unsplash.com/photo-1512428559083-a4979b2b91ef?q=80&w=1200&auto=format&fit=crop', title: 'Mobile App Interface' },
      { src: 'https://images.unsplash.com/photo-1526733158272-60b4944e8744?q=80&w=1200&auto=format&fit=crop', title: 'Validation Screen' },
      { src: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?q=80&w=1200&auto=format&fit=crop', title: 'Offline Database' }
    ]
  }
];
