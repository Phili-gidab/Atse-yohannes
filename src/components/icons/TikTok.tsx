// TikTok isn't part of lucide-react's icon set, so we ship a minimal inline
// SVG that mirrors the lucide API (a numeric `size` prop, currentColor fill)
// for drop-in use alongside the other social icons.
interface TikTokProps {
  size?: number | string;
  className?: string;
}

export const TikTok = ({ size = 24, className }: TikTokProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M16.6 5.82a4.28 4.28 0 0 1-1.05-2.82h-3.2v12.86a2.59 2.59 0 0 1-2.59 2.46 2.59 2.59 0 1 1 .73-5.07V9.98a5.86 5.86 0 0 0-.73-.05A5.86 5.86 0 1 0 15.43 16V9.4a7.5 7.5 0 0 0 4.37 1.4V7.6a4.28 4.28 0 0 1-3.2-1.78z" />
  </svg>
);
