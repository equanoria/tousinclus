import clsx from 'clsx';
import type React from 'react';
import { type ComponentPropsWithoutRef, useId } from 'react';
import { Checkbox } from '../Checkbox/Checkbox';
import styles from './InputCheckboxes.module.css';

export interface InputCheckboxesProps extends ComponentPropsWithoutRef<'div'> {
  label: string;
}

export const InputCheckboxes: React.FC<InputCheckboxesProps> = ({
  className,
  label,
}) => {
  const classes = clsx(styles.inputCheckboxes, className);
  const id = useId();

  return (
    <div className={classes}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.containerCheckboxes}>
        <Checkbox label={'Je suis sourd.e'} />
        <Checkbox label={'Je pèse 40kg/110kg'} />
        <Checkbox label={'Je suis hyperacoustique'} />
        <Checkbox label={'Pas de compte bancaire'} />
        <Checkbox label={'J’ai une phobie sociale'} />
      </div>
    </div>
  );
};
