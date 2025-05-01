import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Toast } from "../../../components/ToastHelper";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const BASE_URL =
  "https://oikgmuvt5b.execute-api.us-west-2.amazonaws.com/test/api/v1";

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const idToken = sessionStorage.getItem("IDToken");
    if (idToken) {
      config.headers.Authorization = `${idToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

type macro_type =
  | "video_youtube"
  | "video_vast"
  | "display_ins"
  | "display_native"
  | "display_standard"
  | "display_tracker"
  | "video_1x1";

interface DisplayTrackerPayload {
  tracker_type: macro_type;
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
const successMessages: Record<macro_type, string> = {
  display_standard: "Standard Display Tracker created successfully",
  display_native: "Native Display Tracker created successfully",
  display_ins: "INS Wrapping Tracker created successfully",
  video_1x1: "1x1 Tracker created successfully",
  video_youtube: "YouTube Tracker created successfully",
  video_vast: "Vast Tracker created successfully",
  display_tracker: "Display Tracker created successfully",
};

const errorMessages: Record<macro_type, string> = {
  display_standard: "Failed to create Standard Display Tracker",
  display_native: "Failed to create Native Display Tracker",
  display_ins: "Failed to create INS Wrapping Tracker",
  video_1x1: "Failed to create 1x1 Tracker",
  video_youtube: "Failed to create YouTube Tracker",
  video_vast: "Failed to create Vast Tracker",
  display_tracker: "Failed to create Display Tracker",
};

const APIS = {
  async getPlatforms(macro_type: macro_type): Promise<any> {
    const data: any = await api.get(
      `/config_dashboard/list_platforms?macro_type=${macro_type}`
    );
    return data.data;
  },
  async list_tp_tracker_types(
    package_name: string,
    tracker_type: macro_type
  ): Promise<any> {
    const data: any = await api.get(
      `config_dashboard/list_tp_tracker_types?package_name=${package_name}&tracker_type=${tracker_type}`
    );
    console.log("===============================", data.data);
    return data.data;
  },
  async createDisplayTracker(payload: DisplayTrackerPayload): Promise<any> {
    const endpoints: Partial<Record<macro_type, string>> = {
      display_standard: "/api/add_display_standard",
      display_native: "/api/add_display_native",
      display_ins: "/api/add_display_ins",
      video_1x1: "/api/add_1x1_tracker",
      video_youtube: "/api/add_youtube_tracker",
      video_vast: "/api/add_vast_tracker",
      display_tracker: "/api/add_display_tracker",
    };

    const endpoint = endpoints[payload.tracker_type];

    if (!endpoint) {
      throw new Error("Invalid tracker type");
    }

    const data: any = await api.post(endpoint, payload);
    return data.data;
  },
  async createVastTracker(payload: any): Promise<any> {
    const data: any = await api.post(
      "config_dashboard/create_tracker",
      payload
    );

    return data.data;
  },
  async create1x1Tracker(payload: OneXOneTrackerPayload): Promise<any> {
    const data: any = await api.post("/api/add_1x1_tracker", payload);
    return data.data;
  },
  async createYoutubeTracker(payload: YoutubeTrackerPayload): Promise<any> {
    const data: any = await api.post("/api/add_youtube_tracker", payload);
    return data.data;
  },
};

function useGetPlatforms(macro_type: macro_type) {
  return useQuery({
    queryKey: ["platforms", macro_type],
    queryFn: () => APIS.getPlatforms(macro_type),
  });
}
function useListTpTrackerTypes(package_name: string, macro_type: macro_type) {
  return useQuery({
    queryKey: ["list_tp_tracker_types", package_name, macro_type],
    queryFn: () => APIS.list_tp_tracker_types(package_name, macro_type),
  });
}

function useCreateDisplayTracker() {
  return useMutation({
    mutationFn: APIS.createDisplayTracker,
    onSuccess: () => {
      const successMessage = successMessages["video_vast"];
      Toast.success({ description: successMessage });
    },
    onError: () => {
      const errorMessage = errorMessages["video_vast"];
      Toast.error({ description: errorMessage });
    },
  });
}

function useCreate1x1Tracker() {
  return useMutation({
    mutationFn: APIS.create1x1Tracker,
    onSuccess: () => {
      Toast.success({ description: "1x1 Tracker created successfully" });
    },
    onError: () => {
      Toast.error({ description: "Failed to create 1x1 Tracker" });
    },
  });
}

function useCreateYoutubeTracker() {
  return useMutation({
    mutationFn: APIS.createYoutubeTracker,
    onSuccess: () => {
      Toast.success({ description: "YouTube Tracker created successfully" });
    },
    onError: () => {
      Toast.error({ description: "Failed to create YouTube Tracker" });
    },
  });
}

function useCreateVastTracker() {
  return useMutation({
    mutationFn: APIS.createVastTracker,
    onSuccess: () => {
      Toast.success({ description: "Vast Tracker created successfully" });
    },
    onError: () => {
      Toast.error({ description: "Failed to create Vast Tracker" });
    },
  });
}

export {
  useGetPlatforms,
  useCreateDisplayTracker,
  useCreate1x1Tracker,
  useCreateYoutubeTracker,
  useListTpTrackerTypes,
  useCreateVastTracker,
};
