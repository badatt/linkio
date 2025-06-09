import * as React from 'react';
import { Avatar } from '@tidy-ui/all';

import { useCurrentUser } from '@/hooks';

export default function () {
  const { data } = useCurrentUser();
  if (!data) return null;
  return <>{data.picture && <Avatar girth="xs" src={data.picture} />}</>;
}
