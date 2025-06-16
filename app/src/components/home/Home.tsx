import React from 'react';
import { FlexBox, FlexItem, Text, Stack } from '@tidy-ui/all';

import { UrlShortenerForm } from '@/components';

import Features from './Features';

export default function () {
  return (
    <FlexBox fld="column" ali="center" gap="1rem" margin="2rem 0">
      <FlexItem fuw>
        <Stack order="column" align="center" gap="1rem">
          <Text.Title2>The Smarter Way to Share Links</Text.Title2>
          <Text.Body1 float="right">Shorten. Share. Track. All in one place.</Text.Body1>
        </Stack>
      </FlexItem>
      <FlexItem fuw>
        <UrlShortenerForm />
      </FlexItem>
      <FlexItem fuw>
        <Features />
      </FlexItem>
    </FlexBox>
  );
}
