import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/util';
import { FastifyErrorResponse, Link } from '@/types';

type CreateLinkRequest = {
  url: string;
};

const useCreateLink = () => {
  const queryClient = useQueryClient();

  const mutationFn = async (request: CreateLinkRequest) => {
    const response = await api.post('/links', request);
    return response.data;
  };

  return useMutation<Link, AxiosError<FastifyErrorResponse>, CreateLinkRequest>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.setQueryData(['link'], (oldData: Link) => ({ ...oldData, ...data }));
    },
  });
};

export { useCreateLink };
