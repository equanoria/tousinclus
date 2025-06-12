import { IconInfoCircle } from "@tabler/icons-react";
import { Button } from "../components/Button/Button";
import type { ReactNode } from "react";

export const GameHeader = ({ children }: { children: ReactNode }) => {
  return (
    <header>
      {children}
      <Button startIcon={<IconInfoCircle />}>Aide</Button>
    </header>
  );
};