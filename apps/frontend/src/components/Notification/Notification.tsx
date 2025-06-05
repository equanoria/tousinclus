import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './Notification.module.css';

export interface NotificationProps extends ComponentPropsWithoutRef<'aside'> {
  onClose?: () => void;
}

export const Notification = ({
  children,
  className,
  onClose,
  ...props
}: NotificationProps) => {
  const classes = clsx(styles.notification, className);

  return (
    <aside className={classes} role="alert" {...props}>
      <div className={styles.container}>
       <div className={styles.header}>
        <h1 className='titlePage'>Notifications</h1>
         {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={clsx(styles.closeButton, 'cta')}
            aria-label="Fermer la modal"
          >
            Fermer
          </button>
        )}
       </div>
       <div className={styles.content}>
         <p className='subheading'>{children}</p>
       </div>
      </div>
    </aside>
  );
};
