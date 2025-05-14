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
  name, 
  type = 'text',
  ...rest
}) => {
  const classes = clsx(styles.blocInput, className);
  const id = useId();

  return (
    <div className={classes}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <input
        id={id}
        className={styles.input}
        name={name} 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </div>
  );
};
