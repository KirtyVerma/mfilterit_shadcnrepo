import React, { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2, Info, ChevronDown, Check, Upload } from "lucide-react";
import { useParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UploadCreative from "./UploadCreative";

const BASE_URL = "https://oyyy02f09h.execute-api.ap-south-1.amazonaws.com";

interface TrackerCopyModalProps {
  show: boolean;
  tracker: string;
  onHide: () => void;
  resetForm: () => void;
}

interface AddDisplayTrackerProps {
  trackerType?: string;
  inputType?: "url" | "upload";
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
  creative_id: string[];
  display_creative_url: string;
  capping_threshold: string;
  capping_timeframe: string;
  tp_tracker_type: string[];
  tp_tracker_url: string[];
  package_name: string;
}

interface CustomTracker {
  type: string;
  url: string;
}

const schema = Yup.object().shape({
  domain_name: Yup.string().required("Domain name is required"),
  campaign_name: Yup.string().required("Campaign name is required"),
  platform_name: Yup.string().required("Platform name is required"),
  adset: Yup.string().required("Adset is required"),
  tag_identifier: Yup.string().required("Tag identifier is required"),
  ro_number: Yup.string().required("RO number is required"),
  creative_id: Yup.array().of(Yup.string()).min(1, "At least one creative must be selected"),
  display_creative_url: Yup.string().test("display_creative_url", "Display creative URL is required", function (value) {
    return this.parent.tracker_type !== "display_creative" || !!value;
  }),
  capping_threshold: Yup.string().test("capping_threshold", "Capping threshold must be a number", function (value) {
    if (!value) return true;
    return !isNaN(Number(value));
  }),
  capping_timeframe: Yup.string().test("capping_timeframe", "Capping timeframe is required when threshold is set", function (value) {
    if (this.parent.capping_threshold && !value) return false;
    return true;
  }),
});

const TrackerCopyModal: React.FC<TrackerCopyModalProps> = ({ show, tracker, onHide, resetForm }) => {
  const router = useRouter();
  const [copyBtnText, setCopyBtnText] = useState("Copy Tracker");

  const closeModal = () => {
    router.push('/dvtrackers/display');
    onHide();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${show ? 'block' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <h2 className="text-xl font-semibold mb-4">Tracker created successfully! Please copy the tracker.</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Display Tracker</label>
          <textarea
            className="w-full p-2 border rounded-md"
            rows={3}
            value={tracker}
            disabled
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={closeModal}>Close</Button>
          <Button onClick={() => {
            navigator.clipboard.writeText(tracker);
            setCopyBtnText("Copied successfully!");
            setTimeout(() => setCopyBtnText("Copy Tracker"), 1000);
          }}>
            {copyBtnText}
          </Button>
          <Button onClick={() => {
            resetForm();
            onHide();
          }}>
            Create Tracker again
          </Button>
        </div>
      </div>
    </div>
  );
};

const AddDisplayTracker: React.FC<AddDisplayTrackerProps> = ({ trackerType = "display_creative", inputType = "url" }) => {
  const { toast } = useToast();
  const [activeTrackerType, setActiveTrackerType] = useState(trackerType);
  const ref = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [generatedDisplayTracker, setGeneratedDisplayTracker] = useState<string | null>(null);
  const [customTrackers, setCustomTrackers] = useState<CustomTracker[]>([]);
  const [showCreativeDropdown, setShowCreativeDropdown] = useState(false);
  const creativeDropdownRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const packageName = params.package_name as string;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (creativeDropdownRef.current && !creativeDropdownRef.current.contains(event.target as Node)) {
        setShowCreativeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const initialFormValues: FormValues = {
    domain_name: "",
    tracker_type: "display_creative",
    campaign_name: "",
    platform_name: "",
    adset: "",
    tag_identifier: "",
    ro_number: "",
    extra_param_1: "",
    extra_param_2: "",
    extra_param_3: "",
    creative_id: [],
    display_creative_url: "",
    capping_threshold: "",
    capping_timeframe: "",
    tp_tracker_type: [],
    tp_tracker_url: [],
    package_name: packageName,
  };

  const handleSubmitAPI = async (values: FormValues) => {
    try {
      const response = await axios.post(`${BASE_URL}/display_tracker`, values);
      setGeneratedDisplayTracker(response.data.tracker_url);
      setShowModal(true);
      toast({
        title: "Success",
        description: "Display tracker created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create display tracker",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <Formik
        innerRef={ref}
        enableReinitialize={true}
        validationSchema={schema}
        onSubmit={handleSubmitAPI}
        initialValues={initialFormValues}
      >
        {({ values, handleChange, setFieldValue, handleBlur, touched, errors, resetForm, isSubmitting }) => (
          <div>
            <TrackerCopyModal
              show={!!generatedDisplayTracker}
              tracker={generatedDisplayTracker || ""}
              onHide={() => setGeneratedDisplayTracker(null)}
              resetForm={() => resetForm({ values: initialFormValues })}
            />
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
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
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

                {inputType === "upload" && (
                  <div className="mt-6">
                    <Label className="block mb-2.5 text-[#374151] text-sm font-medium">Creatives*</Label>
                    <div className="relative" ref={creativeDropdownRef}>
                      <div
                        className="w-full min-h-11 px-3 py-2 bg-white border border-[#E5E7EB] rounded-md text-left flex flex-wrap gap-2 text-sm cursor-pointer"
                        onClick={() => setShowCreativeDropdown(!showCreativeDropdown)}
                      >
                        {values.creative_id.length > 0 ? (
                          values.creative_id.map((creative) => (
                            <span
                              key={creative}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                            >
                              {creative}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFieldValue(
                                    "creative_id",
                                    values.creative_id.filter((c) => c !== creative)
                                  );
                                }}
                                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-purple-200"
                              >
                                ×
                              </button>
                            </span>
                          ))
                        ) : (
                          <span className="text-[#9CA3AF]">Select Creatives</span>
                        )}
                        <ChevronDown className="w-4 h-4 text-[#9CA3AF] ml-auto" />
                      </div>
                      {showCreativeDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-[#E5E7EB] rounded-md shadow-lg">
                          {["creative1", "creative2", "creative3", "creative4", "creative5"].map((creative) => (
                            <div
                              key={creative}
                              className={`px-3 py-2 cursor-pointer hover:bg-purple-50 ${
                                values.creative_id.includes(creative) ? "bg-purple-50" : ""
                              }`}
                              onClick={() => {
                                if (values.creative_id.includes(creative)) {
                                  setFieldValue(
                                    "creative_id",
                                    values.creative_id.filter((c) => c !== creative)
                                  );
                                } else {
                                  setFieldValue("creative_id", [...values.creative_id, creative]);
                                }
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[#374151] text-sm">{creative}</span>
                                {values.creative_id.includes(creative) && (
                                  <Check className="w-4 h-4 text-[#9C27B0]" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.creative_id && touched.creative_id && (
                      <div className="text-red-500 text-xs mt-1">{errors.creative_id}</div>
                    )}
                  </div>
                )}

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

                {inputType === "url" && (
                  <div>
                    <Label className="block mb-2.5 text-[#374151] text-sm font-medium">Display Creative URL</Label>
                    <Field
                      name="display_creative_url"
                      className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter Display Creative URL"
                    />
                    {errors.display_creative_url && touched.display_creative_url && (
                      <div className="text-red-500 text-xs mt-1">{errors.display_creative_url}</div>
                    )}
                  </div>
                )}

                <div className="mt-20">
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-x-8">
                      <div className="space-y-2">
                        <Label className="block text-[#374151] text-sm font-medium flex items-center">
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
                        {errors.capping_threshold && touched.capping_threshold && (
                          <div className="text-red-500 text-xs mt-1">{errors.capping_threshold}</div>
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
                          onValueChange={(value: string) => setFieldValue("capping_timeframe", value)}
                          disabled={!values.capping_threshold}
                        >
                          <SelectTrigger className={`w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md text-left flex justify-between items-center text-sm transition-colors ${!values.capping_threshold ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}>
                            <SelectValue placeholder="Select Capping Timeframe" className="text-[#9CA3AF]" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-[#E5E7EB] rounded-md shadow-lg">
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.capping_timeframe && touched.capping_timeframe && (
                          <div className="text-red-500 text-xs mt-1">{errors.capping_timeframe}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-20">
                  <h3 className="text-[#374151] text-lg font-semibold mb-6">Extra Parameters (Only for Reporting)</h3>
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

                <div className="mt-20">
                  <h3 className="text-[#374151] text-lg font-semibold mb-6">Custom trackers (optional)</h3>
                  <div className="space-y-6">
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
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-[#E5E7EB] rounded-md shadow-lg">
                              {customTrackers.map((tracker) => (
                                <SelectItem 
                                  key={tracker.type} 
                                  value={tracker.type}
                                >
                                  {tracker.type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="block mb-2.5 text-[#374151] text-sm font-medium">Custom Tracker URL</Label>
                          <Field
                            name={`tp_tracker_url.${index}`}
                            className="w-full h-11 px-3 bg-white border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter Tracker URL"
                          />
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
                      "Generate Display Tracker"
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
                <UploadCreative handleNext={() => setShowUploadModal(false)} acceptType="image" />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </Formik>
    </Card>
  );
};

export default AddDisplayTracker;
