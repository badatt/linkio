import axios, { AxiosError } from 'axios';
import { UserCredential } from 'firebase/auth';
import { useMutation } from '@tanstack/react-query';

import { FastifyErrorResponse } from '@/types';

interface CreateUserRequest {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  isAnonymous: boolean;
  photoURL: string;
  createdAt: string;
  lastLoginAt: string;
}

const useCreateUser = () => {
  const mutationFn = async (payload: UserCredential) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _tokenResponse = (payload as any)._tokenResponse;
    if (_tokenResponse?.isNewUser) {
      const request: CreateUserRequest = {
        uid: payload.user.uid,
        email: payload.user.email || '',
        emailVerified: payload.user.emailVerified,
        displayName: payload.user.displayName || '',
        isAnonymous: payload.user.isAnonymous,
        photoURL: payload.user.photoURL || '',
        createdAt: payload.user.metadata.creationTime || '',
        lastLoginAt: payload.user.metadata.lastSignInTime || '',
      };
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users`, request);
      return response.data;
    }
  };

  return useMutation<void, AxiosError<FastifyErrorResponse>, UserCredential>({
    mutationFn,
  });
};

export { useCreateUser };
