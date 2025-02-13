import clsx from 'clsx';
import type { ComponentPropsWithoutRef, FC } from 'react';
import styles from './Input.module.css';

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
    label?: string;
}

export const Input: FC<InputProps> = ({ label='label', className, type = 'text', ...props }) => {
    const classes = clsx(styles.input, className);

    return (
        <div className={styles.inputContainer}>
            <label htmlFor={props.id} className={styles.label}>{label}</label>
            <input id={props.id} type={type} className={classes} {...props} aria-label={label} />
        </div>
    );
};
