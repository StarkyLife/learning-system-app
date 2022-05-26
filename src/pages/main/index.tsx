import { Box, Button, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../shared/routes";

export const MainPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartClick = useCallback(() => {
    navigate(ROUTES.notes);
  }, [navigate]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box textAlign="center">
        <Typography variant="h1">StarkyNotes</Typography>
        <Typography variant="h6" pb={1}>
          Simple note-taking app. Enjoy!
        </Typography>
        <Button
          variant="text"
          endIcon={<ArrowForwardIosIcon />}
          onClick={handleStartClick}
        >
          Start
        </Button>
      </Box>
    </Box>
  );
};
