import axios, { AxiosResponse } from "axios";

export function hasAxiosResponseMessage(
  error: unknown
): error is { response: AxiosResponse<{ message: string }> } {
  return axios.isAxiosError(error) &&
    error.response &&
    error.response.data.message
    ? true
    : false;
}

export const generateAxiosHeaderWithBearer = (token: string) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
