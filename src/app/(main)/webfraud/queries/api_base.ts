<<<<<<< HEAD
"use client"
import { APICall } from '../services/api_services';
import { useMutation } from 'react-query';
import { useEffect,useState } from 'react';

type ErrorResponse = {
  message: string;
};

type ApiCallsProps = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';  // Adjust method types if needed
  params: object;
  onError: (error: ErrorResponse) => void;
  onSuccess: (data: any) => void;
};

export function Api_base({
  url,
  method,
  params,
  onError,
  onSuccess,
}: ApiCallsProps) {
  const [token, setToken] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Access sessionStorage only on client-side
     const idToken = sessionStorage.getItem('IDToken') || "";
      setToken(idToken);
    }
  }, []);
  return useMutation(APICall({
    url,
    method,
    params,
    headers: {
      // Authorization: "eyJraWQiOiJWdUdrQXgyaHZpcTRDXC9BWUs0SmcxRkcxenpWQmphWHZzc3dKSGtxdmFlZz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJjODIxMDNiMC0zMDMxLTcwMjYtMWZkZS0xYmFkOGU2YzkxY2MiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZ2VuZGVyIjoibWFsZSIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtd2VzdC0yXzZnNzVRa0FFZSIsInBob25lX251bWJlcl92ZXJpZmllZCI6ZmFsc2UsImNvZ25pdG86dXNlcm5hbWUiOiJyYW5qaXRoYSIsIm9yaWdpbl9qdGkiOiI3ZjE0ZjYwMy00YTFmLTQyMGYtYmFjZC02OTA0MjE3NDRjZjgiLCJhdWQiOiI0NXU4N2R0Y3I0cTVnMHBwZGp0bGRldGh0ZyIsImV2ZW50X2lkIjoiMmM2NjdiNmItZjIyOC00MTU4LThiNjgtZDAyMzA0YzY1MTRkIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NDAwMzYxMTEsIm5hbWUiOiJSYW5qaXRoYSIsInBob25lX251bWJlciI6Iis5MTg5MDQ0NTkzNzIiLCJleHAiOjE3NDAwNDMzMTEsImN1c3RvbTpyb2xlIjoidXNlciIsImlhdCI6MTc0MDAzNjExMSwianRpIjoiZWM2MzJiMTctMDkzZi00ZWI5LTg3NTAtYmI1Mzg2ZjE3NDQ3IiwiZW1haWwiOiJyYW5qaXRoYS5wQG1maWx0ZXJpdC5jb20ifQ.r8rBCMq_bHrvPs2xbqqMwdF99yoDj-mjTg9jjTMxudPjwDXCd6swJcCy0Q4pMRbFz_HBA3ONi-TkwIsHLS3tfMWPVB8V4BXoAcgcyh0aCGc9SlRIu35OfBknJXg-paeI9WFD1E0juV2MJmtDYHqFtjjC54YLknZMhr-jLmckGMDguo1VyLwjO-BZkPr-jvwm637XhqrhrcF-8jdePo3CbjaztxM4hSVwhOOBh4j_fNoXsH_kZwS-Pk2-kt5P8RaHArSAl6rfDazMsGH7-LnuOboNvIak2P6xCU6IO643NtvIKl9UYcrBkL4bWtyQusf0aSDIc4hbgKmAIKGfM_70_w"
     // Authorization: sessionStorage.getItem('IDToken') || ""
     Authorization: token,
        },
  }), { onError, onSuccess });
}
=======
"use client";
import { useQuery, useMutation, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { queryClient } from '@/lib/queryClient';
import { UnauthorizedError } from "@/common/errors";

type ApiCallOptions<T = unknown> = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  params?: object;
  headers?: Record<string, string>;
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError) => void;
  queryKey?: string[];
};

type ApiCallResult<T> =
  | { type: "query"; result: UseQueryResult<T, AxiosError>, loading: boolean }
  | { type: "mutation"; result: UseMutationResult<T, AxiosError>, loading: boolean };

// Handle unauthorized access
const handleUnauthorized = () => {
  // Store current path for redirect after login
  const currentPath = window.location.pathname;
  if (currentPath !== '/') {
    sessionStorage.setItem('redirectPath', currentPath);
  }
  
  // Clear all session data
  sessionStorage.clear();
  localStorage.clear();
  
  // Redirect to login page
  window.location.href = '/';
};

// Create axios instance with interceptors
const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      handleUnauthorized();
    }
    return Promise.reject(error);
  }
);

// Query function implementation
const queryFunction = async <T>({
  url,
  params,
  signal,
  headers,
}: {
  url: string;
  params?: object;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}): Promise<T> => {
  try {
    const response = await axiosInstance.get<T>(url, {
      params,
      signal,
      headers,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      throw new UnauthorizedError("Session expired");
    }
    throw error;
  }
};

// Mutation function implementation
const mutationFunction = async <T>({
  url,
  method,
  data,
  headers,
}: {
  url: string;
  method: "POST" | "PUT" | "DELETE";
  data?: any;
  headers?: Record<string, string>;
}): Promise<T> => {
  try {
    const response = await axiosInstance.request<T>({
      url,
      method,
      data,
      headers,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      throw new UnauthorizedError("Session expired");
    }
    throw error;
  }
};

export const useApiCall = <T = unknown>(
  options: ApiCallOptions<T>
): ApiCallResult<T> => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const idToken = sessionStorage.getItem("IDToken");
    if (idToken) {
      setToken(idToken);
    }
  }, []);

  const query = useQuery<T, AxiosError>({
    queryKey: options.queryKey || [options.url, options.params],
    queryFn: async (context) => {
      const { signal } = context;
      return queryFunction<T>({
        url: options.url,
        params: options.params,
        signal,
        headers: {
          ...options.headers,
          Authorization: token || "",
        },
      });
    },
    enabled: options.method === "GET" && !!token,
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (error instanceof AxiosError && error.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const mutation = useMutation<T, AxiosError>({
    mutationFn: () =>
      mutationFunction<T>({
        url: options.url,
        method: options.method,
        data: options.params,
        headers: {
          ...options.headers,
          Authorization: token || "",
        },
      }),
    onSuccess: (data) => {
      if (options.queryKey) {
        queryClient.invalidateQueries(options.queryKey);
      }
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        handleUnauthorized();
      }
      if (options.onError) {
        options.onError(error);
      }
    },
  });

  useEffect(() => {
    if (options.method === "GET" && query.error instanceof AxiosError) {
      if (query.error.response?.status === 401) {
        handleUnauthorized();
      }
    }
  }, [query.error, options.method]);

  return options.method === "GET"
    ? { type: "query", result: query, loading: query.isFetching || query.isLoading }
    : { type: "mutation", result: mutation, loading: mutation.isPending || mutation.isLoading };
};
>>>>>>> d1452b7 (Initial commit)
