import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

type Props = {
  schema: Record<string, any>;
  label: string;
  defaultValues?: Record<string, any>;
  formValues?: Record<string, any>;
  cb?: Function;
};

const DynamicInputForm = React.memo(
  forwardRef(
    (
      { schema, defaultValues = {}, label, formValues = {}, cb }: Props,
      ref: any
    ) => {
      const isDropdown = Object.values(schema).every(
        (value) =>
          typeof value === "object" && !Array.isArray(value) && value !== null
      );
      const [dropdown, setdropdown] = useState<Record<string, any>>({});
      const [values, setValues] = useState<Record<string, any>>({
        ...defaultValues,
        ...formValues[label],
      });
      const fieldType = (type: string) => {
        if (type === "str") return "text";
        if (["int", "float"].includes(type)) return "number";
      };

      const saveCurrentValues = useCallback(
        (val: any, subLabel: any) => {
          const newValues = { [subLabel ? subLabel : dropdown[label]]: val };
          setValues((prev) => {
            return { ...prev, ...newValues };
          });
        },
        [values, dropdown, label]
      );

      useEffect(() => {
        cb && cb(values, isDropdown ? label : null);
      }, [values]);

      useImperativeHandle(ref, () => ({
        values: values,
        reset: () => {
          console.log("object");
          setValues({ ...defaultValues });
          setdropdown({});
        },
      }));

      if (isDropdown) {
        return (
          <div key={label + dropdown[label]} className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between gap-x-5">
              <Label className="w-4/6 text-md dark:text-white capitalize">
                {label} :
              </Label>
              <Select
                value={dropdown?.[label]}
                onValueChange={(val) => {
                  setdropdown((prev) => ({ ...prev, [label]: val }));
                }}
              >
                <SelectTrigger className="w-full dark:bg-gray-300 dark:text-white capitalize">
                  <SelectValue placeholder="select value...." />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(schema).map((item: string) => (
                    <SelectItem value={item} key={item} className="capitalize">
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {dropdown?.[label] && (
              <DynamicInputForm
                schema={schema[dropdown[label]]}
                formValues={values}
                label={dropdown[label]}
                cb={saveCurrentValues}
              />
            )}
          </div>
        );
      } else {
        return (
          <>
            {Object.keys(schema).map((key: string) => {
              const field = schema[key];
              if (field === "bool")
                return (
                  <div key={key} className="flex items-center   gap-x-5">
                    <Label className="w-4/6 text-md dark:text-white capitalize">
                      {key} :
                    </Label>
                    <div className="w-full">
                      <Switch
                        name={key}
                        checked={values[key]}
                        onCheckedChange={() =>
                          setValues((prev) => ({
                            ...prev,
                            [key]: !values[key],
                          }))
                        }
                        aria-readonly
                      />
                    </div>
                  </div>
                );
              if (typeof field === "string")
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-x-5"
                  >
                    <Label className="w-4/6 text-md dark:text-white capitalize">
                      {key} :
                    </Label>
                    <Input
                      className="w-full dark:bg-gray-300 dark:text-white"
                      name={key}
                      type={fieldType(schema[key])}
                      placeholder="Enter value"
                      value={values[key] || ""}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                    />
                  </div>
                );

              if (Array.isArray(field))
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-x-5"
                  >
                    <Label className="w-4/6 text-md dark:text-white capitalize">
                      {key} :
                    </Label>
                    <Select
                      name={key}
                      value={values[key]}
                      onValueChange={(val) =>
                        setValues((prev) => ({ ...prev, [key]: val }))
                      }
                    >
                      <SelectTrigger className="w-full dark:bg-gray-300 dark:text-white capitalize">
                        <SelectValue placeholder="enter value" />
                      </SelectTrigger>
                      <SelectContent>
                        {field?.map((item: string) => (
                          <SelectItem
                            value={item}
                            key={item}
                            className="capitalize"
                          >
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );

              if (
                typeof field === "object" &&
                !Array.isArray(field) &&
                dropdown
              )
                return (
                  <DynamicInputForm
                    key={label}
                    schema={field}
                    label={key}
                    formValues={values}
                    cb={saveCurrentValues}
                  />
                );

              // if (field.type === "switch")
              //   return (
              //     <div key={key} className="flex items-center  gap-x-5">
              //       <Label className="w-2/6 text-md dark:text-white capitalize">
              //         {key} :
              //       </Label>
              //       <Switch
              //         name={key}
              //         // checked={values[key]}
              //         // onCheckedChange={() =>
              //         //   setValues((prev) => ({ ...values, [key]: !values[key] }))
              //         // }
              //         aria-readonly
              //       />
              //     </div>
              //   );

              return null;
            })}
          </>
        );
      }
    }
  ),
  (prevProps, nextProps) => {
    // Avoid re-rendering if props are the same
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
  }
);
export default DynamicInputForm;
