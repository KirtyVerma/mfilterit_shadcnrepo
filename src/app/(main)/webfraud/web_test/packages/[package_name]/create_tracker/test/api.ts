import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const BASE_URL = "https://oyyy02f09h.execute-api.ap-south-1.amazonaws.com";

type TrackerType = "display_standard" | "display_native" | "display_ins" | "video_1x1";

interface DisplayTrackerPayload {
  tracker_type: TrackerType;
  package_name: string;
  platform: string;
  tag_identifier: string;
  campaign_name: string;
  ro_number?: string;
  extra_param_1?: string;
  extra_param_2?: string;
  campaign_id?: string;
  placement_id?: string;
  advertiser_id?: string;
  ins_tag_text?: string;
}

interface OneXOneTrackerPayload {
  platform_name: string;
  ro_number?: string;
  campaign_name: string;
  tag_identifier: string;
  package_name: string;
  domain_name: string;
  trId: string;
  tracker_type: "video_1x1";
  email: string;
}

const APIS = {
  async getDisplayPlatforms(packageName: string, trackerType: TrackerType): Promise<any> {
    const data: any = await axios.get(
      `${BASE_URL}/api/platforms?package_name=${packageName}&tracker_type=${trackerType}`
    );
    return data.data.result.data;
  },

  async createDisplayTracker(payload: DisplayTrackerPayload): Promise<any> {
    const endpoints: Record<TrackerType, string> = {
      display_standard: "/api/add_display_standard",
      display_native: "/api/add_display_native",
      display_ins: "/api/add_display_ins",
      video_1x1: "/api/add_1x1_tracker"
    };

    const endpoint = endpoints[payload.tracker_type];

    if (!endpoint) {
      throw new Error("Invalid tracker type");
    }

    const data: any = await axios.post(
      `${BASE_URL}${endpoint}`,
      payload
    );
    return data.data;
  },

  async get1x1Platforms(packageName: string): Promise<any> {
    const data: any = await axios.get(
      `${BASE_URL}/api/platforms?package_name=${packageName}&tracker_type=video_1x1`
    );
    return data.data.result.data;
  },

  async create1x1Tracker(payload: OneXOneTrackerPayload): Promise<any> {
    const data: any = await axios.post(
      `${BASE_URL}/api/add_1x1_tracker`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data.data;
  },
};

function useGetDisplayPlatforms(packageName: string, trackerType: TrackerType) {
  return useQuery({
    queryKey: ["display_platforms", packageName, trackerType],
    queryFn: () => APIS.getDisplayPlatforms(packageName, trackerType),
  });
}

function useGet1x1Platforms(packageName: string) {
  return useQuery({
    queryKey: ["1x1_platforms", packageName],
    queryFn: () => APIS.get1x1Platforms(packageName),
  });
}

const successMessages: Record<TrackerType, string> = {
  display_standard: "Standard Display Tracker created successfully",
  display_native: "Native Display Tracker created successfully",
  display_ins: "INS Wrapping Tracker created successfully",
  video_1x1: "1x1 Tracker created successfully"
};

const errorMessages: Record<TrackerType, string> = {
  display_standard: "Failed to create Standard Display Tracker",
  display_native: "Failed to create Native Display Tracker",
  display_ins: "Failed to create INS Wrapping Tracker",
  video_1x1: "Failed to create 1x1 Tracker"
};

function useCreateDisplayTracker() {
  return useMutation({
    mutationFn: APIS.createDisplayTracker,
    onSuccess: (_, variables) => {
      const successMessage = successMessages[variables.tracker_type];

      toast({
        title: "Success",
        description: successMessage,
      });
    },
    onError: (_, variables) => {
      const errorMessage = errorMessages[variables.tracker_type];

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
}

function useCreate1x1Tracker() {
  return useMutation({
    mutationFn: APIS.create1x1Tracker,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "1x1 Tracker created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create 1x1 Tracker",
        variant: "destructive",
      });
    },
  });
}

export { useGetDisplayPlatforms, useCreateDisplayTracker, useGet1x1Platforms, useCreate1x1Tracker };
