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
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const DDF = forwardRef(({ data, label = "" }: any, ref: any) => {
  if (!data) return;

  const isDropdown =
    typeof Object.values(data)[0] == "object" &&
    !Array.isArray(Object.values(data)[0]);

  const [values, setValues] = useState<Record<string, any>>({});
  const formRef: any = useRef();

  // useEffect(() => {
  //   if (isDropdown)setValues({ [label]: Object.keys(data)[0] })
  // }, [data,label]);
  function handleSubmit() {
    const formData = formRef?.current?.values();
    if (isDropdown) return { [values[label]]: formData };
    return { ...values, [label]: formData };
  }

  useImperativeHandle(ref, () => ({
    values: handleSubmit,
    // reset:reset
  }));

  if (isDropdown) {
    return (
      <>
        <div className="flex items-center justify-between gap-x-5">
          <Label className="w-2/6 text-md dark:text-white capitalize">
            {label} :
          </Label>
          <Select
            value={values[label]}
            onValueChange={(val) =>
              setValues((prev) => ({ ...values, [label]: val }))
            }
          >
            <SelectTrigger className="w-4/6 dark:bg-gray-300 dark:text-white capitalize">
              <SelectValue placeholder="select value...." />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(data).map((item: string) => (
                <SelectItem value={item} key={item} className="capitalize">
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DDF data={data[values[label]]} label={values[label]} ref={formRef} />
      </>
    );
  }
  // else return
  else {
    return (
      <>
        {Object.keys(data).map((key: string) => {
          const field = data[key];
          if (typeof field === "string")
            return (
              <div
                key={key}
                className="flex items-center justify-between gap-x-5"
              >
                <Label className="w-2/6 text-md dark:text-white capitalize">
                  {key} :
                </Label>
                <Input
                  className="w-4/6 dark:bg-gray-300 dark:text-white"
                  name={key}
                  placeholder="Enter value"
                  value={values[key] || ""}
                  onChange={(e) =>
                    setValues((prev) => ({ ...values, [key]: e.target.value }))
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
                <Label className="w-2/6 text-md dark:text-white capitalize">
                  {key} :
                </Label>
                <Select
                  name={key}
                  onValueChange={(val) =>
                    setValues((prev) => ({ ...values, [key]: val }))
                  }
                >
                  <SelectTrigger className="w-4/6 dark:bg-gray-300 dark:text-white capitalize">
                    <SelectValue placeholder={field[0]} />
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

          if (typeof field === "object" && !Array.isArray(field))
            return <DDF data={field} label={key} ref={formRef} />;

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
});

export default DDF;
