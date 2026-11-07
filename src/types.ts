export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  category: 'Digital Direction' | 'Spatial & 3D' | 'Creative Engineering' | 'Brand Systems';
  year: string;
  client: string;
  role: string;
  heroImage: string;
  galleryImages: string[];
  overview: string;
  challenge: string;
  solution: string;
  impactMetrics: { label: string; value: string; detail: string }[];
  awards: string[];
  technologies: string[];
  liveUrl?: string;
  accentColor: string;
  palette: { name: string; hex: string }[];
  typography: { font: string; usage: string }[];
  interactiveFeature?: '3d-viewer' | 'sound-wave' | 'color-mixer' | 'typography-tester';
}

export interface AwardItem {
  year: string;
  award: string;
  project: string;
  category: string;
  organization: string;
  verifiedLink?: string;
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  highlights: string[];
}

export interface EducationItem {
  period: string;
  degree: string;
  institution: string;
  location: string;
  status: string;
  description: string;
  coursework: string[];
  highlights: string[];
}

export interface LabExperiment {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  interactiveType: 'fluid-canvas' | 'audio-reactive' | 'kinetic-grid' | 'magnetic-physics';
  tag: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  initials?: string;
  avatar?: string;
}
