import clsx from 'clsx';
import type React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './CardText.module.css';

export interface CardTextProps extends ComponentPropsWithoutRef<'div'> {
  type: 'situation' | 'user';
  content: string;
}

const CARD_CONTENT = {
  situation: {
    title: "Situation d'usage",
  },
  user: {
    title: 'Utilisateur extrême',
  },
};

export const CardText: React.FC<CardTextProps> = ({
  className,
  type = 'situation',
  content,
  ...props
}) => {
  const classes = clsx(styles.card, styles[type], className);
  const { title } = CARD_CONTENT[type];

  return (
    <div className={classes} {...props}>
      <img
        src={`/assets/circle-cardText-${type}.svg`}
        alt=""
        className={styles.asset}
      />
      <p className={styles.title}>{title}</p>
      <div className={styles.content}>
        {content && <p className={styles.description}>{content}</p>}
      </div>
    </div>
  );
};
