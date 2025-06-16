import * as React from 'react';
import { Alert, Button, ButtonCluster, Code, FlexBox, FlexItem, Input, Progress } from '@tidy-ui/all';

import { useCreateLink } from '@/hooks';

export default function () {
  const urlRef = React.useRef<HTMLInputElement>(null);

  const { mutate, isPending, isSuccess, isError, error, data, reset } = useCreateLink();

  const handleSubmit = () => {
    if (urlRef.current) {
      const url = urlRef.current.value;
      mutate({ url });
    }
  };

  const handleClear = () => {
    if (urlRef.current) {
      urlRef.current.value = '';
    }
    reset();
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
          <Button variant="simple" onClick={handleClear} disabled={isPending}>
            Clear
          </Button>
          <Button variant="primary" tone="major" onClick={handleSubmit} disabled={isPending}>
            Shorten URL
          </Button>
        </ButtonCluster>
      </FlexItem>
      {isSuccess && (
        <FlexItem>
          <Code>
            {window.location.host}/{data.slug}
          </Code>
        </FlexItem>
      )}
      {isError && (
        <FlexItem>
          <Alert status="danger" isSharp>
            {error.response?.data.message ?? error.message}
          </Alert>
        </FlexItem>
      )}
    </FlexBox>
  );
}
