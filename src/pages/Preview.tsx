import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

// Define types for fields and forms
interface DerivedConfig {
  formula: string;
  parentIds: string[];
}

interface Field {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  validation?: {
    notEmpty?: boolean;
    minLength?: number;
    maxLength?: number;
    email?: boolean;
    passwordRule?: boolean;
  };
  defaultValue?: string | number | boolean;
  isDerived?: boolean;
  derivedConfig?: DerivedConfig;
}

interface Form {
  name: string;
  createdAt?: string;
  schema: Field[];
}

// Define possible field value types
type FieldValue = string | number | boolean | undefined;

// Validation helper function
function validateField(value: FieldValue, field: Field): string[] {
  const errors: string[] = [];
  const v = field.validation || {};
  if (v.notEmpty && (!value || value === "")) {
    errors.push("This field is required");
  }
  if (v.minLength && typeof value === "string" && value.length < v.minLength) {
    errors.push(`Minimum length is ${v.minLength}`);
  }
  if (v.maxLength && typeof value === "string" && value.length > v.maxLength) {
    errors.push(`Maximum length is ${v.maxLength}`);
  }
  if (v.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value as string)) {
      errors.push("Invalid email format");
    }
  }
  if (v.passwordRule) {
    const pwRegex = /^(?=.*[0-9]).{8,}$/;
    if (!pwRegex.test(value as string)) {
      errors.push("Password must be min 8 chars and contain a number");
    }
  }
  return errors;
}

function isValidDate(val: unknown): boolean {
  if (!val) return false;
  const d = new Date(val as string);
  return !isNaN(d.getTime());
}

function isValidNumber(val: unknown): boolean {
  return !isNaN(Number(val));
}

function evaluateFormula(
  formula: string,
  parentValues: Record<string, FieldValue>
): FieldValue {
  try {
    let evalStr = formula;
    for (const [key, val] of Object.entries(parentValues)) {
      const safeVal = typeof val === "string" ? `"${val}"` : val;
      const re = new RegExp(`\\b${key}\\b`, "g");
      evalStr = evalStr.replace(re, String(safeVal));
    }
    // eslint-disable-next-line no-eval
    const result = eval(evalStr);
    if (
      result === undefined ||
      result === null ||
      (typeof result === "number" && Number.isNaN(result))
    ) {
      return "";
    }
    return result;
  } catch {
    return "";
  }
}

export default function Preview() {
  const { idx } = useParams<{ idx: string }>();
  const navigate = useNavigate();

  const [savedForms, setSavedForms] = useState<Form[]>([]);
  const [selectedFormIndex, setSelectedFormIndex] = useState<number>(-1);
  const [values, setValues] = useState<Record<string, FieldValue>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const savedFormsJSON = localStorage.getItem("savedForms");
    if (savedFormsJSON) {
      const forms: Form[] = JSON.parse(savedFormsJSON);
      setSavedForms(forms);

      if (idx !== undefined && !isNaN(Number(idx))) {
        setSelectedFormIndex(Number(idx));
      } else {
        setSelectedFormIndex(0);
      }
      setValues({});
      setErrors({});
    }
  }, [idx]);

  const form = savedForms[selectedFormIndex];

  const handleFormChange = (newIndex: number) => {
    setSelectedFormIndex(newIndex);
    setValues({});
    setErrors({});
    navigate(`/preview/${newIndex}`);
  };

  const handleChange = (field: Field, val: FieldValue) => {
    if (!form) return;

    const newValues: Record<string, FieldValue> = {
      ...values,
      [field.id]: val,
    };

    // Recalculate derived fields if any
    form.schema.forEach((f) => {
      if (f.isDerived && f.derivedConfig) {
        const parentValues: Record<string, FieldValue> = {};
        f.derivedConfig.parentIds.forEach((pid) => {
          parentValues[pid] = newValues[pid];
        });
        const derivedVal = evaluateFormula(
          f.derivedConfig.formula,
          parentValues
        );
        newValues[f.id] = derivedVal;
      }
    });

    setValues(newValues);

    const fieldErrors = validateField(val, field);
    setErrors((prev) => ({ ...prev, [field.id]: fieldErrors }));
  };

  if (savedForms.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No saved forms to preview.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Preview Form
      </Typography>

      {/* Dropdown to select form */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="form-select-label">Select Form</InputLabel>
        <Select
          labelId="form-select-label"
          value={selectedFormIndex}
          label="Select Form"
          onChange={(e) => handleFormChange(Number(e.target.value))}
        >
          {savedForms.map((f, idx) => (
            <MenuItem key={idx} value={idx}>
              {f.name} — {f.createdAt || "No date"}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {form && form.schema && (
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {form.schema.map((field) => {
            const rawValue = values[field.id] ?? field.defaultValue ?? "";
            const fieldValue =
              field.type === "date"
                ? isValidDate(rawValue)
                  ? rawValue
                  : ""
                : field.type === "number"
                ? isValidNumber(rawValue)
                  ? rawValue
                  : ""
                : rawValue;

            const fieldErrors = errors[field.id] ?? [];
            const isDerived = field.isDerived === true;

            switch (field.type) {
              case "text":
              case "number":
              case "date":
                return (
                  <TextField
                    key={field.id}
                    label={field.label}
                    type={field.type}
                    required={field.required}
                    value={fieldValue}
                    onChange={(e) =>
                      !isDerived && handleChange(field, e.target.value)
                    }
                    error={fieldErrors.length > 0}
                    helperText={fieldErrors.join(", ")}
                    disabled={isDerived}
                    fullWidth
                  />
                );

              case "textarea":
                return (
                  <TextField
                    key={field.id}
                    label={field.label}
                    multiline
                    rows={4}
                    required={field.required}
                    value={fieldValue}
                    onChange={(e) =>
                      !isDerived && handleChange(field, e.target.value)
                    }
                    error={fieldErrors.length > 0}
                    helperText={fieldErrors.join(", ")}
                    disabled={isDerived}
                    fullWidth
                  />
                );

              case "checkbox":
                return (
                  <FormControlLabel
                    key={field.id}
                    control={
                      <Checkbox
                        checked={Boolean(fieldValue)}
                        onChange={(e) =>
                          !isDerived && handleChange(field, e.target.checked)
                        }
                        disabled={isDerived}
                      />
                    }
                    label={field.label + (field.required ? " *" : "")}
                  />
                );

              case "radio":
                return (
                  <FormControl
                    key={field.id}
                    component="fieldset"
                    error={fieldErrors.length > 0}
                  >
                    <Typography>{field.label}</Typography>
                    <RadioGroup
                      value={fieldValue}
                      onChange={(e) =>
                        !isDerived && handleChange(field, e.target.value)
                      }
                    >
                      <FormControlLabel
                        value="option1"
                        control={<Radio />}
                        label="Option 1"
                      />
                      <FormControlLabel
                        value="option2"
                        control={<Radio />}
                        label="Option 2"
                      />
                    </RadioGroup>
                    {fieldErrors.length > 0 && (
                      <Typography color="error" variant="caption">
                        {fieldErrors.join(", ")}
                      </Typography>
                    )}
                  </FormControl>
                );

              case "select":
                return (
                  <FormControl
                    key={field.id}
                    fullWidth
                    required={field.required}
                    error={fieldErrors.length > 0}
                  >
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      value={fieldValue}
                      label={field.label}
                      onChange={(e) =>
                        !isDerived && handleChange(field, e.target.value)
                      }
                      disabled={isDerived}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="option1">Option 1</MenuItem>
                      <MenuItem value="option2">Option 2</MenuItem>
                    </Select>
                    {fieldErrors.length > 0 && (
                      <Typography color="error" variant="caption">
                        {fieldErrors.join(", ")}
                      </Typography>
                    )}
                  </FormControl>
                );

              default:
                return null;
            }
          })}

          <Button
            variant="contained"
            onClick={() => {
              const newErrors: Record<string, string[]> = {};
              form.schema.forEach((field) => {
                const fieldValue = values[field.id];
                const errs = validateField(fieldValue, field);
                if (errs.length) newErrors[field.id] = errs;
              });

              setErrors(newErrors);

              if (Object.keys(newErrors).length === 0) {
                alert("Form submitted successfully!");
              } else {
                alert("Please fix validation errors.");
              }
            }}
          >
            Submit
          </Button>
        </Box>
      )}
    </Box>
  );
}
