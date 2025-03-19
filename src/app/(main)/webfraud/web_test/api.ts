import { toast, useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { PACKAGES, TRACKER } from "./DATA";
import axios from "axios";

type ToastType = {
  description: string;
  title?: string;
  duration?: number;
};

export class Toast {
  static default(data: ToastType) {
    const { title, description, duration } = data;
    toast({
      title: title || "",
      description: description,
      duration: duration || 1500,
      className: "text-white bg-green-500 capitalize ",
    });
  }
  static success(data: ToastType) {
    const { title, description, duration } = data;
    toast({
      title: title || "success",
      description: description,
      duration: duration || 1500,
      className: "text-white bg-green-500 capitalize ",
    });
  }
  static error(data: ToastType) {
    const { title, description, duration } = data;
    toast({
      title: title || "error",
      description: description,
      duration: duration || 1500,
      className: "text-white bg-red-500 capitalize ",
    });
  }
}

function parseJSON(response: Response) {
  return response.json();
}

const dummyCode = `<script>
(function(m, f, i, l, t, e, r) {
    m[t] = m[t] || function() {
        (m[t].q = m[t].q || []).push(arguments)
    }, m[t].l = 1 * new Date();
    e = f.createElement(l);
    e.async = 1;
    e.id = "mfilterit-visit-tag";
    e.src = i;
    r = f.getElementsByTagName(l)[0];
    r.parentNode.insertBefore(e, r);
})(window, document, "script_url", "script", "mf");
    mf("mf_package_name", "web.test_package.cpv");
    mf("mf_tracking_type", "pageviews"); 
</script> `;

const BASE_URL =
  "https://hu5lf9ft08.execute-api.ap-south-1.amazonaws.com/api/v1/";
// "config_dashboard/customers"
// queryClient.js

// export const queryClient = new QueryClient();

const WEB_TEST_APIS = {
  async getPackages(): Promise<any> {
    const data: any = await axios.get(BASE_URL + "config_dashboard/customers");
    return data.data.data;
  },
  async getTrackers({ queryKey }: any): Promise<any> {
    const [_key, packageName] = queryKey;
    const data: any = await axios.get(BASE_URL + `config_dashboard/trackers?package_name=${packageName}`);
    return data.data.data;
  },
  async getPlatforms(): Promise<any> {
    const data: any = await axios.get(BASE_URL + "config_dashboard/platforms");
    return data.data.data;
  },
  async createTracker(payload: any): Promise<any> {
    let data: any = await axios.post(
      BASE_URL + "config_dashboard/trackers/create",
      payload
    );
    data = data.data.data;
    console.log(["trackers", payload["package_name"]]);
    // queryClient.invalidateQueries({
    //   queryKey: ["trackers", payload["package_name"]],
    // });
    if (data.tracker_url) {
      return {
        language: "url",
        data: data.tracker_url,
      };
    }
  },
  async deleteTracker(payload: any): Promise<any> {
    const { packageName, trackerId } = payload;
    console.log(trackerId);
    try {
      await axios.delete(
        BASE_URL + `config_dashboard/trackers/${trackerId}/delete`
      );
      Toast.success({ description: "tracker deleted" });
    } catch (err) {
      console.log(err);
      Toast.error({ description: "Failed to delete tracker" });
    }
  },
  async getTrackerConfig({ queryKey }: any): Promise<any> {
    const [_key, trackerId] = queryKey;
    const data: any = await axios.get(
      BASE_URL + `config_dashboard/trackers/${trackerId}/get_config`
    );
    return data.data.data;
  },
  async updateTrackerConfig(payload: any): Promise<any> {
    const { trackerId, data:updatedConfig }: any = payload;
    let data: any = await axios.patch(
      BASE_URL + `config_dashboard/trackers/${trackerId}/set_config`,
      updatedConfig
    );
    data = data.data.data;
    return data;
  },
};

function useGetPackages() {
  return useQuery({ queryKey: "packages", queryFn: WEB_TEST_APIS.getPackages });
}
function useGetPlatforms() {
  return useQuery({
    queryKey: "platforms",
    queryFn: WEB_TEST_APIS.getPlatforms,
  });
}
function useGetTrackers(packageName: string | undefined) {
  return useQuery({
    queryKey: ["trackers", packageName],
    queryFn: WEB_TEST_APIS.getTrackers,
  });
}

function useGetTrackerConfig(trackerId: string) {
  return useQuery({
    queryKey: ["tracker_config", trackerId],
    queryFn: WEB_TEST_APIS.getTrackerConfig,
  });
}

function useCreateTracker() {
  return useMutation({
    mutationFn: WEB_TEST_APIS.createTracker,
    onSuccess: () => Toast.success({ description: "Tracker created" }),
    onError: () => Toast.error({ description: " failed creating Tracker" }),
  });
}
function useUpdateTrackerConfig() {
  return useMutation({
    mutationFn: WEB_TEST_APIS.updateTrackerConfig,
    onSuccess: () => Toast.success({ description: "Tracker updated" }),
    onError: () => Toast.error({ description: " failed updating Tracker" }),
  });
}
function useDeleteTracker(packageName: any) {
  const q = useQueryClient();
  return useMutation({
    mutationFn: WEB_TEST_APIS.deleteTracker,
    onSuccess: () => {
      q.invalidateQueries({ queryKey: ["trackers", packageName] });
    },
  });
}

export {
  useGetPackages,
  useGetTrackers,
  useGetPlatforms,
  useGetTrackerConfig,
  useCreateTracker,
  useUpdateTrackerConfig,
  useDeleteTracker,
};

// function checkStatus(response: Response) {
//   if (response.ok) {
//     return response;
//   } else {
//     const httpErrorInfo = {
//       status: response.status,
//       statusText: response.statusText,
//       url: response.url,
//     };
//     console.log(
//       `logging http details for debugging: ${JSON.stringify(httpErrorInfo)}`
//     );

//     let errorMessage = translateStatusToErrorMessage(httpErrorInfo.status);
//     throw new Error(errorMessage);
//   }
// }

// function translateStatusToErrorMessage(status: number) {
//   switch (status) {
//     case 401:
//       return "Please login again.";
//     case 403:
//       return "You do not have permission to view the photos.";
//     default:
//       return "There was an error retrieving the photos. Please try again.";
//   }
// }
