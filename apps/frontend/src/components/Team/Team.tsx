import clsx from 'clsx';
import type { FC } from 'react';
import styles from './Team.module.css';

export interface TeamProps {
  team: 'team1' | 'team2';
  winner?: boolean;
  score: number;
  label: string;
}

export const Team: FC<TeamProps> = ({ winner = false, score, label }) => {
  const teamStyle = winner ? styles.winnerStyle : styles.loserStyle;

  return (
    <div className={clsx(styles.container)}>
      <div className={clsx(styles.badge, teamStyle, winner && styles.winner)}>
        {winner && <div className={styles.crown} />}
        <div className={styles.label}>{label}</div>
      </div>
      <div className={styles.score}>
        <img src="/src/assets/images/stars.svg" alt="" className={styles.stars}/>
        <span className={`${styles.score} ${styles.label}`}>
          Score : {score} points
        </span>
      </div>
    </div>
  );
};
