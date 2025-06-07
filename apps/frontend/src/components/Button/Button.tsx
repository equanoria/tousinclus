import clsx from 'clsx';
import type React from 'react';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'icon';
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  'aria-label'?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  startIcon,
  endIcon,
  ...props
}) => {
  const classes = clsx(styles.button, styles[variant], className);
  const isIconOnly = variant === 'icon' && !children;

  return (
    <button
      type="button"
      className={classes}
      {...props}
      aria-label={props['aria-label']}
    >
      {startIcon && (
        <span className={styles.icon} aria-hidden="true">
          {startIcon}
        </span>
      )}

      {children && <span className={styles.text}>{children}</span>}

      {endIcon && (
        <span className={styles.icon} aria-hidden="true">
          {endIcon}
        </span>
      )}

      {isIconOnly && !props['aria-label'] && (
        <span className="sr-only">Icône sans texte — ajoutez aria-label</span>
      )}
    </button>
  );
};
