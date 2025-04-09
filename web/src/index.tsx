import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GlobalResetStyle, GlobalDefaultStyle, orchidLight, TidyUiProvider } from '@tidy-ui/all';

import Routes from './routes';

const App = () => {
  return (
    <StrictMode>
      <GlobalResetStyle />
      <TidyUiProvider theme={orchidLight}>
        <GlobalDefaultStyle />
        <Routes />
      </TidyUiProvider>
    </StrictMode>
  );
};

const app = document.querySelector('#app');
if (app) createRoot(app).render(<App />);
