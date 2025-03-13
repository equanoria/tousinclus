import clsx from 'clsx';
import type React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './IndicatorCard.module.css';
import { IconCheck } from '@tabler/icons-react';

export interface IndicatorCardProps extends ComponentPropsWithoutRef<'div'> {
  current: boolean; 
  checked: boolean; 
}

export const IndicatorCard: React.FC<IndicatorCardProps> = ({
  className,
  current,
  checked,
  ...props
}) => {
  const classes = clsx(styles.indicatorCard, className, {[styles.current]: current});

  return (
    <div className={classes} {...props}>
        { checked && <IconCheck stroke={2} color='white' size='36' className={styles.iconCheck}/>}
    </div>
  );
};
