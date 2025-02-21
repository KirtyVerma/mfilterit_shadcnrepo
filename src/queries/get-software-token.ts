import Endpoint from "@/common/endpoint";
import { fetchData } from "@/services";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

export function useGetSoftwareToken(enabled: boolean) {
  const url = process.env.NEXT_PUBLIC_AUTH_DOMAIN + Endpoint.GET_SOFTWARE_TOKEN;
  const [Body, setBody] = useState({});
  useEffect(() => {
    setBody({
      access_token: sessionStorage.getItem("AccessToken"),
    });
  }, []);
  return useQuery({
    queryKey: [
      "GET_SOFTWARE_TOKEN",
      {
        url,
        method: "POST",
        headers: {
          Authorization:
            "92a2119fb3329486dd39b97464d4fe5a4f8ba763fa884b8ba2d689b0b67c4175d9eff7232acd828ad24db7e5ddf7cae32ebf6eadab9e4d6c7cdeb1bbbc82c273",
        },
        data: Body,
      },
    ],
    queryFn: fetchData,
    enabled: true,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
