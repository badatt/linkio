import { FlexBox, FlexItem, Stack, Text, useTheme, orchidDark, orchidLight, Anchor } from '@tidy-ui/all';
import * as React from 'react';

export default function () {
  const { changeTheme, theme } = useTheme();
  return (
    <FlexBox fld="column" nowrap>
      <FlexItem>
        <FlexBox padding="0 2rem" jsc="space-around">
          <FlexItem ele={<Stack order="column" />}>
            <Text.Caption bld tone="minor">
              Quick links
            </Text.Caption>
            <Text.Caption>Home</Text.Caption>
            <Text.Caption>About</Text.Caption>
            <Text.Caption>Contact</Text.Caption>
            <Text.Caption>Privacy Policy</Text.Caption>
            <Text.Caption>Terms of Service</Text.Caption>
          </FlexItem>
          <FlexItem ele={<Stack order="column" />}>
            <Text.Caption bld tone="minor">
              Theme
            </Text.Caption>
            <Anchor
              girth="xs"
              href=""
              onClick={() => {
                changeTheme(theme.isDark ? orchidLight : orchidDark);
              }}
            >
              {theme.isDark ? 'Light' : 'Dark'}
            </Anchor>
          </FlexItem>
          <FlexItem ele={<Stack order="column" />}>
            <Text.Caption bld tone="minor">
              Connect
            </Text.Caption>
            <Text.Caption>Email</Text.Caption>
            <Text.Caption>GitHub</Text.Caption>
            <Text.Caption>Linkedin</Text.Caption>
          </FlexItem>
        </FlexBox>
      </FlexItem>
      <FlexItem als="center" margin="2rem 0">
        <Text.Caption>© {new Date().getFullYear()} go.datty.in. All rights reserved.</Text.Caption>
      </FlexItem>
    </FlexBox>
  );
}
