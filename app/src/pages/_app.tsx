import React from 'react';
import '@fortawesome/fontawesome-svg-core/styles.css';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { GlobalResetStyle, GlobalDefaultStyle, TidyUiProvider, GlobalFont } from '@tidy-ui/all';
import { config } from '@fortawesome/fontawesome-svg-core';

import { Head, Layout } from '@/components';
config.autoAddCss = false;

export default function ({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [isHydrated, setIsHydrated] = useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return <Head />;

  return (
    <>
      <Head />
      <GlobalResetStyle />
      <TidyUiProvider>
        <GlobalFont />
        <GlobalDefaultStyle />
        <QueryClientProvider client={queryClient}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </TidyUiProvider>
    </>
  );
}
