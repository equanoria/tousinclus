import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './Banner.module.css';

export interface BannerProps extends ComponentPropsWithoutRef<'aside'> {
  variant?:
    | 'info'
    | 'warning'
    | 'danger';
}

export const Banner = ({
  children,
  className,
  variant = 'info',
  ...props
}: BannerProps) => {
  const classes = clsx(styles.banner, styles[variant], className);

  return (
    <aside className={classes} role="alert" {...props}>
      {children}
    </aside>
  );
};
