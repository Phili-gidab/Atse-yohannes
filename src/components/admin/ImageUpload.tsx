import { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploader } from '../../services/upload.service';

interface Props {
  value?: string;
  onChange: (url: string | undefined) => void;
  /** Storage folder, e.g. "projects/lmc". Will not be used if user pastes a URL. */
  folder: string;
  /** Optional placeholder text. */
  hint?: string;
}

const Wrap = styled.div`
  display: grid;
  gap: 0.6rem;

  .preview {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 12px;
    overflow: hidden;
    background: var(--color-neutral-100);
    border: 1px dashed var(--color-neutral-300);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-neutral-400);
  }
  .preview img {
    width: 100%; height: 100%; object-fit: cover;
  }
  .preview .remove {
    position: absolute;
    top: 8px; right: 8px;
    background: rgba(0,0,0,0.65);
    color: white;
    border: none;
    width: 32px; height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: grid; place-items: center;
  }

  .row {
    display: flex; gap: 0.5rem;
    button {
      background: white;
      border: 1px solid var(--color-neutral-300);
      padding: 0.55rem 0.85rem;
      border-radius: 10px;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      display: inline-flex; align-items: center; gap: 0.4rem;
      &:hover { border-color: var(--color-secondary-400); color: var(--color-secondary-700); }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }
    input[type="text"] {
      flex: 1;
      padding: 0.55rem 0.75rem;
      border: 1px solid var(--color-neutral-300);
      border-radius: 10px;
      font-size: 0.88rem;
    }
  }

  .progress {
    height: 6px;
    background: var(--color-neutral-200);
    border-radius: 3px;
    overflow: hidden;
    .fill { height: 100%; background: var(--color-secondary-500); transition: width 0.2s ease; }
  }

  .err {
    background: #fee2e2; color: #991b1b;
    padding: 0.5rem 0.75rem; border-radius: 8px;
    font-size: 0.82rem;
  }
`;

export const ImageUpload = ({ value, onChange, folder, hint }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);
  const [err, setErr] = useState<string | null>(null);

  const onFile = async (file: File) => {
    setBusy(true);
    setErr(null);
    setPct(0);
    try {
      const r = await uploader.upload(file, {
        folder,
        onProgress: setPct,
      });
      onChange(r.url);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Wrap>
      <div className="preview">
        {value ? (
          <>
            <img src={value} alt="" />
            <button type="button" className="remove" onClick={() => onChange(undefined)}>
              <X size={14} />
            </button>
          </>
        ) : (
          <ImageIcon size={28} />
        )}
      </div>

      {busy && (
        <div className="progress"><div className="fill" style={{ width: `${pct}%` }} /></div>
      )}

      <div className="row">
        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? <Loader2 size={14} className="spin" /> : <Upload size={14} />}
          {busy ? `Uploading ${pct}%` : 'Upload'}
        </button>
        <input
          type="text"
          placeholder={hint ?? 'or paste an image URL'}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || undefined)}
        />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onFile(f);
          e.target.value = '';
        }}
      />

      {err && <div className="err">{err}</div>}
    </Wrap>
  );
};
