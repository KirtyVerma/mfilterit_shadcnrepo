import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Loader2, Info, Upload, AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UploadCreative from "./UploadCreative";
import { useGetPlatforms, useListTpTrackerTypes } from "../api";

interface VideoMetadata {
  width: number;
  height: number;
  duration: number;
  url: string;
}

interface FormValues {
  domain_name: string;
  tracker_type: string;
  campaign_name: string;
  platform_name: string;
  adset: string;
  tag_identifier: string;
  ro_number: string;
  extra_param_1: string;
  extra_param_2: string;
  extra_param_3: string;
  creative_id: string;
  vast_wrapper_url: string;
  vast_creative_url: string;
  vast_creative_metadata?: {
    creative_width: number;
    creative_height: number;
    creative_duration: number;
  };
  capping_threshold: string;
  capping_timeframe: string;
  f_cap_accross_platform: boolean;
  tp_tracker_type: string[];
  tp_tracker_url: string[];
  package_name: string;
  enable_double_spotting: boolean;
  double_spotting_threshold: string;
}

interface CustomTracker {
  type: string;
  url: string;
}

interface AddVastTrackerProps {
  trackerType?: string;
  inputType?: "url" | "upload";
}

const baseSchema = Yup.object().shape({
  campaign_name: Yup.string().required("Campaign name is required"),
  platform_name: Yup.string().required("Platform name is required"),
  adset: Yup.string().required("Adset is required"),
  tag_identifier: Yup.string().required("Tag identifier is required"),
  ro_number: Yup.string(),
  capping_threshold: Yup.string().test(
    "capping_threshold",
    "Capping threshold must be a number",
    function (value) {
      if (!value) return true;
      return !isNaN(Number(value));
    }
  ),
  capping_timeframe: Yup.string().test(
    "capping_timeframe",
    "Capping timeframe is required when threshold is set",
    function (value) {
      if (this.parent.capping_threshold && !value) return false;
      return true;
    }
  ),
  double_spotting_threshold: Yup.string().test(
    "double_spotting_threshold",
    "Double spotting threshold must be a number",
    function (value) {
      if (!this.parent.enable_double_spotting) return true;
      if (!value) return false;
      return !isNaN(Number(value));
    }
  ),
  tp_tracker_type: Yup.array().of(
    Yup.string().required("Tracker type is required")
  ),
  tp_tracker_url: Yup.array().of(
    Yup.string().required("URL is required").url("Please enter a valid URL")
  ),
});

const urlSchema = baseSchema
  .shape({
    vast_wrapper_url: Yup.string()
      .url("Please enter a valid URL")
      .test(
        "either-url-required",
        "VAST wrapper URL is required when creative URL is empty",
        function (value) {
          const { vast_creative_url } = this.parent;
          if (!vast_creative_url && !value) {
            return false;
          }
          return true;
        }
      ),
    vast_creative_url: Yup.string()
      .url("Please enter a valid URL")
      .test(
        "either-url-required",
        "VAST creative URL is required when wrapper URL is empty",
        function (value) {
          const { vast_wrapper_url } = this.parent;
          if (!vast_wrapper_url && !value) {
            return false;
          }
          return true;
        }
      ),
    creative_id: Yup.string(),
  })
  .test(
    "mutually-exclusive-urls",
    "Please provide either VAST wrapper URL or VAST creative URL, not both",
    function (value) {
      const { vast_wrapper_url, vast_creative_url } = value;
      if (vast_wrapper_url && vast_creative_url) {
        return false;
      }
      return true;
    }
  );

const uploadSchema = baseSchema.shape({
  creative_id: Yup.string().required("Creative ID is required"),
  vast_wrapper_url: Yup.string(),
  vast_creative_url: Yup.string(),
});

const getVideoMetadata = async (
  videoUrl: string
): Promise<{ width: number; height: number; duration: number }> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = videoUrl;

    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
      });
    };

    video.onerror = () => {
      reject(new Error("Failed to load video metadata"));
    };
  });
};

const AddVastTracker: React.FC<AddVastTrackerProps> = ({
  trackerType = "vast_creative",
  inputType = "url",
}) => {
  const params = useParams();
  const packageName = params.package_name as string;
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [generatedVastTracker, setGeneratedVastTracker] = useState<
    string | null
  >(null);
  const { data: platformsData, isLoading: isLoadingPlatforms } =
    useGetPlatforms("video_vast");
  const { data: trackerTypesData, isLoading: isLoadingTrackerTypes } =
    useListTpTrackerTypes(packageName, "video_vast");
  const [customTrackers, setCustomTrackers] = useState<CustomTracker[]>([
    { type: "impression", url: "" },
    { type: "click", url: "" },
    { type: "complete", url: "" },
    { type: "first_quartile", url: "" },
    { type: "midpoint", url: "" },
    { type: "click_through_tracker", url: "" },
  ]);
  const ref = useRef(null);
  console.log("trackerTypesData", trackerTypesData);

  const initialFormValues: FormValues = {
    domain_name: "",
    tracker_type: "video_vast",
    campaign_name: "",
    platform_name: "",
    adset: "",
    tag_identifier: "",
    ro_number: "",
    extra_param_1: "",
    extra_param_2: "",
    extra_param_3: "",
    creative_id: "",
    vast_wrapper_url: "",
    vast_creative_url: "",
    vast_creative_metadata: undefined,
    capping_threshold: "",
    capping_timeframe: "",
    f_cap_accross_platform: false,
    tp_tracker_type: [],
    tp_tracker_url: [],
    package_name: packageName,
    enable_double_spotting: false,
    double_spotting_threshold: "",
  };

  const handleUrlSubmit = async (
    values: FormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      if (!values.vast_wrapper_url && !values.vast_creative_url) {
        toast({
          title: "Error",
          description:
            "Please provide either VAST wrapper URL or VAST creative URL",
          variant: "destructive",
        });
        return;
      }

      if (values.vast_wrapper_url && values.vast_creative_url) {
        toast({
          title: "Error",
          description: "Please provide only one URL type, not both",
          variant: "destructive",
        });
        return;
      }

      if (
        values.vast_creative_url &&
        typeof values.vast_creative_url === "string"
      ) {
        try {
          const metadata = await getVideoMetadata(values.vast_creative_url);
          values.vast_creative_metadata = {
            creative_width: metadata.width,
            creative_height: metadata.height,
            creative_duration: metadata.duration,
          };
        } catch (error) {
          console.error("Error fetching video metadata:", error);
        }
      }

      // Filter out empty values
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(([_, value]) => {
          if (Array.isArray(value)) {
            return value.length > 0;
          }
          return value !== "" && value !== null && value !== undefined;
        })
      );

      console.log("URL Form Values:", filteredValues);
      setGeneratedVastTracker(JSON.stringify(filteredValues, null, 2));
      setShowModal(true);
      toast({
        title: "Success",
        description: "URL form submitted successfully",
      });

      // Reset the form after successful submission
      // resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit URL form",
        variant: "destructive",
      });
    }
  };

  const handleUploadSubmit = async (values: FormValues) => {
    try {
      if (!values.creative_id) {
        toast({
          title: "Error",
          description: "Creative ID is required for upload type",
          variant: "destructive",
        });
        return;
      }

      // Filter out empty values
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(([_, value]) => {
          if (Array.isArray(value)) {
            return value.length > 0;
          }
          return value !== "" && value !== null && value !== undefined;
        })
      );

      console.log("Upload Form Values:", filteredValues);
      setGeneratedVastTracker(JSON.stringify(filteredValues, null, 2));
      setShowModal(true);
      toast({
        title: "Success",
        description: "Upload form submitted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit upload form",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <Formik
        innerRef={ref}
        enableReinitialize={true}
        validationSchema={inputType === "url" ? urlSchema : uploadSchema}
        onSubmit={inputType === "url" ? handleUrlSubmit : handleUploadSubmit}
        initialValues={initialFormValues}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({
          values,
          handleChange,
          setFieldValue,
          handleBlur,
          touched,
          errors,
          resetForm,
          isSubmitting,
          isValid,
          dirty,
        }) => (
          <div>
            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Form Values</DialogTitle>
                </DialogHeader>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">
                    {generatedVastTracker}
                  </pre>
                </div>
              </DialogContent>
            </Dialog>

            <Form className="max-w-[1200px] mx-auto">
              <div className="space-y-8">
                {inputType === "upload" && (
                  <div className="">
                    <Button
                      type="button"
                      onClick={() => setShowUploadModal(true)}
                      className="bg-[#9C27B0] hover:bg-[#7B1FA2] text-white flex items-center gap-2"
                    >
                      Upload A New Creative
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-x-6">
                  <div>
                    <Label className="block mb-2.5 text-[#374151] text-sm font-medium">
                      Campaign Name*
                    </Label>
                    <Field
                      name="campaign_name"
                      className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter Campaign Name"
                    />
                    {errors.campaign_name && touched.campaign_name && (
                      <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.campaign_name}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="block mb-2.5 text-[#374151] text-sm font-medium">
                      Platform*
                    </Label>
                    <Select
                      value={values.platform_name}
                      onValueChange={(value: string) =>
                        setFieldValue("platform_name", value)
                      }
                      disabled={isLoadingPlatforms}
                    >
                      <SelectTrigger className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md text-left flex justify-between items-center text-sm">
                        <SelectValue
                          placeholder={
                            isLoadingPlatforms
                              ? "Loading platforms..."
                              : "Select Platform"
                          }
                          className="text-[#9CA3AF]"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-[#E5E7EB] rounded-md shadow-lg">
                        {isLoadingPlatforms ? (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="ml-2">Loading platforms...</span>
                          </div>
                        ) : (
                          platformsData?.map((platform: any) => (
                            <SelectItem key={platform} value={platform}>
                              {platform}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {errors.platform_name && touched.platform_name && (
                      <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.platform_name}
                      </div>
                    )}
                  </div>

                  {inputType === "upload" && (
                    <div>
                      <Label className="block mb-2.5 text-[#374151] text-sm font-medium">
                        Creatives*
                      </Label>
                      <Select
                        value={values.creative_id}
                        onValueChange={(value: string) =>
                          setFieldValue("creative_id", value)
                        }
                      >
                        <SelectTrigger className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md text-left flex justify-between items-center text-sm">
                          <SelectValue
                            placeholder="Select Creative"
                            className="text-[#9CA3AF]"
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-[#E5E7EB] rounded-md shadow-lg">
                          <SelectItem value="creative1">Creative 1</SelectItem>
                          <SelectItem value="creative2">Creative 2</SelectItem>
                          <SelectItem value="creative3">Creative 3</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.creative_id && touched.creative_id && (
                        <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.creative_id}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-x-6">
                  <div>
                    <Label className="block mb-2.5 text-[#374151] text-sm font-medium">
                      Ad Set*
                    </Label>
                    <Field
                      name="adset"
                      className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter Ad Set"
                    />
                    {errors.adset && touched.adset && (
                      <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.adset}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-x-6">
                  <div>
                    <Label className="block mb-2.5 text-[#374151] text-sm font-medium flex items-center">
                      Tracker Name*
                      <div className="ml-1.5 rounded-full bg-[#F3F4F6] p-0.5">
                        <Info className="w-4 h-4 text-[#6B7280]" />
                      </div>
                    </Label>
                    <Field
                      name="tag_identifier"
                      className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter Tracker Name"
                    />
                    {errors.tag_identifier && touched.tag_identifier && (
                      <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.tag_identifier}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="block mb-2.5 text-[#374151] text-sm font-medium">
                      RO Number
                    </Label>
                    <Field
                      name="ro_number"
                      className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter RO Number"
                    />
                    {errors.ro_number && touched.ro_number && (
                      <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.ro_number}
                      </div>
                    )}
                  </div>
                </div>

                {inputType === "url" && (
                  <>
                    <div className="text-sm text-[#7C3AED] mt-8">
                      Note: Either enter the VAST wrapper URL or Enter already
                      uploaded creative URL
                    </div>

                    <div className="grid grid-cols-[1fr,auto,1fr] gap-x-6 items-start">
                      <div>
                        <Label className="block mb-2.5 text-[#374151] text-sm font-medium">
                          VAST Wrapper URL
                        </Label>
                        <Field
                          name="vast_wrapper_url"
                          className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter VAST Wrapper URL"
                          disabled={!!values.vast_creative_url}
                        />
                      </div>

                      <div className="flex items-center justify-center pt-8">
                        <span className="text-[#6B7280] text-base font-medium">
                          OR
                        </span>
                      </div>

                      <div>
                        <Label className="block mb-2.5 text-[#374151] text-sm font-medium">
                          VAST Creative URL
                        </Label>
                        <Field
                          name="vast_creative_url"
                          className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter VAST Creative URL"
                          disabled={!!values.vast_wrapper_url}
                        />
                      </div>
                    </div>
                    {(errors.vast_wrapper_url || errors.vast_creative_url) &&
                      (touched.vast_wrapper_url ||
                        touched.vast_creative_url) && (
                        <div className="text-red-500 text-xs mt-1 text-left flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.vast_wrapper_url || errors.vast_creative_url}
                        </div>
                      )}
                  </>
                )}

                <div className="mt-20">
                  <div className="space-y-8">
                    <div className="grid grid-cols-3 gap-x-8">
                      <div className="space-y-2">
                        <Label className="text-[#374151] text-sm font-medium flex items-center">
                          Capping Threshold
                          <div className="ml-1.5 rounded-full bg-[#F3F4F6] p-0.5">
                            <Info className="w-4 h-4 text-[#6B7280]" />
                          </div>
                        </Label>
                        <Field
                          name="capping_threshold"
                          className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                          placeholder="Enter Capping Threshold"
                          type="number"
                        />
                        {errors.capping_threshold &&
                          touched.capping_threshold && (
                            <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.capping_threshold}
                            </div>
                          )}
                      </div>

                      <div className="space-y-2">
                        <Label className="block text-[#374151] text-sm font-medium flex items-center">
                          Capping Timeframe*
                          <div className="ml-1.5 rounded-full bg-[#F3F4F6] p-0.5">
                            <Info className="w-4 h-4 text-[#6B7280]" />
                          </div>
                        </Label>
                        <Select
                          value={values.capping_timeframe}
                          onValueChange={(value: string) =>
                            setFieldValue("capping_timeframe", value)
                          }
                          disabled={!values.capping_threshold}
                        >
                          <SelectTrigger
                            className={`w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md text-left flex justify-between items-center text-sm transition-colors ${!values.capping_threshold ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
                          >
                            <SelectValue
                              placeholder="Select Capping Timeframe"
                              className="text-[#9CA3AF]"
                            />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-[#E5E7EB] rounded-md shadow-lg">
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.capping_timeframe &&
                          touched.capping_timeframe && (
                            <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.capping_timeframe}
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="f_cap_accross_platform"
                          checked={values.f_cap_accross_platform}
                          onCheckedChange={(checked: boolean) =>
                            setFieldValue("f_cap_accross_platform", checked)
                          }
                          className="w-4 h-4 border border-[#E5E7EB] rounded data-[state=checked]:bg-[#9C27B0] data-[state=checked]:border-[#9C27B0] transition-colors"
                        />
                        <label
                          htmlFor="f_cap_accross_platform"
                          className="text-[#374151] text-sm font-medium cursor-pointer hover:text-[#9C27B0] transition-colors"
                        >
                          Enable F-cap across platform
                        </label>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="enable_double_spotting"
                            checked={values.enable_double_spotting}
                            onCheckedChange={(checked: boolean) =>
                              setFieldValue("enable_double_spotting", checked)
                            }
                            className="w-4 h-4 border border-[#E5E7EB] rounded data-[state=checked]:bg-[#9C27B0] data-[state=checked]:border-[#9C27B0] transition-colors"
                          />
                          <label
                            htmlFor="enable_double_spotting"
                            className="text-[#374151] text-sm font-medium cursor-pointer hover:text-[#9C27B0] transition-colors"
                          >
                            Enable Double Spotting
                          </label>
                        </div>

                        {values.enable_double_spotting && (
                          <div className="pl-7">
                            <Field
                              name="double_spotting_threshold"
                              className="w-1/3 h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                              placeholder="Enter Double Spotting Threshold"
                              type="number"
                            />
                            {errors.double_spotting_threshold &&
                              touched.double_spotting_threshold && (
                                <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.double_spotting_threshold}
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-20">
                  <h3 className="text-[#374151] text-lg font-semibold mb-6">
                    Extra Parameters (Only for Reporting)
                  </h3>
                  <div className="grid grid-cols-3 gap-x-6">
                    <div>
                      <Label className="block mb-2.5 text-[#374151] text-sm font-medium">
                        Extra Parameter 1
                      </Label>
                      <Field
                        name="extra_param_1"
                        className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter Extra Parameter 1"
                      />
                    </div>

                    <div>
                      <Label className="block mb-2.5 text-[#374151] text-sm font-medium">
                        Extra Parameter 2
                      </Label>
                      <Field
                        name="extra_param_2"
                        className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter Extra Parameter 2"
                      />
                    </div>

                    <div>
                      <Label className="block mb-2.5 text-[#374151] text-sm font-medium">
                        Extra Parameter 3
                      </Label>
                      <Field
                        name="extra_param_3"
                        className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter Extra Parameter 3"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-20">
                  <h3 className="text-[#374151] text-lg font-semibold mb-6">
                    Custom trackers (optional)
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-6">
                      {values.tp_tracker_type.map((_, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-[1fr,1fr,auto] gap-x-4 items-start"
                        >
                          <div>
                            <Label className="block mb-2.5 text-[#374151] text-sm font-medium">
                              Custom Tracker Name
                            </Label>
                            <Select
                              value={values.tp_tracker_type[index]}
                              onValueChange={(value: string) => {
                                const newTypes = [...values.tp_tracker_type];
                                newTypes[index] = value;
                                setFieldValue("tp_tracker_type", newTypes);
                              }}
                              disabled={isLoadingTrackerTypes}
                            >
                              <SelectTrigger className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md text-left flex justify-between items-center text-sm">
                                <SelectValue
                                  placeholder={
                                    isLoadingTrackerTypes
                                      ? "Loading tracker types..."
                                      : "Select Tracker Name"
                                  }
                                  className="text-[#9CA3AF]"
                                />
                              </SelectTrigger>
                              <SelectContent className="bg-white border border-[#E5E7EB] rounded-md shadow-lg">
                                {isLoadingTrackerTypes ? (
                                  <div className="flex items-center justify-center p-4">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="ml-2">
                                      Loading tracker types...
                                    </span>
                                  </div>
                                ) : (
                                  trackerTypesData
                                    ?.filter(
                                      (trackerType: string) =>
                                        trackerType !== "click_through_tracker" ||
                                        !values.tp_tracker_type.includes("click_through_tracker") ||
                                        trackerType === values.tp_tracker_type[index]
                                    )
                                    .map((trackerType: string) => (
                                      <SelectItem
                                        key={trackerType}
                                        value={trackerType}
                                      >
                                        {trackerType}
                                      </SelectItem>
                                    ))
                                )}
                              </SelectContent>
                            </Select>
                            {errors.tp_tracker_type &&
                              (errors.tp_tracker_type as string[])[index] &&
                              touched.tp_tracker_type?.[index] && (
                                <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {(errors.tp_tracker_type as string[])[index]}
                                </div>
                              )}
                          </div>

                          <div>
                            <Label className="block mb-2.5 text-[#374151] text-sm font-medium">
                              Custom Tracker URL
                            </Label>
                            <Field
                              name={`tp_tracker_url.${index}`}
                              className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Enter Tracker URL"
                            />
                            {errors.tp_tracker_url &&
                              (errors.tp_tracker_url as string[])[index] &&
                              touched.tp_tracker_url?.[index] && (
                                <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {(errors.tp_tracker_url as string[])[index]}
                                </div>
                              )}
                          </div>

                          <div className="pt-8">
                            <Button
                              type="button"
                              onClick={() => {
                                const newTypes = values.tp_tracker_type.filter(
                                  (_, i) => i !== index
                                );
                                const newUrls = values.tp_tracker_url.filter(
                                  (_, i) => i !== index
                                );
                                setFieldValue("tp_tracker_type", newTypes);
                                setFieldValue("tp_tracker_url", newUrls);
                              }}
                              variant="destructive"
                              size="sm"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mb-6">
                      <Button
                        type="button"
                        onClick={() => {
                          setFieldValue("tp_tracker_type", [
                            ...values.tp_tracker_type,
                            "",
                          ]);
                          setFieldValue("tp_tracker_url", [
                            ...values.tp_tracker_url,
                            "",
                          ]);
                        }}
                        variant="default"
                        className="bg-[#9C27B0] hover:bg-[#7B1FA2] text-white"
                      >
                        Add Custom Tracker
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-start space-x-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#9C27B0] hover:bg-[#7B1FA2] text-white min-w-[160px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Generate VAST Tracker"
                    )}
                  </Button>
                </div>
              </div>
            </Form>

            <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
              <DialogContent className="p-6 min-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Upload Creative</DialogTitle>
                </DialogHeader>
                <UploadCreative
                  handleNext={() => setShowUploadModal(false)}
                  acceptType="video"
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </Formik>
    </Card>
  );
};

export default AddVastTracker;
