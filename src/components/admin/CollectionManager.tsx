import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Plus, Pencil, Image as ImageIcon } from 'lucide-react';
import { db } from '../../config/firebase';
import { schemas } from '../../admin/schemas';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;

  h1 { color: var(--color-primary-900); margin-bottom: 0.25rem; font-size: 1.65rem; }
  p { color: var(--color-neutral-600); font-size: 0.92rem; }

  a.add {
    background: linear-gradient(135deg, var(--color-secondary-500), var(--color-secondary-700));
    color: white;
    text-decoration: none;
    padding: 0.7rem 1.1rem;
    border-radius: 10px;
    font-weight: 700;
    font-size: 0.9rem;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    &:hover { transform: translateY(-2px); }
  }
`;

const Empty = styled.div`
  background: white;
  border: 1px dashed var(--color-neutral-300);
  border-radius: 14px;
  padding: 2rem;
  text-align: center;
  color: var(--color-neutral-500);
`;

const List = styled.div`
  background: white;
  border: 1px solid var(--color-neutral-200);
  border-radius: 14px;
  overflow: hidden;
`;

const Row = styled(Link)`
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-neutral-100);
  text-decoration: none;
  color: inherit;
  transition: background 0.15s ease;

  &:last-of-type { border-bottom: none; }
  &:hover { background: var(--color-neutral-50); }

  .thumb {
    width: 64px; height: 48px;
    border-radius: 8px;
    overflow: hidden;
    background: var(--color-neutral-100);
    display: grid; place-items: center;
    color: var(--color-neutral-400);
    img { width: 100%; height: 100%; object-fit: cover; }
  }
  .body {
    min-width: 0;
    .title {
      color: var(--color-primary-900);
      font-weight: 700;
      margin-bottom: 0.15rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .sub {
      color: var(--color-neutral-500);
      font-size: 0.85rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .edit {
    color: var(--color-secondary-700);
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.85rem;
    font-weight: 600;
  }
`;

interface Props {
  collectionKey: string;
}

export const CollectionManager = ({ collectionKey }: Props) => {
  const schema = schemas[collectionKey];
  const [items, setItems] = useState<Array<Record<string, unknown> & { id: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    (async () => {
      try {
        const ref = collection(db!, schema.collection);
        const q = schema.orderField ? query(ref, orderBy(schema.orderField)) : ref;
        const snap = await getDocs(q);
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } finally {
        setLoading(false);
      }
    })();
  }, [schema.collection, schema.orderField]);

  return (
    <>
      <Header>
        <div>
          <h1>{schema.title}</h1>
          <p>{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>
        <Link className="add" to={`/admin/${collectionKey}/new`}>
          <Plus size={15} /> New {schema.singular}
        </Link>
      </Header>

      {loading && <p>Loading…</p>}
      {!loading && items.length === 0 && (
        <Empty>
          No {schema.title.toLowerCase()} yet. Click <strong>New {schema.singular}</strong> to add one,
          or seed from the dashboard.
        </Empty>
      )}
      {!loading && items.length > 0 && (
        <List>
          {items.map((item) => {
            const img = schema.rowImage?.(item);
            return (
              <Row key={item.id} to={`/admin/${collectionKey}/${item.id}`}>
                <div className="thumb">
                  {img ? <img src={img} alt="" /> : <ImageIcon size={20} />}
                </div>
                <div className="body">
                  <div className="title">{schema.rowTitle(item)}</div>
                  {schema.rowSubtitle && <div className="sub">{schema.rowSubtitle(item)}</div>}
                </div>
                <span className="edit"><Pencil size={14} /> Edit</span>
              </Row>
            );
          })}
        </List>
      )}
    </>
  );
};
