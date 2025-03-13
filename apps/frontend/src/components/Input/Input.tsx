import clsx from 'clsx';
import type React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './Input.module.css';

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
  placeholder: string;
}



export const Input: React.FC<InputProps> = ({
  className,
  label,
  placeholder,
}) => {
  const classes = clsx(styles.blocInput, className);

  return (
    <div className={classes}>
      <label className={styles.label} htmlFor="">{label}</label>
      <input type="text" className={styles.input} placeholder={placeholder} />
    </div>

  );
};


