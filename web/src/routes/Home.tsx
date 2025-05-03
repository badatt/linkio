import React from 'react';
import { FlexBox, FlexItem, Text, Input, Button, Code, Alert } from '@tidy-ui/all';
import axios, { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

type CreateLinkRequest = {
  link: string;
};

type CreateLinkSuccessResponse = {
  slug: string;
};

type CreateLinkErrorResponse = {
  statusCode?: number;
  code?: string;
  error?: string;
  message?: string;
};

const createLink = async (request: CreateLinkRequest) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/links`, { link: request.link });
  return response.data;
};

export default function () {
  const urlRef = React.useRef<HTMLInputElement>(null);

  const { isPending, isSuccess, isError, data, mutate, error } = useMutation<
    CreateLinkSuccessResponse,
    AxiosError<CreateLinkErrorResponse>,
    CreateLinkRequest
  >({
    mutationFn: createLink,
  });

  const handleSubmit = () => {
    if (urlRef.current) {
      const link = urlRef.current.value;
      mutate({ link });
    }
  };

  return (
    <FlexBox fld="column" ali="center" gap="2rem" margin="2rem 0">
      <FlexItem>
        <Text.H2>Minify your URL</Text.H2>
      </FlexItem>
      <FlexItem fuw>
        <Input isStretched ref={urlRef} placeholder="Paste the link here" />
      </FlexItem>
      <FlexItem>
        <Button variant="hero" girth="md" isGradient onClick={handleSubmit} disabled={isPending}>
          submit
        </Button>
      </FlexItem>
      {isSuccess && (
        <FlexItem>
          <Code>{`${window.location.hostname}/${data.slug}`}</Code>
        </FlexItem>
      )}
      {isError && (
        <FlexItem>
          <Alert status="danger">{error.response?.data.message}</Alert>
        </FlexItem>
      )}
    </FlexBox>
  );
}
