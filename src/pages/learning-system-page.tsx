import { Container, Stack } from "@mui/material";
import { CategoryBlock } from "./category-block";
import { TextBlock } from "./text-block";

const blocksMocks = [
  { id: "categoryId-1", type: "category", text: "В чем смысл жизни?" },
  { id: "textBlockId-1", type: "text", text: "Шёл я как-то домой..." },
];

export const LearningSystemPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Stack spacing={2}>
        {blocksMocks.map((block) =>
          block.type === "category" ? (
            <CategoryBlock key={block.id} text={block.text} />
          ) : (
            <TextBlock key={block.id} text={block.text} />
          )
        )}
      </Stack>
    </Container>
  );
};
