import * as React from 'react';
import { Container, styled } from '@tidy-ui/all';

const Layout = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  bottom: 0;
  overflow: auto;
`;

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <Container maxWidth="md">{children}</Container>
    </Layout>
  );
}
