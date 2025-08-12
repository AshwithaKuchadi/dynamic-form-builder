// src/pages/MyForms.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function MyForms() {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedFormsJSON = localStorage.getItem("savedForms");
    if (savedFormsJSON) {
      setForms(JSON.parse(savedFormsJSON));
    }
  }, []);

  if (forms.length === 0)
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">My Forms</Typography>
        <Typography>No saved forms found.</Typography>
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        My Forms
      </Typography>
      <List>
        {forms.map((form, idx) => (
          <React.Fragment key={idx}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate(`/preview/${idx}`)}>
                <ListItemText
                  primary={form.name}
                  secondary={`Created on: ${new Date(
                    form.createdAt
                  ).toLocaleString()}`}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}
