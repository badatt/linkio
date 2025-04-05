import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { FlexBox, FlexItem, Text, orchidLight, TidyUiProvider, Stack } from '@tidy-ui/all';

const App = () => {
  return (
    <StrictMode>
      <TidyUiProvider theme={orchidLight}>
        <FlexBox ctr fld="column" ali="center">
          <FlexItem>
            <Text.h2>We're getting things ready !</Text.h2>
          </FlexItem>
          <FlexItem>
            <Text.h5>We are working hard to get everything ready for you.</Text.h5>
          </FlexItem>
        </FlexBox>
        <Stack></Stack>
      </TidyUiProvider>
    </StrictMode>
  );
};

const app = document.querySelector('#app');
if (app) createRoot(app).render(<App />);
