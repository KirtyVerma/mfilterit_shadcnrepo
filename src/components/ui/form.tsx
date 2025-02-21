import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import * as Yup from "yup";
import { cva } from "class-variance-authority";
import { Button } from "./button";

type FormFieldType =
  | {
    label: string;
    name: string;
    type: "text" | "email" | "password" | "textarea";
    placeholder: string;
    required: boolean;
    options?: never;
  }
  | {
    label: string;
    name: string;
    type: "select";
    options: string[];
    required: boolean;
    placeholder?: never;
  }
  | {
    label: string;
    name: string;
    type: "radio";
    options: string[];
    required: boolean;
    placeholder?: never;
  }
  | {
    label: string;
    name: string;
    type: "checkbox";
    required: boolean;
    placeholder?: never;
    options?: never;
  }
  | {
    label: string;
    name: string;
    type: "file";
    required: boolean;
    placeholder?: never;
    options?: never;
  };

interface FormValues {
  [key: string]: string | boolean | File | null; // Types based on your form fields
}


interface DynamicFormProps {
  formConfig: FormFieldType[];
  onSubmit: (values: Record<string, any>) => void;
  showCancelButton?: boolean;
  showSaveButton?: boolean;
  onCancel?: () => void;
  saveButtonLabel?: string;
  cancelButtonLabel?: string;
}

const formStyles = cva("flex flex-col space-y-2", {
  variants: {
    label: {
      default: "text-sm font-medium mb-1",
    },
    input: {
      default: "border rounded-md p-2 w-full",
      select: "border rounded-md p-2 w-full bg-white",
      textarea: "border rounded-md p-2 w-full h-24",
      radio: "mr-1",
      checkbox: "mr-1",
      file: "rounded-md p-2 w-full bg-white-100",
    },
  },
});

const createValidationSchema = (formConfig: FormFieldType[]) => {
  const schemaFields: { [key: string]: any } = {};

  formConfig.forEach((field) => {
    schemaFields[field.name] = Yup.string().required(
      field.required ? `${field.label} is required` : "",
    );
  });

  return Yup.object().shape(schemaFields);
};

// Main dynamic form component
const DynamicForm: React.FC<DynamicFormProps> = ({
  formConfig,
  onSubmit,
  showCancelButton = false,
  showSaveButton = true,
  onCancel,
  saveButtonLabel = "Save",
  cancelButtonLabel = "Cancel",
}) => {
  const validationSchema = createValidationSchema(formConfig);

  return (
    <Formik
      initialValues={formConfig.reduce<FormValues>((acc, field) => {
        if (field.type === "checkbox") {
          acc[field.name] = false;
        } else if (field.type === "file") {
          acc[field.name] = null;
        } else {
          acc[field.name] = "";
        }
        return acc;
      }, {})}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ setFieldValue }: FormikProps) => (
        <Form className="space-y-6 p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {formConfig.map((field, index) => (
              <div key={index} className="flex flex-col">
                <label
                  htmlFor={field.name}
                  className={formStyles({ label: "default" })}
                >
                  {field.label}
                </label>

                {field.type === "textarea" && (
                  <Field
                    as="textarea"
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    className={formStyles({ input: "textarea" })}
                  />
                )}

                {field.type === "radio" &&
                  field.options?.map((option, idx) => (
                    <div key={idx} className="flex items-center">
                      <Field
                        type="radio"
                        name={field.name}
                        value={option}
                        required={field.required}
                        className={formStyles({ input: "radio" })}
                      />
                      <label htmlFor={`${field.name}-${option}`} className="ml-2">
                        {option}
                      </label>
                    </div>
                  ))}

                {field.type === "checkbox" ? (
                  <div className="flex items-center">
                    <Field
                      type="checkbox"
                      name={field.name}
                      className={formStyles({ input: "checkbox" })}
                    />
                    <label htmlFor={field.name} className="ml-2">
                      {field.label}
                    </label>
                  </div>
                ) : null}

                {field.type === "file" ? (
                  <input
                    type="file"
                    name={field.name}
                    onChange={(event) => {
                      const files = event?.currentTarget?.files;
                      if (files && files?.length > 0) {
                        setFieldValue(field.name, files[0]);
                      } else {
                        setFieldValue(field.name, null);
                      }
                    }}
                    required={field.required}
                    className={formStyles({ input: "file" })}
                  />
                ) : null}

                {field.type === "select" ? (
                  <Field
                    as="select"
                    name={field.name}
                    required={field.required}
                    className={formStyles({ input: "select" })}
                  >
                    <option value="" label="Select an option" />
                    {field.options?.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </Field>
                ) : null}

                {field.type !== "radio" &&
                  field.type !== "checkbox" &&
                  field.type !== "file" &&
                  field.type !== "select" &&
                  field.type !== "textarea" && (
                    <Field
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      className={formStyles({ input: "default" })}
                    />
                  )}


                <ErrorMessage
                  name={field.name}
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-4">
            {showCancelButton && (
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={onCancel}
              >
                {cancelButtonLabel}
              </Button>
            )}

            {showSaveButton && (
              <Button type="submit" variant="default" size="default">
                {saveButtonLabel}
              </Button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default DynamicForm;
