import clsx from 'clsx';
import type React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './GameCard.module.css';

export interface GameCardProps extends ComponentPropsWithoutRef<'div'> {
  type: 'situation' | 'user';
  img: string;
  alt: string;
  number?: number;
}

export const GameCard: React.FC<GameCardProps> = ({
  className,
  type = 'situation',
  alt,
  img,
  number,
  ...props
}) => {
  const classes = clsx(styles.card, styles[type], className);

  return (
    <figure
      className={classes}
      aria-label={`${type === 'situation' ? 'Carte situation' : 'Carte utilisateur'} : ${alt}`}
      {...props}
    >
      {typeof number !== 'undefined' && (
        <span className={styles.number} aria-hidden="true">
          {number}
        </span>
      )}
      <div className={styles.imageContainer}>
        <img src={img} alt={alt || 'Carte du jeu'} className={styles.image} />
      </div>
    </figure>
  );
};
