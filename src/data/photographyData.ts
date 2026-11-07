export interface PhotoItem {
  id: string;
  title: string;
  subtitle?: string;
  series: string;
  category: 'architecture' | 'light' | 'heritage' | 'stories' | 'minimal';
  url: string;
  aspectRatio: 'landscape-wide' | 'portrait-tall' | 'square' | 'portrait-standard' | 'landscape-standard';
  colSpan?: string; // Tailwind grid column span
  rowSpan?: string; // Tailwind grid row span
  heightClass?: string;
  location: string;
  year: string;
  camera?: string;
  lens?: string;
  settings?: string;
  edition?: string;
  description?: string;
  dominantTone?: string;
}

export const PHOTOGRAPHY_SERIES = [
  { id: 'all', label: 'Complete Archive', count: 10 },
  { id: 'heritage', label: 'Kutch & Heritage', count: 3 },
  { id: 'architecture', label: 'Architectural Monoliths', count: 3 },
  { id: 'light', label: 'Shadow & Geometry', count: 2 },
  { id: 'stories', label: 'Human Narratives', count: 2 }
];


export const INITIAL_PHOTOGRAPHY_ARCHIVE: PhotoItem[] = [
  {
    id: 'photo-01',
    title: 'Even Reflections Have Shadows',
    subtitle: 'Studies in Light & Absence',
    series: 'Quiet Realities',
    category: 'light',
    url: '/images/1000081034.jpeg',
    aspectRatio: 'landscape-wide',
    colSpan: 'col-span-12 md:col-span-8',
    rowSpan: 'row-span-2',
    heightClass: 'h-[360px] sm:h-[480px] md:h-[540px]',
    location: '',
    year: '2026',
    camera: '',
    lens: '',
    settings: '',
    edition: '',
    description: 'A silhouetted hand emerges from the mirror, suspended between presence and absence. Scattered sunlight cuts through the darkness, creating an intimate study of solitude, perception, and the shadows we carry.',
    dominantTone: '#171717'
  },
  {
    id: 'photo-02',
    title: 'What the Season Leaves Behind',
    subtitle: 'Botanical Study I',
    series: 'Quiet Nature',
    category: 'light',
    url: '/images/20260712_180744.jpg',
    aspectRatio: 'portrait-tall',
    colSpan: 'col-span-12 sm:col-span-6 md:col-span-4',
    rowSpan: 'row-span-2',
    heightClass: 'h-[420px] sm:h-[480px] md:h-[540px]',
    location: '',
    year: '2026',
    camera: '',
    lens: '',
    settings: '',
    edition: '',
    description: 'Delicate remnants of a passing season rise against an endless, clouded sky. An intimate observation of impermanence, organic textures, and the quiet beauty of things left behind.',
    dominantTone: '#A69A8B'
  },
  {
    id: 'photo-03',
    title: 'Between Concrete & Sky',
    subtitle: 'Urban Fragment I',
    series: 'City in Stillness',
    category: 'architecture',
    url: '/images/20260728_092924.jpg',
    aspectRatio: 'portrait-tall',
    colSpan: 'col-span-12 sm:col-span-6 md:col-span-4',
    rowSpan: 'row-span-1',
    heightClass: 'h-[340px] sm:h-[400px]',
    location: '',
    year: '2026',
    camera: '',
    lens: '',
    settings: '',
    edition: '',
    description: 'Small birds occupy the edges of an ordinary concrete structure, where rigid architecture meets an open sky. A monochromatic observation of urban life, scale, and unexpected freedom.',
    dominantTone: '#77736F'
  },
  {
    id: 'photo-04',
    title: 'An Afterglow in Bloom',
    subtitle: 'Botanical Study II',
    series: 'Forgotten Summers',
    category: 'light',
    url: '/images/1000103205.jpeg',
    aspectRatio: 'portrait-tall',
    colSpan: 'col-span-12 md:col-span-4',
    rowSpan: 'row-span-1',
    heightClass: 'h-[340px] sm:h-[400px]',
    location: '',
    year: '2026',
    camera: '',
    lens: '',
    settings: '',
    edition: '',
    description: 'A solitary white bloom rests within a warm amber atmosphere. Grain, deep shadows, and faded sepia tones transform a fleeting botanical moment into a fragment of another time.',
    dominantTone: '#70421A'
  },
  {
    id: 'photo-05',
    title: 'Memories in Soft Focus',
    subtitle: 'Floral Impressions I',
    series: 'Forgotten Summers',
    category: 'light',
    url: '/images/1000103404.jpeg',
    aspectRatio: 'portrait-tall',
    colSpan: 'col-span-12 sm:col-span-6 md:col-span-4',
    rowSpan: 'row-span-1',
    heightClass: 'h-[340px] sm:h-[400px]',
    location: '',
    year: '2026',
    camera: '',
    lens: '',
    settings: '',
    edition: '',
    description: 'A fleeting garden scene softened by movement, faded colors, and the gentle imperfections of memory. Muted pinks and greens create a nostalgic exploration of color, blur, and botanical forms.',
    dominantTone: '#66533D'
  },
  {
    id: 'photo-06',
    title: 'A Small Pause in the Vast',
    subtitle: 'Silhouette Study I',
    series: 'Above the Ordinary',
    category: 'stories',
    url: '/images/1000107544.jpeg',
    aspectRatio: 'portrait-tall',
    colSpan: 'col-span-12 md:col-span-7',
    rowSpan: 'row-span-1',
    heightClass: 'h-[380px] sm:h-[460px]',
    location: '',
    year: '2026',
    camera: '',
    lens: '',
    settings: '',
    edition: '',
    description: 'A solitary bird rests upon a narrow line beneath an immense, clouded sky. Minimal forms, atmospheric grain, and deep shadows turn an ordinary encounter into a quiet meditation on isolation and stillness.',
    dominantTone: '#455054'
  },
  {
    id: 'photo-07',
    title: 'The Weight of Silence',
    subtitle: 'Urban Fragment II',
    series: 'City in Stillness',
    category: 'architecture',
    url: '/images/1000110156 (1).jpeg',
    aspectRatio: 'landscape-wide',
    colSpan: 'col-span-12 md:col-span-5',
    rowSpan: 'row-span-1',
    heightClass: 'h-[380px] sm:h-[460px]',
    location: '',
    year: '2026',
    camera: '',
    lens: '',
    settings: '',
    edition: '',
    description: 'A solitary bird finds its place among tangled electrical lines and weathered infrastructure. Stark monochrome contrasts reveal an unexpected stillness within the complexity of the urban landscape.',
    dominantTone: '#302C29'
  },
  {
    id: 'photo-08',
    title: 'The Nature of Contrast',
    subtitle: 'Between the Built & Wild',
    series: 'City in Stillness',
    category: 'architecture',
    url: '/images/1000113696 (1).jpeg',
    aspectRatio: 'landscape-wide',
    colSpan: 'col-span-12 md:col-span-8',
    rowSpan: 'row-span-1',
    heightClass: 'h-[380px] sm:h-[460px]',
    location: '',
    year: '2026',
    camera: '',
    lens: '',
    settings: '',
    edition: '',
    description: 'An industrial communications tower rises beside the dark silhouette of a tree, set against an expansive muted sky. A visual dialogue between human construction and the untamed forms of nature.',
    dominantTone: '#77716A'
  },
  {
    id: 'photo-09',
    title: 'Where the Light Lives',
    subtitle: 'Botanical Study III',
    series: 'Light & Living Things',
    category: 'light',
    url: '/images/aambali.png',
    aspectRatio: 'portrait-tall',
    colSpan: 'col-span-12 sm:col-span-6 md:col-span-4',
    rowSpan: 'row-span-1',
    heightClass: 'h-[360px] sm:h-[420px]',
    location: '',
    year: '2026',
    camera: '',
    lens: '',
    settings: '',
    edition: '',
    description: 'Golden sunlight traces the intricate veins of broad green leaves, revealing the delicate architecture of nature. Warm backlighting and luminous bokeh transform ordinary foliage into an intimate study of light and organic geometry.',
    dominantTone: '#70501A'
  },
  {
  id: 'photo-10',
  title: 'A Brief Stillness',
  subtitle: 'Butterfly in the Wild',
  series: 'Natural Narratives',
  category: 'light',
  url: '/images/BUTTERFLY.jpeg',
  aspectRatio: 'portrait-tall',
  colSpan: 'col-span-12 sm:col-span-6 md:col-span-4',
  rowSpan: 'row-span-1',
  heightClass: 'h-[420px] sm:h-[480px]',
  location: 'Location not specified',
  year: '2026',
  camera: 'Not specified',
  lens: 'Not specified',
  settings: 'Not specified',
  edition: 'Edition 11/13',
  description: 'A vivid orange butterfly resting among wild grasses and delicate seed heads, surrounded by the quiet complexity of untamed nature.',
  dominantTone: '#777b3d'
},
{
  id: 'photo-11',
  title: 'Where the Clouds Gather',
  subtitle: 'Anatomy of the Monsoon Sky',
  series: 'Atmospheric Studies',
  category: 'light',
  url: '/images/CLD.jpeg',
  aspectRatio: 'portrait-tall',
  colSpan: 'col-span-12 sm:col-span-6 md:col-span-4',
  rowSpan: 'row-span-1',
  heightClass: 'h-[420px] sm:h-[480px]',
  location: 'Location not specified',
  year: '2026',
  camera: 'Not specified',
  lens: 'Not specified',
  settings: 'Not specified',
  edition: 'Edition 12/13',
  description: 'Towering monsoon clouds drift across an endless cobalt sky, interrupted by the stark vertical silhouette of an electric pole.',
  dominantTone: '#164b78'
},
{
  id: 'photo-12',
  title: 'A Gaze Through Iron',
  subtitle: 'The Quiet Observer',
  series: 'Human & Animal Narratives',
  category: 'stories',
  url: '/images/IMG3.jpeg',
  aspectRatio: 'portrait-tall',
  colSpan: 'col-span-12 sm:col-span-6 md:col-span-4',
  rowSpan: 'row-span-1',
  heightClass: 'h-[420px] sm:h-[480px]',
  location: 'Location not specified',
  year: '2026',
  camera: 'Not specified',
  lens: 'Not specified',
  settings: 'Not specified',
  edition: 'Edition 13/13',
  description: 'A solitary tabby cat caught in a quiet moment behind weathered iron bars, rendered in monochrome with an intimate documentary perspective.',
  dominantTone: '#77736b'
}
];

