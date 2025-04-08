import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { orchidLight, TidyUiProvider } from '@tidy-ui/all';

import Routes from './routes';

const App = () => {
  return (
    <StrictMode>
      <TidyUiProvider theme={orchidLight}>
        <Routes />
      </TidyUiProvider>
    </StrictMode>
  );
};

const app = document.querySelector('#app');
if (app) createRoot(app).render(<App />);
