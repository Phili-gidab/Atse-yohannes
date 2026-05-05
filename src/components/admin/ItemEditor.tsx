import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '../../config/firebase';
import { schemas } from '../../admin/schemas';
import { FieldInput } from './FieldInput';

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;

  .back {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--color-neutral-600);
    text-decoration: none;
    font-size: 0.88rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    &:hover { color: var(--color-secondary-700); }
  }
  h1 { color: var(--color-primary-900); margin-bottom: 0.25rem; font-size: 1.55rem; }
  p { color: var(--color-neutral-600); font-size: 0.92rem; }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;

  button {
    border: none;
    padding: 0.7rem 1.1rem;
    border-radius: 10px;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }
  .save {
    background: linear-gradient(135deg, var(--color-secondary-500), var(--color-secondary-700));
    color: white;
    &:hover:not(:disabled) { transform: translateY(-2px); }
  }
  .del {
    background: white;
    color: var(--color-error);
    border: 1px solid var(--color-neutral-200);
    &:hover { background: #fef2f2; border-color: #fca5a5; }
  }
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid var(--color-neutral-200);
  display: grid;
  gap: 1.25rem;
  max-width: 760px;
`;

const Status = styled.div<{ $kind: 'ok' | 'err' }>`
  margin-top: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
  color: ${({ $kind }) => ($kind === 'ok' ? 'var(--color-success)' : 'var(--color-error)')};
`;

interface Props {
  collectionKey: string;
}

export const ItemEditor = ({ collectionKey }: Props) => {
  const schema = schemas[collectionKey];
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const isNew = !id || id === 'new';
  const [data, setData] = useState<Record<string, unknown>>(schema.defaults);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (isNew || !db || !id) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db!, schema.collection, id));
        if (snap.exists()) {
          setData({ ...schema.defaults, ...snap.data() });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew, schema.collection, schema.defaults]);

  const setField = (key: string, value: unknown) =>
    setData((d) => ({ ...d, [key]: value }));

  const computeId = (): string => {
    if (!isNew && id) return id;
    if (schema.idStrategy === 'fromField' && schema.idField) {
      const v = data[schema.idField];
      if (typeof v === 'string' && v.trim()) return slugify(v);
      return crypto.randomUUID().slice(0, 8);
    }
    if (schema.idStrategy === 'slugFromTitle' && schema.idField) {
      const v = data[schema.idField];
      if (typeof v === 'string' && v.trim()) return slugify(v);
    }
    return crypto.randomUUID().slice(0, 8);
  };

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setSaving(true);
    setSaved(false);
    setErr(null);
    try {
      const docId = computeId();
      await setDoc(
        doc(db, schema.collection, docId),
        { ...data, updatedAt: serverTimestamp() },
        { merge: !isNew }
      );
      await qc.invalidateQueries({ queryKey: [schema.collection] });
      // Also invalidate well-known query keys mapped 1:1 in useContent
      await qc.invalidateQueries();
      setSaved(true);
      if (isNew) navigate(`/admin/${collectionKey}/${docId}`, { replace: true });
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!db || isNew || !id) return;
    if (!confirm(`Delete this ${schema.singular.toLowerCase()}? This can't be undone.`)) return;
    setSaving(true);
    try {
      await deleteDoc(doc(db, schema.collection, id));
      await qc.invalidateQueries({ queryKey: [schema.collection] });
      await qc.invalidateQueries();
      navigate(`/admin/${collectionKey}`);
    } catch (e) {
      setErr((e as Error).message);
      setSaving(false);
    }
  };

  return (
    <>
      <Link className="back" to={`/admin/${collectionKey}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-neutral-600)', textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.75rem' }}>
        <ArrowLeft size={14} /> Back to {schema.title}
      </Link>
      <Header>
        <div>
          <h1>{isNew ? `New ${schema.singular}` : `Edit ${schema.singular}`}</h1>
          <p>Collection: <code>{schema.collection}</code></p>
        </div>
        <Actions>
          {!isNew && (
            <button type="button" className="del" onClick={handleDelete} disabled={saving}>
              <Trash2 size={15} /> Delete
            </button>
          )}
          <button type="submit" className="save" form="item-form" disabled={saving || loading}>
            <Save size={15} /> {saving ? 'Saving…' : 'Save'}
          </button>
        </Actions>
      </Header>

      <Form id="item-form" onSubmit={handle}>
        {loading && <p>Loading…</p>}
        {!loading &&
          schema.fields.map((f) => (
            <FieldInput
              key={f.key}
              field={f}
              value={data[f.key]}
              onChange={(v) => setField(f.key, v)}
              imageFolder={schema.imageFolder}
            />
          ))}
        {saved && (
          <Status $kind="ok">
            <CheckCircle2 size={16} /> Saved
          </Status>
        )}
        {err && (
          <Status $kind="err">
            <AlertCircle size={16} /> {err}
          </Status>
        )}
      </Form>
    </>
  );
};
