import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Loader2, AlertCircle, CheckCircle2, Copy, Upload, Trash2 } from "lucide-react";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface FormValues {
  creativeName: string;
  creativeUrl: string;
  height: string;
  width: string;
  creativeDuration?: string;
  files: FileMetadata[];
  creativeType: "image" | "video";
}

interface FileMetadata {
  file: File;
  name: string;
  size: string;
  width: number;
  height: number;
  duration?: number;
}

interface UploadCreativeProps {
  handleNext: (status: string) => void;
  acceptType?: "image" | "video" | "both";
}

const initialValues: FormValues = {
  creativeName: "",
  creativeUrl: "",
  height: "",
  width: "",
  creativeDuration: "",
  files: [],
  creativeType: "image",
};

const validationSchema = Yup.object().shape({
  creativeName: Yup.string().required("Creative Name is required"),
  creativeUrl: Yup.string()
    .test(
      "url-or-file",
      "Either Creative URL or File is required",
      function (value) {
        const files = this.parent.files;
        return !!(value || (files && files.length > 0));
      }
    )
    .test(
      "not-both",
      "Please provide either URL or File, not both",
      function (value) {
        const files = this.parent.files;
        return !(value && files && files.length > 0);
      }
    )
    .when("files", {
      is: (files: FileMetadata[] | undefined) => !files || files.length === 0,
      then: (schema) => schema.required("Creative URL is required when no file is uploaded"),
    }),
  height: Yup.number()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .positive("Height must be positive"),
  width: Yup.number()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .positive("Width must be positive"),
  creativeDuration: Yup.number()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .when("creativeType", {
      is: "video",
      then: (schema) => schema.required("Duration is required for video creatives"),
    })
    .positive("Duration must be positive"),
  files: Yup.array()
    .test(
      "url-or-file",
      "Either Creative URL or File is required",
      function (value) {
        const url = this.parent.creativeUrl;
        return !!(url || (value && value.length > 0));
      }
    )
    .test(
      "not-both",
      "Please provide either URL or File, not both",
      function (value) {
        const url = this.parent.creativeUrl;
        return !(url && value && value.length > 0);
      }
    ),
  creativeType: Yup.string().oneOf(["image", "video"]).required(),
});

const UploadCreative = ({
  handleNext,
  acceptType = "both",
}: UploadCreativeProps) => {
  const { toast } = useToast();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<FileMetadata[]>([]);

  const getAcceptString = () => {
    switch (acceptType) {
      case "image":
        return ".png,.jpg,.jpeg,.webp";
      case "video":
        return ".mp4,.webm,.mov";
      case "both":
        return ".png,.jpg,.jpeg,.webp,.mp4,.webm,.mov";
      default:
        return ".png,.jpg,.jpeg,.webp,.mp4,.webm,.mov";
    }
  };

  const handleDeleteFiles = (
    setFieldValue: (field: string, value: any) => void
  ) => {
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
    
    // Validate file type based on acceptType
    if (acceptType !== "both") {
      const invalidFiles = filesArray.filter(file => {
        if (acceptType === "image") {
          return !file.type.startsWith("image/");
        } else if (acceptType === "video") {
          return !file.type.startsWith("video/");
        }
        return false;
      });
      
      if (invalidFiles.length > 0) {
        toast({
          title: "Invalid File Type",
          description: `Please upload only ${acceptType} files`,
          variant: "destructive",
        });
        return;
      }
    }

    const selectedFiles = await Promise.all(
      filesArray.map((file) => {
        return new Promise<FileMetadata>((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onload = (e) => {
            const isVideo = file.type.startsWith("video/");
            const metadata = {
              file,
              name: file.name,
              size: (file.size / (1024 * 1024)).toFixed(2),
              width: 0,
              height: 0,
            };

            if (isVideo) {
              const video = document.createElement("video");
              video.src = e.target?.result as string;
              video.onloadedmetadata = () => {
                metadata.width = video.videoWidth;
                metadata.height = video.videoHeight;
                const videoMetadata = {
                  ...metadata,
                  duration: video.duration,
                };
                resolve(videoMetadata);
                setFieldValue("creativeType", "video");
                setFieldValue("creativeDuration", video.duration.toFixed(2));
                setFieldValue("width", video.videoWidth);
                setFieldValue("height", video.videoHeight);
              };
            } else {
              const img = new Image();
              img.src = e.target?.result as string;
              img.onload = () => {
                metadata.width = img.width;
                metadata.height = img.height;
                resolve(metadata);
                setFieldValue("creativeType", "image");
                setFieldValue("width", img.width);
                setFieldValue("height", img.height);
              };
            }
          };
        });
      })
    );

    setFieldValue("files", selectedFiles);
    setFieldValue("creativeName", selectedFiles[0].name);
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
        formData.append(
          `creative_width${index}`,
          fileMetadata.width.toString()
        );
        formData.append(
          `creative_height${index}`,
          fileMetadata.height.toString()
        );
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
    <Card className="p-8 mt-8 max-w-4xl mx-auto">
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
                <div className="flex items-center gap-2">
                  <Field
                    as={Input}
                    name="creativeUrl"
                    placeholder="Enter Creative URL"
                    className={`flex-1 ${
                      errors.creativeUrl && touched.creativeUrl
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                  />
                  <span className="text-gray-500">or</span>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => inputFileRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Browse File
                  </Button>
                  <input
                    type="file"
                    ref={inputFileRef}
                    hidden
                    accept={getAcceptString()}
                    onChange={(event) => handleFileChange(event, setFieldValue)}
                  />
                </div>
                {errors.creativeUrl && touched.creativeUrl && (
                  <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.creativeUrl}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Height
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
                  Width
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

              {acceptType === "video" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Creative Duration (seconds)
                  </label>
                  <Field
                    as={Input}
                    type="number"
                    name="creativeDuration"
                    placeholder="Enter Duration"
                    className={`w-full ${
                      errors.creativeDuration && touched.creativeDuration
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                  />
                  {errors.creativeDuration && touched.creativeDuration && (
                    <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.creativeDuration}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {files.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Selected Files:</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteFiles(setFieldValue)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-sm text-gray-600 bg-white p-2 rounded border border-gray-200">
                      <span>{file.name}</span>
                      <span className="text-gray-500">
                        {file.width}x{file.height} ({file.size}MB)
                      </span>
                    </div>
                  ))}
                </div>
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
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload Creative</span>
                  </div>
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
