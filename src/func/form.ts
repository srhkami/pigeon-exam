import toast from "react-hot-toast";
import {FieldValues, UseFormSetError} from "react-hook-form";

import {getUserFacingErrorMessage} from "./api-error.ts";

type ApiFormError = {
  response?: {
    status?: number,
    data?: unknown,
  },
}

export default function showFormError<TFieldValues extends FieldValues>(err: ApiFormError, setError: UseFormSetError<TFieldValues>) {
  void setError;
  toast.error(getUserFacingErrorMessage(err, {fallback: "表單送出失敗，請稍後再試。"}));
}
