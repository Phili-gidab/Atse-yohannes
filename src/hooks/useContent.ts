import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/content.service';
import {
  HERO,
  ORG,
  STORY,
  OUR_STORY,
  PROGRAMS,
  PROJECTS,
  NEWS,
  EVENTS,
  LEADERSHIP,
  CHAPTERS,
  DONATION_TIERS,
  IMPACT_METRICS,
  GALLERY,
  RESOURCES,
} from '../data/content';

// Each hook keys to the corresponding Firestore path so cache invalidation
// after admin edits stays straightforward (queryClient.invalidateQueries(['hero'])).
//
// Every hook passes `placeholderData` from the local seed. The seed renders
// instantly on cold load so sections never appear empty during the Firestore
// round-trip; the live Firestore data swaps in as soon as it arrives.

const flatResourcesSeed = RESOURCES.flatMap((cat) =>
  cat.items.map((it) => ({
    category: cat.category,
    title: it.title,
    type: it.type,
    url: 'url' in it ? (it as { url?: string }).url : undefined,
    visibility: 'public' as const,
  }))
);

export const useHero = () =>
  useQuery({
    queryKey: ['hero'],
    queryFn: () => contentService.getHero(),
    placeholderData: HERO,
  });

export const useOrg = () =>
  useQuery({
    queryKey: ['org'],
    queryFn: () => contentService.getOrg(),
    placeholderData: ORG,
  });

export const useStory = () =>
  useQuery({
    queryKey: ['story'],
    queryFn: () => contentService.getStory(),
    placeholderData: STORY,
  });

export const useOurStory = () =>
  useQuery({
    queryKey: ['ourStory'],
    queryFn: () => contentService.getOurStory(),
    placeholderData: { body: OUR_STORY },
  });

export const usePrograms = () =>
  useQuery({
    queryKey: ['programs'],
    queryFn: () => contentService.getPrograms(),
    placeholderData: PROGRAMS,
  });

export const useProjects = () =>
  useQuery({
    queryKey: ['projects'],
    queryFn: () => contentService.getProjects(),
    placeholderData: PROJECTS,
  });

export const useNews = () =>
  useQuery({
    queryKey: ['news'],
    queryFn: () => contentService.getNews(),
    placeholderData: NEWS,
  });

export const useEvents = () =>
  useQuery({
    queryKey: ['events'],
    queryFn: () => contentService.getEvents(),
    placeholderData: EVENTS,
  });

export const useLeadership = () =>
  useQuery({
    queryKey: ['leadership'],
    queryFn: () => contentService.getLeadership(),
    placeholderData: LEADERSHIP,
  });

export const useChapters = () =>
  useQuery({
    queryKey: ['chapters'],
    queryFn: () => contentService.getChapters(),
    placeholderData: CHAPTERS,
  });

export const useDonationTiers = () =>
  useQuery({
    queryKey: ['donationTiers'],
    queryFn: () => contentService.getDonationTiers(),
    placeholderData: DONATION_TIERS,
  });

export const useResources = () =>
  useQuery({
    queryKey: ['resources'],
    queryFn: () => contentService.getResources(),
    placeholderData: flatResourcesSeed,
  });

export const useImpactMetrics = () =>
  useQuery({
    queryKey: ['impactMetrics'],
    queryFn: () => contentService.getImpactMetrics(),
    placeholderData: IMPACT_METRICS,
  });

export const useGallery = () =>
  useQuery({
    queryKey: ['gallery'],
    queryFn: () => contentService.getGallery(),
    placeholderData: GALLERY,
  });
