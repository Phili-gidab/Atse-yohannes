import styled from '@emotion/styled';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  $variant?: Variant;
  $size?: Size;
  $fullWidth?: boolean;
}

const sizeStyles = (size: Size = 'md') => {
  const map = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.8125rem' },
    md: { padding: '0.75rem 1.5rem', fontSize: '0.9rem' },
    lg: { padding: '1rem 2rem', fontSize: '1rem' },
  };
  return map[size];
};

const variantStyles = (variant: Variant = 'primary') => {
  switch (variant) {
    case 'primary':
      return `
        background: var(--color-primary-900);
        color: white;
        &:hover { background: var(--color-primary-800); transform: translateY(-2px); box-shadow: 0 12px 24px rgba(30, 58, 138, 0.25); }
      `;
    case 'secondary':
      return `
        background: var(--color-secondary-600);
        color: white;
        &:hover { background: var(--color-secondary-700); transform: translateY(-2px); box-shadow: 0 12px 24px rgba(13,148,136,0.3); }
      `;
    case 'gold':
      return `
        background: linear-gradient(135deg, var(--color-accent-400) 0%, var(--color-accent-500) 50%, var(--color-accent-600) 100%);
        color: var(--color-primary-900);
        box-shadow: 0 6px 20px rgba(212,160,18,0.35), inset 0 1px 0 rgba(255,255,255,0.2);
        &:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(212,160,18,0.45); }
      `;
    case 'outline':
      return `
        background: transparent;
        color: var(--color-primary-900);
        border: 2px solid var(--color-primary-900);
        &:hover { background: var(--color-primary-900); color: white; }
      `;
    case 'ghost':
      return `
        background: transparent;
        color: inherit;
        &:hover { background: rgba(0,0,0,0.05); }
      `;
  }
};

const StyledButton = styled.button<BaseProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-heading);
  font-weight: 600;
  letter-spacing: 0.3px;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.25s ease;
  text-decoration: none;
  white-space: nowrap;
  min-width: 0;
  max-width: 100%;
  ${({ $size }) => {
    const s = sizeStyles($size);
    return `padding: ${s.padding}; font-size: ${s.fontSize};`;
  }}
  ${({ $variant }) => variantStyles($variant)}
  ${({ $fullWidth }) => ($fullWidth ? 'width: 100%;' : '')}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const StyledLink = StyledButton.withComponent(Link);
const StyledA = StyledButton.withComponent('a');

interface ButtonProps extends BaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  to?: string;
  href?: string;
  external?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth,
  to,
  href,
  external,
  ...rest
}: ButtonProps) => {
  if (to) {
    return (
      <StyledLink to={to} $variant={variant} $size={size} $fullWidth={fullWidth}>
        {children}
      </StyledLink>
    );
  }
  if (href) {
    return (
      <StyledA
        href={href}
        $variant={variant}
        $size={size}
        $fullWidth={fullWidth}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
      >
        {children}
      </StyledA>
    );
  }
  return (
    <StyledButton $variant={variant} $size={size} $fullWidth={fullWidth} {...rest}>
      {children}
    </StyledButton>
  );
};
