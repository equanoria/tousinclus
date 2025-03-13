import clsx from 'clsx';
import type React from 'react';
import { ComponentPropsWithoutRef } from 'react';
import styles from './Help.module.css';
import { useAppState } from '../../context/AppStateProvider';

export interface HelpProps extends ComponentPropsWithoutRef<'div'> {
    title: string;
    content: string;
}

export const Help: React.FC<HelpProps> = ({ className, title, content }) => {
    const { isHelpOpen, setHelpOpen } = useAppState();
    const classes = clsx(styles.blocHelp, className, { [styles.open]: isHelpOpen });

    return (
        <div className={classes}>
            <div className={styles.overlay} onClick={() => setHelpOpen(false)} />
            <div className={styles.popin}>
                <button className={styles.closeBtn} onClick={() => setHelpOpen(false)}>Masquer</button>
               <div className={styles.content}> 
                <h1 className={styles.title}>Règles du jeu</h1>
                <div className={styles.rules}>
                    <p>{title}</p>
                    <p>{content}</p>
                </div>
               </div>
            </div>
        </div>
    );
};

