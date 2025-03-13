import clsx from 'clsx';
import type React from 'react';
import { useId, type ComponentPropsWithoutRef } from 'react';
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
  const id = useId(); 

  return (
    <div className={classes}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <textarea id={id} className={styles.textarea} placeholder={placeholder} />
    </div>
  );
};


