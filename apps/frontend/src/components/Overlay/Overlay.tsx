import clsx from 'clsx';
import type { FC, KeyboardEvent, MouseEvent } from 'react';
import styles from './Overlay.module.css';

type OverlayProps = {
  isVisible: boolean;
  className?: string;
  onClick?: (
    event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>,
  ) => void;
};

export const Overlay: FC<OverlayProps> = ({
  isVisible,
  className,
  onClick,
}) => {
  if (!isVisible) return null;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(event);
    }
  };

  return (
    <div
      className={clsx(styles.overlay, className)}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    />
  );
};
