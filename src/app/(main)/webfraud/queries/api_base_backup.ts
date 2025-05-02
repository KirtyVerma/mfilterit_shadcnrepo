"use client";
import { useQuery, useMutation, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { queryClient } from '@/lib/queryClient';

type ApiCallOptions<T = unknown> = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  params?: object;
  headers?: Record<string, string>;
  onSuccess?: (data: T) => void; // Success callback
  onError?: (error: AxiosError) => void; // Error callback
  queryKey?: string[]; // Optional query key for invalidation
};

type ApiCallResult<T> =
  | { type: "query"; result: UseQueryResult<T, AxiosError> }
  | { type: "mutation"; result: UseMutationResult<T, AxiosError> };

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
  const response = await axios.get<T>(url, {
    params,
    signal,
    headers,
  });
  return response.data;
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
  const response = await axios.request<T>({
    url,
    method,
    data,
    headers,
  });
  return response.data;
};

export const useApiCall1 = <T = unknown>(
  options: ApiCallOptions<T>
): ApiCallResult<T> => {
  const [token, setToken] = useState("");

  // Fetch token from sessionStorage
  useEffect(() => {
    const idToken = sessionStorage.getItem("IDToken");
    if (idToken) {
      setToken(idToken);
    }
  }, []);

  // Query logic for GET requests
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
          Authorization: token || "", // Add the Authorization header
        },
      });
    },
    enabled: options.method === "GET" && !!token, // Only enable for GET requests and when token is available
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    onSuccess: options.onSuccess,
    onError: options.onError,
  });

  // Mutation logic for POST, PUT, DELETE requests
  const mutation = useMutation<T, AxiosError>({
    mutationFn: () =>
      mutationFunction<T>({
        url: options.url,
        method: options.method,
        data: options.params, // Use params as data for mutations
        headers: {
          ...options.headers,
          Authorization: token || "",
        },
      }),
    onSuccess: (data) => {
      // Invalidate the query to refresh data after mutation
      if (options.queryKey) {
        queryClient.invalidateQueries(options.queryKey);
      }
      if (options.onSuccess) {
        options.onSuccess(data); // Call onSuccess for mutation
      }
    },
    onError: (error) => {
      if (options.onError) {
        options.onError(error); // Call onError for mutation
      }
    },
  });

  // Return the appropriate result based on the method
  return options.method === "GET"
    ? { type: "query", result: query }
    : { type: "mutation", result: mutation };
};
