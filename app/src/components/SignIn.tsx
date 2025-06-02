import * as React from 'react';
import {
  Button,
  FlexBox,
  Loader,
} from '@tidy-ui/all';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';

import { auth } from '@/util';
import { useCreateUser } from '@/hooks';

export default function () {
  const [user, setUser] = React.useState<User | null>(null);
  const { mutate, isError, isSuccess, isPending, error, data, reset } = useCreateUser();

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

  const handleSignOut = () => {
    signOut(auth);
    reset();
  };

  React.useEffect(() => {
   if (isError) {
      signOut(auth);
    }
  }, [isSuccess, isError, data, error]);

  return (
    <FlexBox ali='center'>
      {isPending && (
        <Loader girth='sm'/>
      )}
      {user && !isError && !isPending && (
        <Button tone="danger" variant="simple" onClick={handleSignOut}>
          Signout
        </Button>
      )}
      {!user && !isSuccess && !isPending && (
        <Button tone="major" variant="outlined" onClick={handleSignIn}>
          Sign in with Google
        </Button>
      )}
    </FlexBox>
  );
}
