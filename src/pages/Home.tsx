import {
  Hero,
  ImpactMetrics,
  Programs,
  ImpactStory,
  ProjectsOverview,
  CommunityGallery,
  GetInvolved,
  AlumniNetwork,
  LatestUpdates,
  FinalCTA,
} from '../components/sections';

export const Home = () => {
  return (
    <>
      <Hero />
      <ImpactMetrics />
      <Programs />
      <ImpactStory />
      <ProjectsOverview />
      <CommunityGallery />
      <GetInvolved />
      <AlumniNetwork />
      <LatestUpdates />
      <FinalCTA />
    </>
  );
};
