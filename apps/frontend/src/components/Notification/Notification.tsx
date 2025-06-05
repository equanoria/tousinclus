import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './Notification.module.css';

export interface NotificationProps extends ComponentPropsWithoutRef<'aside'> {
  variant?:
    | 'info'
    | 'warning'
    | 'danger';
}

export const Notification = ({
  children,
  className,
  variant = 'info',
  ...props
}: NotificationProps) => {
  const classes = clsx(styles.notification, styles[variant], className);

  return (
    <aside className={classes} role="alert" {...props}>
      {children}
    </aside>
  );
};
