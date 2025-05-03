import clsx from 'clsx';
import type React from 'react';
import { type ComponentPropsWithoutRef, useId } from 'react';
import styles from './Textarea.module.css';

export interface TextareaProps extends ComponentPropsWithoutRef<'div'> {
  label: string;
}

export const Textarea: React.FC<TextareaProps> = ({ className, label }) => {
  const classes = clsx(styles.blocTextarea, className);
  const id = useId();

  return (
    <div className={classes}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        className={styles.textarea}
        placeholder="Écris ton texte ici..."
      />
    </div>
  );
};
