import clsx from 'clsx';
import type React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './GameCard.module.css';

export interface GameCardProps extends ComponentPropsWithoutRef<'div'> {
  type: 'situation' | 'user';
  img: string;
  alt: string;
  number?: string;
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
    <div className={classes} {...props}>
      <p className={styles.number}>{number}</p>
      {img && <img src={img} alt={alt || 'Game Card Image'} />}
    </div>
  );
};
