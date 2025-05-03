import clsx from 'clsx';
import type React from 'react';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'icon';
  startIcon?: ReactElement;
  endIcon?: ReactElement;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'normal',
  startIcon,
  endIcon,
  ...props
}) => {
  const classes = clsx(styles.button, styles[variant], className);

  return (
    <button type="button" className={classes} {...props}>
      {startIcon && <span className={styles.icon}>{startIcon}</span>}
      <span>{children}</span>
      {endIcon && <span className={styles.icon}>{endIcon}</span>}
    </button>
  );
};
