import React, { ComponentPropsWithoutRef } from 'react';
import styles from './Button.module.css';
import clsx from 'clsx';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'positive' | 'warning' | 'danger' | 'outlined';
}

export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'normal', ...props }) => {
  const classes = clsx(
    styles.button,
    styles[variant],
    className
  );

  return (
    <button
      type="button"
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};
