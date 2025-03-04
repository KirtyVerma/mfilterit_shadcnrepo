import { toast, useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "react-query";
import { PACKAGES, TRACKER } from "./DATA";
import axios from "axios";

type ToastType = {
  description: string;
  title?: string;
  duration?: number;
};
class Toast {
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

const WEB_TEST_APIS = {
  async getPackages(): Promise<any> {
    const data: any = await axios.get(BASE_URL + "config_dashboard/customers");
    return data.data.customers;
  },
  async getPackage({ queryKey }: any): Promise<any> {
    const [_key, packageName] = queryKey;
    const data: any = await axios.get(BASE_URL + "config_dashboard/trackers");
    return data.data;
  },
  getPreview(): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(dummyCode);
      }, 2000);
    });
  },
  async getPlatforms(): Promise<any> {
    const data: any = await axios.get(BASE_URL + "config_dashboard/platforms");
    return data.data.data;
  },
};

function useGetPackages() {
  return useQuery({ queryKey: "packages", queryFn: WEB_TEST_APIS.getPackages });
}
function useGetPackage(packageName: string | undefined) {
  return useQuery({
    queryKey: ["package", packageName],
    queryFn: WEB_TEST_APIS.getPackage,
  });
}
function useGetPlatforms() {
  return useQuery({
    queryKey: "platforms",
    queryFn: WEB_TEST_APIS.getPlatforms,
  });
}
function useGetPreview() {
  return useMutation({
    mutationFn: WEB_TEST_APIS.getPreview,
    // onSuccess: () => Toast.success({ description: "it works on success" }),
  });
}

export { useGetPreview, useGetPackages, useGetPackage, useGetPlatforms };

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
