import { PrivateRoute, LinksList } from '@/components';

export default function () {
  return (
    <PrivateRoute>
      <LinksList />
    </PrivateRoute>
  );
}
