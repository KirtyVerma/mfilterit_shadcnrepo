"use client";
import Endpoint from "@/common/endpoint";
import { fetchData } from "@/services";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

export function useIsMFA() {
  const [Body, setBody] = useState({});
  const url = process.env.NEXT_PUBLIC_AUTH_DOMAIN + Endpoint.IS_MFA;
  useEffect(() => {
    setBody({
      access_token:
        typeof window === "object" ? sessionStorage.getItem("AccessToken") : "",
    });
  }, []);
  let t = true;
  if (typeof window === "undefined") t = false;

  return useQuery({
    queryKey: [
      "IS_MFA",
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
    enabled: t,
    staleTime: Number.POSITIVE_INFINITY,
    retry: 5,
  });
}
