import * as React from 'react';
import { Container, DividerEnhanced, FlexBox, FlexItem, styled, Text } from '@tidy-ui/all';
import Footer from './Footer';

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
      <Container maxWidth="md">
        <FlexBox fld="column" nowrap>
          <FlexItem fuw>{children}</FlexItem>
          <FlexItem fuw>
            <DividerEnhanced>
              <Text.Caption tone="neutral">No login needed. Free to use.</Text.Caption>
            </DividerEnhanced>
          </FlexItem>
          <FlexItem fuw>
            <Footer />
          </FlexItem>
        </FlexBox>
      </Container>
    </Layout>
  );
}
