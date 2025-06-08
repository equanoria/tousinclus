import { type ReactNode, useEffect } from 'react';
import styles from './Decoration.module.css';

export const Decoration = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    document.body.classList.add(styles.decoratedBody);

    return () => {
      document.body.classList.remove(styles.decoratedBody);
    };
  }, []);

  return children;
};
