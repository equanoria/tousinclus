import React, { ComponentPropsWithoutRef } from 'react';
import styles from './Link.module.css';
import stylesButton from '../Button/Button.module.css';
import clsx from 'clsx';

export interface LinkProps extends ComponentPropsWithoutRef<'a'> {
  variant?: 'button-normal' | 'button-danger' | 'button-positive' | 'button-outlined';
}

export const Link: React.FC<LinkProps> = ({ children, className, variant = 'normal', ...props }) => {

  const getClasses = () => {
    const variantName = variant.split('-');

    if (variantName[0] === 'button') {
      return clsx(
        stylesButton.button,
        stylesButton[variantName[1]],
        className
      );
    }

    return clsx(
      styles.link,
      styles[variant],
      className
    );
  };

  return (
    <a
      className={getClasses()}
      {...props}
    >
      {children}
    </a>
  );
};
