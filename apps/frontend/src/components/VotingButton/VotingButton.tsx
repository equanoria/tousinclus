import type { ETeam } from '@tousinclus/types';
import clsx from 'clsx';
import styles from './VotingButton.module.css';

type VotingButtonProps = {
  className?: string;
  name: string;
  value: ETeam;
  checked: boolean;
  onChange: () => void;
};

export const VotingButton: React.FC<VotingButtonProps> = ({
  className,
  name,
  value,
  checked,
  onChange,
}) => {
  const classes = clsx(styles.votingBtn, className);
  return (
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className={classes}
    />
  );
};
