import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2, Info } from "lucide-react";
import { useParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const BASE_URL = "https://oyyy02f09h.execute-api.ap-south-1.amazonaws.com";

const TEST_DATA = {
  domain_name: "test-domain.com",
  tracker_type: "video_vast",
  campaign_name: "Test Campaign",
  platform_name: "facebook",
  adset: "Test Ad Set",
  tag_identifier: "Test Tracker",
  ro_number: "RO123456",
  extra_param_1: "Extra 1",
  extra_param_2: "Extra 2",
  extra_param_3: "Extra 3",
  creative_id: "creative1",
  vast_wrapper_url: "https://test.com/vast-wrapper.xml",
  vast_creative_url: "https://test.com/vast-creative.xml",
  capping_threshold: "1000",
  capping_timeframe: "daily",
  f_cap_accross_platform: true,
  enable_custom_tracker: false,
  tp_tracker_type: [],
  tp_tracker_url: [],
  package_name: "test-package",
  enable_double_spotting: true,
  double_spotting_threshold: "500"
};

interface TrackerCopyModalProps {
  show: boolean;
  tracker: string;
  onHide: () => void;
  resetForm: () => void;
}

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
  enable_double_spotting: boolean;
  double_spotting_threshold: string;
}

interface CustomTracker {
  type: string;
  url: string;
}

const schema = Yup.object().shape({
  ro_number: Yup.string().required("RO number is required"),
});

const TrackerCopyModal: React.FC<TrackerCopyModalProps> = ({ show, tracker, onHide, resetForm }) => {
  const router = useRouter();
  const [copyBtnText, setCopyBtnText] = useState("Copy Tracker");

  const closeModal = () => {
    router.push('/dvtrackers/video');
    onHide();
  };

  return (
    <div className={`fixed px-8 py-4 inset-0 bg-black bg-opacity-50 flex items-center justify-center ${show ? 'block' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <h2 className="text-xl text-center font-semibold mb-4">Tracker created successfully! Please copy the tracker.</h2>
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

const AddVastTracker: React.FC<AddVastTrackerProps> = ({ trackerType = "vast_creative" }) => {
  const { toast } = useToast();
  const [activeTrackerType, setActiveTrackerType] = useState(trackerType);
  const ref = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [generatedVastTracker, setGeneratedVastTracker] = useState<string | null>(null);
  const [customTrackers, setCustomTrackers] = useState<CustomTracker[]>([]);
  const params = useParams();
  const packageName = params.package_name as string;

  const initialFormValues: FormValues = {
    domain_name: TEST_DATA.domain_name,
    tracker_type: TEST_DATA.tracker_type,
    campaign_name: TEST_DATA.campaign_name,
    platform_name: TEST_DATA.platform_name,
    adset: TEST_DATA.adset,
    tag_identifier: TEST_DATA.tag_identifier,
    ro_number: TEST_DATA.ro_number,
    extra_param_1: TEST_DATA.extra_param_1,
    extra_param_2: TEST_DATA.extra_param_2,
    extra_param_3: TEST_DATA.extra_param_3,
    creative_id: TEST_DATA.creative_id,
    vast_wrapper_url: TEST_DATA.vast_wrapper_url,
    vast_creative_url: TEST_DATA.vast_creative_url,
    capping_threshold: TEST_DATA.capping_threshold,
    capping_timeframe: TEST_DATA.capping_timeframe,
    f_cap_accross_platform: TEST_DATA.f_cap_accross_platform,
    enable_custom_tracker: TEST_DATA.enable_custom_tracker,
    tp_tracker_type: TEST_DATA.tp_tracker_type,
    tp_tracker_url: TEST_DATA.tp_tracker_url,
    package_name: packageName,
    enable_double_spotting: TEST_DATA.enable_double_spotting,
    double_spotting_threshold: TEST_DATA.double_spotting_threshold,
  };

  const handleSubmitAPI = async (values: FormValues) => {
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

  return (
    <Card className="p-6">
      <div className=" mb-8">
        <h1 className="ml-24 text-2xl font-semibold text-[#374151] mb-4 txt-center">Edit Video Tracker</h1>
        <div className="border-b border-[#E5E7EB]"></div>
      </div>
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
              show={!!generatedVastTracker}
              tracker={generatedVastTracker || ""}
              onHide={() => setGeneratedVastTracker(null)}
              resetForm={() => resetForm({ values: initialFormValues })}
            />
            <Form className="max-w-[1200px] mx-auto">
              <div className="space-y-8">
                <div className="grid grid-cols-3 gap-x-6">
                  <div>
                    <Label className="block mb-2.5 text-[#374151] text-sm font-medium">Campaign Name*</Label>
                    <Field
                      name="campaign_name"
                      className="w-full h-11 px-3 bg-gray-50 border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 opacity-50 cursor-not-allowed"
                      placeholder="Enter Campaign Name"
                      disabled
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
                      disabled
                    >
                      <SelectTrigger className="w-full h-11 px-3 bg-gray-50 border border-[#E5E7EB] rounded-md text-left flex justify-between items-center text-sm opacity-50 cursor-not-allowed">
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
                    <Label className="block mb-2.5 text-[#374151] text-sm font-medium">Creatives*</Label>
                    <Select
                      value={values.creative_id}
                      onValueChange={(value: string) => setFieldValue("creative_id", value)}
                      disabled
                    >
                      <SelectTrigger className="w-full h-11 px-3 bg-gray-50 border border-[#E5E7EB] rounded-md text-left flex justify-between items-center text-sm opacity-50 cursor-not-allowed">
                        <SelectValue placeholder="Select Creative" className="text-[#9CA3AF]" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-[#E5E7EB] rounded-md shadow-lg">
                        <SelectItem value="creative1">Creative 1</SelectItem>
                        <SelectItem value="creative2">Creative 2</SelectItem>
                        <SelectItem value="creative3">Creative 3</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.creative_id && touched.creative_id && (
                      <div className="text-red-500 text-xs mt-1">{errors.creative_id}</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-x-6">
                  <div>
                    <Label className="block mb-2.5 text-[#374151] text-sm font-medium">Ad Set*</Label>
                    <Field
                      name="adset"
                      className="w-full h-11 px-3 bg-gray-50 border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 opacity-50 cursor-not-allowed"
                      placeholder="Enter Ad Set"
                      disabled
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
                      className="w-full h-11 px-3 bg-gray-50 border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 opacity-50 cursor-not-allowed"
                      placeholder="Enter Tracker Name"
                      disabled
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
                          disabled
                        >
                          <SelectTrigger className={`w-full h-11 px-3 bg-gray-50 border border-[#E5E7EB] rounded-md text-left flex justify-between items-center text-sm transition-colors opacity-50 cursor-not-allowed`}>
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

                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="f_cap_accross_platform"
                          checked={values.f_cap_accross_platform}
                          onCheckedChange={(checked: boolean) =>
                            setFieldValue("f_cap_accross_platform", checked)
                          }
                          className="w-4 h-4 border border-[#E5E7EB] rounded data-[state=checked]:bg-[#9C27B0] data-[state=checked]:border-[#9C27B0] transition-colors opacity-50 cursor-not-allowed"
                          disabled
                        />
                        <label 
                          htmlFor="f_cap_accross_platform" 
                          className="text-[#374151] text-sm font-medium cursor-pointer hover:text-[#9C27B0] transition-colors opacity-50"
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
                            className="w-4 h-4 border border-[#E5E7EB] rounded data-[state=checked]:bg-[#9C27B0] data-[state=checked]:border-[#9C27B0] transition-colors opacity-50 cursor-not-allowed"
                            disabled
                          />
                          <label 
                            htmlFor="enable_double_spotting" 
                            className="text-[#374151] text-sm font-medium cursor-pointer hover:text-[#9C27B0] transition-colors opacity-50"
                          >
                            Enable Double Spotting
                          </label>
                        </div>

                        {values.enable_double_spotting && (
                          <div className="pl-7">
                            <Field
                              name="double_spotting_threshold"
                              className="w-1/3 h-11 px-3 bg-gray-50 border border-[#E5E7EB] rounded-md placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors opacity-50 cursor-not-allowed"
                              placeholder="Enter Double Spotting Threshold"
                              type="number"
                              disabled
                            />
                            {errors.double_spotting_threshold && touched.double_spotting_threshold && (
                              <div className="text-red-500 text-xs mt-1">{errors.double_spotting_threshold}</div>
                            )}
                          </div>
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