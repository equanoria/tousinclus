import clsx from 'clsx';
import { useId, type ComponentPropsWithoutRef } from 'react';
import styles from './Textarea.module.css';

export interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  label: string;
  placeholder: string;
}

export const Textarea = ({
  className,
  label,
  placeholder,
  ...props
}: TextareaProps) => {
  const classes = clsx(styles.blocTextarea, className);
  const id = useId(); 

  return (
    <div className={classes}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <textarea id={id} className={styles.textarea} placeholder={placeholder} {...props} />
    </div>
  );
};


