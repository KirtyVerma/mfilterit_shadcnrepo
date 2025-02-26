import { useMutation, useQuery } from "react-query";

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
  //   getAll(page = 1, limit = 100) {
  //     return (
  //       fetch(`${url}?_page=${page}&_limit=${limit}`)
  //         // .then(delay(600))
  //         .then(checkStatus)
  //         .then(parseJSON)
  //         .catch((error) => {
  //           let errorMessage = translateStatusToErrorMessage(error);
  //           throw new Error(errorMessage);
  //         })
  //     );
  //   },
};

function useGetPreview() {
  return useMutation({ mutationFn: WEB_TEST_APIS.getPreview });
}

export { useGetPreview };
