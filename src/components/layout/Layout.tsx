import type { ReactNode } from 'react';
import styled from '@emotion/styled';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Main = styled.main`
  flex: 1;
  width: 100%;
  max-width: 100vw;
  overflow-x: clip;
`;

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </>
  );
};
