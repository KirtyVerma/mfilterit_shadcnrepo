import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Loader2, AlertCircle, CheckCircle2, Copy } from "lucide-react";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface FormValues {
  creativeName: string;
  creativeUrl: string;
  height: string;
  width: string;
  files: FileMetadata[];
}

interface FileMetadata {
  file: File;
  name: string;
  size: string;
  width: number;
  height: number;
}

const initialValues: FormValues = {
  creativeName: "",
  creativeUrl: "",
  height: "",
  width: "",
  files: [],
};

const validationSchema = Yup.object().shape({
  creativeName: Yup.string().required("Creative Name is required"),
  creativeUrl: Yup.string().test(
    "file-or-url",
    "Either Creative URL or File is required",
    function (value) {
      const files = this.parent.files;
      return !!(value || (files && files.length > 0));
    }
  ),
  height: Yup.number()
    .required("Height is required")
    .positive("Height must be positive"),
  width: Yup.number()
    .required("Width is required")
    .positive("Width must be positive"),
  files: Yup.array().test(
    "file-or-url",
    "Either Creative URL or File is required",
    function (value) {
      const url = this.parent.creativeUrl;
      return !!(url || (value && value.length > 0));
    }
  ),
});

const UploadCreative = ({ handleNext }: { handleNext: (status: string) => void }) => {
  const { toast } = useToast();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<FileMetadata[]>([]);

  const handleDeleteFiles = (setFieldValue: (field: string, value: any) => void) => {
    if (files.length) {
      setFieldValue("files", []);
      setFieldValue("creativeName", "");
      setFieldValue("width", "");
      setFieldValue("height", "");
      setFiles([]);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const filesArray = Array.from(event.target.files || []);
    const selectedFiles = await Promise.all(
      filesArray.map((file) => {
        return new Promise<FileMetadata>((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onload = (e) => {
            const img = new Image();
            img.src = e.target?.result as string;

            img.onload = () => {
              resolve({
                file,
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(2),
                width: img.width,
                height: img.height,
              });
            };
          };
        });
      })
    );

    setFieldValue("files", selectedFiles);
    setFieldValue("creativeName", selectedFiles[0].name);
    setFieldValue("width", selectedFiles[0].width);
    setFieldValue("height", selectedFiles[0].height);
    setFiles(selectedFiles);
  };

  const handleSubmit = async (values: FormValues) => {
    setIsUploading(true);
    const package_name = localStorage.getItem("dpackage");
    const domain_name = localStorage.getItem("displayVideoDomain");

    if (!package_name || !domain_name) {
      toast({
        title: "Error",
        description: "Package name or domain name not found",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("package_name", package_name);
    formData.append("domain_name", domain_name);
    formData.append("creative_type", "display_creative");

    if (values.files.length) {
      values.files.forEach((fileMetadata, index) => {
        const fileExtention = `.${fileMetadata.name.split(".").slice(-1)}`;
        const creativeName = values.creativeName.endsWith(fileExtention)
          ? values.creativeName
          : `${values.creativeName}${fileExtention}`;
        formData.append(`creative_name${index}`, creativeName);
        formData.append(`file${index}`, fileMetadata.file);
        formData.append(`creative_width${index}`, fileMetadata.width.toString());
        formData.append(`creative_height${index}`, fileMetadata.height.toString());
      });
    } else {
      formData.append("creative_name", values.creativeName);
      formData.append("creative_width", values.width);
      formData.append("creative_height", values.height);
      formData.append("creative_url", values.creativeUrl);
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/add_display_creatives`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast({
        title: "Success",
        description: "Creative uploaded successfully!",
      });
      handleNext("creative_uploaded");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to upload creative",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-8 mt-8">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values, errors, touched }) => (
          <Form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Creative Name*
                </label>
                <Field
                  as={Input}
                  name="creativeName"
                  placeholder="Enter Creative Name"
                  className={`w-full ${
                    errors.creativeName && touched.creativeName
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                />
                {errors.creativeName && touched.creativeName && (
                  <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.creativeName}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Creative URL
                </label>
                <Field
                  as={Input}
                  name="creativeUrl"
                  placeholder="Enter Creative URL"
                  className={`w-full ${
                    errors.creativeUrl && touched.creativeUrl
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                />
                {errors.creativeUrl && touched.creativeUrl && (
                  <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.creativeUrl}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Height*
                </label>
                <Field
                  as={Input}
                  type="number"
                  name="height"
                  placeholder="Enter Height"
                  className={`w-full ${
                    errors.height && touched.height
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                />
                {errors.height && touched.height && (
                  <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.height}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Width*
                </label>
                <Field
                  as={Input}
                  type="number"
                  name="width"
                  placeholder="Enter Width"
                  className={`w-full ${
                    errors.width && touched.width
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                />
                {errors.width && touched.width && (
                  <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.width}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => inputFileRef.current?.click()}
              >
                Browse File
              </Button>
              <input
                type="file"
                ref={inputFileRef}
                hidden
                accept=".png,.jpg,.jpeg,.webp"
                onChange={(event) => handleFileChange(event, setFieldValue)}
              />
              {files.length > 0 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleDeleteFiles(setFieldValue)}
                >
                  Delete File
                </Button>
              )}
            </div>

            {files.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Selected Files:</h3>
                {files.map((file, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    {file.name} ({file.width}x{file.height}, {file.size}MB)
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-start pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="px-8 py-2 text-base font-medium"
              >
                {isSubmitting || isUploading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  "Upload Creative"
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default UploadCreative;