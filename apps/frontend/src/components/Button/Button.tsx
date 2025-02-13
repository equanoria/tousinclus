import clsx from 'clsx';
import type React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'normal',
  ...props
}) => {
  const classes = clsx(styles.button, styles[variant], className);

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
};
