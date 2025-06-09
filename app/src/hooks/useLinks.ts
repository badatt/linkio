import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import { api } from '@/util';
import { FastifyErrorResponse, Link } from '@/types';

type CreateLinkRequest = {
  url: string;
};

const useCreateLink = () => {
  const queryClient = useQueryClient();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const mutationFn = async (request: CreateLinkRequest) => {
    if (!executeRecaptcha) {
      throw new Error('reCAPTCHA is not ready');
    }
    const token = await executeRecaptcha('CreateLink');
    const response = await api.post('/links', request, {
      headers: {
        'x-recaptcha-token': token,
      },
    });
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
