import clsx from 'clsx';
import type React from 'react';
import { useId, type ComponentPropsWithoutRef } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
  hideLabel?: boolean; 
}

export const Checkbox: React.FC<CheckboxProps> = ({
  className,
  label,
  checked,
  onChange,
  hideLabel = false,
  disabled,
  ...props
}) => {
  const id = useId();
  const classes = clsx(styles.checkbox, className);

  return (
    <div className={classes}>
      <input
        type="checkbox"
        id={id}
        className={styles.input}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        aria-checked={checked}
        aria-disabled={disabled}
        {...props}
      />
      <label
        htmlFor={id}
        className={clsx(styles.label, hideLabel && 'sr-only')}
      >
        {label}
      </label>
    </div>
  );
};
