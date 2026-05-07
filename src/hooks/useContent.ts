import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/content.service';

// Each hook keys to the corresponding Firestore path so cache invalidation
// after admin edits stays straightforward (queryClient.invalidateQueries(['hero'])).

export const useHero = () =>
  useQuery({ queryKey: ['hero'], queryFn: () => contentService.getHero() });

export const useOrg = () =>
  useQuery({ queryKey: ['org'], queryFn: () => contentService.getOrg() });

export const useStory = () =>
  useQuery({ queryKey: ['story'], queryFn: () => contentService.getStory() });

export const useOurStory = () =>
  useQuery({ queryKey: ['ourStory'], queryFn: () => contentService.getOurStory() });

export const usePrograms = () =>
  useQuery({ queryKey: ['programs'], queryFn: () => contentService.getPrograms() });

export const useProjects = () =>
  useQuery({ queryKey: ['projects'], queryFn: () => contentService.getProjects() });

export const useNews = () =>
  useQuery({ queryKey: ['news'], queryFn: () => contentService.getNews() });

export const useEvents = () =>
  useQuery({ queryKey: ['events'], queryFn: () => contentService.getEvents() });

export const useLeadership = () =>
  useQuery({ queryKey: ['leadership'], queryFn: () => contentService.getLeadership() });

export const useChapters = () =>
  useQuery({ queryKey: ['chapters'], queryFn: () => contentService.getChapters() });

export const useDonationTiers = () =>
  useQuery({ queryKey: ['donationTiers'], queryFn: () => contentService.getDonationTiers() });

export const useResources = () =>
  useQuery({ queryKey: ['resources'], queryFn: () => contentService.getResources() });

export const useImpactMetrics = () =>
  useQuery({ queryKey: ['impactMetrics'], queryFn: () => contentService.getImpactMetrics() });

export const useGallery = () =>
  useQuery({ queryKey: ['gallery'], queryFn: () => contentService.getGallery() });
