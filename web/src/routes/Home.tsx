import React from 'react';
import { FlexBox, FlexItem, Text, Input, Button, Container, Code } from '@tidy-ui/all';
import axios from 'axios';

export default function () {
  const urlRef = React.useRef<HTMLInputElement>(null);
  const [message, setMessage] = React.useState<string>('');

  const handleSubmit = () => {
    if (urlRef.current) {
      const link = urlRef.current.value;
      console.log(`URL: ${link}`); // Handle the URL submission here

      axios
        .post(`${import.meta.env.VITE_API_URL}/links`, { link })
        .then((response) => {
          console.log('Response:', response.data);
          if (response.data) {
            setMessage(`${window.location.href}${response.data.slug}`);
          } else {
            setMessage('Error: No data received');
          }
          urlRef.current!.value = '';
        })
        .catch((error) => {
          console.error('Error:', error);
          setMessage('Error: Unable to shorten the URL');
        });
    }
  };

  return (
    <Container>
      <FlexBox fld="column" ali="center" gap="2rem" margin="2rem 0">
        <FlexItem>
          <Text.H2>Minify your URL</Text.H2>
        </FlexItem>
        <FlexItem>
          <Input width="760px" ref={urlRef} placeholder="Paste the link here" />
        </FlexItem>
        <FlexItem>
          <Button variant="primary" tone="major" girth="xl" onClick={handleSubmit}>
            submit
          </Button>
        </FlexItem>
        {message && (
          <FlexItem>
            <Code>{message}</Code>
          </FlexItem>
        )}
      </FlexBox>
    </Container>
  );
}
