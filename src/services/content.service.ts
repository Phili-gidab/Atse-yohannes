// Read-through service for site content.
// If Firebase is configured, reads from Firestore; otherwise returns the seed
// data from src/data/content.ts. This lets the public site keep working before
// the CMS is wired, and lets admin edits override the seeds once configured.

import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import {
  HERO,
  IMPACT_METRICS,
  PROGRAMS,
  PROJECTS,
  STORY,
  HOW_WE_WORK,
  LEADERSHIP,
  COMMITTEES,
  CHAPTERS,
  NEWS,
  EVENTS,
  RESOURCES,
  DONATION_TIERS,
  VALUES,
  OUR_STORY,
  ORG,
  GALLERY,
  CAMPAIGN,
} from '../data/content';

// Resources in the seed are grouped by category, but the Firestore/admin shape
// is flat. Flatten for the fallback so public components see one consistent
// shape regardless of source.
const flatResourcesSeed = RESOURCES.flatMap((cat) =>
  cat.items.map((it) => ({ category: cat.category, title: it.title, type: it.type, visibility: 'public' as const }))
);

const seeds = {
  org: ORG,
  hero: HERO,
  impactMetrics: IMPACT_METRICS,
  programs: PROGRAMS,
  projects: PROJECTS,
  story: STORY,
  howWeWork: HOW_WE_WORK,
  leadership: LEADERSHIP,
  committees: COMMITTEES,
  chapters: CHAPTERS,
  news: NEWS,
  events: EVENTS,
  resources: flatResourcesSeed,
  donationTiers: DONATION_TIERS,
  values: VALUES,
  ourStory: OUR_STORY,
  gallery: GALLERY,
  campaign: CAMPAIGN,
};

const fetchDoc = async <T>(path: string, fallback: T): Promise<T> => {
  if (!isFirebaseConfigured || !db) return fallback;
  try {
    const snap = await getDoc(doc(db, path));
    if (!snap.exists()) return fallback;
    return { ...fallback, ...(snap.data() as object) } as T;
  } catch {
    return fallback;
  }
};

const fetchCollection = async <T>(
  path: string,
  fallback: T[],
  opts?: { publishedOnly?: boolean; orderField?: string; orderDir?: 'asc' | 'desc' }
): Promise<T[]> => {
  if (!isFirebaseConfigured || !db) return fallback;
  try {
    const ref = collection(db, path);
    const constraints = [];
    if (opts?.publishedOnly) constraints.push(where('published', '==', true));
    if (opts?.orderField) constraints.push(orderBy(opts.orderField, opts.orderDir ?? 'asc'));
    const q = constraints.length ? query(ref, ...constraints) : ref;
    const snap = await getDocs(q);
    if (snap.empty) return fallback;
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as unknown as T);
  } catch {
    return fallback;
  }
};

export const contentService = {
  getHero: () => fetchDoc('content/hero', seeds.hero),
  getOrg: () => fetchDoc('content/org', seeds.org),
  getStory: () => fetchDoc('content/story', seeds.story),
  getOurStory: () => fetchDoc('content/about', { body: seeds.ourStory }),
  getGallery: () => fetchDoc('content/gallery', seeds.gallery),
  getCampaign: () => fetchDoc('content/campaign', seeds.campaign),

  getPrograms: () => fetchCollection('programs', seeds.programs, { orderField: 'order' }),
  getProjects: () =>
    fetchCollection('projects', seeds.projects, { publishedOnly: true, orderField: 'order' }),
  getNews: () =>
    fetchCollection('news', seeds.news, {
      publishedOnly: true,
      orderField: 'date',
      orderDir: 'desc',
    }),
  getEvents: () =>
    fetchCollection('events', seeds.events, { publishedOnly: true, orderField: 'date' }),
  getLeadership: () => fetchCollection('leadership', seeds.leadership, { orderField: 'order' }),
  getChapters: () => fetchCollection('chapters', seeds.chapters),
  getDonationTiers: () =>
    fetchCollection('donationTiers', seeds.donationTiers, { orderField: 'amount' }),
  getResources: () => fetchCollection('resources', seeds.resources),
  getImpactMetrics: () =>
    fetchCollection('impactMetrics', seeds.impactMetrics, { orderField: 'order' }),
};

export { seeds };
