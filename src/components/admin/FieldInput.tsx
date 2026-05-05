import styled from '@emotion/styled';
import type { Field } from '../../admin/schemas';
import { ImageUpload } from './ImageUpload';
import { getIcon } from '../../utils/iconMap';

interface Props {
  field: Field;
  value: unknown;
  onChange: (value: unknown) => void;
  imageFolder?: string;
}

const Wrap = styled.div`
  display: grid;
  gap: 0.4rem;

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-neutral-700);
  }
  .helper {
    font-size: 0.78rem;
    color: var(--color-neutral-500);
  }
  input[type="text"], input[type="number"], input[type="date"], textarea, select {
    width: 100%;
    padding: 0.65rem 0.8rem;
    border: 1px solid var(--color-neutral-300);
    border-radius: 10px;
    font-size: 0.93rem;
    font-family: inherit;
    &:focus {
      outline: none;
      border-color: var(--color-secondary-500);
      box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.18);
    }
  }
  textarea { min-height: 90px; resize: vertical; }

  .switch {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    cursor: pointer;
    user-select: none;

    .track {
      width: 40px; height: 22px;
      border-radius: 999px;
      background: var(--color-neutral-300);
      position: relative;
      transition: background 0.2s ease;
      .thumb {
        position: absolute;
        top: 2px; left: 2px;
        width: 18px; height: 18px;
        border-radius: 50%;
        background: white;
        transition: transform 0.2s ease;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      }
    }
    input:checked + .track {
      background: var(--color-secondary-500);
      .thumb { transform: translateX(18px); }
    }
    input { display: none; }
  }

  .icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 0.4rem;
    background: var(--color-neutral-50);
    padding: 0.6rem;
    border-radius: 10px;
    max-height: 220px;
    overflow-y: auto;

    button {
      background: white;
      border: 1px solid var(--color-neutral-200);
      border-radius: 8px;
      padding: 0.55rem;
      cursor: pointer;
      display: grid;
      place-items: center;
      color: var(--color-neutral-600);
      font-size: 0.65rem;
      gap: 0.2rem;
      &:hover { border-color: var(--color-secondary-400); color: var(--color-secondary-700); }
      &.active {
        background: var(--color-secondary-50);
        border-color: var(--color-secondary-500);
        color: var(--color-secondary-700);
      }
      .lbl { font-size: 0.6rem; line-height: 1; }
    }
  }
`;

export const FieldInput = ({ field, value, onChange, imageFolder }: Props) => {
  const helper = field.helper && <div className="helper">{field.helper}</div>;

  switch (field.type) {
    case 'text':
      return (
        <Wrap>
          <label>{field.label}{field.required && <span style={{ color: 'var(--color-error)' }}> *</span>}</label>
          <input
            type="text"
            value={(value as string) ?? ''}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
          {helper}
        </Wrap>
      );

    case 'textarea':
      return (
        <Wrap>
          <label>{field.label}{field.required && <span style={{ color: 'var(--color-error)' }}> *</span>}</label>
          <textarea
            value={(value as string) ?? ''}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
          {helper}
        </Wrap>
      );

    case 'number':
      return (
        <Wrap>
          <label>{field.label}{field.required && <span style={{ color: 'var(--color-error)' }}> *</span>}</label>
          <input
            type="number"
            value={(value as number) ?? 0}
            onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
            required={field.required}
          />
          {helper}
        </Wrap>
      );

    case 'date':
      return (
        <Wrap>
          <label>{field.label}{field.required && <span style={{ color: 'var(--color-error)' }}> *</span>}</label>
          <input
            type="date"
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
          {helper}
        </Wrap>
      );

    case 'select':
      return (
        <Wrap>
          <label>{field.label}{field.required && <span style={{ color: 'var(--color-error)' }}> *</span>}</label>
          <select
            value={(value as string) ?? field.options?.[0] ?? ''}
            onChange={(e) => onChange(e.target.value)}
          >
            {(field.options ?? []).map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          {helper}
        </Wrap>
      );

    case 'switch': {
      const checked = Boolean(value);
      return (
        <Wrap>
          <label className="switch">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
            />
            <span className="track"><span className="thumb" /></span>
            <span>{field.label}</span>
          </label>
          {helper}
        </Wrap>
      );
    }

    case 'list': {
      const items = (value as string[]) ?? [];
      return (
        <Wrap>
          <label>{field.label}</label>
          <textarea
            value={items.join('\n')}
            onChange={(e) =>
              onChange(
                e.target.value
                  .split('\n')
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
            placeholder="One per line"
          />
          {helper}
        </Wrap>
      );
    }

    case 'image':
      return (
        <Wrap>
          <label>{field.label}</label>
          <ImageUpload
            value={value as string | undefined}
            onChange={(v) => onChange(v ?? '')}
            folder={imageFolder ?? 'site'}
          />
          {helper}
        </Wrap>
      );

    case 'icon': {
      const current = (value as string) ?? 'Sparkles';
      return (
        <Wrap>
          <label>{field.label}</label>
          <div className="icon-grid">
            {(field.options ?? []).map((name) => {
              const Icon = getIcon(name);
              const active = name === current;
              return (
                <button
                  key={name}
                  type="button"
                  className={active ? 'active' : ''}
                  title={name}
                  onClick={() => onChange(name)}
                >
                  <Icon size={16} />
                  <span className="lbl">{name}</span>
                </button>
              );
            })}
          </div>
          {helper}
        </Wrap>
      );
    }

    default:
      return null;
  }
};
