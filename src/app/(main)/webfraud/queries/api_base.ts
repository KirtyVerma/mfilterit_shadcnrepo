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
