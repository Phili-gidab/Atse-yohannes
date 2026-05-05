import { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Search, Download, ExternalLink, FileText, Link as LinkIcon, FileSpreadsheet, Lock } from 'lucide-react';
import { PageHero } from '../components/sections/PageHero';
import { useResources } from '../hooks/useContent';
import { useAuth } from '../hooks/useAuth';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface FlatResource { category: string; title: string; type: string; url?: string; visibility?: 'public' | 'members' }
interface ResourceCategory { category: string; items: { title: string; type: string; url?: string; visibility?: 'public' | 'members' }[] }

const groupResources = (items: FlatResource[]): ResourceCategory[] => {
  const map = new Map<string, { title: string; type: string; url?: string; visibility?: 'public' | 'members' }[]>();
  items.forEach((r) => {
    const list = map.get(r.category) ?? [];
    list.push({ title: r.title, type: r.type, url: r.url, visibility: r.visibility });
    map.set(r.category, list);
  });
  return Array.from(map.entries()).map(([category, items]) => ({ category, items }));
};

const Section = styled.section`
  padding: 5rem 0;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid var(--color-neutral-200);
  border-radius: 14px;
  padding: 0.75rem 1.25rem;
  max-width: 600px;
  margin: 0 auto 3rem;
  box-shadow: var(--shadow-sm);

  input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 0.95rem;
    background: transparent;
  }
  svg { color: var(--color-neutral-400); }
`;

const Categories = styled.div`
  display: grid;
  gap: 2.5rem;
`;

const Category = styled.div`
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
  }
  h2 {
    font-size: 1.5rem;
    color: var(--color-primary-900);
  }
  .count {
    color: var(--color-neutral-500);
    font-size: 0.85rem;
    font-weight: 500;
  }
`;

const Items = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const Item = styled.a`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1.1rem 1.25rem;
  background: white;
  border: 1px solid var(--color-neutral-200);
  border-radius: 14px;
  text-decoration: none;
  transition: all 0.25s ease;
  cursor: pointer;

  .icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    background: var(--color-secondary-50);
    color: var(--color-secondary-700);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .title {
    color: var(--color-primary-900);
    font-weight: 600;
    font-size: 0.92rem;
    flex: 1;
  }
  .type {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--color-neutral-500);
    font-weight: 700;
  }

  &:hover {
    border-color: var(--color-secondary-400);
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);

    .icon { background: var(--color-secondary-500); color: white; }
  }
`;

const typeIcon = (t: string) => {
  if (t === 'Link') return <LinkIcon size={18} />;
  if (t === 'Form') return <FileSpreadsheet size={18} />;
  return <FileText size={18} />;
};

const typeAction = (t: string) => (t === 'Link' ? <ExternalLink size={14} /> : <Download size={14} />);

export const Resources = () => {
  useDocumentTitle('Student Resources', 'Books, scholarships, and educational links curated for Atse Yohannes School students.');
  const [query, setQuery] = useState('');
  const { data: items = [] } = useResources();
  const { user } = useAuth();
  const isMember = user?.role === 'member' || user?.role === 'admin' || user?.role === 'super_admin';
  const RESOURCES = useMemo(() => groupResources(items as FlatResource[]), [items]);

  return (
    <>
      <PageHero
        eyebrow="Student Resources"
        title="Learning Materials, Scholarships & Tools"
        subtitle="A growing hub of resources to help students at Atse Yohannes School succeed in their studies and beyond."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Resources' }]}
      />
      <Section>
        <Container>
          <SearchBar>
            <Search size={18} />
            <input
              type="search"
              placeholder="Search books, guides, scholarships…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </SearchBar>

          <Categories>
            {RESOURCES.map((cat) => {
              const filtered = cat.items.filter((i) =>
                i.title.toLowerCase().includes(query.toLowerCase()),
              );
              if (!filtered.length) return null;
              return (
                <Category key={cat.category}>
                  <div className="head">
                    <h2>{cat.category}</h2>
                    <span className="count">{filtered.length} items</span>
                  </div>
                  <Items>
                    {filtered.map((i) => {
                      const gated = i.visibility === 'members' && !isMember;
                      if (gated) {
                        return (
                          <Link
                            key={i.title}
                            to="/portal/login"
                            style={{ textDecoration: 'none', opacity: 0.7 }}
                          >
                            <Item as="div">
                              <span className="icon"><Lock size={18} /></span>
                              <span className="title">{i.title}</span>
                              <span className="type">Members only · Sign in</span>
                            </Item>
                          </Link>
                        );
                      }
                      return (
                        <Item
                          key={i.title}
                          href={i.url || '#'}
                          target={i.url ? '_blank' : undefined}
                          rel="noreferrer"
                        >
                          <span className="icon">{typeIcon(i.type)}</span>
                          <span className="title">{i.title}</span>
                          <span className="type">{typeAction(i.type)}</span>
                        </Item>
                      );
                    })}
                  </Items>
                </Category>
              );
            })}
          </Categories>
        </Container>
      </Section>
    </>
  );
};
