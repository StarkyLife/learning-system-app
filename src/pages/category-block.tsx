import { InputBase } from "@mui/material";
import { BlockBase } from "./base-block";

type Props = {
  text: string;
};

export const CategoryBlock: React.FC<Props> = ({ text }) => (
  <BlockBase>
    <InputBase fullWidth defaultValue={text} multiline />
  </BlockBase>
);
