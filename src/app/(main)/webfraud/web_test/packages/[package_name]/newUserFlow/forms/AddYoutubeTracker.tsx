import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter, useParams } from "next/navigation";
import { Loader2, Copy } from "lucide-react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { useGetPlatforms, useCreateYoutubeTracker } from "../api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface Platform {
  value: string;
  label: string;
}

interface PlatformData {
  platform_name: string;
  platform_id: string;
}

const validationSchema = Yup.object().shape({
  platform_name: Yup.string()
    .matches(/^[a-zA-Z0-9_-]+$/, "Invalid characters in the string")
    .required("Platform Name is required"),
  campaign_name: Yup.string()
    .matches(/^[a-zA-Z0-9_-]+$/, "Invalid characters in the string")
    .required("Campaign Name is required"),
  tag_identifier: Yup.string()
    .matches(/^[a-zA-Z0-9_-]+$/, "Invalid characters in the string")
    .required("Tag Identifier is required"),
  ro_number: Yup.string()
    .matches(/^[a-zA-Z0-9_-]+$/, "Invalid characters in the string")
    .optional(),
});

const TrackerCopyModal = ({
  tracker,
  onClose,
  onReset,
}: {
  tracker: string;
  onClose: () => void;
  onReset: () => void;
}) => {
  const [copyText, setCopyText] = useState("Copy Tracker");
  const router = useRouter();

  const handleCopy = () => {
    navigator.clipboard.writeText(tracker);
    setCopyText("Copied!");
    setTimeout(() => setCopyText("Copy Tracker"), 2000);
  };

  const handleClose = () => {
    router.push("/dvtrackers/video");
    onClose();
  };

  return (
    <Dialog open={!!tracker} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tracker created successfully!</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Youtube Tracker</Label>
            <Input value={tracker} readOnly className="min-h-[100px]" />
          </div>
          <Button onClick={handleCopy} className="w-full">
            <Copy className="mr-2 h-4 w-4" />
            {copyText}
          </Button>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              onReset();
              onClose();
            }}
          >
            Create Another Tracker
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AddYoutubeTracker = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [trackerUrl, setTrackerUrl] = useState("");

  const params = useParams();
  const packageName =
    typeof params.package_name === "string" ? params.package_name : "";
  const { data: platformsData, isLoading: isLoadingPlatforms } =
    useGetPlatforms(packageName, "video_youtube");
  const createYoutubeTracker = useCreateYoutubeTracker();

  const platforms: Platform[] =
    platformsData?.map((platform: PlatformData) => ({
      value: platform.platform_name,
      label: platform.platform_name,
    })) || [];

  const initialValues = {
    platform_name: "",
    campaign_name: "",
    tag_identifier: "",
    ro_number: "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    setIsLoading(true);
    try {
      const payload = {
        ...values,
        tracker_type: "video_youtube" as const,
        email: localStorage.getItem("email") || "",
        domain_name: localStorage.getItem("displayVideoDomain") || "",
        package_name: packageName,
      };

      const response = await createYoutubeTracker.mutateAsync(payload);
      setTrackerUrl(response.tracker_url);
    } catch (error) {
      console.error("Failed to create tracker:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8 max-w-4xl mx-auto">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form className="space-y-8">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="platform_name">Platform Name*</Label>
                  <Select
                    onValueChange={(value) =>
                      setFieldValue("platform_name", value)
                    }
                    value={values.platform_name}
                    disabled={isLoadingPlatforms}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoadingPlatforms
                            ? "Loading platforms..."
                            : "Select Platform Name"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingPlatforms ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="ml-2">Loading platforms...</span>
                        </div>
                      ) : (
                        platforms.map((platform: Platform) => (
                          <SelectItem
                            key={platform.value}
                            value={platform.value}
                          >
                            {platform.label}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.platform_name && touched.platform_name && (
                    <p className="text-sm text-red-500">
                      {errors.platform_name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campaign_name">Campaign Name*</Label>
                  <Field
                    as={Input}
                    name="campaign_name"
                    placeholder="Enter Campaign Name"
                  />
                  {errors.campaign_name && touched.campaign_name && (
                    <p className="text-sm text-red-500">
                      {errors.campaign_name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tag_identifier">Tag Identifier*</Label>
                  <Field
                    as={Input}
                    name="tag_identifier"
                    placeholder="Enter Tag Identifier"
                  />
                  {errors.tag_identifier && touched.tag_identifier && (
                    <p className="text-sm text-red-500">
                      {errors.tag_identifier}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ro_number">RO Number</Label>
                  <Field
                    as={Input}
                    name="ro_number"
                    placeholder="Enter RO Number"
                  />
                  {errors.ro_number && touched.ro_number && (
                    <p className="text-sm text-red-500">{errors.ro_number}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-start">
              <Button type="submit" disabled={isLoading || isLoadingPlatforms}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Click Tracker"
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      <TrackerCopyModal
        tracker={trackerUrl}
        onClose={() => setTrackerUrl("")}
        onReset={() => setTrackerUrl("")}
      />
    </Card>
  );
};

export default AddYoutubeTracker;
