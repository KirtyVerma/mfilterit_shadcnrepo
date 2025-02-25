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
import React, { useState } from "react";

type Props = {
  data: Record<string, any>;
  cb: Function;
};

const InputForm = ({ data,cb }: Props) => {
  const [values, setValues] = useState(() => {
    // Initialize state with default values
    return Object.keys(data).reduce(
      (acc, key) => {
        if (data[key].type !== "radio") acc[key] = data[key]?.values?.[0] || "";
        else acc[key] = data[key]?.values?.[0] || false;
        return acc;
      },
      {} as Record<string, any>
    );
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    cb(values); // Call the callback function with form data
  }

  return (
    <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
      {Object.keys(data).map((key) => {
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
                  {field?.values.map((item: string) => (
                    <SelectItem value={item} key={item} className="capitalize">
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );

        if (field.type === "switch")
          return (
            <div key={key} className="flex flex-col gap-y-2">
              <Label className="mb-1">{key} :</Label>
              <Switch
                name={key}
                  checked={values[key]}
                  onCheckedChange={()=>setValues((prev) => ({ ...prev, [key]: !values[key] }))}
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
      <Button type="submit" className="w-full">
        Save
      </Button>
    </form>
  );
};

export default InputForm;

{
  /* 
<div className="flex items-center justify-between gap-x-5">
        <Label className="w-2/6">Package Name :</Label>
        <Input
          className=" w-4/6"
          placeholder="Enter tracker name"
          value={"packageName"}
          disabled
        />
      </div>
      <div className="flex items-center justify-between gap-x-5">
        <Label className="w-2/6">Tracker Type :</Label>
        <Select>
          <SelectTrigger className="w-4/6 capitalize">
            <SelectValue placeholder="impression" />
          </SelectTrigger>
          <SelectContent>
            {["impression", "visit", "click", "event", "s2s"].map((Item, i) => (
              <SelectItem value={Item} key={i} className="capitalize">
                {Item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between gap-x-5">
        <Label className="w-2/6">Setting 1 : </Label>
        <Input className="  w-4/6" placeholder="Setting 1" />
      </div>
      <div className="flex items-center justify-between gap-x-5">
        <Label className="w-2/6">Setting 2 : </Label>
        <Input className=" w-4/6" placeholder="Setting 2" />
      </div>
      <div className="flex justify-end">
        <Button className="capitalize mt-2 mb-5">Generate Tracker</Button>
      </div>
    </div> */
}
