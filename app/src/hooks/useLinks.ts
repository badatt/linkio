import axios, { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

import { FastifyErrorResponse } from '@/types';

type CreateLinkRequest = {
  url: string;
};

type CreateLinkSuccessResponse = {
  slug: string;
  location: string;
};

const useCreateLink = () => {
  const mutationFn = async (request: CreateLinkRequest) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/links`, request);
    return response.data;
  };

  return useMutation<CreateLinkSuccessResponse, AxiosError<FastifyErrorResponse>, CreateLinkRequest>({
    mutationFn,
  });
};

export { useCreateLink };
