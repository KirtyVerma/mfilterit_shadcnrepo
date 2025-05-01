import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useGetPlatforms, useCreateDisplayTracker } from "../api";
import { Loader2, AlertCircle, CheckCircle2, Copy } from "lucide-react";
import { useParams } from "next/navigation";

type TrackerType = "display_standard" | "display_native" | "display_ins";

interface Platform {
  value: string;
  label: string;
}

interface TrackerConfig {
  type: TrackerType;
  title: string;
  buttonText: string;
  validationSchema: Yup.ObjectSchema<any>;
  initialValues: Record<string, string>;
  fields: {
    name: string;
    label: string;
    type?: string;
    required?: boolean;
  }[];
}

const trackerConfigs: TrackerConfig[] = [
  {
    type: "display_standard",
    title: "Standard Creatives",
    buttonText: "Generate JS TAG",
    validationSchema: Yup.object().shape({
      platform: Yup.string()
        .matches(/^[a-zA-Z0-9_-]+$/, "Invalid characters in the string")
        .required("Platform is required"),
      tag_identifier: Yup.string()
        .matches(/^[a-zA-Z0-9_-]+$/, "Invalid characters in the string")
        .required("Tag Identifier is required"),
      campaign_name: Yup.string()
        .matches(/^[a-zA-Z0-9_-]+$/, "Invalid characters in the string")
        .required("Campaign name is required"),
      ro_number: Yup.string().matches(
        /^[a-zA-Z0-9_-]*$/,
        "Invalid characters in the string"
      ),
      extra_param_1: Yup.string(),
      extra_param_2: Yup.string(),
      extra_param_3: Yup.string(),
    }),
    initialValues: {
      platform: "",
      tag_identifier: "",
      campaign_name: "",
      ro_number: "",
      extra_param_1: "",
      extra_param_2: "",
      extra_param_3: "",
    },
    fields: [
      { name: "platform", label: "Select Platform*", required: true },
      { name: "tag_identifier", label: "Tag Identifier*", required: true },
      { name: "campaign_name", label: "Campaign Name*", required: true },
      { name: "extra_param_1", label: "Extra Param 1" },
      { name: "extra_param_2", label: "Extra Param 2" },
      { name: "extra_param_3", label: "Extra Param 3" },
      { name: "ro_number", label: "RO Number" },
    ],
  },
  {
    type: "display_native",
    title: "Native Creatives",
    buttonText: "Generate 1x1 Pixel",
    validationSchema: Yup.object().shape({
      platform: Yup.string()
        .matches(/^[a-zA-Z0-9_-]+$/, "Invalid characters in the string")
        .required("Platform is required"),
      tag_identifier: Yup.string()
        .matches(/^[a-zA-Z0-9_-]+$/, "Invalid characters in the string")
        .required("Tag Identifier is required"),
      campaign_name: Yup.string()
        .matches(/^[a-zA-Z0-9_-]+$/, "Invalid characters in the string")
        .required("Campaign name is required"),
      ro_number: Yup.string().matches(
        /^[a-zA-Z0-9_-]*$/,
        "Invalid characters in the string"
      ),
      extra_param_1: Yup.string(),
      extra_param_2: Yup.string(),
      extra_param_3: Yup.string(),
    }),
    initialValues: {
      platform: "",
      tag_identifier: "",
      campaign_name: "",
      ro_number: "",
      extra_param_1: "",
      extra_param_2: "",
      extra_param_3: "",
    },
    fields: [
      { name: "platform", label: "Select Platform*", required: true },
      { name: "tag_identifier", label: "Tag Identifier*", required: true },
      { name: "campaign_name", label: "Campaign Name*", required: true },
      { name: "extra_param_1", label: "Extra Param 1" },
      { name: "extra_param_2", label: "Extra Param 2" },
      { name: "extra_param_3", label: "Extra Param 3" },
      { name: "ro_number", label: "RO Number" },
    ],
  },
  {
    type: "display_ins",
    title: "Creative INS Wrapping",
    buttonText: "Generate INS Tracker",
    validationSchema: Yup.object().shape({
      campaign_name: Yup.string()
        .matches(/^[a-zA-Z0-9_-]+$/, "Invalid characters in the string")
        .required("Campaign name is required"),
      campaign_id: Yup.string().required("Campaign ID is required"),
      placement_id: Yup.string().required("Placement ID is required"),
      advertiser_id: Yup.string().required("Advertiser ID is required"),
      platform: Yup.string()
        .matches(/^[a-zA-Z0-9_-]+$/, "Invalid characters in the string")
        .required("Platform is required"),
      tag_identifier: Yup.string()
        .matches(/^[a-zA-Z0-9_-]+$/, "Invalid characters in the string")
        .required("Tag Identifier is required"),
      ins_tag_text: Yup.string().required("INS Tag is required"),
      extra_param_1: Yup.string(),
      extra_param_2: Yup.string(),
      extra_param_3: Yup.string(),
      ro_number: Yup.string().matches(
        /^[a-zA-Z0-9_-]*$/,
        "Invalid characters in the string"
      ),
    }),
    initialValues: {
      campaign_name: "",
      campaign_id: "",
      placement_id: "",
      advertiser_id: "",
      platform: "",
      tag_identifier: "",
      ro_number: "",
      ins_tag_text: "",
      extra_param_1: "",
      extra_param_2: "",
      extra_param_3: "",  
    },
    fields: [
      { name: "campaign_name", label: "Campaign Name*", required: true },
      { name: "campaign_id", label: "Campaign ID*", required: true },
      { name: "placement_id", label: "Placement ID*", required: true },
      { name: "advertiser_id", label: "Advertiser ID*", required: true },
      { name: "platform", label: "Select Platform*", required: true },
      { name: "tag_identifier", label: "Tag Identifier*", required: true },
      {
        name: "ins_tag_text",
        label: "INS Tag*",
        type: "textarea",
        required: true,
      },
      { name: "extra_param_1", label: "Extra Param 1" },
      { name: "extra_param_2", label: "Extra Param 2" },
      { name: "extra_param_3", label: "Extra Param 3" },
      { name: "ro_number", label: "RO Number" },
    ],
  },
];

const AddMfDisplayTracker: React.FC<{ default_page: string }> = ({
  default_page,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(default_page);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

	return (
    <div id="DisplayDashboardComponent" className="max-w-7xl mx-auto">
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {trackerConfigs.map((config) => (
            <button
              key={config.type}
              onClick={() => handleTabChange(config.type)}
              className={`
                group relative min-w-0 flex-1 overflow-hidden py-4 px-1 text-center text-sm font-medium focus:z-10
                ${
                  activeTab === config.type
                    ? "border-b-2 border-primary text-primary"
                    : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <span className="flex items-center justify-center gap-2">
                {config.title}
                {activeTab === config.type && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform scale-x-100 transition-transform duration-200" />
                )}
              </span>
              <span
                className={`
                  absolute inset-x-0 bottom-0 h-0.5
                  ${
                    activeTab === config.type
                      ? "bg-primary"
                      : "bg-transparent group-hover:bg-gray-300"
                  }
                  transition-colors duration-200
                `}
              />
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {trackerConfigs.map((config) => (
          <div
            key={config.type}
            className={`transition-all duration-300 ${
              activeTab === config.type
                ? "opacity-100 translate-y-0"
                : "opacity-0 hidden translate-y-4"
            }`}
          >
            <TrackerForm config={config} />
          </div>
        ))}
      </div>
			</div>
  );
};

const TrackerForm: React.FC<{ config: TrackerConfig }> = ({ config }) => {
  const { toast } = useToast();
  const [trackerValue, setTrackerValue] = useState("");
  const params = useParams();
  const package_name = params.package_name as string;

  const { data: platformsData = [], isLoading: isLoadingPlatforms } =
    useGetPlatforms(package_name, config.type);
  const createDisplayTracker = useCreateDisplayTracker();

  const platforms: Platform[] = platformsData.map((data: any) => ({
    value: data.platform_name,
    label: data.platform_name,
  }));

  const handleSubmit = async (
    values: typeof config.initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const payload = {
        ...values,
        tracker_type: config.type,
        package_name,
      };
	  console.log(payload)
    //   const response = await createDisplayTracker.mutateAsync(payload);
    //   setTrackerValue(response.tracker_url);
    } catch (error) {
      console.error("Error creating tracker:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-8">
      <Formik
        initialValues={config.initialValues}
        validationSchema={config.validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values, errors, touched }) => (
          <Form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {config.fields.map((field) => (
                <div
                  key={field.name}
                  className={`space-y-2 ${
                    field.type === "textarea"
                      ? "md:col-span-2 lg:col-span-3"
                      : ""
                  }`}
                >
                  <label className="text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  {field.name === "platform" ? (
                    <Select
                      onValueChange={(value) =>
                        setFieldValue("platform", value)
                      }
                      value={values.platform}
                      disabled={isLoadingPlatforms}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            isLoadingPlatforms
                              ? "Loading platforms..."
                              : "Select Platform"
                          }
                        />
                        {isLoadingPlatforms && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {platforms.map((platform) => (
                          <SelectItem
                            key={platform.value}
                            value={platform.value}
                          >
                            {platform.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === "textarea" ? (
                    <Field
                      as="textarea"
                      name={field.name}
                      placeholder={`Enter ${field.label.replace("*", "")}`}
                      className="min-h-[200px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  ) : (
                    <Field
                      as={Input}
                      name={field.name}
                      placeholder={`Enter ${field.label.replace("*", "")}`}
                      className={`w-full ${
                        errors[field.name] && touched[field.name]
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                    />
                  )}
                  {errors[field.name] && touched[field.name] && (
                    <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors[field.name]}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-start pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || createDisplayTracker.isLoading}
                className="px-8 py-2 text-base font-medium"
              >
                {isSubmitting || createDisplayTracker.isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  config.buttonText
                )}
              </Button>
            </div>

            {trackerValue && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <h3 className="text-sm font-medium">
                    Generated Tracker URL:
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={trackerValue}
                    readOnly
                    className="flex-1 bg-white"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(trackerValue);
                      toast({
                        title: "Copied to clipboard",
                        description:
                          "Tracker URL has been copied to your clipboard",
                      });
                    }}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </Button>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default AddMfDisplayTracker;
