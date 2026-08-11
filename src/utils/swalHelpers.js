import Swal from "sweetalert2";

// Reads your Tailwind primary color CSS var, with a safe fallback
export const getPrimaryColor = () =>
  getComputedStyle(document.documentElement)
    .getPropertyValue("--tw-primary")
    .trim() || "#881337";

/**
 * Generic "Are you sure?" confirmation dialog.
 * Returns true if the user confirmed, false otherwise.
 */
export const confirmDialog = async ({
  title = "Are you sure?",
  text = "This action cannot be undone.",
  confirmButtonText = "Yes, continue",
  cancelButtonText = "No",
  icon = "warning",
} = {}) => {
  const primaryColor = getPrimaryColor();
  const result = await Swal.fire({
    icon,
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: primaryColor,
    cancelButtonColor: "#6b7280",
    buttonsStyling: true,
  });
  return result.isConfirmed;
};

// Convenience wrapper specifically for delete confirmations
export const confirmDelete = (itemName) =>
  confirmDialog({
    title: "Are you sure?",
    text: `Do you want to delete "${itemName}"? This action cannot be undone.`,
    confirmButtonText: "Yes, delete it",
  });

/**
 * Shows success/error toast based on an API response object.
 * Handles the { success, msg } / { success, message } envelope shape
 * used across your services (adjust the field names if a given
 * endpoint differs).
 */
export const showApiResult = (
  res,
  {
    successTitle = "Success",
    errorTitle = "Failed",
    fallbackSuccess = "Operation completed successfully.",
    fallbackError = "Something went wrong. Please try again.",
    onSuccess,
  } = {}
) => {
  const primaryColor = getPrimaryColor();
  const body = res?.data ?? res;
  const isSuccess = body?.success !== false;
  const msg = body?.msg || body?.message;

  if (isSuccess) {
    Swal.fire({
      icon: "success",
      title: successTitle,
      text: msg || fallbackSuccess,
      confirmButtonColor: primaryColor,
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    onSuccess?.();
  } else {
    Swal.fire({
      icon: "error",
      title: errorTitle,
      text: msg || fallbackError,
      confirmButtonColor: primaryColor,
    });
  }
  return isSuccess;
};

/**
 * Shows an error dialog from a caught exception (network/API failure,
 * not a { success: false } response).
 */
export const showApiError = (
  err,
  { title = "Failed", fallback = "Something went wrong. Please try again." } = {}
) => {
  const primaryColor = getPrimaryColor();
  Swal.fire({
    icon: "error",
    title,
    text:
      err?.response?.data?.errorMessage ||
      err?.response?.data?.msg ||
      err?.message ||
      fallback,
    confirmButtonColor: primaryColor,
  });
};