import { InputBase, Typography } from "@mui/material";
import { BlockBase } from "./base-block";

type Props = {
  title: string;
};

export const TextBlock: React.FC<Props> = ({ title }) => (
  <BlockBase>
    <InputBase fullWidth defaultValue={title} multiline />
    <Typography>Hidden content</Typography>
  </BlockBase>
);
