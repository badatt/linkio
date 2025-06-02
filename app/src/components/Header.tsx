import * as React from 'react';
import {
  Anchor,
  Button,
  Divider,
  FlexBox,
  FlexItem,
  Note,
  Stack,
  Text,
  useTheme,
  orchidDark,
  orchidLight,
} from '@tidy-ui/all';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-regular-svg-icons';
import Link from 'next/link';

import SignIn from './SignIn';

export default function () {
  const { changeTheme, theme } = useTheme();

  React.useEffect(() => {
    changeTheme(localStorage.getItem('theme-is-dark') == 'true' ? orchidDark : orchidLight);
  }, [changeTheme]);

  React.useEffect(() => {
    localStorage.setItem('theme-is-dark', `${theme.isDark}`);
  }, [theme]);

  return (
    <>
      <FlexBox jsc="space-between" margin="0.5rem 0 0 0">
        <FlexItem>
          <Text.H6>
            <Link href="/">Linkio</Link>
          </Text.H6>
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
