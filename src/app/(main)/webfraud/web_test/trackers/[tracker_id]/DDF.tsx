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
  useRef,
  useState,
} from "react";

const DDF = React.memo(
  forwardRef(({ data, label, p = {}, cb }: any, ref: any) => {
    if (!data) return;
    // whenever change occures trigger a call back

    const isDropdown = Object.values(data).every(
      (value) =>
        typeof value === "object" && !Array.isArray(value) && value !== null
    );

    const [values, setValues] = useState<Record<string, any>>({ ...p[label] });
    const formRef: any = useRef();

    function getValues() {
      const formData = formRef?.current?.values();
      if (isDropdown) {
        console.log(
          label,
          "drop down values ====>",
          label,
          values[label],
          values
        );
        return { [label]: values };
      }
      return { ...values, ...formData };
    }

    // function saveCurrentValues(val: any) {
    //   setValues((prev) => ({ ...prev, [values[label]]: val }));
    // }
    const saveCurrentValues = useCallback(
      (val: any) => {
        setValues((prev) => ({ ...prev, [values[label]]: val }));
      },
      [values, label]
    );
    // function savePreviousValues(val: any) {
    //   setValues((prev) => {
    //     let result: any = { ...prev, [label]: val };
    //     const formData = formRef?.current?.values();
    //     if (prev[label] && formData) result[prev[label]] = formData;
    //     return result;
    //   })
    // }
    const savePreviousValues = useCallback(
      (val: any) => {
        setValues((prev) => {
          let result: any = { ...prev, [label]: val };
          const formData = formRef?.current?.values();
          if (prev[label] && formData) result[prev[label]] = formData;
          return result;
        });
      },
      [values, label]
    );

    useImperativeHandle(ref, () => ({
      values: getValues,
    }));

    useEffect(() => {
      console.log("trigger save");
      cb && cb(values);
    }, [values]);

    if (isDropdown) {
      return (
        <div key={label + values[label]} className="flex flex-col gap-y-4">
          <div className="flex items-center justify-between gap-x-5">
            <Label className="w-2/6 text-md dark:text-white capitalize">
              {label} :
            </Label>
            <Select value={values[label]} onValueChange={savePreviousValues}>
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
          <DDF
            data={data[values[label]]}
            p={values}
            label={values[label]}
            ref={formRef}
            cb={saveCurrentValues}
          />
        </div>
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
                      setValues((prev) => ({
                        ...values,
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
              return (
                <DDF
                  key={label}
                  data={field}
                  label={key}
                  p={values}
                  ref={formRef}
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
  }),
  (prevProps, nextProps) => {
    // Avoid re-rendering if props are the same
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
  }
);
export default DDF;
