import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const BASE_URL = "https://oyyy02f09h.execute-api.ap-south-1.amazonaws.com";

type TrackerType = "display_standard" | "display_native" | "display_ins" | "video_1x1" | "video_youtube";

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

interface YoutubeTrackerPayload {
  platform_name: string;
  campaign_name: string;
  tag_identifier: string;
  ro_number?: string;
  tracker_type: "video_youtube";
  email: string;
  domain_name: string;
  package_name: string;
}

const APIS = {
  async getPlatforms(packageName: string, trackerType: TrackerType): Promise<any> {
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

  async createYoutubeTracker(payload: YoutubeTrackerPayload): Promise<any> {
    const data: any = await axios.post(
      `${BASE_URL}/api/add_youtube_tracker`,
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

function useGetPlatforms(packageName: string, trackerType: TrackerType) {
  return useQuery({
    queryKey: ["platforms", packageName, trackerType],
    queryFn: () => APIS.getPlatforms(packageName, trackerType),
  });
}

const successMessages: Record<TrackerType, string> = {
  display_standard: "Standard Display Tracker created successfully",
  display_native: "Native Display Tracker created successfully",
  display_ins: "INS Wrapping Tracker created successfully",
  video_1x1: "1x1 Tracker created successfully",
  video_youtube: "YouTube Tracker created successfully"
};

const errorMessages: Record<TrackerType, string> = {
  display_standard: "Failed to create Standard Display Tracker",
  display_native: "Failed to create Native Display Tracker",
  display_ins: "Failed to create INS Wrapping Tracker",
  video_1x1: "Failed to create 1x1 Tracker",
  video_youtube: "Failed to create YouTube Tracker"
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

function useCreateYoutubeTracker() {
  return useMutation({
    mutationFn: APIS.createYoutubeTracker,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "YouTube Tracker created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create YouTube Tracker",
        variant: "destructive",
      });
    },
  });
}

export { useGetPlatforms, useCreateDisplayTracker, useCreate1x1Tracker, useCreateYoutubeTracker };
