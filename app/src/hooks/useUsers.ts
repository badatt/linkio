import axios, { AxiosError } from 'axios';
import { User } from 'firebase/auth';
import { useMutation } from '@tanstack/react-query';

import { FastifyErrorResponse } from '@/types';

interface CreateUserRequest {
  isAnonymous: boolean;
  createdAt: number;
  lastLoginAt: number;
}

const useCreateUser = () => {
  const mutationFn = async (user: User) => {
    const request: CreateUserRequest = {
      isAnonymous: user.isAnonymous,
      createdAt: new Date(user.metadata.creationTime!).getTime(),
      lastLoginAt: new Date(user.metadata.lastSignInTime!).getTime(),
    };

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users`, request, {
      headers: {
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
    });
    return response.data;
  };

  return useMutation<void, AxiosError<FastifyErrorResponse>, User>({
    mutationFn,
  });
};

export { useCreateUser };
