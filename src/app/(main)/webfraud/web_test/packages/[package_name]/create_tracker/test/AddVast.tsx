import React, { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle2, Copy } from "lucide-react";
import { useParams } from "next/navigation";
// import { UploadCreative } from "./UploadCreative";

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
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Domain Name*</label>
                  <Field
                    as={Input}
                    name="domain_name"
                    placeholder="Enter domain name"
                    className={`w-full ${errors.domain_name && touched.domain_name ? "border-red-500" : ""}`}
                  />
                  <ErrorMessage name="domain_name" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Campaign Name*</label>
                  <Field
                    as={Input}
                    name="campaign_name"
                    placeholder="Enter campaign name"
                    className={`w-full ${errors.campaign_name && touched.campaign_name ? "border-red-500" : ""}`}
                  />
                  <ErrorMessage name="campaign_name" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform Name*</label>
                  <Field
                    as={Input}
                    name="platform_name"
                    placeholder="Enter platform name"
                    className={`w-full ${errors.platform_name && touched.platform_name ? "border-red-500" : ""}`}
                  />
                  <ErrorMessage name="platform_name" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Adset*</label>
                  <Field
                    as={Input}
                    name="adset"
                    placeholder="Enter adset"
                    className={`w-full ${errors.adset && touched.adset ? "border-red-500" : ""}`}
                  />
                  <ErrorMessage name="adset" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tag Identifier*</label>
                  <Field
                    as={Input}
                    name="tag_identifier"
                    placeholder="Enter tag identifier"
                    className={`w-full ${errors.tag_identifier && touched.tag_identifier ? "border-red-500" : ""}`}
                  />
                  <ErrorMessage name="tag_identifier" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">RO Number*</label>
                  <Field
                    as={Input}
                    name="ro_number"
                    placeholder="Enter RO number"
                    className={`w-full ${errors.ro_number && touched.ro_number ? "border-red-500" : ""}`}
                  />
                  <ErrorMessage name="ro_number" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Creative ID*</label>
                  <Field
                    as={Input}
                    name="creative_id"
                    placeholder="Enter creative ID"
                    className={`w-full ${errors.creative_id && touched.creative_id ? "border-red-500" : ""}`}
                  />
                  <ErrorMessage name="creative_id" component="div" className="text-red-500 text-sm" />
                </div>

                {activeTrackerType === "vast_wrapper" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">VAST Wrapper URL*</label>
                    <Field
                      as={Input}
                      name="vast_wrapper_url"
                      placeholder="Enter VAST wrapper URL"
                      className={`w-full ${errors.vast_wrapper_url && touched.vast_wrapper_url ? "border-red-500" : ""}`}
                    />
                    <ErrorMessage name="vast_wrapper_url" component="div" className="text-red-500 text-sm" />
                  </div>
                )}

                {activeTrackerType === "vast_creative" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">VAST Creative URL*</label>
                    <Field
                      as={Input}
                      name="vast_creative_url"
                      placeholder="Enter VAST creative URL"
                      className={`w-full ${errors.vast_creative_url && touched.vast_creative_url ? "border-red-500" : ""}`}
                    />
                    <ErrorMessage name="vast_creative_url" component="div" className="text-red-500 text-sm" />
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </Card>
  );
};

export default AddVastTracker;