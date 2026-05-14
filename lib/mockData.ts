import type { Manual, Video, VideoCategory } from './supabase';

export const MOCK_CATEGORIES: VideoCategory[] = [
  {
    id: 'cat-1',
    slug: 'onboarding',
    name_en: 'Onboarding',
    name_es: 'Inducción',
    thumbnail_url:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop',
    order_index: 1,
  },
  {
    id: 'cat-2',
    slug: 'sales',
    name_en: 'Sales',
    name_es: 'Ventas',
    thumbnail_url:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop',
    order_index: 2,
  },
  {
    id: 'cat-3',
    slug: 'product',
    name_en: 'Product',
    name_es: 'Producto',
    thumbnail_url:
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop',
    order_index: 3,
  },
  {
    id: 'cat-4',
    slug: 'leadership',
    name_en: 'Leadership',
    name_es: 'Liderazgo',
    thumbnail_url:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop',
    order_index: 4,
  },
];

export const MOCK_VIDEOS: Video[] = [
  {
    id: 'v-1',
    category_id: 'cat-1',
    title_en: 'Welcome to the team',
    title_es: 'Bienvenido al equipo',
    description_en: 'Get a tour of our values and ways of working.',
    description_es: 'Conoce nuestros valores y forma de trabajar.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop',
    video_url:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration_seconds: 540,
    size_bytes: 158_000_000,
    resolution: '1080p',
    instructor: 'Sara López',
    chapters: [
      { start_seconds: 0, title_en: 'Welcome', title_es: 'Bienvenida' },
      { start_seconds: 60, title_en: 'Our mission', title_es: 'Nuestra misión' },
      { start_seconds: 180, title_en: 'How we work', title_es: 'Cómo trabajamos' },
      { start_seconds: 360, title_en: 'Tooling', title_es: 'Herramientas' },
      { start_seconds: 480, title_en: 'Next steps', title_es: 'Próximos pasos' },
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'v-2',
    category_id: 'cat-2',
    title_en: 'Discovery call playbook',
    title_es: 'Guía para llamadas de descubrimiento',
    description_en: 'How to run a discovery call from start to finish.',
    description_es: 'Cómo dirigir una llamada de descubrimiento.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop',
    video_url:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration_seconds: 1320,
    size_bytes: 412_000_000,
    resolution: '1080p',
    instructor: 'Carlos Méndez',
    chapters: [
      { start_seconds: 0, title_en: 'Opening', title_es: 'Apertura' },
      { start_seconds: 180, title_en: 'Qualifying questions', title_es: 'Preguntas de calificación' },
      { start_seconds: 540, title_en: 'Handling pushback', title_es: 'Manejo de objeciones' },
      { start_seconds: 900, title_en: 'Closing the call', title_es: 'Cierre' },
      { start_seconds: 1200, title_en: 'Follow-up', title_es: 'Seguimiento' },
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'v-3',
    category_id: 'cat-3',
    title_en: 'Product walkthrough',
    title_es: 'Recorrido por el producto',
    description_en: null,
    description_es: null,
    thumbnail_url:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop',
    video_url:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration_seconds: 780,
    size_bytes: 256_000_000,
    resolution: '720p',
    instructor: 'Priya Singh',
    chapters: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'v-4',
    category_id: 'cat-4',
    title_en: 'Coaching conversations',
    title_es: 'Conversaciones de coaching',
    description_en: null,
    description_es: null,
    thumbnail_url:
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&auto=format&fit=crop',
    video_url:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration_seconds: 960,
    size_bytes: 312_000_000,
    resolution: '1080p',
    instructor: 'Daniel Ortiz',
    chapters: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'v-5',
    category_id: 'cat-1',
    title_en: 'Your first week',
    title_es: 'Tu primera semana',
    description_en: 'What to expect and how to make the most of it.',
    description_es: 'Qué esperar y cómo aprovecharla al máximo.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop',
    video_url:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration_seconds: 420,
    size_bytes: 124_000_000,
    resolution: '1080p',
    instructor: 'Sara López',
    chapters: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'v-6',
    category_id: 'cat-1',
    title_en: 'Meet the leadership team',
    title_es: 'Conoce al equipo de liderazgo',
    description_en: null,
    description_es: null,
    thumbnail_url:
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop',
    video_url:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration_seconds: 600,
    size_bytes: 198_000_000,
    resolution: '720p',
    instructor: null,
    chapters: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'v-7',
    category_id: 'cat-2',
    title_en: 'Handling objections',
    title_es: 'Manejo de objeciones',
    description_en: 'The five most common objections and how to address them.',
    description_es: 'Las cinco objeciones más comunes y cómo manejarlas.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop',
    video_url:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    duration_seconds: 840,
    size_bytes: 248_000_000,
    resolution: '1080p',
    instructor: 'Carlos Méndez',
    chapters: null,
    created_at: new Date().toISOString(),
  },
];

export const MOCK_MANUALS: Manual[] = [
  {
    id: 'm-1',
    title_en: 'Employee handbook',
    title_es: 'Manual del empleado',
    description_en: 'Policies, benefits, and culture overview.',
    description_es: 'Políticas, beneficios y resumen de cultura.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop',
    pdf_url_en: 'https://www.africau.edu/images/default/sample.pdf',
    pdf_url_es: 'https://www.africau.edu/images/default/sample.pdf',
    page_count: 42,
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-2',
    title_en: 'Sales playbook',
    title_es: 'Manual de ventas',
    description_en: 'Process, scripts and objection handling.',
    description_es: 'Proceso, guiones y manejo de objeciones.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop',
    pdf_url_en: 'https://www.africau.edu/images/default/sample.pdf',
    pdf_url_es: null,
    page_count: 88,
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-3',
    title_en: 'Brand guidelines',
    title_es: 'Guía de marca',
    description_en: 'Logos, typography, colors.',
    description_es: 'Logos, tipografía, colores.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop',
    pdf_url_en: null,
    pdf_url_es: 'https://www.africau.edu/images/default/sample.pdf',
    page_count: 24,
    created_at: new Date().toISOString(),
  },
];
