import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { Toast } from "./components/ToastHelper";

const BASE_URL =
  "https://oikgmuvt5b.execute-api.us-west-2.amazonaws.com/test/api/v1/";

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

function parseJSON(response: Response) {
  return response.json();
}
function flattenObject(obj) {
  let r = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value != "object") r[key] = value;
    else {
      let k = Object.keys(value)[0];
      r[key] = k;
      r = { ...r, ...flattenObject(value[k]) };
    }
  }
  return r;
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

// "config_dashboard/customers"
// queryClient.js

// export const queryClient = new QueryClient();

const WEB_TEST_APIS = {
  async getPackages(): Promise<any> {
    const data: any = await api.get("config_dashboard/list_packages");
    return data.data;
  },
  async getTrackers({ queryKey }: any): Promise<any> {
    const [_key, packageName] = queryKey;
    const data: any = await api.get(
      `config_dashboard/list_trackers?package_name=${packageName}&limit=200&page=1`
    );
    console.log("data.data.trackers", data.data.trackers);
    return data.data.trackers;
  },
  async getNewTrackerSchema(tracker_type: string): Promise<any> {
    let data: any = await api.get(
      "config_dashboard/trackers/get_tracker_generation_schema"
    );
    data = data.data.data;
    const tracker_type_data = data.tracker_type[tracker_type];
    delete data.tracker_type;
    data = { ...data, ...tracker_type_data };

    return data;
  },
  async createTracker(payload: any): Promise<any> {
    payload = flattenObject(payload);
    let data: any = await api.post("config_dashboard/trackers/create", payload);
    data = data.data.data;
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
      await api.delete(`config_dashboard/trackers/${trackerId}/delete`);
      Toast.success({ description: "tracker deleted" });
    } catch (err) {
      console.log(err);
      Toast.error({ description: "Failed to delete tracker" });
    }
  },
  async getTrackerConfig({ queryKey }: any): Promise<any> {
    const [_key, trackerId] = queryKey;
    const data: any = await api.get(
      `config_dashboard/trackers/${trackerId}/get_config`
    );
    return data.data.data;
  },
  async updateTrackerConfig(payload: any): Promise<any> {
    const { trackerId, data: updatedConfig }: any = payload;
    let data: any = await api.patch(
      `config_dashboard/trackers/${trackerId}/set_config`,
      updatedConfig
    );
    data = data.data.data;
    return data;
  },
};

function useGetPackages() {
  return useQuery({ queryKey: "packages", queryFn: WEB_TEST_APIS.getPackages });
}
function useGetNewTrackerSchema(tracker_type: string) {
  return useQuery({
    queryKey: ["tracker_schema", tracker_type],
    queryFn: () => WEB_TEST_APIS.getNewTrackerSchema(tracker_type),
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
    staleTime: Infinity,
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
  useGetNewTrackerSchema,
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
