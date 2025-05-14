import clsx from 'clsx';
import type React from 'react';
import { useId, type ComponentPropsWithoutRef } from 'react';
import styles from './Input.module.css';

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
  placeholder: string;
}

export const Input: React.FC<InputProps> = ({
  className,
  label,
  placeholder,
  value,
  onChange,
}) => {
  const classes = clsx(styles.blocInput, className);
  const id = useId();

  return (
    <div className={classes}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <input
        type="text"
        id={id}
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};


