"use client";
import { TextField } from "@/components/mf/forms/TextField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ChangePasswordErrorType, useChangePassword } from "@/queries";
import { Formik, FormikHelpers } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const schema = Yup.object().shape({
  current_password: Yup.string().required("Required"),
  new_password: Yup.string()
    .min(8, "Too short")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at number")
    .matches(
      /[!@#%^*(),.":|]/,
      'Password must contain at least one special character (!@#%^*(),.":|])',
    )
    .required("Required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("new_password"), ""], "Passwords must match")
    .required("Required"),
});

export const ChangePassword = () => {
  const [initialValues, setinitialValues] = useState({});
  useEffect(() => {
    setinitialValues({
      current_password: "",
      new_password: "",
      confirm_password: "",
      access_token:
        typeof window === "object"
          ? (sessionStorage.getItem("AccessToken") ?? "")
          : "",
    });
  }, []);
  const onChangePasswordSuccess = (d: unknown) => {
    if (
      typeof d === "object" &&
      d !== null &&
      "data" in d &&
      typeof d.data === "object" &&
      d.data !== null &&
      "message" in d.data &&
      typeof d.data.message === "string"
    ) {
      toast({ title: (d as { data: { message: string } }).data.message });
    } else {
      console.error("Invalid response structure");
    }
  };

  const onChangePasswordError = (e: ChangePasswordErrorType) =>
    toast({ title: e.message, variant: "destructive" });

  const ChangePassword = useChangePassword(
    onChangePasswordError,
    onChangePasswordSuccess,
  );

  const handleSubmit = (
    d: typeof initialValues,
    { resetForm }: FormikHelpers<typeof initialValues>,
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirm_password: k, ...body } = d;
    ChangePassword.mutate({ body });
    resetForm();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, handleSubmit, errors }) => (
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
              <div>
                <TextField
                  label="Current Password"
                  placeholder="Current Password"
                  name="current_password"
                  error={errors.current_password}
                  onChange={(e) => setFieldValue("current_password", e)}
                />
              </div>
              <div>
                <TextField
                  label="New Password"
                  placeholder="New Password"
                  name="new_password"
                  type="password"
                  error={errors.new_password}
                  onChange={(e) => setFieldValue("new_password", e)}
                />
              </div>
              <div>
                <TextField
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  name="confirm_password"
                  type="password"
                  error={errors.confirm_password}
                  onChange={(e) => setFieldValue("confirm_password", e)}
                />
              </div>
              <Button className="ml-auto w-fit">Change Password</Button>
            </form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};
