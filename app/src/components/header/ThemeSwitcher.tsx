import * as React from 'react';
import { Button, orchidDark, orchidLight } from '@tidy-ui/all';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-regular-svg-icons';

import { useTheme } from '@/hooks';

export default function () {
  const { theme, changeTheme } = useTheme();

  return (
    <Button
      onClick={() => {
        changeTheme(theme.isDark ? orchidLight : orchidDark);
      }}
      tone="major"
      icon={theme.isDark ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />}
    />
  );
}
