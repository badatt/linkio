import React, { useState } from 'react';
import '@fortawesome/fontawesome-svg-core/styles.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { GlobalResetStyle, GlobalDefaultStyle, TidyUiProvider, GlobalFont } from '@tidy-ui/all';
import { config } from '@fortawesome/fontawesome-svg-core';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import { Head, Layout } from '@/components';
config.autoAddCss = false;

export default function ({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      }),
  );
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
            <GoogleReCaptchaProvider
              reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              scriptProps={{
                async: true,
                defer: true,
                appendTo: 'head',
              }}
            >
              <Component {...pageProps} />
            </GoogleReCaptchaProvider>
          </Layout>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </TidyUiProvider>
    </>
  );
}
