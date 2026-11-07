import { CaseStudy, AwardItem, ExperienceItem, EducationItem, LabExperiment, Testimonial } from '../types';

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'khedut-kharch',
    title: 'Khedut Kharch (ખેડૂત ખર્ચ નોંધ)',
    subtitle: 'Offline-First Agricultural Crop Expense, Profit & Farm Management PWA',
    category: 'Creative Engineering',
    year: '2025',
    client: 'Self-Directed Major Agritech Initiative (For Farmers of Gujarat & India)',
    role: 'Lead Architect & Full-Stack Developer',
    heroImage: '/images/khedutkharch.png',
    galleryImages: [
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=1600&auto=format&fit=crop'
    ],
    overview: 'A flagship, offline-capable Progressive Web App (PWA) tailored specifically for regional farmers (ખેડૂતો). Engineered to track season-wise crop expenses (ખાતર, બિયારણ, મજૂરી, દવા), harvest yields, sales revenue, net profit & loss, voice-assisted quick expense entries, digital farmer document wallet, and godown stock management without requiring active cellular internet in remote agricultural fields.',
    challenge: 'Indian farmers and agriculturalists frequently operate in remote farmland zones with inconsistent 2G/4G connectivity. Most accounting and ledger apps are complicated, cluttered, English-centric, and fail to function without an uninterrupted internet connection.',
    solution: 'Architected a native-like Gujarati-first Progressive Web Application with client-side IndexedDB offline persistence, background cloud synchronization with Firebase, voice-guided expense logging (વાણી દ્વારા ઝડપી ખર્ચ), seasonal harvest profit/loss audits, and printable PDF farm balance sheets.',
    impactMetrics: [
      { label: 'Offline Capability', value: '100% Offline', detail: 'Zero-connection IndexedDB persistence & PWA service workers' },
      { label: 'Language First', value: 'ગુજરાતી / Native', detail: 'Culturally intuitive terminology for vernacular accessibility' },
      { label: 'Entry Speed', value: '< 5 Seconds', detail: 'Voice dictation & single-tap shortcut for instant field entry' }
    ],
    awards: ['Major Agritech Innovation Showcase', 'Offline-First Progressive Web App Feature'],
    technologies: ['React 18', 'TypeScript', 'Tailwind CSS', 'IndexedDB / Offline Storage', 'Firebase Sync', 'PWA / Service Workers', 'Web Speech API', 'PDF Reporting'],
    liveUrl: 'https://khedut-kharch.vercel.app',
    accentColor: '#2F6B4F',
    palette: [
      { name: 'Khedut Green', hex: '#2F6B4F' },
      { name: 'Fertile Soil', hex: '#4A3525' },
      { name: 'Parchment Canvas', hex: '#F7F4EC' },
      { name: 'Golden Harvest', hex: '#E5A93C' }
    ],
    typography: [
      { font: 'Plus Jakarta Sans', usage: 'Financial Aggregates & Season Telemetry' },
      { font: 'Syne Bold', usage: 'Agricultural Headings & Crop Summaries' }
    ],
    interactiveFeature: 'typography-tester'
  },
  {
    id: 'dharashuddhjal',
    title: 'Dharashuddhjal',
    subtitle: 'Pure RO + UV Drinking Water Supply & Delivery Platform',
    category: 'Digital Direction',
    year: '2025',
    client: 'Dhara Shuddh Jal (Dev Chaudhary & Neel Pokar), Mathal & Ugedi',
    role: 'Full-Stack Web Developer & UI Designer',
    heroImage: '/images/dharashudhjal.png',
    galleryImages: [
      'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584727638096-042c45049ebe?q=80&w=1600&auto=format&fit=crop'
    ],
    overview: 'A modern, mobile-first digital storefront and dispatch platform for Dhara Shuddh Jal, a trusted purified drinking water supplier with delivery hubs in Mathal and Ugedi (Nakhatrana, Gujarat). Highlights multi-stage RO + UV water filtration, 100% hygienic water testing standards, 20L can delivery, and direct one-tap WhatsApp order routing.',
    challenge: 'Enabling residents and local businesses in Nakhatrana to easily discover purified drinking water suppliers on Google and place daily 20L can orders or event supplies with zero friction.',
    solution: 'Designed and deployed an ultra-clean, mobile-first single-page experience with multi-stage RO+UV filtration showcases, branch locations (Mathal & Ugedi hubs), and immediate WhatsApp dispatch triggers.',
    impactMetrics: [
      { label: 'Turnaround Delivery', value: '3 Days', detail: 'From initial brief to live production deploy' },
      { label: 'Google Search Lift', value: '+220%', detail: 'In local geographic organic queries' },
      { label: 'Client Feedback', value: '5.0 Star', detail: 'Rated best local investment by business owner' }
    ],
    awards: ['Rapid Delivery Milestone Award', '5.0 Star Client Review'],
    technologies: ['HTML5', 'CSS3', 'Modern JavaScript', 'Local SEO & Schema', 'WhatsApp Routing'],
    liveUrl: 'https://Dharashuddhjal.onrender.com',
    accentColor: '#2B6CB0',
    palette: [
      { name: 'Deep Aqua', hex: '#1A365D' },
      { name: 'Pure Cyan Stream', hex: '#2B6CB0' },
      { name: 'Fresh Cloud', hex: '#F0F9FF' },
      { name: 'Mineral Charcoal', hex: '#1E293B' }
    ],
    typography: [
      { font: 'Instrument Serif Italic', usage: 'Purity Statements & Quality Marks' },
      { font: 'Plus Jakarta Sans', usage: 'Delivery Metrics & Service Packages' }
    ],
    interactiveFeature: 'color-mixer'
  },
  {
    id: 'shiv-enterprises',
    title: 'Shiv Enterprises',
    subtitle: 'Digital Services, E-Governance & Agricultural Hub',
    category: 'Brand Systems',
    year: '2025',
    client: 'Shiv Enterprises (Dhirendra Rameshchandra Nayani), Kotda Jadodar',
    role: 'Lead Frontend Developer & UI Designer',
    heroImage: '/images/shiventerprises.png',
    galleryImages: [
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1600&auto=format&fit=crop'
    ],
    overview: 'A complete digital portal for Shiv Enterprises located at MP Chhabhaiya Complex, Khambhla Road, Kotda Jadodar, Gujarat. Showcases comprehensive digital services including bus & train ticket booking, utility bill payments, and agricultural government schemes (i-Khedut portal, Farmer ID, subsidy applications, 7/12 & 8A land records).',
    challenge: 'Structuring a wide range of civic, ticketing, and farming services into an accessible, bilingual-friendly interface that regional customers can easily navigate on basic smartphones.',
    solution: 'Developed a clean, responsive layout with categorized service sections, clear operating hours (Mon–Fri 8 AM–8 PM), store location map, and direct one-click WhatsApp & call support.',
    impactMetrics: [
      { label: 'Client Inquiries', value: '+180%', detail: 'Direct inbound WhatsApp & phone queries' },
      { label: 'Page Load Speed', value: '1.4s', detail: 'Optimized asset delivery across 4G and 5G' },
      { label: 'Client Satisfaction', value: '5.0 / 5', detail: 'Verified client endorsement and feedback' }
    ],
    awards: ['Local Business Excellence Recognition', '5.0 Star Verified Client Rating'],
    technologies: ['HTML5 & CSS3', 'JavaScript', 'Responsive UI/UX', 'WhatsApp Business API', 'Local SEO'],
    liveUrl: 'https://shiv-enterprises-9ees.onrender.com',
    accentColor: '#111111',
    palette: [
      { name: 'Industrial Slate', hex: '#1C2127' },
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Alabaster Canvas', hex: '#F9F8F5' },
      { name: 'Steel Neutral', hex: '#585E67' }
    ],
    typography: [
      { font: 'Instrument Serif', usage: 'Corporate Headlines & Catalog Titles' },
      { font: 'Plus Jakarta Sans', usage: 'Product Specifications & Contact Indices' }
    ],
    interactiveFeature: 'typography-tester'
  },
  {
    id: 'family-footwear',
    title: 'Family Footwear',
    subtitle: 'Nakhatrana\'s Multi-Brand Footwear & Showroom Portal',
    category: 'Creative Engineering',
    year: '2025',
    client: 'Family Footwear, Nakhatrana, Gujarat',
    role: 'Frontend UI Engineer & Visual Designer',
    heroImage: '/images/familyfootwear.png',
    galleryImages: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1600&auto=format&fit=crop'
    ],
    overview: 'An online footwear showroom portal for Nakhatrana\'s trusted shoe store. Highlights men\'s leather shoes, women\'s sandals, kids\' shoes, and sports footwear from leading brands (Bata, Sparx, Campus, Nike, Adidas, Puma) alongside traditional ethnic styles with 5000+ happy customers.',
    challenge: 'Bringing the extensive variety of an established physical shoe store online without creating sluggish loading times on mobile 4G networks.',
    solution: 'Constructed an agile, component-driven catalog layout featuring high-definition compressed visual previews, category navigation chips, store timings (9 AM – 8 PM), and direct WhatsApp product inquiries.',
    impactMetrics: [
      { label: 'Customer Rating', value: '4.9 / 5.0', detail: 'Verified customer review score' },
      { label: 'Shoes Cataloged', value: '5000+ Sold', detail: 'Trusted regional footwear showroom' },
      { label: 'Mobile Share', value: '78%', detail: 'Of total traffic accessing on handheld devices' }
    ],
    awards: ['Mobile UX Optimization Recognition', 'Nakhatrana Commerce Showcase'],
    technologies: ['HTML5 & CSS3', 'JavaScript', 'Responsive Grid', 'Performance Tuning', 'WhatsApp Linkage'],
    liveUrl: 'https://Family-footwear.onrender.com',
    accentColor: '#9C6644',
    palette: [
      { name: 'Leather Umber', hex: '#3B2F2F' },
      { name: 'Warm Terracotta', hex: '#9C6644' },
      { name: 'Linen Cream', hex: '#FAF7F2' },
      { name: 'Neutral Ash', hex: '#6E6B68' }
    ],
    typography: [
      { font: 'Syne Bold', usage: 'Collection Headers & Category Indices' },
      { font: 'Plus Jakarta Sans', usage: 'Product Specs & Store Information' }
    ],
    interactiveFeature: 'typography-tester'
  },
  {
    id: 'mehandi-art-by-pn',
    title: 'Mehandi Art by PN',
    subtitle: 'Bridal Henna & Artistry Studio Portfolio',
    category: 'Brand Systems',
    year: '2025',
    client: 'Mehandi Art by PN, Gujarat',
    role: 'Brand Designer & Web Developer',
    heroImage: '/images/mehandiartpn.png',
    galleryImages: [
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1600&auto=format&fit=crop'
    ],
    overview: 'A modern bridal mehndi and henna artistry portfolio designed for Mehandi Art by PN. Showcases intricate bridal henna galleries, traditional Indian, Arabic, and Indo-Western patterns, ceremonial packages, pricing tiers, and direct WhatsApp date booking.',
    challenge: 'Displaying high-resolution intricate henna photography while maintaining instant page loads and an elegant, celebratory visual tone.',
    solution: 'Designed a warm editorial portfolio with responsive media grids, curated bridal packages, and direct one-click WhatsApp consultation scheduling.',
    impactMetrics: [
      { label: 'Booking Inquiries', value: '+300%', detail: 'In wedding and festival season consultations' },
      { label: 'Client Rating', value: '5.0 Star', detail: 'Consistently praised for elegance and clarity' },
      { label: 'Direct Leads', value: '100% Direct', detail: 'Instant WhatsApp customer connectivity' }
    ],
    awards: ['Bridal Artistry Portfolio Feature', '5.0 Star Client Review'],
    technologies: ['HTML5 & CSS3', 'JavaScript', 'Optimized Gallery', 'WhatsApp Scheduling'],
    liveUrl: 'https://mehandiartbypn.onrender.com',
    accentColor: '#8C3A48',
    palette: [
      { name: 'Henna Crimson', hex: '#631D27' },
      { name: 'Rose Gold', hex: '#D4A373' },
      { name: 'Silk Ivory', hex: '#FAF8F5' },
      { name: 'Warm Noir', hex: '#1C1917' }
    ],
    typography: [
      { font: 'Instrument Serif Italic', usage: 'Bridal Statements & Package Names' },
      { font: 'Plus Jakarta Sans', usage: 'Pricing Tiers & Booking Schedule' }
    ],
    interactiveFeature: 'color-mixer'
  },
  {
    id: 'passport-studio',
    title: 'Passport Studio',
    subtitle: 'Instant Passport Photo Generator & Print Sheet Maker',
    category: 'Brand Systems',
    year: '2025',
    client: 'Digital Utility Product',
    role: 'Full-Stack Developer & UI Designer',
    heroImage: '/images/passport.png',
    galleryImages: [
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=1600&auto=format&fit=crop'
    ],
    overview: 'An intuitive digital passport photo creation and specification suite that converts personal portraits into standard government-compliant ID photo grids (Indian Passport, US Visa, Schengen, Stamp Size) for instant download and printing.',
    challenge: 'Providing accurate aspect ratio crops and high-resolution print grids directly inside the browser while keeping user photos 100% private and client-side.',
    solution: 'Engineered an in-browser image cropping, alignment, and multi-photo sheet generation pipeline with high-DPI canvas export (4x6, A4 layouts) and zero server uploads.',
    impactMetrics: [
      { label: 'Processing Speed', value: 'Instant', detail: 'Zero server roundtrip; client-side canvas render' },
      { label: 'Print Output', value: '300 DPI', detail: 'Standard photographic print resolution' },
      { label: 'Privacy', value: '100% Client-Side', detail: 'No images uploaded to external servers' }
    ],
    awards: ['Digital Photography Utility Feature'],
    technologies: ['React', 'HTML5 Canvas', 'TypeScript', 'Tailwind CSS', 'High-DPI Export'],
    liveUrl: 'https://passportstudio.vercel.app/',
    accentColor: '#3B82F6',
    palette: [
      { name: 'Studio Cobalt', hex: '#1D4ED8' },
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Neutral Slate', hex: '#334155' },
      { name: 'Canvas Mist', hex: '#F8FAFC' }
    ],
    typography: [
      { font: 'Instrument Serif', usage: 'Studio Headlines & Format Specs' },
      { font: 'Plus Jakarta Sans', usage: 'Aspect Ratio & Print Settings' }
    ],
    interactiveFeature: 'typography-tester'
  },
  {
    id: 'keyboard-tester',
    title: 'Keyboard Tester',
    subtitle: 'Real-Time Keyboard Matrix & Key Latency Diagnostic Tool',
    category: 'Creative Engineering',
    year: '2025',
    client: 'Self-Directed Developer Utility',
    role: 'Creative Technologist & UI Engineer',
    heroImage: '/images/keyboard.png',
    galleryImages: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1600&auto=format&fit=crop'
    ],
    overview: 'A real-time browser-based keyboard testing utility for diagnosing key actuation, N-Key Rollover (NKRO), latency timing, and modifier responsiveness with visual matrix lighting.',
    challenge: 'Handling simultaneous raw DOM key events with sub-millisecond visual updates without UI stutter or dropped events across different browser layouts.',
    solution: 'Built a hardware-accelerated keyboard matrix layout with event loop debouncing, keypress history telemetry, and auditory haptic feedback.',
    impactMetrics: [
      { label: 'Actuation Delay', value: '< 1ms', detail: 'Instant DOM keyboard matrix updates' },
      { label: 'Keys Supported', value: '100% Full', detail: 'Full ANSI & ISO keyboard coverage' },
      { label: 'Performance', value: '60 FPS', detail: 'Smooth state transition animations' }
    ],
    awards: ['Hardware Utility of the Month'],
    technologies: ['JavaScript', 'DOM KeyEvents', 'Web Audio API', 'CSS Grid', 'Tailwind CSS'],
    liveUrl: 'https://keyboard-tester.onrender.com/',
    accentColor: '#F59E0B',
    palette: [
      { name: 'Amber Glow', hex: '#F59E0B' },
      { name: 'Obsidian Case', hex: '#0F172A' },
      { name: 'Mechanical Slate', hex: '#1E293B' },
      { name: 'Keycap Silver', hex: '#E2E8F0' }
    ],
    typography: [
      { font: 'JetBrains Mono', usage: 'KeyCode Hex & Scan Codes' },
      { font: 'Syne Bold', usage: 'Hardware Diagnostic Headers' }
    ],
    interactiveFeature: 'typography-tester'
  }
];

export const AWARDS_LIST: AwardItem[] = [
  {
    year: '2025–2026',
    award: '5.0 Star Verified Client Trust Rating',
    project: 'Dharashuddhjal, Shiv Enterprises, Family Footwear, Mehandi Art & Clients',
    category: 'Client Benchmark',
    organization: '5-Star Reviews'
  },
  {
    year: '2025',
    award: '5+ Production Client Web Portals Deployed',
    project: 'Turnkey Commercial Web Applications & Local Storefronts',
    category: 'Production Milestone',
    organization: 'Shubham Developer'
  },
  {
    year: '2025',
    award: '10+ Software & Web Projects Engineered',
    project: 'Interactive UI Engines, Developer Utilities & Web Apps',
    category: 'Engineering Portfolio',
    organization: 'Full-Stack Showcase'
  },
  {
    year: '2025',
    award: 'Rapid 2–5 Day Delivery Standard',
    project: 'Turnkey Web Development & Live Domain Deployment',
    category: 'Execution Standard',
    organization: 'Delivery Benchmark'
  },
  {
    year: '2025',
    award: 'Mobile-First UI & Sub-Second Speed',
    project: 'Responsive Frontend Portals across 4G/5G Handheld Networks',
    category: 'Performance Benchmark',
    organization: 'Lighthouse 95+'
  },
  {
    year: '2024–2025',
    award: 'Direct WhatsApp Customer Lead Routing',
    project: 'Zero-Friction Client Inquiries & Conversion Architecture',
    category: 'Commercial Impact',
    organization: 'Lead Generation'
  }
];

export const EXPERIENCE_LIST: ExperienceItem[] = [
  {
    period: '2024 — Present (12+ Months)',
    role: 'Frontend Web Developer',
    company: 'Shubham Developer',
    location: 'Kotda Jadodar, Kutch, Gujarat, India',
    description: 'Specializing in high-performance, mobile-first frontend web engineering, bespoke web experiences, and high-converting digital storefronts for regional businesses, clinics, showrooms, and personal brands.',
    highlights: [
      'Built 5+ productive client web portals and 10+ projects with 12+ months of dedicated frontend development experience.',
      'Developed live production client platforms including Dharashuddhjal, Shiv Enterprises, Family Footwear, and Mehandi Art by PN.',
      'Engineered interactive utility products such as Khedut Kharch, Passport Studio, and Keyboard Tester.',
      'Specialized in HTML5, AI Engineering, modern JavaScript, Python, and Tailwind CSS interfaces.',
      'Integrated direct WhatsApp lead workflows and Google local search structure to drive immediate inquiries with 2–5 day turnaround.'
    ]
  },
  {
    period: '2024 — 2025',
    role: 'Frontend Architect & Client Delivery Lead',
    company: 'Regional Commercial Digital Projects',
    location: 'Gujarat, India',
    description: 'Delivered turnkey web solutions with sub-second page loads, custom product catalogs, and direct 5-star client ratings.',
    highlights: [
      'Designed mobile-first UI components, category filters, and interactive media galleries.',
      'Guaranteed 100% responsive fluid layouts tested across 15+ real mobile and desktop displays.'
    ]
  }
];

export const EDUCATION_LIST: EducationItem[] = [
  {
    period: '2024 — 2026',
    degree: 'Diploma in Computer Engineering',
    institution: 'Government Polytechnic, Bhuj',
    location: 'Bhuj, Kutch, Gujarat, India',
    status: 'Currently in 3rd Semester (2nd Year)',
    description: 'Pursuing comprehensive technical foundations in computer systems, software engineering, and application development with high practical focus.',
    coursework: [
      'Responsive Web Page Design',
      'Python Programming',
      'Data Structures & Algorithms',
      'Database Management Systems',
      'Computer Networks & Protocols',
      'Software Engineering Principles'
    ],
    highlights: [
      'Currently active in 3rd Semester (2nd Year) of Diploma in Computer Engineering at GP Bhuj.',
      'Hands-on expertise in Responsive Web Page Design and Python applied directly to live client projects.',
      'Merged academic principles with real-world industry delivery (5+ live client portals, 10+ web apps).'
    ]
  }
];

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: 'exp-1',
    title: 'Harmonic Waveform Resonance',
    category: 'Audio Reactive / Canvas',
    date: 'Aug 2025',
    description: 'Interactive canvas reacting in real-time to mouse velocity and frequency harmonics, calculating fluid damping equations on every frame.',
    interactiveType: 'fluid-canvas',
    tag: 'Interactive'
  },
  {
    id: 'exp-2',
    title: 'Kinetic Elasticity & Spring Physics',
    category: 'Motion Dynamics',
    date: 'Jul 2025',
    description: 'A study on sub-pixel magnetic attraction curves that feel weighted, organic, and physically grounded under rapid cursor movement.',
    interactiveType: 'magnetic-physics',
    tag: 'Physics'
  },
  {
    id: 'exp-3',
    title: 'Variable Monospace Font Distort',
    category: 'Kinetic Type',
    date: 'May 2025',
    description: 'Real-time glyph geometry morphing based on cursor proximity and spatial pull vectors.',
    interactiveType: 'kinetic-grid',
    tag: 'Typography'
  },
  {
    id: 'exp-4',
    title: 'Synthesizer Micro-Chords',
    category: 'Spatial Sound',
    date: 'Apr 2025',
    description: 'Bespoke procedural pentatonic chord generator mapped to visual quadrants for ambient digital feedback.',
    interactiveType: 'audio-reactive',
    tag: 'Web Audio'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Shubham built my Water supplier website in just 3 days. Customers started finding us on Google within the first week. Best investment I made for my shop!",
    author: "Chaudhary Dev",
    role: "Founder & Owner",
    company: "Dharashuddhjal, Mathal",
    initials: "CD"
  },
  {
    quote: "Very happy with the website created by Shubham for Shiv Enterprises. The design is neat and customers can easily view our services and contact us. Highly recommended for website development.",
    author: "Dhirendra Nayani",
    role: "Managing Director",
    company: "Shiv Enterprise, Kotda Jadodar",
    initials: "DN"
  },
  {
    quote: "Exceptional speed and attention to detail. Our retail footwear showroom catalog loads instantly on all mobile phones and WhatsApp inquiries have doubled.",
    author: "Kirit Patel",
    role: "Proprietor",
    company: "Family Footwear, Nakhatrana",
    initials: "KP"
  },
  {
    quote: "Very professional. He understood exactly what I needed for our bridal mehndi studio and designed something way better than expected. Clients easily browse our latest bridal henna catalog and book appointments directly on WhatsApp.",
    author: "Pratha Dayani",
    role: "Lead Artist & Founder",
    company: "Mehandi Art by PN, Surat",
    initials: "PD"
  }
];

export const CLIENT_LOGOS = [
  { name: 'Shiv Enterprises', label: 'Hardware & Supplies' },
  { name: 'Dharashuddhjal', label: 'Purified Water Platform' },
  { name: 'Family Footwear', label: 'Retail Showroom' },
  { name: 'Mehandi Art by PN', label: 'Bridal Artistry' },
  { name: 'Kotda Jadodar Commerce', label: 'Local Business Growth' },
  { name: 'Kutch Digital', label: 'Web Solutions' },
  { name: 'Kotda Jadodar Services', label: 'Commercial Portals' },
  { name: 'Nakhatrana Retail', label: 'Storefront Experience' }
];

export const MANIFESTO_PRINCIPLES = [
  {
    number: '01',
    title: 'Customer-First Architecture',
    summary: 'Websites are not built merely to showcase code. They are engineered to bring businesses real customers, calls, and enquiries.',
    detail: 'Every layout decision, call-to-action placement, and typography choice is calculated to make it effortless for your customers to find you, trust you, and reach out immediately.'
  },
  {
    number: '02',
    title: 'Mobile-First Precision',
    summary: 'Over 80% of local customers browse on phones. Every design begins on the handheld screen.',
    detail: 'Clean navigation, instant tap-to-call buttons, and seamless WhatsApp messaging integration ensure zero friction on small screens.'
  },
  {
    number: '03',
    title: 'Speed & Search Dominance',
    summary: 'Sub-second load times and clean semantic structure help local businesses rank on Google.',
    detail: 'Lightweight assets, optimized code, and schema markup ensure fast indexing so nearby customers discover your shop or clinic first.'
  },
  {
    number: '04',
    title: 'Rapid 2–5 Day Delivery',
    summary: 'Fast turnaround without compromising polish, quality, or reliability.',
    detail: 'From initial consultation and design drafting to client revisions and live deployment, your website is ready to generate business within days.'
  }
];
