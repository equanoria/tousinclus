import clsx from 'clsx';
import { useId, type ComponentPropsWithoutRef } from 'react';
import styles from './Textarea.module.css';

export interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  label: string;
  placeholder?: string;
  error?: string;
  description?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  className,
  label,
  placeholder,
  value,
  onChange,
  error,
  description,
  ...rest
}) => {
  const id = useId();
  const errorId = `${id}-error`;
  const descId = `${id}-desc`;

  const describedBy =
    [description ? descId : null, error ? errorId : null]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <div className={clsx(styles.blocTextarea, className)}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>

      {description && (
        <p id={descId} className={styles.description}>
          {description}
        </p>
      )}

      <textarea
        id={id}
        className={clsx(styles.textarea, { [styles.error]: !!error })}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        {...rest}
      />

      {error && (
        <p id={errorId} className={styles.errorMessage}>
          {error}
        </p>
      )}
    </div>
  );
};
