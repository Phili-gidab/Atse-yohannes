// Idempotent seeder: copies the static seed data from src/data/content.ts
// into Firestore the first time an admin clicks "Seed". If a collection or
// doc already exists it is skipped, so re-running is safe.
//
// Icon-bearing arrays (PROGRAMS, VALUES) store the lucide icon NAME (string)
// in Firestore — the public components map name → component on read.

import { collection, doc, getDocs, setDoc, writeBatch } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import {
  HERO,
  ORG,
  STORY,
  OUR_STORY,
  IMPACT_METRICS,
  PROGRAMS,
  PROJECTS,
  HOW_WE_WORK,
  LEADERSHIP,
  COMMITTEES,
  CHAPTERS,
  NEWS,
  EVENTS,
  RESOURCES,
  DONATION_TIERS,
  VALUES,
  CAMPAIGN,
} from '../data/content';

// Map lucide icon component → name string by inspecting displayName/name.
// If a seed entry's icon doesn't expose a usable name, we fall back to "Sparkles".
const iconName = (icon: unknown): string => {
  if (typeof icon === 'function' || typeof icon === 'object') {
    const c = icon as { displayName?: string; name?: string; render?: { displayName?: string } };
    return c?.displayName ?? c?.render?.displayName ?? c?.name ?? 'Sparkles';
  }
  return 'Sparkles';
};

export interface SeedResult {
  collection: string;
  written: number;
  skipped: number;
}

const seedCollection = async <T extends Record<string, unknown>>(
  path: string,
  items: T[],
  idFor: (item: T, index: number) => string,
  transform?: (item: T, index: number) => Record<string, unknown>
): Promise<SeedResult> => {
  if (!db) throw new Error('Firestore not configured');

  const ref = collection(db, path);
  const existing = await getDocs(ref);
  const existingIds = new Set(existing.docs.map((d) => d.id));

  const batch = writeBatch(db);
  let written = 0;
  let skipped = 0;

  items.forEach((item, i) => {
    const id = idFor(item, i);
    if (existingIds.has(id)) {
      skipped += 1;
      return;
    }
    const data = transform ? transform(item, i) : item;
    batch.set(doc(db!, path, id), {
      ...data,
      published: true,
      order: i,
      createdAt: new Date().toISOString(),
    });
    written += 1;
  });

  if (written > 0) await batch.commit();
  return { collection: path, written, skipped };
};

const seedDoc = async (
  path: string,
  data: Record<string, unknown>
): Promise<SeedResult> => {
  if (!db) throw new Error('Firestore not configured');
  const ref = doc(db, path);
  // setDoc with merge:false would clobber — use merge:true so re-running tops
  // up any missing fields without erasing edits made via the editor.
  await setDoc(ref, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  return { collection: path, written: 1, skipped: 0 };
};

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

export const seedFirestore = async (): Promise<SeedResult[]> => {
  if (!isFirebaseConfigured) throw new Error('Firebase not configured');

  const results: SeedResult[] = [];

  // --- Singleton docs under content/ ---
  results.push(await seedDoc('content/hero', HERO as unknown as Record<string, unknown>));
  results.push(await seedDoc('content/org', ORG as unknown as Record<string, unknown>));
  results.push(await seedDoc('content/story', STORY as unknown as Record<string, unknown>));
  results.push(await seedDoc('content/about', { body: OUR_STORY }));
  results.push(await seedDoc('content/committees', { items: COMMITTEES }));
  results.push(await seedDoc('content/campaign', CAMPAIGN as unknown as Record<string, unknown>));

  // --- Collections ---
  results.push(
    await seedCollection(
      'impactMetrics',
      IMPACT_METRICS as unknown as Record<string, unknown>[],
      (_, i) => `m${i + 1}`
    )
  );

  results.push(
    await seedCollection(
      'programs',
      PROGRAMS as unknown as Record<string, unknown>[],
      (p) => slug((p as { title: string }).title),
      (p) => ({ ...p, icon: iconName((p as { icon: unknown }).icon) })
    )
  );

  results.push(
    await seedCollection(
      'projects',
      PROJECTS as unknown as Record<string, unknown>[],
      (p) => (p as { slug: string }).slug
    )
  );

  results.push(
    await seedCollection(
      'howWeWork',
      HOW_WE_WORK as unknown as Record<string, unknown>[],
      (h) => (h as { step: string }).step
    )
  );

  results.push(
    await seedCollection(
      'leadership',
      LEADERSHIP as unknown as Record<string, unknown>[],
      (l) => slug((l as { name: string }).name)
    )
  );

  results.push(
    await seedCollection(
      'chapters',
      CHAPTERS as unknown as Record<string, unknown>[],
      (c) => slug((c as { name: string }).name)
    )
  );

  results.push(
    await seedCollection(
      'news',
      NEWS as unknown as Record<string, unknown>[],
      (n) => (n as { slug: string }).slug
    )
  );

  results.push(
    await seedCollection(
      'events',
      EVENTS as unknown as Record<string, unknown>[],
      (e) => (e as { slug: string }).slug
    )
  );

  results.push(
    await seedCollection(
      'donationTiers',
      DONATION_TIERS as unknown as Record<string, unknown>[],
      (t) => `tier-${(t as { amount: number }).amount}`
    )
  );

  results.push(
    await seedCollection(
      'values',
      VALUES as unknown as Record<string, unknown>[],
      (v) => slug((v as { title: string }).title),
      (v) => ({ ...v, icon: iconName((v as { icon: unknown }).icon) })
    )
  );

  // Resources are nested as categories → items in the seed; flatten to a list.
  const flatResources: Record<string, unknown>[] = [];
  RESOURCES.forEach((cat) => {
    cat.items.forEach((item, j) => {
      flatResources.push({
        category: cat.category,
        title: item.title,
        type: item.type,
        visibility: 'public',
        order: j,
      });
    });
  });
  results.push(
    await seedCollection('resources', flatResources, (r) =>
      slug(`${(r as { category: string }).category}-${(r as { title: string }).title}`)
    )
  );

  return results;
};
