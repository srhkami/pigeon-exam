import toast from "react-hot-toast";
import {FieldValues, Path, UseFormSetError} from "react-hook-form";

import getApiErrorMessage from "./api-error.ts";

type ApiFormError = {
  response?: {
    status?: number,
    data?: unknown,
  },
  respose?: {
    status?: number,
    data?: unknown,
  },
}

export default function showFormError<TFieldValues extends FieldValues>(err: ApiFormError, setError: UseFormSetError<TFieldValues>) {
  console.log(err);
  const response = err?.response ?? err?.respose;
  const errorData = response?.data;

  if (response?.status === 400 && errorData && typeof errorData === "object" && !Array.isArray(errorData)) {
    for (const [key, value] of Object.entries(errorData)) {
      const message = Array.isArray(value)
        ? value.filter((item): item is string => typeof item === "string").join("、")
        : typeof value === "string"
          ? value
          : getApiErrorMessage({response}, "表單驗證失敗，請稍後再試");
      setError(key as Path<TFieldValues>, {type: "server", message})
    }
    return;
  }

  toast.error(getApiErrorMessage(err, "表單送出失敗，請稍後再試"));
}
