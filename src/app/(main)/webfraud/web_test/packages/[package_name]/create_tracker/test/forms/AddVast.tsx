import React, { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle2, Copy, Info } from "lucide-react";
import { useParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";


const BASE_URL = "https://oyyy02f09h.execute-api.ap-south-1.amazonaws.com";

interface TrackerCopyModalProps {
  show: boolean;
  tracker: string;
  onHide: () => void;
  resetForm: () => void;
}

const TrackerCopyModal: React.FC<TrackerCopyModalProps> = ({ show, tracker, onHide, resetForm }) => {
  const router = useRouter();
  const [copyBtnText, setCopyBtnText] = useState("Copy Tracker");

  const closeModal = () => {
    router.push('/dvtrackers/video');
    onHide();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${show ? 'block' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <h2 className="text-xl font-semibold mb-4">Tracker created successfully! Please copy the tracker.</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">VAST Tracker</label>
          <textarea
            className="w-full p-2 border rounded-md"
            rows={3}
            value={tracker}
            disabled
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={closeModal}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(tracker);
              setCopyBtnText("Copied successfully!");
              setTimeout(() => setCopyBtnText("Copy Tracker"), 1000);
            }}
          >
            {copyBtnText}
          </Button>
          <Button
            onClick={() => {
              resetForm();
              onHide();
            }}
          >
            Create Tracker again
          </Button>
        </div>
      </div>
    </div>
  );
};

interface UploadCreativeModalProps {
  show: boolean;
  onHide: () => void;
  refreshCreatives: () => void;
}

// Comment out UploadCreativeModal component
/*
const UploadCreativeModal: React.FC<UploadCreativeModalProps> = ({ show, onHide, refreshCreatives }) => {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${show ? 'block' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upload Creative</h2>
          <Button variant="ghost" onClick={onHide}>×</Button>
        </div>
        <div className="p-4">
          <UploadCreative handleNext={refreshCreatives} />
        </div>
      </div>
    </div>
  );
};
*/

interface AddVastTrackerProps {
  trackerType?: string;
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
  capping_threshold: string;
  capping_timeframe: string;
  f_cap_accross_platform: boolean;
  enable_custom_tracker: boolean;
  tp_tracker_type: string[];
  tp_tracker_url: string[];
  package_name: string;
}

const schema = Yup.object().shape({
  domain_name: Yup.string().required("Domain name is required"),
  campaign_name: Yup.string().required("Campaign name is required"),
  platform_name: Yup.string().required("Platform name is required"),
  adset: Yup.string().required("Adset is required"),
  tag_identifier: Yup.string().required("Tag identifier is required"),
  ro_number: Yup.string().required("RO number is required"),
  creative_id: Yup.string().required("Creative ID is required"),
  vast_wrapper_url: Yup.string().test("vast_wrapper_url", "VAST wrapper URL is required", function (value) {
    return this.parent.tracker_type !== "vast_wrapper" || !!value;
  }),
  vast_creative_url: Yup.string().test("vast_creative_url", "VAST creative URL is required", function (value) {
    return this.parent.tracker_type !== "vast_creative" || !!value;
  }),
});

const AddVastTracker: React.FC<AddVastTrackerProps> = ({ trackerType = "vast_creative" }) => {
  const { toast } = useToast();
  const [activeTrackerType, setActiveTrackerType] = useState(trackerType);
  const ref = useRef(null);
  const [creativeUrlValidationMsg, setCreativeUrlValidationMsg] = useState('');
  const [videoOfCreatives, setVideoOfCreatives] = useState<Array<{ value: string; label: string }>>([]);
  const [creativeMetadata, setCreativeMetadata] = useState<{ width: number; height: number; duration: number } | null>(null);
  const [platforms, setPlatforms] = useState<Array<{ value: string; label: string }>>([]);
  const [creativesDataArray, setCreativesDataArray] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [generatedVastTracker, setGeneratedVastTracker] = useState<string | null>(null);
  const [customTrackersList, setCustomTrackersList] = useState<Array<{ value: string; label: string }>>([]);
  const params = useParams();
  const packageName = params.package_name as string;
  const [refreshCount, setRefreshCount] = useState(0);

  const initialFormValues = {
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
    capping_threshold: "",
    capping_timeframe: "",
    f_cap_accross_platform: false,
    enable_custom_tracker: false,
    tp_tracker_type: [] as string[],
    tp_tracker_url: [] as string[],
    package_name: packageName,
  };

  const [formData, setFormData] = useState(initialFormValues);

  const validateUrls = (values: any) => {
    const errors: any = {};
    if (values.tracker_type === "vast_wrapper" && !values.vast_wrapper_url) {
      errors.vast_wrapper_url = "VAST wrapper URL is required";
    }
    if (values.tracker_type === "vast_creative" && !values.vast_creative_url) {
      errors.vast_creative_url = "VAST creative URL is required";
    }
    return errors;
  };

  const handleSubmitAPI = async (values: any) => {
    try {
      const response = await axios.post(`${BASE_URL}/vast_tracker`, values);
      setGeneratedVastTracker(response.data.tracker_url);
      setShowModal(true);
      toast({
        title: "Success",
        description: "VAST tracker created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create VAST tracker",
        variant: "destructive",
      });
    }
  };

  const refreshCreatives = () => {
    setRefreshCount(prev => prev + 1);
  };

  return (
    <Card className="p-6">
      <Formik
        innerRef={ref}
        enableReinitialize={true}
        validationSchema={schema}
        onSubmit={handleSubmitAPI}
        initialValues={formData}
        validate={activeTrackerType === "vast_wrapper" ? validateUrls : undefined}
      >
        {({ values, handleChange, setFieldValue, handleBlur, touched, errors, resetForm, isSubmitting }) => (
          <div>
            <TrackerCopyModal
              show={!!generatedVastTracker}
              tracker={generatedVastTracker || ""}
              onHide={() => setGeneratedVastTracker(null)}
              resetForm={() => resetForm({ values: initialFormValues })}
            />
            {/* <UploadCreativeModal
              show={showModal}
              onHide={() => setShowModal(false)}
              refreshCreatives={refreshCreatives}
            /> */}
            <Form className="p-8 max-w-[1200px] mx-auto">
              <div className="space-y-8">
                <div className="grid grid-cols-3 gap-x-6">
                  <div>
                    <Label className="block mb-2.5 text-[#374151] text-sm font-medium">Campaign Name*</Label>
                  <Field
                    name="campaign_name"
                      className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter Campaign Name"
                  />
                    {errors.campaign_name && touched.campaign_name && (
                      <div className="text-red-500 text-xs mt-1">{errors.campaign_name}</div>
                    )}
                </div>

                  <div>
                    <Label className="block mb-2.5 text-[#374151] text-sm font-medium">Platform*</Label>
                    <Select
                      value={values.platform_name}
                      onValueChange={(value: string) => setFieldValue("platform_name", value)}
                    >
                      <SelectTrigger className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md text-left flex justify-between items-center text-sm">
                        <SelectValue placeholder="Select Platform" className="text-[#9CA3AF]" />
                       
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-[#E5E7EB] rounded-md shadow-lg">
                        <SelectItem value="facebook" className="px-3 py-2 text-sm hover:bg-[#F3F4F6] cursor-pointer">
                          Facebook
                        </SelectItem>
                        <SelectItem value="google" className="px-3 py-2 text-sm hover:bg-[#F3F4F6] cursor-pointer">
                          Google
                        </SelectItem>
                        <SelectItem value="tiktok" className="px-3 py-2 text-sm hover:bg-[#F3F4F6] cursor-pointer">
                          TikTok
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.platform_name && touched.platform_name && (
                      <div className="text-red-500 text-xs mt-1">{errors.platform_name}</div>
                    )}
                </div>

                  <div>
                    <Label className="block mb-2.5 text-[#374151] text-sm font-medium">Ad Set*</Label>
                  <Field
                    name="adset"
                      className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter Ad Set"
                  />
                    {errors.adset && touched.adset && (
                      <div className="text-red-500 text-xs mt-1">{errors.adset}</div>
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
                      <div className="text-red-500 text-xs mt-1">{errors.tag_identifier}</div>
                    )}
                </div>

                  <div>
                    <Label className="block mb-2.5 text-[#374151] text-sm font-medium">RO Number</Label>
                  <Field
                    name="ro_number"
                      className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter RO Number"
                  />
                    {errors.ro_number && touched.ro_number && (
                      <div className="text-red-500 text-xs mt-1">{errors.ro_number}</div>
                    )}
                  </div>
                </div>

                <div className="text-sm text-[#7C3AED] mt-8">
                  Note: Either enter the VAST wrapper URL or Enter already uploaded creative URL
                </div>

                <div className="grid grid-cols-[1fr,auto,1fr] gap-x-6 items-start">
                  <div>
                    <Label className="block mb-2.5 text-[#374151] text-sm font-medium">VAST Wrapper URL</Label>
                    <Field
                      name="vast_wrapper_url"
                      className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter VAST Wrapper URL"
                      disabled={!!values.vast_creative_url}
                    />
                  </div>

                  <div className="flex items-center justify-center pt-8">
                    <span className="text-[#6B7280] text-base font-medium">OR</span>
                  </div>

                  <div>
                    <Label className="block mb-2.5 text-[#374151] text-sm font-medium">VAST Creative URL</Label>
                    <Field
                      name="vast_creative_url"
                      className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter VAST Creative URL"
                      disabled={!!values.vast_wrapper_url}
                    />
                  </div>
                </div>

                <div className="mt-10">
                  <h3 className="text-[#374151] text-sm font-medium mb-6">Extra Parameters (Only for Reporting)</h3>
                  <div className="grid grid-cols-3 gap-x-6">
                    <div>
                      <Label className="block mb-2.5 text-[#374151] text-sm font-medium">Extra Parameter 1</Label>
                      <Field
                        name="extra_param_1"
                        className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter Extra Parameter 1"
                      />
                    </div>

                    <div>
                      <Label className="block mb-2.5 text-[#374151] text-sm font-medium">Extra Parameter 2</Label>
                      <Field
                        name="extra_param_2"
                        className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter Extra Parameter 2"
                      />
                    </div>

                    <div>
                      <Label className="block mb-2.5 text-[#374151] text-sm font-medium">Extra Parameter 3</Label>
                      <Field
                        name="extra_param_3"
                        className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter Extra Parameter 3"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <h3 className="text-[#374151] text-sm font-medium mb-6">Frequency CAP config</h3>
                  <div className="grid grid-cols-3 gap-x-6">
                    <div>
                      <Label className="block mb-2.5 text-[#374151] text-sm font-medium flex items-center">
                        Capping Threshold
                        <div className="ml-1.5 rounded-full bg-[#F3F4F6] p-0.5">
                          <Info className="w-4 h-4 text-[#6B7280]" />
                        </div>
                      </Label>
                      <Field
                        name="capping_threshold"
                        className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter Capping Threshold"
                      />
                    </div>

                    <div>
                      <Label className="block mb-2.5 text-[#374151] text-sm font-medium flex items-center">
                        Capping Timeframe*
                        <div className="ml-1.5 rounded-full bg-[#F3F4F6] p-0.5">
                          <Info className="w-4 h-4 text-[#6B7280]" />
                        </div>
                      </Label>
                      <Select
                        value={values.capping_timeframe}
                        onValueChange={(value: string) => setFieldValue("capping_timeframe", value)}
                      >
                        <SelectTrigger className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md text-left flex justify-between items-center text-sm">
                          <SelectValue placeholder="Select Capping Timeframe" className="text-[#9CA3AF]" />
                        
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-[#E5E7EB] rounded-md shadow-lg">
                          <SelectItem value="daily" className="px-3 py-2 text-sm hover:bg-[#F3F4F6] cursor-pointer">
                            Daily
                          </SelectItem>
                          <SelectItem value="weekly" className="px-3 py-2 text-sm hover:bg-[#F3F4F6] cursor-pointer">
                            Weekly
                          </SelectItem>
                          <SelectItem value="monthly" className="px-3 py-2 text-sm hover:bg-[#F3F4F6] cursor-pointer">
                            Monthly
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center mt-8">
                      <Checkbox
                        id="f_cap_accross_platform"
                        checked={values.f_cap_accross_platform}
                        onCheckedChange={(checked: boolean) =>
                          setFieldValue("f_cap_accross_platform", checked)
                        }
                        className="w-4 h-4 border border-[#E5E7EB] rounded mr-2 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                      />
                      <label 
                        htmlFor="f_cap_accross_platform" 
                        className="text-[#374151] text-sm cursor-pointer"
                      >
                        Enable F-cap across platform
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <hr className="w-[95%] border-[#E5E7EB] my-6" />
                  <div className="mb-6">
                    <p className="text-[#374151] text-sm font-medium">
                      <b>Custom trackers (optional)</b>
                    </p>
                  </div>
                  <div className="mb-6">
                    <Button
                      type="button"
                      onClick={() => {
                        setFieldValue("tp_tracker_type", [...values.tp_tracker_type, ""]);
                        setFieldValue("tp_tracker_url", [...values.tp_tracker_url, ""]);
                      }}
                      variant="default"
                      className="bg-[#9C27B0] hover:bg-[#7B1FA2] text-white"
                    >
                      Add Custom Tracker
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {values.tp_tracker_type.map((_, index) => (
                      <div key={index} className="grid grid-cols-[1fr,1fr,auto] gap-x-4 items-start">
                        <div>
                          <Label className="block mb-2.5 text-[#374151] text-sm font-medium">Custom Tracker Name</Label>
                          <Select
                            value={values.tp_tracker_type[index]}
                            onValueChange={(value: string) => {
                              const newTypes = [...values.tp_tracker_type];
                              newTypes[index] = value;
                              setFieldValue("tp_tracker_type", newTypes);
                            }}
                          >
                            <SelectTrigger className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md text-left flex justify-between items-center text-sm">
                              <SelectValue placeholder="Select Tracker Name" className="text-[#9CA3AF]" />
                              <span className="text-[#6B7280]">
                                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                              </span>
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-[#E5E7EB] rounded-md shadow-lg">
                              {customTrackersList.map((tracker) => (
                                <SelectItem 
                                  key={tracker.value} 
                                  value={tracker.value}
                                  className="px-3 py-2 text-sm hover:bg-[#F3F4F6] cursor-pointer"
                                >
                                  {tracker.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.tp_tracker_type?.[index] && touched.tp_tracker_type?.[index] && (
                            <div className="text-red-500 text-xs mt-1">{errors.tp_tracker_type[index]}</div>
                          )}
                        </div>

                        <div>
                          <Label className="block mb-2.5 text-[#374151] text-sm font-medium">Custom Tracker URL</Label>
                          <Field
                            name={`tp_tracker_url.${index}`}
                            className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter Tracker URL"
                          />
                          {errors.tp_tracker_url?.[index] && touched.tp_tracker_url?.[index] && (
                            <div className="text-red-500 text-xs mt-1">{errors.tp_tracker_url[index]}</div>
                          )}
                        </div>

                        <div className="pt-8">
                          <Button
                            type="button"
                            onClick={() => {
                              const newTypes = values.tp_tracker_type.filter((_, i) => i !== index);
                              const newUrls = values.tp_tracker_url.filter((_, i) => i !== index);
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
          </div>
        )}
      </Formik>
    </Card>
  );
};

export default AddVastTracker;