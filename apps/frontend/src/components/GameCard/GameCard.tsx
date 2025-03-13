import clsx from 'clsx';
import type React from 'react';
import type { ComponentPropsWithoutRef ,ReactElement } from 'react';
import styles from './GameCard.module.css';

export interface GameCardProps extends ComponentPropsWithoutRef<'div'> {
  type:
    | 'situation'
    | 'user';
  size:
    | 'm'
    | 'l'; 
  img: string;
  alt: string;
  content: string;
  label?: string;
  icon?: ReactElement; 
}

const CARD_CONTENT = {
  situation: {
    title: "situation d'usage"
  },
  user: {
    title: "utilisateur extrême",
  }
}

export const GameCard: React.FC<GameCardProps> = ({
  className,
  type = 'situation',
  alt,
  label, 
  img,
  icon,
  content,
  size = 'm',
  ...props
}) => {
  const classes = clsx(styles.card, styles[type], styles[size], className);
  const { title } = CARD_CONTENT[type];

  return (
    <div className={classes} {...props}>
      <p className={styles.title}>{title}</p>
      <div className={styles.content}>
      {img && <img src={img} alt={alt || 'Game Card Image'} />}
      <div className={styles.contentText}> 
          {content && <p className={styles.description}>{content}</p>}
        <div className={styles.text}> 
          {icon && <div>{icon}</div>}
          {label && <p>{label}</p>}
        </div>
      </div>
      </div>
    </div>
  );
};
