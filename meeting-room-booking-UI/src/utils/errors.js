export function getErrorMessage(error) {
  const data = error?.response?.data;

  if (!data) {
    return "Something went wrong. Please try again.";
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  const fieldErrors = Object.values(data).filter((value) => typeof value === "string");

  if (fieldErrors.length > 0) {
    return fieldErrors.join(", ");
  }

  return "Something went wrong. Please try again.";
}
