import React from 'react';
import { FlexBox, FlexItem, Text } from '@tidy-ui/all';

export default function () {
  return (
    <div>
      <FlexBox ctr fld="column" ali="center">
        <FlexItem>
          <Text.h2>We're getting things ready (sandbox) !</Text.h2>
        </FlexItem>
        <FlexItem>
          <Text.h5>We are working hard to get everything ready for you.</Text.h5>
        </FlexItem>
      </FlexBox>
    </div>
  );
}
