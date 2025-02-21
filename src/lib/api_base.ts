import { APICall } from '../app/(main)/webfraud/services/api_services';
import { useMutation } from 'react-query';

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
    return useMutation(APICall({
        url,
        method,
        params,
        headers: {
            Authorization: sessionStorage.getItem('IdToken') || ""
        },
    }), { onError, onSuccess });
}