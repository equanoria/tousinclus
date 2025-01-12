import React from 'react';
import classes from './Button.module.css';
import clsx from 'clsx';

interface ButtonProps {
  type: 'link' | 'button';
  content: string;
  variant?: 'normal' | 'danger' | 'positive' | 'outlined';
  state?: 'normal' | 'disabled';
  href?: string;
  target?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ type, content, variant = 'normal', state = 'normal', href, onClick, target }) => {
  const buttonClassName = clsx(
    classes.button,
    classes[variant],
    state === 'disabled' ? classes.disabled : null
  );

  switch (type) {
    case 'button':
      return (
        <button
          type="button"
          className={buttonClassName}
          onClick={state === 'disabled' ? undefined : onClick}
          disabled={state === 'disabled'}
        >
          {content}
        </button>
      );
    default:
      return (
        <a
          href={href}
          className={buttonClassName}
          target={target || undefined}
        >
          {content}
        </a>
      );
  };
};

export default Button;
