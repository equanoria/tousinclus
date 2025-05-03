import { IconHeartFilled } from '@tabler/icons-react';
import clsx from 'clsx';
import type React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './CardAnswers.module.css';

export interface CardAnswersProps extends ComponentPropsWithoutRef<'div'> {
  team: 'team1' | 'team2';
  data: Record<string, unknown>;
}

export const CardAnswers: React.FC<CardAnswersProps> = ({
  className,
  team,
  data,
  ...props
}) => {
  const classes = clsx(styles.cardAnswers, styles[team], className);
  const teamName = team === 'team1' ? 'Équipe 1' : 'Équipe 2';

  return (
    <div className={classes} {...props}>
      <div className={styles.filter} />
      <p className={styles.teamName}>{teamName}</p>
      <div className={styles.answersContainer}>
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <p>{key}</p>
            <p>{String(value)}</p>
          </div>
        ))}
      </div>
      <div className={styles.votingButton}>
        <div className={clsx(styles.filter, styles.icon)} />
        <IconHeartFilled size={28} className={styles.heart} />
      </div>
    </div>
  );
};
