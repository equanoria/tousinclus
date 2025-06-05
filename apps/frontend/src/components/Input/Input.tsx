import clsx from 'clsx';
import { useId, type ComponentPropsWithoutRef } from 'react';
import styles from './Input.module.css';

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
  className?: string;
  error?: string;
}

export const Input = ({
  label,
  className,
  error,
  ...props
}: InputProps) => {
  const classes = clsx(styles.formGroup, className);
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={classes}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <input
        id={id}
        className={styles.input}
        {...props}
        {...(error ? { 'aria-invalid': true, 'aria-describedby': errorId } : {})}
      />
      {error && <p className={clsx(styles.error, errorId)}>{error}</p>}
    </div>
  );
};
