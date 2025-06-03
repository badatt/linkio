import React from 'react';
import { AxiosError } from 'axios';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api, auth } from '@/util';
import { FastifyErrorResponse, User } from '@/types';

interface CreateUserRequest {
  isAnonymous: boolean;
  createdAt: number;
  lastLoginAt: number;
}

const useCreateUser = () => {
  const queryClient = useQueryClient();

  const mutationFn = async (user: FirebaseUser) => {
    const request: CreateUserRequest = {
      isAnonymous: user.isAnonymous,
      createdAt: new Date(user.metadata.creationTime!).getTime(),
      lastLoginAt: new Date(user.metadata.lastSignInTime!).getTime(),
    };

    const response = await api.post('/users', request);
    return response.data;
  };

  return useMutation<User, AxiosError<FastifyErrorResponse>, FirebaseUser>({
    mutationKey: ['createUser'],
    mutationFn,
    onSuccess: (data: User) => {
      queryClient.setQueryData(['user'], (oldData: User) => ({ ...oldData, ...data }));
    },
  });
};

const useCurrentUser = () => {
  const [isAuthReady, setIsAuthReady] = React.useState(false);
  const [firebaseUser, setFirebaseUser] = React.useState(() => auth.currentUser);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
      } else {
        setFirebaseUser(null);
        queryClient.removeQueries({ queryKey: ['user'] });
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  });

  const queryFun = async () => {
    const response = await api.get('/users/me');
    return response.data;
  };

  return useQuery<User, AxiosError<FastifyErrorResponse>>({
    queryKey: ['user'],
    queryFn: queryFun,
    enabled: isAuthReady && !!firebaseUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export { useCreateUser, useCurrentUser };
