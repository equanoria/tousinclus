import clsx from 'clsx';
import type React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
  id: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  className,
  label,
  id,
  ...props
}) => {
  const classes = clsx(styles.checkbox, className);

  return (
    <div className={classes}>
      <input type="checkbox" id={id} className={styles.input} {...props} />
      <label htmlFor={id} className={styles.label}>{label}</label>
    </div>
  );
};
