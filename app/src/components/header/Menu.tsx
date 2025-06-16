import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { Avatar, Menu, MenuItem, MenuItemSeparator } from '@tidy-ui/all';

import { auth } from '@/util';
import { useCurrentUser } from '@/hooks';

export default function () {
  const { data } = useCurrentUser();

  const handleSignOut = () => {
    signOut(auth);
    window.location.reload();
  };

  if (!data) return null;
  return (
    <Menu
      trigger={data.picture ? <Avatar girth="xs" src={data.picture} /> : <Avatar girth="xs" name={data.name} />}
      width="max-content"
    >
      <MenuItem icon={<FontAwesomeIcon icon={faLink} />}>
        <Link href="/my-links">My Links</Link>
      </MenuItem>
      <MenuItemSeparator />
      <MenuItem icon={<FontAwesomeIcon icon={faArrowRightFromBracket} />} tone="danger" onClick={handleSignOut}>
        Logout
      </MenuItem>
    </Menu>
  );
}
