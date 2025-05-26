import * as React from 'react';
import axios, { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { Alert, Button, ButtonCluster, Code, FlexBox, FlexItem, Input, Progress } from '@tidy-ui/all';
import { env } from '../../util';

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
  const response = await axios.post(`${env('VITE_API_URL')}/links`, { link: request.link });
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

  const handleCancel = () => {
    if (urlRef.current) {
      urlRef.current.value = '';
    }
  };

  return (
    <FlexBox fld="column" ali="center" gap="1rem" margin="2rem 0">
      <Progress variant="indeterminate" girth="xxs" tone="minor" display={isPending ? 'inline-block' : 'none'} />
      <FlexItem fuw>
        <Input
          isStretched
          ref={urlRef}
          placeholder="Paste your long URL here..."
          status={isError ? 'danger' : 'info'}
        />
      </FlexItem>
      <FlexItem width="50%">
        <ButtonCluster isStretched disabled={isPending}>
          <Button variant="simple" onClick={handleCancel} disabled={isPending}>
            Clear
          </Button>
          <Button variant="primary" tone="major" onClick={handleSubmit} disabled={isPending}>
            Shorten URL
          </Button>
        </ButtonCluster>
      </FlexItem>
      {isSuccess && (
        <FlexItem>
          <Code>{`${window.location.hostname}/${data.slug}`}</Code>
        </FlexItem>
      )}
      {isError && (
        <FlexItem>
          <Alert status="danger" isSharp>
            {error.response?.data.message}
          </Alert>
        </FlexItem>
      )}
    </FlexBox>
  );
}
