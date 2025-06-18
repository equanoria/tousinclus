import { IconInfoCircle } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { Button } from '../components/Button/Button';

export const GameHeader = ({ children }: { children: ReactNode }) => {
  return (
    <header>
      {children}
      <Button startIcon={<IconInfoCircle />}>Aide</Button>
    </header>
  );
};
