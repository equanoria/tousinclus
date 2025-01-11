import React from 'react';
import classes from './Button.module.css';
import clsx from 'clsx';

interface ButtonProps {
  type: 'link' | 'button';
  content: string;
  href?: string;
  onClick?: () => void;
  variant?: 'normal' | 'disabled' | 'danger' | 'positive';
}

const Button: React.FC<ButtonProps> = ({ type, content, href, onClick, variant = 'normal' }) => {
  const buttonClassName = clsx(classes.button, classes[variant]);

  switch (type) {
    case 'button':
      return (
        <button type="button" className={buttonClassName} onClick={onClick}>
          {content}
        </button>
      );
      break;
    default:
      return (
        <a href={href} className={buttonClassName}>
          {content}
        </a>
      );
  };
};

export default Button;
