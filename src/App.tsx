import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import Home from "./pages/Home";
import FormBuilder from "./pages/formBuilder";
import Preview from "./pages/Preview";
import MyForms from "./pages/MyForms";
import { lightTheme, darkTheme } from "./theme";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <AppBar position="fixed">
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              bgcolor: "primary.main",
            }}
          >
            {/* Left side nav links */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                component={Link}
                to="/create"
                color="inherit"
                sx={{ textTransform: "none" }}
              >
                Form Builder
              </Button>
              <Button
                component={Link}
                to="/preview"
                color="inherit"
                sx={{ textTransform: "none" }}
              >
                Preview
              </Button>

              <Button
                component={Link}
                to="/myforms"
                color="inherit"
                sx={{ textTransform: "none" }}
              >
                My Forms
              </Button>
            </Box>

            {/* Right side theme toggle */}
            <IconButton color="inherit" onClick={handleToggleTheme}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Add padding top so content is below AppBar */}
        <Box sx={{ pt: 8, px: 2 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<FormBuilder />} />
            <Route path="/preview" element={<Preview />} />
            <Route path="/preview/:idx" element={<Preview />} />
            <Route path="/myforms" element={<MyForms />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}
