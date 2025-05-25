import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { GlobalResetStyle, GlobalDefaultStyle, TidyUiProvider, GlobalFont } from '@tidy-ui/all';

import Routes from './routes';

const queryClient = new QueryClient();

const App = () => {
  return (
    <StrictMode>
      <GlobalResetStyle />
      <TidyUiProvider>
        <GlobalFont />
        <GlobalDefaultStyle />
        <QueryClientProvider client={queryClient}>
          <Routes />
        </QueryClientProvider>
      </TidyUiProvider>
    </StrictMode>
  );
};

const app = document.querySelector('#app');
if (app) createRoot(app).render(<App />);
