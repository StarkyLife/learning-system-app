import { Typography } from "@mui/material";
import { BlockBase } from "./base-block";

type Props = {
  text: string;
};

export const CategoryBlock: React.FC<Props> = ({ text }) => (
  <BlockBase>
    <Typography variant="h6">{text}</Typography>
  </BlockBase>
);
