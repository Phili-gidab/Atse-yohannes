// Declarative schemas for each Firestore collection. Adding a new editor =
// adding a new entry here + a route in App.tsx. The CollectionManager and
// ItemEditor render whatever the schema says.

import { iconNames } from '../utils/iconMap';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'image'
  | 'select'
  | 'icon'
  | 'list' // string[] entered as comma-separated or one-per-line
  | 'switch'
  | 'date';

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  helper?: string;
  placeholder?: string;
}

export interface CollectionSchema {
  /** Firestore collection path. */
  collection: string;
  /** Sidebar / heading title. */
  title: string;
  /** Singular label for "Add new". */
  singular: string;
  /** Where uploaded images live in Storage. */
  imageFolder?: string;
  /** Render label for the list view. */
  rowTitle: (item: Record<string, unknown>) => string;
  rowSubtitle?: (item: Record<string, unknown>) => string;
  rowImage?: (item: Record<string, unknown>) => string | undefined;
  /** How the document ID is determined when creating new items. */
  idStrategy: 'slugFromTitle' | 'auto' | 'fromField';
  idField?: string;
  /** The fields to render in the editor form. */
  fields: Field[];
  /** Defaults when creating a new item. */
  defaults: Record<string, unknown>;
  /** Sort field for list view. */
  orderField?: string;
}

export const schemas: Record<string, CollectionSchema> = {
  programs: {
    collection: 'programs',
    title: 'Programs',
    singular: 'Program',
    imageFolder: 'site/programs',
    rowTitle: (i) => String(i.title ?? ''),
    rowSubtitle: (i) => String(i.description ?? '').slice(0, 120),
    idStrategy: 'slugFromTitle',
    idField: 'title',
    orderField: 'order',
    defaults: { icon: 'Sparkles', title: '', description: '', published: true, order: 99 },
    fields: [
      { key: 'icon', label: 'Icon', type: 'icon', options: iconNames, required: true },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true },
      { key: 'order', label: 'Display order', type: 'number', helper: 'Lower numbers appear first' },
      { key: 'published', label: 'Published', type: 'switch' },
    ],
  },

  projects: {
    collection: 'projects',
    title: 'Projects',
    singular: 'Project',
    imageFolder: 'projects',
    rowTitle: (i) => String(i.title ?? ''),
    rowSubtitle: (i) => String(i.status ?? ''),
    rowImage: (i) => (typeof i.image === 'string' ? i.image : undefined),
    idStrategy: 'fromField',
    idField: 'slug',
    orderField: 'order',
    defaults: {
      slug: '',
      title: '',
      status: 'Ongoing',
      image: '',
      story: '',
      problem: '',
      action: '',
      impact: [],
      published: true,
      order: 99,
    },
    fields: [
      { key: 'slug', label: 'Slug (URL fragment, no spaces)', type: 'text', required: true, placeholder: 'lmc-equipment' },
      { key: 'title', label: 'Title', type: 'text', required: true },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: ['Completed', 'Ongoing', 'Active Campaign', 'Building Completed — Equipment Ongoing'],
      },
      { key: 'image', label: 'Cover image', type: 'image' },
      { key: 'story', label: 'Background story (optional)', type: 'textarea', helper: 'Adds context above "The Problem" — useful for completed projects with a meaningful backstory.' },
      { key: 'problem', label: 'The Problem', type: 'textarea', required: true },
      { key: 'action', label: 'Our Action', type: 'textarea', required: true },
      { key: 'impact', label: 'Impact (one per line)', type: 'list', helper: 'One bullet per line' },
      { key: 'order', label: 'Display order', type: 'number' },
      { key: 'published', label: 'Published', type: 'switch' },
    ],
  },

  news: {
    collection: 'news',
    title: 'News & Updates',
    singular: 'News post',
    imageFolder: 'news',
    rowTitle: (i) => String(i.title ?? ''),
    rowSubtitle: (i) => `${i.category ?? ''} · ${i.date ?? ''}`,
    rowImage: (i) => (typeof i.image === 'string' ? i.image : undefined),
    idStrategy: 'fromField',
    idField: 'slug',
    orderField: 'date',
    defaults: {
      slug: '',
      date: new Date().toISOString().slice(0, 10),
      category: 'News',
      title: '',
      excerpt: '',
      image: '',
      body: '',
      published: true,
    },
    fields: [
      { key: 'slug', label: 'Slug', type: 'text', required: true },
      { key: 'date', label: 'Date', type: 'date', required: true },
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        options: ['Fundraising', 'Event', 'Campaign', 'Project', 'News', 'Story'],
      },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'excerpt', label: 'Excerpt (1–2 sentences)', type: 'textarea', required: true },
      { key: 'image', label: 'Cover image', type: 'image' },
      { key: 'body', label: 'Full body (optional)', type: 'textarea' },
      { key: 'published', label: 'Published', type: 'switch' },
    ],
  },

  events: {
    collection: 'events',
    title: 'Events',
    singular: 'Event',
    imageFolder: 'events',
    rowTitle: (i) => String(i.title ?? ''),
    rowSubtitle: (i) => `${i.location ?? ''} · ${i.date ?? ''}`,
    idStrategy: 'fromField',
    idField: 'slug',
    orderField: 'date',
    defaults: {
      slug: '',
      date: new Date().toISOString().slice(0, 10),
      title: '',
      location: '',
      description: '',
      type: 'Reunion',
      flyerImage: '',
      featured: false,
      discountUrl: '',
      discountLabel: '',
      published: true,
    },
    fields: [
      { key: 'slug', label: 'Slug', type: 'text', required: true },
      { key: 'date', label: 'Date', type: 'date', required: true },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'location', label: 'Location', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true },
      {
        key: 'type',
        label: 'Type',
        type: 'select',
        options: ['Reunion', 'Visit', 'Fundraiser', 'Gathering', 'Meeting', 'Conference'],
      },
      { key: 'flyerImage', label: 'Flyer image (optional)', type: 'image', helper: 'For Reunion events, this flyer is featured on the homepage.' },
      { key: 'featured', label: 'Feature on homepage', type: 'switch', helper: 'Spotlights this event in the homepage reunion banner.' },
      { key: 'discountUrl', label: 'Discount link URL (optional)', type: 'text', helper: 'Shows as a clickable button (e.g. hotel reunion discount).' },
      { key: 'discountLabel', label: 'Discount link label', type: 'text', helper: 'Button text for the discount link. Defaults to "Reunion Discount Link".' },
      { key: 'published', label: 'Published', type: 'switch' },
    ],
  },

  leadership: {
    collection: 'leadership',
    title: 'Leadership',
    singular: 'Leader',
    rowTitle: (i) => String(i.name ?? ''),
    rowSubtitle: (i) => String(i.role ?? ''),
    idStrategy: 'slugFromTitle',
    idField: 'name',
    orderField: 'order',
    defaults: { name: '', role: '', initials: '', published: true, order: 99 },
    fields: [
      { key: 'name', label: 'Full name', type: 'text', required: true },
      { key: 'role', label: 'Role / title', type: 'text', required: true },
      { key: 'initials', label: 'Initials (2 chars, shown on avatar)', type: 'text', required: true },
      { key: 'order', label: 'Display order', type: 'number' },
      { key: 'published', label: 'Published', type: 'switch' },
    ],
  },

  chapters: {
    collection: 'chapters',
    title: 'Chapters',
    singular: 'Chapter',
    rowTitle: (i) => String(i.name ?? ''),
    rowSubtitle: (i) => (Array.isArray(i.cities) ? (i.cities as string[]).join(' · ') : ''),
    idStrategy: 'slugFromTitle',
    idField: 'name',
    defaults: { name: '', cities: [], published: true, order: 99 },
    fields: [
      { key: 'name', label: 'Region / country', type: 'text', required: true, placeholder: 'United States' },
      { key: 'cities', label: 'Cities (one per line)', type: 'list' },
      { key: 'order', label: 'Display order', type: 'number' },
      { key: 'published', label: 'Published', type: 'switch' },
    ],
  },

  donationTiers: {
    collection: 'donationTiers',
    title: 'Donation Tiers',
    singular: 'Tier',
    rowTitle: (i) => `$${i.amount ?? 0} — ${i.label ?? ''}`,
    rowSubtitle: (i) => String(i.impact ?? ''),
    idStrategy: 'auto',
    orderField: 'amount',
    defaults: { amount: 25, label: '', impact: '', featured: false, published: true },
    fields: [
      { key: 'amount', label: 'Amount (USD)', type: 'number', required: true },
      { key: 'label', label: 'Tier name', type: 'text', required: true, placeholder: 'Patron' },
      { key: 'impact', label: 'Impact statement', type: 'textarea', required: true },
      { key: 'featured', label: 'Highlighted tier', type: 'switch' },
      { key: 'published', label: 'Published', type: 'switch' },
    ],
  },

  resources: {
    collection: 'resources',
    title: 'Resources',
    singular: 'Resource',
    rowTitle: (i) => String(i.title ?? ''),
    rowSubtitle: (i) => `${i.category ?? ''} · ${i.type ?? ''}`,
    idStrategy: 'auto',
    orderField: 'order',
    defaults: {
      category: 'Books & Study Guides',
      title: '',
      type: 'PDF',
      visibility: 'public',
      url: '',
      published: true,
      order: 99,
    },
    fields: [
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        options: ['Books & Study Guides', 'Scholarships', 'External Learning Links', 'Documents', 'Other'],
      },
      { key: 'title', label: 'Title', type: 'text', required: true },
      {
        key: 'type',
        label: 'Type',
        type: 'select',
        options: ['PDF', 'Link', 'Form', 'Document'],
      },
      { key: 'url', label: 'Link or download URL', type: 'text' },
      {
        key: 'visibility',
        label: 'Visibility',
        type: 'select',
        options: ['public', 'members'],
        helper: 'Members-only resources are gated by Firestore rules',
      },
      { key: 'order', label: 'Display order', type: 'number' },
      { key: 'published', label: 'Published', type: 'switch' },
    ],
  },

  impactMetrics: {
    collection: 'impactMetrics',
    title: 'Impact Metrics',
    singular: 'Metric',
    rowTitle: (i) => `${i.value ?? ''} — ${i.label ?? ''}`,
    idStrategy: 'auto',
    orderField: 'order',
    defaults: { value: '', label: '', order: 99, published: true },
    fields: [
      { key: 'value', label: 'Number / value', type: 'text', placeholder: '$10,100+' },
      { key: 'label', label: 'Label', type: 'text', required: true },
      { key: 'order', label: 'Display order', type: 'number' },
      { key: 'published', label: 'Published', type: 'switch' },
    ],
  },
};
