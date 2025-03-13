import clsx from 'clsx';
import type React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './Textarea.module.css';

export interface TextareaProps extends ComponentPropsWithoutRef<'div'> {
  label: string;
  placeholder: string;
}



export const Textarea: React.FC<TextareaProps> = ({
  className,
  label,
  placeholder,
}) => {
  const classes = clsx(styles.blocTextarea, className);

  return (
    <div className={classes}>
      <label className={styles.label} htmlFor="">{label}</label>
      <textarea className={styles.textarea} placeholder={placeholder} />
    </div>

  );
};


