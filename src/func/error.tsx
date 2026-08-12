import toast from "react-hot-toast";
import {getUserFacingErrorMessage, UserFacingErrorOptions} from "./api-error.ts";

export function showUserFacingError(error: unknown, options: UserFacingErrorOptions = {}) {
  toast.error(getUserFacingErrorMessage(error, options));
}