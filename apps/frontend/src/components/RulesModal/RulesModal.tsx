import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './RulesModal.module.css';

export interface RulesModalProps extends ComponentPropsWithoutRef<'aside'> {
  title: string;
  onClose?: () => void;
}

export const RulesModal = ({
  children,
  className,
  title,
  onClose,
  ...props
}: RulesModalProps) => {
  const classes = clsx(styles.rules, className);

  return (
    <aside
      className={classes}
      aria-modal="true"
      aria-labelledby="rules-title"
      {...props}
    >
      <div className={styles.container}>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={clsx(styles.closeButton, 'cta')}
            aria-label="Fermer la modal"
          >
            Fermer
          </button>
        )}
        <h1 className="titlePage" id="rules-title">
          Règles du jeu
        </h1>
        <div className={styles.content}>
          <h2 className="heading">{title}</h2>
          <div>{children}</div>
        </div>
      </div>
    </aside>
  );
};
