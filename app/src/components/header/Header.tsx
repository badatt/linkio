import * as React from 'react';
import { Anchor, Divider, FlexBox, FlexItem, Note, Text } from '@tidy-ui/all';
import Link from 'next/link';

import ThemeSwitcher from './ThemeSwitcher';
import SignIn from './SignIn';
import Menu from './Menu';

export default function () {
  return (
    <>
      <FlexBox ali="center" jsc="space-between" margin="0.5rem 0 0 0">
        <FlexItem>
          <Text.H6>
            <Link href="/">Linkio</Link>
          </Text.H6>
        </FlexItem>
        <FlexItem>
          <FlexBox gap="1rem">
            <Menu />
            <SignIn />
            <ThemeSwitcher />
          </FlexBox>
        </FlexItem>
      </FlexBox>
      <Divider />
      <Note padding="0.25rem 0">
        <Text.Caption ctr>
          This site is currently under active development. If you encounter any issues or bugs, please{' '}
          <Anchor href="https://github.com/badatt/linkio/issues" canLaunch girth="xxs" tone="minor">
            report them on GitHub
          </Anchor>
          . Your feedback helps us improve!
        </Text.Caption>
      </Note>
    </>
  );
}
