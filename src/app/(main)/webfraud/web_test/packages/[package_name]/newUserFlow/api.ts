import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Toast } from "../../../components/ToastHelper";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
export const WEB_TEST_APIS_BASE_URL =
  "https://oikgmuvt5b.execute-api.us-west-2.amazonaws.com/test/api/v1";

// Create axios instance with default config
const api = axios.create({
  baseURL: WEB_TEST_APIS_BASE_URL,
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
    return data.data;
  },
  async list_creatives(
    package_name: string
    // type: "video" | "display"
  ): Promise<any> {
    const data: any = await api.get(
      `config_dashboard/list_creatives?package_name=${package_name}`
    );
    return data.data;
  },
  async uploadToS3(
    upload_type: "url" | "video" = "video",
    package_name: string,
    file_name: string,
    file: File
  ): Promise<any> {
    try {
      if (upload_type === "video") {
        const data: any = await api.get(
          `config_dashboard/generate_presigned_url?package_name=${package_name}&file_name=${file_name}`
        );
        const presigned_url =
          "https://s3.ap-south-1.amazonaws.com/wafs-creative-hosting/assets/web.test_package.cpv/MTc0NjE4MDM5MjM4Mg.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASB2TGVD5I3LFVC64%2F20250502%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250502T100632Z&X-Amz-Expires=300&X-Amz-SignedHeaders=host&X-Amz-Signature=7eb5d2566a14bb41144640a3cecfd046f73577286dcbfb18c6234d4b93c60dc9";
        const res_file_name =
          "assets/web.test_package.cpv/MTc0NjE4MDM5MjM4Mg.mp4";
        await fetch(presigned_url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        return res_file_name;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong while uploading the video");
    }
  },
  async uploadCreative(payload: any): Promise<any> {
    const data: any = await api.post(
      "config_dashboard/upload_creative",
      payload
    );
    return data.data;
  },
  async createTracker(payload: any): Promise<any> {
    const data: any = await api.post(
      "config_dashboard/create_tracker",
      payload
    );

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

function useCreateVastTracker() {
  return useMutation({
    mutationFn: (payload: any) => APIS.createTracker(payload),
    onSuccess: () => {
      Toast.success({ description: "Vast Tracker created successfully" });
    },
    onError: () => {
      Toast.error({ description: "Failed to create Vast Tracker" });
    },
  });
}

function useListCreatives(package_name: string) {
  return useQuery({
    queryKey: ["list_creatives", package_name],
    queryFn: () => APIS.list_creatives(package_name),
  });
}

function useUploadCreative() {
  return useMutation({
    mutationFn: (payload: any) => APIS.uploadCreative(payload),
    onSuccess: () => {
      Toast.success({ description: "Creative uploaded successfully" });
    },
    onError: () => {
      Toast.error({ description: "Failed to upload Creative" });
    },
  });
}

export {
  useGetPlatforms,
  useListTpTrackerTypes,
  useCreateVastTracker,
  useListCreatives,
  useUploadCreative,
  APIS,
};
