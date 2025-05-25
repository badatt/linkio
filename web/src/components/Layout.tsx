import * as React from 'react';
import { Anchor, Container, DividerEnhanced, FlexBox, FlexItem, styled, Text, Note } from '@tidy-ui/all';
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
        <Note padding="0.25rem 0">
          <Text.Caption ctr>
            This site is currently under active development. If you encounter any issues or bugs, please{' '}
            <Anchor href="https://github.com/badatt/linkio/issues" canLaunch girth="xxs" tone="minor">
              report them on GitHub
            </Anchor>
            . Your feedback helps us improve!
          </Text.Caption>
        </Note>

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
