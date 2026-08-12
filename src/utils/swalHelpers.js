import Swal from "sweetalert2";

// Reads your Tailwind primary color CSS var, with a safe fallback
export const getPrimaryColor = () =>
  getComputedStyle(document.documentElement)
    .getPropertyValue("--tw-primary")
    .trim() || "#881337";

/**
 * Extracts a human-readable message from an API error/response body.
 * Purely additive — used internally by showApiResult/showApiError only.
 * Does not change the public signature of anything.
 *
 * Handles all shapes seen across endpoints so far:
 *  - errorMessage: "Some string"
 *  - errorMessage: ["msg1", "msg2"]
 *  - errorMessage: { fieldName: ["msg1", "msg2"], otherField: ["msg3"] }
 *  - errorMessage: { fieldName: "single string msg" }
 *  - errors: [{ message: "..." }]   (some endpoints use "errors" instead)
 *  - falls back to msg / message
 *  - falls back to the provided fallback string
 */
const extractErrorMessage = (body, fallback) => {
  if (!body) return fallback;

  const { errorMessage, errors, msg, message } = body;

  // 1) errorMessage as plain string
  if (typeof errorMessage === "string" && errorMessage.trim()) {
    return errorMessage;
  }

  // 2) errorMessage as array of strings
  if (Array.isArray(errorMessage) && errorMessage.length) {
    const flat = errorMessage.filter(Boolean);
    if (flat.length) return flat.join("\n");
  }

  // 3) errorMessage as field-map: { field: [msgs] } or { field: "msg" }
  if (errorMessage && typeof errorMessage === "object" && !Array.isArray(errorMessage)) {
    const lines = Object.values(errorMessage)
      .flatMap((v) => (Array.isArray(v) ? v : [v]))
      .filter(Boolean);
    if (lines.length) return lines.join("\n");
  }

  // 4) some endpoints use "errors" instead of "errorMessage"
  if (Array.isArray(errors) && errors.length) {
    const lines = errors
      .map((e) => (typeof e === "string" ? e : e?.message))
      .filter(Boolean);
    if (lines.length) return lines.join("\n");
  }

  // 5) fall back to msg/message, but skip generic non-informative values
  const generic = msg || message;
  if (generic && String(generic).toUpperCase() !== "FAILED") return generic;

  // 6) nothing usable found
  return fallback;
};

/**
 * Generic "Are you sure?" confirmation dialog.
 * Returns true if the user confirmed, false otherwise.
 * UNCHANGED — no behavior modified.
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
// UNCHANGED — no behavior modified.
export const confirmDelete = (itemName) =>
  confirmDialog({
    title: "Are you sure?",
    text: `Do you want to delete "${itemName}"? This action cannot be undone.`,
    confirmButtonText: "Yes, delete it",
  });

/**
 * Shows success/error toast based on an API response object.
 * Same signature and same return value (boolean) as before.
 * Only the error-text extraction is smarter now.
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

  if (isSuccess) {
    Swal.fire({
      icon: "success",
      title: successTitle,
      text: body?.msg || body?.message || fallbackSuccess,
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
      text: extractErrorMessage(body, fallbackError),
      confirmButtonColor: primaryColor,
    });
  }
  return isSuccess;
};

/**
 * Shows an error dialog from a caught exception (network/API failure,
 * not a { success: false } response).
 * Same signature as before. Only the error-text extraction is smarter now.
 */
export const showApiError = (
  err,
  { title = "Failed", fallback = "Something went wrong. Please try again." } = {}
) => {
  const primaryColor = getPrimaryColor();
  const body = err?.response?.data;

  Swal.fire({
    icon: "error",
    title,
    text: extractErrorMessage(body, err?.message || fallback),
    confirmButtonColor: primaryColor,
  });
};