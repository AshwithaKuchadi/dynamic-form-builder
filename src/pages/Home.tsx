import React from "react";
import { Box, Typography } from "@mui/material";
import { pink } from "@mui/material/colors";

export default function Home() {
  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)", // full viewport height minus navbar height (64px)
        pt: "64px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 2,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // purple gradient background
        color: "white",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        fontWeight="bold"
        sx={{
          textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
          mb: 2,
          letterSpacing: "0.1em",
        }}
      >
        Welcome to
      </Typography>

      <Typography
        variant="h1"
        component="h1"
        sx={{
          background: "linear-gradient(45deg, #f3ec78, #af4261)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: 900,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          mb: 1,
        }}
      >
        Dynamic Form Builder
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
          opacity: 0.85,
          fontStyle: "italic",
          maxWidth: 400,
          color: "blue",
        }}
      >
        Build and preview forms with ease — a simple and intuitive tool for all
        your dynamic form needs.
      </Typography>
    </Box>
  );
}
