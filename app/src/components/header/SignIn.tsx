import * as React from 'react';
import { Button, FlexBox, Loader } from '@tidy-ui/all';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';

import { auth } from '@/util';
import { useCreateUser } from '@/hooks';

export default function () {
  const [user, setUser] = React.useState<User | null>(null);
  const { mutate, isError, isSuccess, isPending, error, data } = useCreateUser();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      mutate(result.user);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  React.useEffect(() => {
    if (isError) {
      signOut(auth);
    }
  }, [isSuccess, isError, data, error]);

  if (isPending)
    return (
      <FlexBox>
        <Loader girth="sm" />
      </FlexBox>
    );

  if (!user && !isSuccess && !isPending)
    return (
      <FlexBox>
        <Button tone="major" variant="outlined" onClick={handleSignIn}>
          Sign in with Google
        </Button>
      </FlexBox>
    );
}
