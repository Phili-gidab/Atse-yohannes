import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useQueryClient } from '@tanstack/react-query';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Images,
} from 'lucide-react';
import { db } from '../../config/firebase';
import { GALLERY, type GalleryDoc } from '../../data/content';
import { ImageUpload } from '../../components/admin/ImageUpload';

const Header = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;

  h1 {
    color: var(--color-primary-900);
    font-size: 1.65rem;
    margin-bottom: 0.25rem;
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
  }
  p { color: var(--color-neutral-600); }

  .count {
    background: var(--color-primary-50);
    color: var(--color-primary-700);
    border: 1px solid var(--color-primary-100);
    padding: 0.5rem 0.85rem;
    border-radius: 12px;
    font-weight: 700;
    font-size: 0.85rem;
    display: inline-flex;
    gap: 0.4rem;
    align-items: center;

    .num { color: var(--color-secondary-700); font-size: 1.1rem; }
  }
`;

const Card = styled.section`
  background: white;
  padding: 1.75rem;
  border-radius: 16px;
  border: 1px solid var(--color-neutral-200);
  margin-bottom: 1.5rem;

  h2 {
    color: var(--color-primary-900);
    font-size: 1.05rem;
    margin-bottom: 1rem;
  }

  .grid {
    display: grid;
    gap: 1rem;
  }

  .pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    @media (max-width: 600px) { grid-template-columns: 1fr; }
  }

  label {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--color-neutral-700);
    display: block;
    margin-bottom: 0.3rem;
  }
  input, textarea, select {
    width: 100%;
    padding: 0.6rem 0.8rem;
    border: 1px solid var(--color-neutral-300);
    border-radius: 10px;
    font-size: 0.92rem;
    font-family: inherit;
    background: white;
    &:focus {
      outline: none;
      border-color: var(--color-secondary-500);
      box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.18);
    }
  }
  textarea { min-height: 84px; resize: vertical; }
`;

const ItemsHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  h2 { margin-bottom: 0; }

  button.add {
    background: linear-gradient(135deg, var(--color-secondary-500), var(--color-secondary-700));
    color: white;
    border: none;
    padding: 0.6rem 1rem;
    border-radius: 10px;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    transition: transform 0.2s ease;
    &:hover { transform: translateY(-2px); }
  }
`;

const ItemList = styled.div`
  display: grid;
  gap: 1rem;
`;

const ItemRow = styled.article`
  position: relative;
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 0.85rem;
  background: var(--color-neutral-50);
  border: 1px solid var(--color-neutral-200);
  border-radius: 14px;
  padding: 1rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }

  .grip {
    color: var(--color-neutral-400);
    display: grid;
    place-items: center;
    align-self: start;
    padding-top: 0.6rem;

    @media (max-width: 720px) { display: none; }
  }

  .body {
    display: grid;
    gap: 0.85rem;
    grid-template-columns: 280px 1fr;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  .image-side { display: grid; gap: 0.5rem; }

  .image-side .index-pill {
    background: white;
    border: 1px solid var(--color-neutral-200);
    color: var(--color-primary-700);
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    padding: 0.25rem 0.55rem;
    border-radius: 999px;
    text-transform: uppercase;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    width: fit-content;
  }

  .fields { display: grid; gap: 0.7rem; }

  .row-actions {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
    margin-top: 0.25rem;

    button {
      background: white;
      border: 1px solid var(--color-neutral-300);
      color: var(--color-neutral-700);
      padding: 0.45rem 0.7rem;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      transition: all 0.18s ease;

      &:hover:not(:disabled) {
        border-color: var(--color-secondary-400);
        color: var(--color-secondary-700);
      }
      &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      &.danger:hover {
        border-color: var(--color-error);
        color: var(--color-error);
      }
    }
  }
`;

const Empty = styled.div`
  text-align: center;
  padding: 2.5rem 1rem;
  border: 2px dashed var(--color-neutral-200);
  border-radius: 14px;
  color: var(--color-neutral-500);
  background: var(--color-neutral-50);
`;

const Bar = styled.div`
  position: sticky;
  bottom: 0;
  background: white;
  padding: 1rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid var(--color-neutral-200);
  margin-top: 1rem;

  button.save {
    background: linear-gradient(135deg, var(--color-secondary-500), var(--color-secondary-700));
    color: white;
    border: none;
    padding: 0.75rem 1.2rem;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    &:disabled { opacity: 0.6; cursor: not-allowed; }
    &:hover:not(:disabled) { transform: translateY(-2px); }
  }
  .ok {
    color: var(--color-success);
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 600;
  }
  .err {
    color: var(--color-error);
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 600;
  }
`;

const widthOptions: GalleryDoc['items'][number]['width'][] = ['narrow', 'normal', 'wide'];

const newItem = (): GalleryDoc['items'][number] => ({
  src: '',
  alt: '',
  tag: '',
  width: 'normal',
});

export const GalleryEditor = () => {
  const qc = useQueryClient();
  const [data, setData] = useState<GalleryDoc>(GALLERY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const snap = await getDoc(doc(db!, 'content/gallery'));
        if (snap.exists()) {
          const d = snap.data() as Partial<GalleryDoc>;
          setData((cur) => ({ ...cur, ...d, items: d.items?.length ? d.items : cur.items }));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateField = <K extends keyof GalleryDoc>(key: K, value: GalleryDoc[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const updateItem = (
    index: number,
    patch: Partial<GalleryDoc['items'][number]>
  ) =>
    setData((d) => {
      const items = [...d.items];
      items[index] = { ...items[index], ...patch };
      return { ...d, items };
    });

  const addItem = () =>
    setData((d) => ({ ...d, items: [...d.items, newItem()] }));

  const removeItem = (index: number) =>
    setData((d) => ({ ...d, items: d.items.filter((_, i) => i !== index) }));

  const moveItem = (index: number, dir: -1 | 1) =>
    setData((d) => {
      const next = index + dir;
      if (next < 0 || next >= d.items.length) return d;
      const items = [...d.items];
      const [m] = items.splice(index, 1);
      items.splice(next, 0, m);
      return { ...d, items };
    });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setSaving(true);
    setSaved(false);
    setErr(null);
    try {
      // Drop entries that have no image at all so we don't ship broken tiles.
      const clean = {
        ...data,
        items: data.items
          .filter((i) => i.src.trim().length > 0)
          .map((i) => ({
            src: i.src.trim(),
            alt: (i.alt ?? '').trim(),
            tag: (i.tag ?? '').trim(),
            width: i.width ?? 'normal',
          })),
      };
      await setDoc(
        doc(db, 'content/gallery'),
        { ...clean, updatedAt: serverTimestamp() },
        { merge: true }
      );
      await qc.invalidateQueries({ queryKey: ['gallery'] });
      setSaved(true);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header>
        <div>
          <h1>
            <Images size={22} /> Gallery
          </h1>
          <p>
            Manage the homepage gallery. Reorder, replace, or upload new photos —
            changes save to the live site after pressing <strong>Save</strong>.
          </p>
        </div>
        <div className="count">
          <span className="num">{data.items.length}</span>
          <span>photos</span>
        </div>
      </Header>

      {loading && <p>Loading…</p>}

      {!loading && (
        <form onSubmit={handleSave}>
          <Card>
            <h2>Section header</h2>
            <div className="grid">
              <div className="pair">
                <div>
                  <label>Eyebrow</label>
                  <input
                    type="text"
                    value={data.eyebrow}
                    onChange={(e) => updateField('eyebrow', e.target.value)}
                    placeholder="Visual Stories"
                  />
                </div>
                <div>
                  <label>Accent (highlighted word)</label>
                  <input
                    type="text"
                    value={data.accent}
                    onChange={(e) => updateField('accent', e.target.value)}
                    placeholder="AYAA"
                  />
                </div>
              </div>
              <div>
                <label>Headline</label>
                <input
                  type="text"
                  value={data.headline}
                  onChange={(e) => updateField('headline', e.target.value)}
                  placeholder="Moments That Make"
                />
              </div>
              <div>
                <label>Subtext</label>
                <textarea
                  value={data.subtext}
                  onChange={(e) => updateField('subtext', e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card>
            <ItemsHead>
              <h2>Photos ({data.items.length})</h2>
              <button type="button" className="add" onClick={addItem}>
                <Plus size={16} /> Add photo
              </button>
            </ItemsHead>

            {data.items.length === 0 ? (
              <Empty>
                No photos yet. Click <strong>Add photo</strong> to upload your
                first one.
              </Empty>
            ) : (
              <ItemList>
                {data.items.map((item, index) => (
                  <ItemRow key={index}>
                    <div className="grip">
                      <GripVertical size={18} />
                    </div>
                    <div className="body">
                      <div className="image-side">
                        <span className="index-pill">
                          <Images size={12} /> #{String(index + 1).padStart(2, '0')}
                        </span>
                        <ImageUpload
                          value={item.src || undefined}
                          onChange={(url) => updateItem(index, { src: url ?? '' })}
                          folder="site/gallery"
                          hint="or paste an image URL"
                        />
                      </div>

                      <div className="fields">
                        <div>
                          <label>Caption / alt text</label>
                          <input
                            type="text"
                            value={item.alt}
                            onChange={(e) =>
                              updateItem(index, { alt: e.target.value })
                            }
                            placeholder="Describe what's happening in the photo"
                          />
                        </div>

                        <div className="pair">
                          <div>
                            <label>Tag (small pill)</label>
                            <input
                              type="text"
                              value={item.tag ?? ''}
                              onChange={(e) =>
                                updateItem(index, { tag: e.target.value })
                              }
                              placeholder="Reunion, Project, Fundraiser…"
                            />
                          </div>
                          <div>
                            <label>Width</label>
                            <select
                              value={item.width ?? 'normal'}
                              onChange={(e) =>
                                updateItem(index, {
                                  width: e.target.value as 'narrow' | 'normal' | 'wide',
                                })
                              }
                            >
                              {widthOptions.map((w) => (
                                <option key={w} value={w}>
                                  {w}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="row-actions">
                          <button
                            type="button"
                            onClick={() => moveItem(index, -1)}
                            disabled={index === 0}
                            title="Move up"
                          >
                            <ArrowUp size={14} /> Up
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem(index, 1)}
                            disabled={index === data.items.length - 1}
                            title="Move down"
                          >
                            <ArrowDown size={14} /> Down
                          </button>
                          <button
                            type="button"
                            className="danger"
                            onClick={() => removeItem(index)}
                            title="Remove"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </ItemRow>
                ))}
              </ItemList>
            )}
          </Card>

          <Bar>
            <button type="submit" className="save" disabled={saving}>
              <Save size={15} /> {saving ? 'Saving…' : 'Save gallery'}
            </button>
            {saved && (
              <span className="ok">
                <CheckCircle2 size={16} /> Saved
              </span>
            )}
            {err && (
              <span className="err">
                <AlertCircle size={16} /> {err}
              </span>
            )}
          </Bar>
        </form>
      )}
    </>
  );
};
