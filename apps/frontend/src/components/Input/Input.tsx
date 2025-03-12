import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './Input.module.css';

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  className,
  ...props
}) => {
  const classes = clsx(styles.input, className);

  return (
    <div className={styles.inputContainer}>
      <label htmlFor={props.id} className={styles.label}>{label}</label>
      <input id={props.id} className={classes} {...props} />
    </div>
  );
};
