import { IconBellRinging } from '@tabler/icons-react';
import clsx from 'clsx';
import type React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './Timer.module.css';

export interface TimerProps extends ComponentPropsWithoutRef<'div'> {
  timer: number;
}

export const Timer: React.FC<TimerProps> = ({ className, timer, ...props }) => {
  const classes = clsx(styles.timer, className);

  return (
    <div className={classes} {...props}>
      <IconBellRinging />
      <p className={styles.time}>0{timer} : 00</p>
    </div>
  );
};
