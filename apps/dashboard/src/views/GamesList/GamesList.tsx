import { Button } from '@/components/ui/button';
import styles from './GamesList.module.css';

export const GamesList = () => {
  return (
    <div className={styles.gamesList}>
      <h1>Dashboard</h1>
      <h2>Parties en cours</h2>

      <Button>Je suis un bouton shadcn/ui</Button>
    </div>
  );
};
