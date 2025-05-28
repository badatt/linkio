import React, {useEffect} from 'react';
import { useRouter } from "next/router";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/util';

export default function ({ children }: { children: React.ReactNode }) {
  const [ user, loading ] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <p>Loading...</p>;
  }

  return children;
}
