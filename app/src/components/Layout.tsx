import type { Metadata } from "next";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GlobalResetStyle, GlobalDefaultStyle, TidyUiProvider, GlobalFont } from '@tidy-ui/all';

const queryClient = new QueryClient();

export default function({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <GlobalResetStyle />
    <TidyUiProvider>
      <GlobalFont />
      <GlobalDefaultStyle />
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </TidyUiProvider>
    </>
  );
}
