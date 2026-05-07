import { useEffect, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';
import { Camera, X, ArrowLeft, ArrowRight, Maximize2 } from 'lucide-react';
import { useGallery } from '../../hooks/useContent';

// =====================================================
// AWWWARDS-style infinite marquee gallery for AYAA.
// Three rows scroll in alternating directions; each tile
// opens a lightbox with prev/next + keyboard navigation.
// =====================================================

export interface GalleryItem {
  src: string;
  alt: string;
  tag?: string;
  width?: 'narrow' | 'normal' | 'wide';
}

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const Wrap = styled.section`
  position: relative;
  padding: 6rem 0 6.5rem;
  background: linear-gradient(180deg, var(--color-primary-950) 0%, var(--color-primary-900) 100%);
  color: white;
  overflow: hidden;
  isolation: isolate;

  @media (max-width: 768px) {
    padding: 4.5rem 0 5rem;
  }
`;

const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image:
    radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
`;

const Glow = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(circle at 12% 20%, rgba(20, 184, 166, 0.18), transparent 45%),
    radial-gradient(circle at 88% 80%, rgba(245, 183, 29, 0.12), transparent 50%);
  pointer-events: none;
`;

const HeaderRow = styled(motion.div)`
  position: relative;
  z-index: 2;
  max-width: var(--container-max);
  margin: 0 auto 3rem;
  padding: 0 var(--container-padding);
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;

  @media (max-width: 760px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
  }

  .lead {
    max-width: 560px;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0.4rem 0.9rem;
    border-radius: 999px;
    background: rgba(245, 183, 29, 0.10);
    border: 1px solid rgba(245, 183, 29, 0.25);
    color: var(--color-accent-300);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 1.1rem;
    backdrop-filter: blur(6px);
  }

  h2 {
    color: white;
    font-size: clamp(2rem, 4.6vw, 3.4rem);
    line-height: 1.05;
    letter-spacing: -0.02em;
    margin-bottom: 0.85rem;

    .accent {
      display: inline-block;
      background: linear-gradient(120deg, var(--color-accent-300), #ffd66b 50%, var(--color-accent-500));
      background-size: 200% auto;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: ${shimmer} 5s linear infinite;
    }
  }

  p {
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.98rem;
    line-height: 1.7;
    max-width: 46ch;
  }

  .meta {
    text-align: right;
    flex-shrink: 0;

    @media (max-width: 760px) { text-align: left; }

    .num {
      font-family: var(--font-heading);
      font-size: 2.4rem;
      font-weight: 800;
      color: var(--color-accent-300);
      line-height: 1;
      letter-spacing: -0.02em;
    }
    .lbl {
      font-size: 0.72rem;
      color: rgba(255, 255, 255, 0.55);
      text-transform: uppercase;
      letter-spacing: 1.4px;
      font-weight: 700;
      margin-top: 0.5rem;
    }
  }
`;

const Marquees = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  gap: 0.85rem;

  @media (max-width: 768px) {
    gap: 0.65rem;
  }
`;

const RowWrap = styled.div`
  position: relative;
  overflow: hidden;
`;

const Track = styled(motion.div)`
  display: flex;
  gap: 0.85rem;
  width: max-content;

  @media (max-width: 768px) {
    gap: 0.65rem;
  }
`;

const Tile = styled(motion.button)<{ $w: 'narrow' | 'normal' | 'wide' }>`
  position: relative;
  flex-shrink: 0;
  width: ${({ $w }) =>
    $w === 'wide' ? '420px' : $w === 'narrow' ? '240px' : '320px'};
  aspect-ratio: 4 / 3;
  border-radius: 18px;
  overflow: hidden;
  cursor: zoom-in;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0;
  isolation: isolate;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.35);
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.45s cubic-bezier(0.22, 1, 0.36, 1);

  @media (max-width: 768px) {
    width: ${({ $w }) =>
      $w === 'wide' ? '300px' : $w === 'narrow' ? '180px' : '230px'};
    border-radius: 14px;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 28px 60px rgba(0, 0, 0, 0.55);

    img { transform: scale(1.08); }
    .veil { opacity: 1; }
    .meta { transform: translateY(0); opacity: 1; }
    .ring { border-color: rgba(245, 183, 29, 0.55); }
    .hint { transform: scale(1); }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .veil {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 35%, rgba(6, 24, 48, 0.92) 100%);
    opacity: 0.45;
    transition: opacity 0.4s ease;
  }

  .ring {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border: 2px solid transparent;
    transition: border-color 0.4s ease;
    pointer-events: none;
  }

  .tag {
    position: absolute;
    top: 14px;
    left: 14px;
    padding: 0.32rem 0.7rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.92);
    color: var(--color-primary-900);
    font-size: 0.66rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    backdrop-filter: blur(6px);
  }

  .hint {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 38px;
    height: 38px;
    border-radius: 999px;
    background: var(--color-accent-400);
    color: var(--color-primary-950);
    display: grid;
    place-items: center;
    transform: scale(0);
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .meta {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 14px;
    transform: translateY(8px);
    opacity: 0;
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease;

    .bar {
      width: 36px;
      height: 2px;
      background: var(--color-accent-400);
      margin-bottom: 8px;
    }
    .cap {
      color: white;
      font-size: 0.92rem;
      font-weight: 600;
      line-height: 1.35;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    }
  }
`;

const Fade = styled.div<{ $side: 'left' | 'right' }>`
  position: absolute;
  inset-block: 0;
  ${({ $side }) => ($side === 'left' ? 'left: 0;' : 'right: 0;')}
  width: clamp(60px, 12vw, 180px);
  z-index: 5;
  pointer-events: none;
  background: ${({ $side }) =>
    $side === 'left'
      ? 'linear-gradient(90deg, var(--color-primary-950) 0%, transparent 100%)'
      : 'linear-gradient(-90deg, var(--color-primary-950) 0%, transparent 100%)'};
`;

// ---------- Lightbox ----------

const LightboxWrap = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  padding: clamp(0.75rem, 4vw, 3.5rem);
`;

const LightboxBackdrop = styled(motion.button)`
  position: absolute;
  inset: 0;
  background: rgba(6, 24, 48, 0.92);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: none;
  cursor: zoom-out;
`;

const LightboxStage = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  height: min(82vh, 800px);
  display: grid;
  place-items: center;
`;

const LightboxImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 14px;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.55);
`;

const Counter = styled.div`
  position: absolute;
  top: clamp(0.75rem, 3vw, 1.5rem);
  left: clamp(0.75rem, 3vw, 1.5rem);
  z-index: 4;
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  color: white;
  font-family: var(--font-heading);

  .now {
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--color-accent-300);
    letter-spacing: -0.02em;
  }
  .sep {
    color: rgba(255, 255, 255, 0.3);
  }
  .total {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 0.06em;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: clamp(0.75rem, 3vw, 1.5rem);
  right: clamp(0.75rem, 3vw, 1.5rem);
  z-index: 4;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: var(--color-accent-400);
  color: var(--color-primary-950);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: transform 0.25s ease, background 0.25s ease;

  &:hover {
    background: var(--color-accent-300);
    transform: scale(1.08);
  }
`;

const NavRow = styled.div`
  position: absolute;
  bottom: clamp(0.75rem, 3vw, 2rem);
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  display: flex;
  align-items: center;
  gap: 1rem;

  .cap {
    max-width: 36ch;
    text-align: center;
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.92rem;
    font-weight: 500;
    padding: 0 0.5rem;
  }

  button {
    width: 52px;
    height: 52px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.04);
    color: white;
    cursor: pointer;
    display: grid;
    place-items: center;
    backdrop-filter: blur(8px);
    transition: all 0.25s ease;

    &:hover {
      background: var(--color-accent-400);
      border-color: var(--color-accent-400);
      color: var(--color-primary-950);
      transform: translateY(-3px);
    }
  }
`;

// ---------- Helpers ----------

const splitIntoRows = <T,>(items: T[], rows: number): T[][] => {
  if (items.length === 0) return Array.from({ length: rows }, () => []);
  const out: T[][] = Array.from({ length: rows }, () => []);
  items.forEach((item, i) => {
    out[i % rows].push(item);
  });
  return out;
};

// ---------- Component ----------

export const Gallery = () => {
  const { data } = useGallery();
  const containerRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  const items = useMemo<GalleryItem[]>(() => data?.items ?? [], [data]);
  const eyebrow = data?.eyebrow ?? 'Visual Stories';
  const headline = data?.headline ?? 'Moments That Make Us';
  const accent = data?.accent ?? 'AYAA';
  const subtext =
    data?.subtext ??
    'A collective archive of reunions, classrooms, fundraisers, and the people behind every milestone — captured in motion.';

  const rows = useMemo(() => splitIntoRows(items, 3), [items]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const headerY = useTransform(scrollYProgress, [0, 0.4], [40, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.25, 0.85, 1], [0, 1, 1, 0.85]);

  const open = (item: GalleryItem) => {
    const idx = items.findIndex((it) => it.src === item.src);
    setActive(idx === -1 ? 0 : idx);
  };
  const close = () => setActive(null);
  const navigate = (dir: -1 | 1) => {
    if (active === null || items.length === 0) return;
    setActive((i) => {
      if (i === null) return 0;
      const len = items.length;
      return (i + dir + len) % len;
    });
  };

  useEffect(() => {
    if (active === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (items.length === 0) return null;

  return (
    <Wrap
      ref={containerRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Photo gallery"
    >
      <Backdrop />
      <Glow />

      <HeaderRow style={{ y: headerY, opacity: headerOpacity }}>
        <div className="lead">
          <span className="eyebrow"><Camera size={13} /> {eyebrow}</span>
          <h2>
            {headline} <span className="accent">{accent}</span>
          </h2>
          <p>{subtext}</p>
        </div>
        <div className="meta">
          <div className="num">{String(items.length).padStart(2, '0')}</div>
          <div className="lbl">Captured Moments</div>
        </div>
      </HeaderRow>

      <Marquees>
        {rows.map((rowItems, i) => (
          <MarqueeRow
            key={i}
            items={rowItems}
            direction={i % 2 === 0 ? 'left' : 'right'}
            speed={48 + i * 6}
            paused={paused}
            onOpen={open}
          />
        ))}
        <Fade $side="left" />
        <Fade $side="right" />
      </Marquees>

      <AnimatePresence>
        {active !== null && (
          <Lightbox
            item={items[active]}
            index={active}
            total={items.length}
            onClose={close}
            onPrev={() => navigate(-1)}
            onNext={() => navigate(1)}
          />
        )}
      </AnimatePresence>
    </Wrap>
  );
};

// ---------- Marquee row ----------

interface MarqueeRowProps {
  items: GalleryItem[];
  direction: 'left' | 'right';
  speed: number;
  paused: boolean;
  onOpen: (item: GalleryItem) => void;
}

const MarqueeRow = ({ items, direction, speed, paused, onOpen }: MarqueeRowProps) => {
  // Duplicate enough times to make the loop seamless on wide screens.
  const tiles = useMemo(() => [...items, ...items, ...items], [items]);
  if (items.length === 0) return null;

  return (
    <RowWrap>
      <Track
        animate={{
          x: direction === 'left' ? ['0%', '-33.333%'] : ['-33.333%', '0%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
        style={{ animationPlayState: paused ? 'paused' : 'running' }}
      >
        {tiles.map((item, i) => (
          <Tile
            key={`${item.src}-${i}`}
            $w={item.width ?? (i % 4 === 0 ? 'wide' : 'normal')}
            type="button"
            onClick={() => onOpen(item)}
            aria-label={`Open image: ${item.alt || 'gallery image'}`}
          >
            <img src={item.src} alt={item.alt} loading="lazy" draggable={false} />
            <span className="veil" />
            {item.tag && <span className="tag">{item.tag}</span>}
            <span className="hint" aria-hidden>
              <Maximize2 size={16} strokeWidth={2.4} />
            </span>
            <div className="meta">
              <div className="bar" />
              <div className="cap">{item.alt}</div>
            </div>
            <span className="ring" />
          </Tile>
        ))}
      </Track>
    </RowWrap>
  );
};

// ---------- Lightbox ----------

interface LightboxProps {
  item: GalleryItem;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const Lightbox = ({ item, index, total, onClose, onPrev, onNext }: LightboxProps) => {
  return (
    <LightboxWrap
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <LightboxBackdrop
        onClick={onClose}
        aria-label="Close gallery"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <Counter>
        <span className="now">{String(index + 1).padStart(2, '0')}</span>
        <span className="sep">/</span>
        <span className="total">{String(total).padStart(2, '0')}</span>
      </Counter>

      <CloseBtn type="button" onClick={onClose} aria-label="Close">
        <X size={18} strokeWidth={2.4} />
      </CloseBtn>

      <LightboxStage>
        <AnimatePresence mode="wait">
          <LightboxImage
            key={item.src}
            src={item.src}
            alt={item.alt}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>
      </LightboxStage>

      <NavRow>
        <button type="button" onClick={onPrev} aria-label="Previous">
          <ArrowLeft size={20} />
        </button>
        <div className="cap">{item.alt}</div>
        <button type="button" onClick={onNext} aria-label="Next">
          <ArrowRight size={20} />
        </button>
      </NavRow>
    </LightboxWrap>
  );
};

export default Gallery;
