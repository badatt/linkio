import { Layout, PrivateRoute } from '@/components';

export default function () {
  return (
    <PrivateRoute>
      <Layout>
        Settings
      </Layout>
    </PrivateRoute>
  );
}
