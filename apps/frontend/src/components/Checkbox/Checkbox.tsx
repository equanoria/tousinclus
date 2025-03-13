import clsx from 'clsx';
import type React from 'react';
import { useId, type ComponentPropsWithoutRef } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  className,
  label,
  ...props
}) => {
  const classes = clsx(styles.checkbox, className);
  const id = useId();

  return (
    <div className={classes}>
      <input type="checkbox" id={id} className={styles.input} {...props} />
      <label htmlFor={id} className={styles.label}>{label}</label>
    </div>
  );
};
