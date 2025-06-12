import clsx from 'clsx';
import type React from 'react';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import stylesButton from '../Button/Button.module.css';
import styles from './Link.module.css';

export interface LinkProps extends ComponentPropsWithoutRef<'a'> {
  variant?:
    | 'button-primary'
    | 'button-secondary'
    | 'button-tertiary'
    | 'button-positive'
    | 'button-warning'
    | 'button-danger'
    | 'button-outlined';
  startIcon?: ReactElement;
  endIcon?: ReactElement;
}

export const Link: React.FC<LinkProps> = ({
  children,
  className,
  variant = 'normal',
  startIcon,
  endIcon,
  ...props
}) => {
  const getClasses = () => {
    const variantName = variant.split('-');

    if (variantName[0] === 'button') {
      return clsx(stylesButton.button, stylesButton[variantName[1]], className);
    }

    return clsx(styles.link, styles[variant], className);
  };

  return (
    <a className={getClasses()} {...props}>
      {startIcon && <span className={styles.icon}>{startIcon}</span>}
      {children && <span>{children}</span>}
      {endIcon && <span className={styles.icon}>{endIcon}</span>}
    </a>
  );
};
