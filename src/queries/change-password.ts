import Endpoint from "@/common/endpoint";
import { APICall } from "@/services";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";

export type ChangePasswordErrorType = {
  message: string;
};

export type ChangePasswordBodyType = {
  current_password: string;
  new_password: string;
  access_token: string;
};

export function useChangePassword(
  onError: (data: ChangePasswordErrorType) => void,
  onSuccess: (data: any) => void,
) {
  const url = process.env.NEXT_PUBLIC_AUTH_DOMAIN + Endpoint.CHANGE_PASSWORD;
  return useMutation(
    APICall({
      url,
      method: "POST",
      headers: {
        Authorization:
          "92a2119fb3329486dd39b97464d4fe5a4f8ba763fa884b8ba2d689b0b67c4175d9eff7232acd828ad24db7e5ddf7cae32ebf6eadab9e4d6c7cdeb1bbbc82c273",
      },
    }),
    { onError, onSuccess },
  );
}

/** RESPONSE FROM API
{
    "message": "User created successfully",
    "user": {
        "CodeDeliveryDetails": {
            "AttributeName": "email",
            "DeliveryMedium": "EMAIL",
            "Destination": "t***@m***"
        },
        "ResponseMetadata": {
            "HTTPHeaders": {
                "connection": "keep-alive",
                "content-length": "171",
                "content-type": "application/x-amz-json-1.1",
                "date": "Fri, 18 Oct 2024 06:22:06 GMT",
                "x-amzn-requestid": "3862caf7-875b-4fed-a68e-1f71b1a7153a"
            },
            "HTTPStatusCode": 200,
            "RequestId": "3862caf7-875b-4fed-a68e-1f71b1a7153a",
            "RetryAttempts": 0
        },
        "UserConfirmed": false,
        "UserSub": "d8c13360-2041-70cd-66d4-48fd5f4bd821"
    }
}
 */
