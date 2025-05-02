import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Copy,
  Upload,
  Trash2,
} from "lucide-react";
import axios from "axios";
import { useParams } from "next/navigation";
import { APIS, useUploadCreative, WEB_TEST_APIS_BASE_URL } from "../api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface FormValues {
  creativeName: string;
  creativeUrl: string;
  height: number;
  width: number;
  creativeDuration?: number;
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
  acceptType: "image" | "video";
  callBack?: () => void;
}

const initialValues: FormValues = {
  creativeName: "",
  creativeUrl: "",
  height: 0,
  width: 0,
  creativeDuration: 0,
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
      then: (schema) =>
        schema.required("Creative URL is required when no file is uploaded"),
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
      then: (schema) =>
        schema
          .required("Duration is required for video creatives")
          .max(300, "Duration must be less than or equal to 300 seconds"),
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

const UploadCreative = ({ callBack, acceptType }: UploadCreativeProps) => {
  const { toast } = useToast();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const params = useParams();
  const packageName = params.package_name as string;
  const { mutate: uploadCreative } = useUploadCreative();

  const getAcceptString = () => {
    switch (acceptType) {
      case "image":
        return ".png,.jpg,.jpeg,.webp";
      case "video":
        return ".mp4,.webm,.mov";
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
      setFieldValue("width", 0);
      setFieldValue("height", 0);
      setFiles([]);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Set creative type based on acceptType prop
    setFieldValue("creativeType", acceptType);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      const metadata = {
        file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2),
        width: 0,
        height: 0,
      };

      if (acceptType === "video") {
        const video = document.createElement("video");
        video.src = e.target?.result as string;
        video.onloadedmetadata = () => {
          metadata.width = video.videoWidth;
          metadata.height = video.videoHeight;
          const videoMetadata = {
            ...metadata,
            duration: video.duration,
          };
          setFieldValue("files", [videoMetadata]);
          setFieldValue("creativeName", file.name);
          setFieldValue("creativeDuration", video.duration.toFixed(2));
          setFieldValue("width", video.videoWidth);
          setFieldValue("height", video.videoHeight);
          setFiles([videoMetadata]);
        };
      } else {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          metadata.width = img.width;
          metadata.height = img.height;
          setFieldValue("files", [metadata]);
          setFieldValue("creativeName", file.name);
          setFieldValue("width", img.width);
          setFieldValue("height", img.height);
          setFiles([metadata]);
        };
      }
    };
  };

  const handleImageSubmit = async (values: FormValues) => {
    setIsUploading(true);
    const domain_name = "test_domain";
    const formData = {
      package_name: packageName,
      domain_name: domain_name,
      creative_type: "image",
      creative_name: values.creativeName,
      creative_width: values.width,
      creative_height: values.height,
    };

    try {
      if (values.files.length) {
        const fileMetadata = values.files[0];
        const fileExtention = `.${fileMetadata.name.split(".").slice(-1)}`;
        const creativeName = values.creativeName.endsWith(fileExtention)
          ? values.creativeName
          : `${values.creativeName}${fileExtention}`;

        const presignedUrl = await axios.get(
          `${WEB_TEST_APIS_BASE_URL}/config_dashboard/generate_presigned_url?package_name=${packageName}&file_name=${creativeName}`
        );

        // Upload file to presigned URL
        await axios.put(presignedUrl.data.url, fileMetadata.file, {
          headers: {
            "Content-Type": fileMetadata.file.type,
          },
        });

        toast({
          title: "Success",
          description: "Image uploaded successfully!",
        });
      } else {
        // Handle URL case

        formData["creative_url"] = values.creativeUrl;

        // Log FormData contents
        console.log("Image FormData contents:", formData);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoSubmit = async (values: FormValues) => {
    setIsUploading(true);
    const domain_name = "test_domain";
    const formData: any = {
      package_name: packageName,
      domain_name: domain_name,
      creative_type: "video",
      creative_name: values.creativeName,
      creative_width: values.width,
      creative_height: values.height,
      creative_duration: values.creativeDuration ? parseInt(values.creativeDuration) : 0,
    };
    console.log(formData)

    try {
      if (values.files.length) {
        const fileMetadata = values.files[0];
        const fileExtention = `.${fileMetadata.name.split(".").slice(-1)}`;
        const creativeName = values.creativeName.endsWith(fileExtention)
          ? values.creativeName
          : `${values.creativeName}${fileExtention}`;

        const file_name = await APIS.uploadToS3(
          "video",
          packageName,
          creativeName,
          fileMetadata.file
        );
        formData["uploaded_file_name"] = file_name;
      } else {
        formData["creative_url"] = values.creativeUrl;
      }

      uploadCreative(formData);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to upload video",
        variant: "destructive",
      });
    } finally {
      console.log("Video FormData contents:", formData);
      setIsUploading(false);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    if (acceptType === "image") {
      await handleImageSubmit(values);
    } else {
      await handleVideoSubmit(values);
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
            <div className="space-y-6">
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
                <p className="text-sm text-gray-500 mt-1">
                  Note: Please provide either a URL or upload a file, not both.
                </p>
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = parseInt(e.target.value, 10);
                    setFieldValue("height", isNaN(value) ? 0 : value);
                  }}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = parseInt(e.target.value, 10);
                    setFieldValue("width", isNaN(value) ? 0 : value);
                  }}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = parseInt(e.target.value, 10);
                      setFieldValue(
                        "creativeDuration",
                        isNaN(value) ? 0 : value
                      );
                    }}
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
                  <h3 className="text-sm font-medium text-gray-700">
                    Selected Files:
                  </h3>
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
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm text-gray-600 bg-white p-2 rounded border border-gray-200"
                    >
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
