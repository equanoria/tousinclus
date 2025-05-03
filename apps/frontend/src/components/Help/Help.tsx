import clsx from 'clsx';
import type React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { useAppState } from '../../context/AppStateProvider';
import styles from './Help.module.css';

export interface HelpProps extends ComponentPropsWithoutRef<'div'> {
  title: string;
  content: string;
}

export const Help: React.FC<HelpProps> = ({ className, title, content }) => {
  const { isHelpOpen, setHelpOpen } = useAppState();
  const classes = clsx(styles.blocHelp, className, {
    [styles.open]: isHelpOpen,
  });

  return (
    <div className={classes}>
      <div
        className={styles.overlay}
        onClick={() => setHelpOpen(false)}
        onKeyUp={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setHelpOpen(false);
          }
        }}
        role="button"
        tabIndex={0}
      />
      <div className={styles.popin}>
        <button type="button" className={styles.closeBtn} onClick={() => setHelpOpen(false)}>
          Masquer
        </button>
        <div className={styles.content}>
          <h1 className={styles.title}>Règles du jeu</h1>
          <div className={styles.rules}>
            <p>{title}</p>
            <p>{content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
