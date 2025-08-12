import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date";

interface ValidationRules {
  notEmpty?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  passwordRule?: boolean;
}

interface DerivedConfig {
  parentIds?: string[];
  formula?: string;
}

interface Field {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: string;
  validation?: ValidationRules;
  isDerived?: boolean;
  derivedConfig?: DerivedConfig;
}

interface FormBuilderState {
  fields: Field[];
}

const initialState: FormBuilderState = {
  fields: [],
};

const formBuilderSlice = createSlice({
  name: "formBuilder",
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<{ type: FieldType }>) => {
      state.fields.push({
        id: uuidv4(),
        type: action.payload.type,
        label: "New Field",
        required: false,
        defaultValue: "",
        validation: {},
      });
    },
    updateFieldLabel: (
      state,
      action: PayloadAction<{ id: string; label: string }>
    ) => {
      const field = state.fields.find((f) => f.id === action.payload.id);
      if (field) {
        field.label = action.payload.label;
      }
    },
    toggleRequired: (state, action: PayloadAction<{ id: string }>) => {
      const field = state.fields.find((f) => f.id === action.payload.id);
      if (field) {
        field.required = !field.required;
      }
    },
    updateDefaultValue: (
      state,
      action: PayloadAction<{ id: string; defaultValue: string }>
    ) => {
      const field = state.fields.find((f) => f.id === action.payload.id);
      if (field) {
        field.defaultValue = action.payload.defaultValue;
      }
    },
    updateValidation: (
      state,
      action: PayloadAction<{ id: string; validation: ValidationRules }>
    ) => {
      const field = state.fields.find((f) => f.id === action.payload.id);
      if (field) {
        field.validation = {
          ...field.validation,
          ...action.payload.validation,
        };
      }
    },
    deleteField: (state, action: PayloadAction<{ id: string }>) => {
      state.fields = state.fields.filter((f) => f.id !== action.payload.id);
    },
    reorderFields: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.fields.length ||
        toIndex >= state.fields.length
      )
        return;

      const [movedField] = state.fields.splice(fromIndex, 1);
      state.fields.splice(toIndex, 0, movedField);
    },
    setDerivedConfig: (
      state,
      action: PayloadAction<{ id: string; config?: DerivedConfig }>
    ) => {
      const field = state.fields.find((f) => f.id === action.payload.id);
      if (field) {
        if (action.payload.config) {
          field.isDerived = true;
          field.derivedConfig = action.payload.config;
        } else {
          field.isDerived = false;
          field.derivedConfig = undefined;
        }
      }
    },
    // ✅ Reset form to initial state after saving
    resetForm: (state) => {
      state.fields = [];
    },
  },
});

export const {
  addField,
  updateFieldLabel,
  toggleRequired,
  updateDefaultValue,
  updateValidation,
  deleteField,
  reorderFields,
  setDerivedConfig,
  resetForm,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;
