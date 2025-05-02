"use client"
<<<<<<< HEAD
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { QueryFunctionContext } from "react-query";
=======
import { UnauthorizedError } from "@/common/errors";
import { QueryFunctionContext } from "@tanstack/react-query";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
>>>>>>> d1452b7 (Initial commit)

// TYPES
type Method = "GET" | "POST" | "PUT" | "DELETE";
type APICallType = {
  method: Method;
  url: string;
  headers?: Record<string, string>;
  params?: object;
};
<<<<<<< HEAD
//
const headers = { "Content-Type": "application/json" };
const API_Instance = axios.create({ headers });

// // Deprecated
export function APICall(q: APICallType) {
  return async (params: { query?: Record<string, string>; body?: unknown }) => {
    try {
      const config = {
        headers: q.headers,
        params: params.query,
      };

      switch (q.method) {
        case "GET": {
          return await API_Instance.get(q.url, config);
        }
        case "POST": {
          return await API_Instance.post(q.url, params.body, config);
        }
        case "PUT": {
          return await API_Instance.put(q.url, params.body, config);
        }
        case "DELETE": {
          return await API_Instance.delete(q.url, config);
        }
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        switch (error.status) {
          case 401:
          // console.log("401");
          // sessionStorage.clear();
          // window.location.href = "/";
          // break;
          default:
            throw new Error(
              error.response?.data?.error ?? "Something went wrong",
            );
        }
      }
      throw new Error("Something went wrong");
    }
  };
}

async function ApiCall<D = void>({
  options,
  signal,
}: {
  options: AxiosRequestConfig;
  signal?: AbortSignal | undefined;
}): Promise<D> {
  const config: AxiosRequestConfig = {
    ...options,
    signal: signal,
  };
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      switch (error.status) {
        case 401:
        // console.log("401");
        // sessionStorage.clear();
        // window.location.href = "/";
        // break;
        default:
          throw new Error(
            error.response?.data?.error ?? "Something went wrong",
          );
      }
    }
    throw new Error("Something went wrong");
  }
}

export function queryFunction(q: QueryFunctionContext) {
  // @ts-expect-error unused
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, { options }] = q.queryKey;
  return ApiCall({ options, signal: q.signal });
}

export async function mutationFunction(options: AxiosRequestConfig) {
  return ApiCall({ options });
}

// Generic function to fetch data using useQuery
// Deprecated
export async function fetchData(q: QueryFunctionContext) {
  const [_key, { options }] = q.queryKey;
  console.log("options:", options);
  const config: AxiosRequestConfig = {
    ...options,
    signal: q.signal,
  };
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      switch (error.status) {
        case 401:
        // console.log("401");
        // sessionStorage.clear();
        // window.location.href = "/";
        // break;
        default:
          throw new Error(
            error.response?.data?.error ?? "Something went wrong",
          );
      }
    }
    throw new Error("Something went wrong");
  }
}
=======

// First, let's create a debug logger that executes immediately
const debug = {
  log: (...args: any[]) => {
    console.log('[API Debug]', new Date().toISOString(), ...args);
  },
  error: (...args: any[]) => {
    console.error('[API Error]', new Date().toISOString(), ...args);
  }
};

// Log initial setup
debug.log('API Services initializing...');

// Default headers
const headers = { "Content-Type": "application/json" };
const API_Instance = axios.create({ headers });

debug.log('Axios instance created');

// Handle session expiry and redirect
const handleSessionExpiry = () => {
  debug.log('Session expiry handler starting');
  
  // Get current URL before any changes
  const currentUrl = window.location.href;
  debug.log('Current URL:', currentUrl);

  // Immediately log token status
  const accessToken = sessionStorage.getItem('AccessToken');
  const idToken = sessionStorage.getItem('IdToken');
  debug.log('Token status - AccessToken:', !!accessToken, 'IdToken:', !!idToken);

  try {
    const currentPath = window.location.pathname;
    debug.log('Current path:', currentPath);
    
    if (currentPath !== '/login') {
      sessionStorage.setItem('redirectPath', currentPath);
      debug.log('Stored redirect path:', currentPath);
    }
    
    debug.log('Clearing session storage...');
    sessionStorage.clear();
    localStorage.clear();
    
    debug.log('About to redirect to login...');
    // Use setTimeout to ensure our logs appear
    setTimeout(() => {
      debug.log('Executing redirect now');
      window.location.href = '/login';
    }, 100);
    
  } catch (error) {
    debug.error('Session cleanup error:', error);
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  }
};

// Request interceptor
API_Instance.interceptors.request.use(
  (config) => {
    debug.log('Request interceptor started', config.url);
    const token = sessionStorage.getItem('IdToken');
    debug.log('Token present:', !!token);
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      debug.log('Added token to request');
    }
    
    return config;
  },
  (error) => {
    debug.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
API_Instance.interceptors.response.use(
  (response) => {
    debug.log('Response success:', response.status);
    return response;
  },
  (error) => {
    debug.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      debug.log('401 detected, handling session expiry');
      handleSessionExpiry();
    }
    
    return Promise.reject(error);
  }
);

// API call function
export async function APICall<T = unknown>({
  method,
  url,
  headers,
  params,
}: APICallType): Promise<T> {
  debug.log('APICall started:', { method, url });
  
  try {
    const config: AxiosRequestConfig = {
      method,
      url,
      headers,
      params: method === "GET" ? params : undefined,
      data: method !== "GET" ? params : undefined,
    };

    debug.log('Making request with config:', {
      method: config.method,
      url: config.url,
      hasHeaders: !!config.headers,
      hasParams: !!config.params,
      hasData: !!config.data
    });

    const response = await API_Instance(config);
    debug.log('Request successful:', response.status);
    return response.data as T;
    
  } catch (error) {
    debug.error('APICall error:', error);
    
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      debug.log('Error status:', status);
      
      switch (status) {
        case 401:
          debug.log('Handling 401 error');
          handleSessionExpiry();
          throw new UnauthorizedError('Session expired');

        case 500:
          throw new Error('Internal Server Error. Please try again later.');

        default:
          throw new Error(
            error.response?.data?.error ?? 
            error.response?.data?.message ?? 
            'Something went wrong'
          );
      }
    }
    throw new Error("An unexpected error occurred");
  }
}

debug.log('API Services initialization complete');

// Query function for React Query
export async function queryFunction<T = unknown>(
  context: QueryFunctionContext,
): Promise<T> {
  const { queryKey, signal } = context;
  const [_, options] = queryKey;

  return APICall<T>({
    ...options,
    signal, // Pass the AbortSignal to the API call
  });
}

// Mutation function for React Query
export async function mutationFunction<T = unknown>(
  options: AxiosRequestConfig,
): Promise<T> {
  return APICall<T>(options);
}

// Export the instance for direct use
export { API_Instance };
>>>>>>> d1452b7 (Initial commit)
