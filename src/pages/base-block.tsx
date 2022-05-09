import { Paper } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

export const BlockBase: React.FC<Props> = ({ children }) => (
  <Paper variant="outlined">{children}</Paper>
);
