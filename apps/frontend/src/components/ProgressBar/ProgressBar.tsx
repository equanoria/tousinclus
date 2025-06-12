import clsx from 'clsx';
import type React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './ProgressBar.module.css';

export interface ProgressBarProps extends ComponentPropsWithoutRef<'div'> {
  max: number;
  value: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  className,
  max,
  value,
}) => {
  const classes = clsx(styles.progressBar, className);

  return (
    <div className={classes}>
      <progress max={max} value={value} />
    </div>
  );
};
