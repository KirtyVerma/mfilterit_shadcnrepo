import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "react-query";
import { PACKAGES, TRACKER } from "./DATA";

const fnc = ({ message, type }: any) => {
  const { toast } = useToast();
  let className = "text-white";
  if (type === "success") className = className + "bg-green-500 ";
  else if (type === "warning") className = className + "bg-green-500 ";
  else className = className + "bg-red-500 ";

  const toastObj = toast({
    description: message,
    className: className,
  });
  setTimeout(() => {
    toastObj.dismiss();
  }, 1000);
};

function translateStatusToErrorMessage(status: number) {
  switch (status) {
    case 401:
      return "Please login again.";
    case 403:
      return "You do not have permission to view the photos.";
    default:
      return "There was an error retrieving the photos. Please try again.";
  }
}

function checkStatus(response: Response) {
  if (response.ok) {
    return response;
  } else {
    const httpErrorInfo = {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    };
    console.log(
      `logging http details for debugging: ${JSON.stringify(httpErrorInfo)}`
    );

    let errorMessage = translateStatusToErrorMessage(httpErrorInfo.status);
    throw new Error(errorMessage);
  }
}

function parseJSON(response: Response) {
  return response.json();
}

function delay(ms: number) {
  return function (x: any) {
    return new Promise((resolve) => setTimeout(() => resolve(x), ms));
  };
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

const WEB_TEST_APIS = {
  getPreview(): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(dummyCode);
      }, 2000);
    });
  },
  getPackages(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(PACKAGES);
      }, 2000);
    });
  },
  getPackage({ queryKey }: any): Promise<any> {
    const [_key, packageName] = queryKey; //
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(TRACKER.filter((item) => item.package_name === packageName));
      }, 2000);
    });
  },
};

function useGetPreview() {
  return useMutation({ mutationFn: WEB_TEST_APIS.getPreview });
}
function useGetPackages() {
  return useQuery({ queryKey: "packages", queryFn: WEB_TEST_APIS.getPackages });
}
function useGetPackage(packageName: string) {
  return useQuery({
    queryKey: ["package", packageName],
    queryFn: WEB_TEST_APIS.getPackage,
  });
}

export { useGetPreview, useGetPackages, useGetPackage };
