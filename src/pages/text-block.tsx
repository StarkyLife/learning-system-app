import { Typography } from "@mui/material";
import { BlockBase } from "./base-block";

type Props = {
  text: string;
};

export const TextBlock: React.FC<Props> = ({ text }) => (
  <BlockBase>
    <Typography variant="h6">{text}</Typography>
    <Typography>Hidden content</Typography>
  </BlockBase>
);
