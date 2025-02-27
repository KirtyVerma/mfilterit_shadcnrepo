import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

type DataFromat =
  | {
      type: "dropdown";
      values?: string[];
    }
  | {
      type: "input" | "switch";
    };
type Props = {
  data: DataFromat[];
};

const DynamicInputForm = forwardRef(({ data }: Props, ref: any) => {
  const [values, setValues] = useState<Record<string, any>>({});
  useEffect(() => {
    setValues(
      Object.keys(data).reduce(
        (acc, key: any) => {
          if (data[key].type === "dropdown") acc[key] = data[key]?.values?.[0];
          else if (data[key].type === "switch") acc[key] = false;
          else acc[key] = "";
          return acc;
        },
        {} as Record<string, any>
      )
    );
  }, [data]);

  function handleSubmit() {
    return values; // Call the callback function with form data
  }
  useImperativeHandle(ref, () => ({
    values: handleSubmit,
  }));

  return (
    <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
      {Object.keys(data).map((key: any) => {
        const field = data[key];

        if (field.type === "input")
          return (
            <div
              key={key}
              className="flex items-center justify-between gap-x-5"
            >
              <Label className="w-2/6">{key} :</Label>
              <Input
                className="w-4/6"
                name={key}
                placeholder="Enter value"
                value={values[key] || ""}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [key]: e.target.value }))
                }
              />
            </div>
          );

        if (field.type === "dropdown")
          return (
            <div
              key={key}
              className="flex items-center justify-between gap-x-5"
            >
              <Label className="w-2/6">{key} :</Label>
              <Select
                name={key}
                value={values[key]}
                onValueChange={(val) =>
                  setValues((prev) => ({ ...prev, [key]: val }))
                }
              >
                <SelectTrigger className="w-4/6 capitalize">
                  <SelectValue placeholder={values[key]} />
                </SelectTrigger>
                <SelectContent>
                  {field.values &&
                    field?.values.map((item: string) => (
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

        if (field.type === "switch")
          return (
            <div key={key} className="flex items-center  gap-x-5">
              <Label className="w-2/6">{key} :</Label>
              <Switch
                name={key}
                checked={values[key]}
                onCheckedChange={() =>
                  setValues((prev) => ({ ...prev, [key]: !values[key] }))
                }
                aria-readonly
              />
              {/* <RadioGroup
                name={key}
                value={values[key]}
                onValueChange={(val) =>
                  setValues((prev) => ({ ...prev, [key]: val }))
                }
                className="flex gap-x-5"
              >
                {field.values.map((item: string) => (
                  <div key={item} className="flex items-center gap-x-2">
                    <RadioGroupItem value={item} id={item} />
                    <Label htmlFor={item}>{item}</Label>
                  </div>
                ))}
              </RadioGroup> */}
            </div>
          );

        return null;
      })}
      {/* <Button type="submit" className="w-full mt-8">
          Save
        </Button> */}
    </form>
  );
});

export default DynamicInputForm;
