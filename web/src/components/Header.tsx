import * as React from 'react';
import {
  Anchor,
  Button,
  Divider,
  FlexBox,
  FlexItem,
  Note,
  Stack,
  Text,
  useTheme,
  orchidDark,
  orchidLight,
} from '@tidy-ui/all';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-regular-svg-icons';
import { auth } from '../firebase';

export default function () {
  const [user, setUser] = React.useState<User | null>(null);
  const { changeTheme, theme } = useTheme();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('User Info:', result.user.toJSON());
      console.log('User', result.user);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <>
      <FlexBox jsc="space-between" margin="0.5rem 0 0 0">
        <FlexItem>
          <Text.H6>Linkio</Text.H6>
        </FlexItem>
        <FlexItem>
          <Stack align="center" gap="1rem">
            {user && <Anchor href="/settings">Settings</Anchor>}
            {user && (
              <Button tone="danger" variant="simple" onClick={() => signOut(auth)}>
                Signout
              </Button>
            )}
            {!user && (
              <Button tone="major" variant="outlined" onClick={handleSignIn}>
                Sign in with Google
              </Button>
            )}
            <Button
              onClick={() => {
                changeTheme(theme.isDark ? orchidLight : orchidDark);
              }}
              tone="major"
              icon={theme.isDark ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />}
            />
          </Stack>
        </FlexItem>
      </FlexBox>
      <Divider />
      <Note padding="0.25rem 0">
        <Text.Caption ctr>
          This site is currently under active development. If you encounter any issues or bugs, please{' '}
          <Anchor href="https://github.com/badatt/linkio/issues" canLaunch girth="xxs" tone="minor">
            report them on GitHub
          </Anchor>
          . Your feedback helps us improve!
        </Text.Caption>
      </Note>
    </>
  );
}
