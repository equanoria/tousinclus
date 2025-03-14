import clsx from 'clsx';
import type React from 'react';
import { ComponentPropsWithoutRef } from 'react';
import styles from './Help.module.css';

export interface helpProps extends ComponentPropsWithoutRef<'div'> {
    title: string;
    content: string;
}

export const Help: React.FC<helpProps> = ({
    className,
    title,
    content
}) => {
    const classes = clsx(styles.blocHelp, className);

    return (
        <div className={classes}>
            <div className={styles.mask}>Masquer</div>
            <h1>Règles du jeu</h1>
            <div>
                <p>{title}</p>
                <p>{content}</p>
            </div>
        </div>

    );
};


