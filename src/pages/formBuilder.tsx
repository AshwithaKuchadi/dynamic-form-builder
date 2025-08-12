import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addField,
  updateFieldLabel,
  toggleRequired,
  updateDefaultValue,
  updateValidation,
  deleteField,
  reorderFields,
  setDerivedConfig,
} from "../features/formBuilderSlice";
import type { RootState, AppDispatch } from "../store";
import {
  Button,
  List,
  ListItem,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  IconButton,
  Chip,
  Grid,
  Divider,
  Paper,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { resetForm } from "../features/formBuilderSlice";

const fieldTypes = [
  "text",
  "number",
  "textarea",
  "select",
  "radio",
  "checkbox",
  "date",
] as const;

export default function FormBuilder() {
  const dispatch = useDispatch<AppDispatch>();
  const fields = useSelector((state: RootState) => state.formBuilder.fields);

  const handleSave = () => {
    const formName = window.prompt("Enter form name to save:");
    if (!formName) {
      alert("Form name is required!");
      return;
    }

    const savedFormsJSON = localStorage.getItem("savedForms");
    const savedForms = savedFormsJSON ? JSON.parse(savedFormsJSON) : [];

    savedForms.push({
      name: formName,
      createdAt: new Date().toISOString(),
      schema: fields, // <-- your current fields state
    });

    localStorage.setItem("savedForms", JSON.stringify(savedForms));
    alert("Form saved successfully!");

    dispatch(resetForm());
  };

  const [newFieldType, setNewFieldType] =
    useState<(typeof fieldTypes)[number]>("text");

  const showMinMaxLength = (type: string) =>
    type === "text" || type === "textarea";

  const moveField = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= fields.length) return;
    dispatch(reorderFields({ fromIndex: index, toIndex: newIndex }));
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 900, mx: "auto" }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{ fontWeight: "bold", textAlign: "center", mb: 4 }}
      >
        Dynamic Form Builder
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "center",
          mb: 4,
        }}
      >
        <FormControl sx={{ minWidth: 180, flexGrow: 1, maxWidth: 250 }}>
          <InputLabel id="field-type-label">Select Field Type</InputLabel>
          <Select
            labelId="field-type-label"
            value={newFieldType}
            label="Select Field Type"
            onChange={(e) =>
              setNewFieldType(e.target.value as (typeof fieldTypes)[number])
            }
            size="small"
          >
            {fieldTypes.map((ft) => (
              <MenuItem key={ft} value={ft}>
                {ft.charAt(0).toUpperCase() + ft.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          sx={{ minWidth: 140 }}
          onClick={() => dispatch(addField({ type: newFieldType }))}
        >
          Add Field
        </Button>
      </Box>

      {fields.length === 0 && (
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mt: 6 }}
        >
          No fields added yet. Start by selecting a field type above and
          clicking "Add Field".
        </Typography>
      )}

      <List sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {fields.map((field, index) => {
          const parentFieldOptions = fields.filter((f) => f.id !== field.id);
          return (
            <Paper
              key={field.id}
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                transition: "box-shadow 0.3s",
                "&:hover": { boxShadow: 8 },
              }}
            >
              <Grid container spacing={2} alignItems="center">
                {/* Field Label and Controls */}
                <Grid item xs={12} sm={5}>
                  <TextField
                    label="Field Label"
                    value={field.label}
                    size="small"
                    onChange={(e) =>
                      dispatch(
                        updateFieldLabel({
                          id: field.id,
                          label: e.target.value,
                        })
                      )
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={6} sm={2} sx={{ textTransform: "capitalize" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "medium", color: "text.secondary" }}
                  >
                    {field.type}
                  </Typography>
                </Grid>

                <Grid item xs={6} sm={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.required}
                        onChange={() =>
                          dispatch(toggleRequired({ id: field.id }))
                        }
                        color="primary"
                      />
                    }
                    label="Required"
                    labelPlacement="start"
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={3}
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                >
                  <IconButton
                    onClick={() => moveField(index, -1)}
                    disabled={index === 0}
                    size="small"
                    aria-label="Move field up"
                    color="primary"
                  >
                    <ArrowUpwardIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => moveField(index, 1)}
                    disabled={index === fields.length - 1}
                    size="small"
                    aria-label="Move field down"
                    color="primary"
                  >
                    <ArrowDownwardIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => dispatch(deleteField({ id: field.id }))}
                    size="small"
                    aria-label="Delete field"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>

                {/* Default Value */}
                <Grid item xs={12}>
                  <TextField
                    label="Default Value"
                    size="small"
                    fullWidth
                    value={field.defaultValue || ""}
                    onChange={(e) =>
                      dispatch(
                        updateDefaultValue({
                          id: field.id,
                          defaultValue: e.target.value,
                        })
                      )
                    }
                  />
                </Grid>

                {/* Validation Section */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Validation Rules
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.validation?.notEmpty || false}
                          onChange={(e) =>
                            dispatch(
                              updateValidation({
                                id: field.id,
                                validation: { notEmpty: e.target.checked },
                              })
                            )
                          }
                          color="primary"
                        />
                      }
                      label="Not Empty"
                    />

                    {showMinMaxLength(field.type) && (
                      <>
                        <TextField
                          label="Min Length"
                          type="number"
                          size="small"
                          sx={{ width: 110 }}
                          value={field.validation?.minLength ?? ""}
                          onChange={(e) =>
                            dispatch(
                              updateValidation({
                                id: field.id,
                                validation: {
                                  minLength: e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                                },
                              })
                            )
                          }
                        />

                        <TextField
                          label="Max Length"
                          type="number"
                          size="small"
                          sx={{ width: 110 }}
                          value={field.validation?.maxLength ?? ""}
                          onChange={(e) =>
                            dispatch(
                              updateValidation({
                                id: field.id,
                                validation: {
                                  maxLength: e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                                },
                              })
                            )
                          }
                        />
                      </>
                    )}

                    {field.type === "text" && (
                      <>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={field.validation?.email || false}
                              onChange={(e) =>
                                dispatch(
                                  updateValidation({
                                    id: field.id,
                                    validation: { email: e.target.checked },
                                  })
                                )
                              }
                              color="primary"
                            />
                          }
                          label="Email Format"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={field.validation?.passwordRule || false}
                              onChange={(e) =>
                                dispatch(
                                  updateValidation({
                                    id: field.id,
                                    validation: {
                                      passwordRule: e.target.checked,
                                    },
                                  })
                                )
                              }
                              color="primary"
                            />
                          }
                          label="Custom Password Rule"
                        />
                      </>
                    )}
                  </Box>
                </Grid>

                {/* Derived Field Section */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.isDerived || false}
                        onChange={(e) => {
                          if (e.target.checked) {
                            dispatch(
                              setDerivedConfig({
                                id: field.id,
                                config: { parentIds: [], formula: "" },
                              })
                            );
                          } else {
                            dispatch(
                              setDerivedConfig({
                                id: field.id,
                                config: undefined,
                              })
                            );
                          }
                        }}
                        color="secondary"
                      />
                    }
                    label="Is Derived Field"
                    sx={{ fontWeight: "bold" }}
                  />

                  {field.isDerived && field.derivedConfig && (
                    <>
                      <FormControl fullWidth sx={{ mt: 1 }}>
                        <InputLabel id={`parent-fields-label-${field.id}`}>
                          Parent Fields
                        </InputLabel>
                        <Select
                          labelId={`parent-fields-label-${field.id}`}
                          multiple
                          value={field.derivedConfig.parentIds}
                          onChange={(e) =>
                            dispatch(
                              setDerivedConfig({
                                id: field.id,
                                config: {
                                  ...field.derivedConfig,
                                  parentIds: e.target.value as string[],
                                },
                              })
                            )
                          }
                          renderValue={(selected) => (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                                mt: 0.5,
                              }}
                            >
                              {(selected as string[]).map((id) => {
                                const pf = fields.find((f) => f.id === id);
                                return (
                                  <Chip
                                    key={id}
                                    label={pf?.label || "Unknown"}
                                    size="small"
                                    color="secondary"
                                  />
                                );
                              })}
                            </Box>
                          )}
                        >
                          {parentFieldOptions.map((pf) => (
                            <MenuItem key={pf.id} value={pf.id}>
                              {pf.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <TextField
                        label="Formula"
                        multiline
                        minRows={3}
                        fullWidth
                        sx={{ mt: 1 }}
                        value={field.derivedConfig.formula}
                        onChange={(e) =>
                          dispatch(
                            setDerivedConfig({
                              id: field.id,
                              config: {
                                ...field.derivedConfig,
                                formula: e.target.value,
                              },
                            })
                          )
                        }
                        helperText="Define formula using parent fields"
                      />
                    </>
                  )}
                </Grid>
              </Grid>
            </Paper>
          );
        })}
      </List>

      <Box textAlign="center" mt={5}>
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={handleSave}
        >
          Save Form
        </Button>
      </Box>
    </Box>
  );
}
