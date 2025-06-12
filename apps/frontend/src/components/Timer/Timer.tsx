import { IconBellRinging } from '@tabler/icons-react';
import clsx from 'clsx';
import { useEffect, useState, type ComponentPropsWithoutRef } from 'react';
import styles from './Timer.module.css';
import { localeManager } from '@tousinclus/managers';

export interface TimerProps extends ComponentPropsWithoutRef<'div'> {
  endTime: Date;
}

export const Timer = ({
  className,
  endTime,
  ...props
}: TimerProps) => {
  const [timeLeftInSeconds, setTimeLeftInSeconds] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((endTime.getTime() - now) / 1000));
      setTimeLeftInSeconds(diff);
    };

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const formatTime = (totalSeconds: number): JSX.Element[] => {
    let remaining = totalSeconds;
    const formattedParts: JSX.Element[] = [];

    const locale = localeManager.getLocale();

    const numberFormat = (value: number, unit: 'hour' | 'minute' | 'second') =>
      new Intl.NumberFormat(locale.code, { style: 'unit', unit }).formatToParts(value);

      const buildUnitSpan = (value: number, unit: 'hour' | 'minute' | 'second', key: string) => {
        const parts = numberFormat(value, unit);

        return (
          <span key={key}>
            {parts.map((part) => (
              <span key={`${part.type}-${part.value}`} className={styles[part.type]}>{part.value}</span>
            ))}
          </span>
        );
      };

    const hours = Math.floor(remaining / 3600);
    if (hours > 0) {
      formattedParts.push(buildUnitSpan(hours, 'hour', 'h'));
      remaining -= hours * 3600;
    }

    const minutes = Math.floor(remaining / 60);
    if (minutes > 0 || hours > 0) {
      formattedParts.push(buildUnitSpan(minutes, 'minute', 'm'));
      remaining -= minutes * 60;
    }

    formattedParts.push(buildUnitSpan(remaining, 'second', 's'));

    return formattedParts;
  };


  const formatDateTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      String(hours).padStart(2, '0'),
      String(minutes).padStart(2, '0'),
      String(seconds).padStart(2, '0')
    ].join(':');
  };

  const classes = clsx(styles.timer, className);

  return (
    <div className={classes} {...props}>
      <IconBellRinging />
      <time dateTime={formatDateTime(timeLeftInSeconds)} className={styles.time}>
        {formatTime(timeLeftInSeconds)}
      </time>
    </div>
  );
};
