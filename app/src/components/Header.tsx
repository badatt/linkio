import * as React from 'react';
import { Anchor, Button, Divider, FlexBox, FlexItem, Note, Stack, Text, orchidDark, orchidLight } from '@tidy-ui/all';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-regular-svg-icons';
import Link from 'next/link';

import { useTheme, useCurrentUser } from '@/hooks';

import SignIn from './SignIn';

export default function () {
  const { data } = useCurrentUser();
  const { theme, changeTheme } = useTheme();

  return (
    <>
      <FlexBox ali="center" jsc="space-between" margin="0.5rem 0 0 0">
        <FlexItem>
          <Text.H6>
            <Link href="/">Linkio</Link>
          </Text.H6>
        </FlexItem>
        <FlexItem>
          <Text.Body1>{data ? `Welcome, ${data.name}` : 'Welcome, Guest!'}</Text.Body1>
        </FlexItem>
        <FlexItem>
          <Stack align="center" gap="1rem">
            <SignIn />
            <Button
              onClick={() => {
                changeTheme(theme.isDark ? orchidLight : orchidDark);
              }}
              tone="major"
              icon={theme.isDark ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />}
            />
          </Stack>
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
