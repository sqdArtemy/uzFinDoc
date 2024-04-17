import { z } from "zod";

function validate(text: string, setErrorText, errorText: string, emailSchema) {
  if (!text) {
    return setErrorText("");
  }
  try {
    emailSchema.parse(text);
    setErrorText("");
  } catch (error) {
    setErrorText(errorText);
  }
}

export function validateEmail(text: string, setErrorText) {
  const emailSchema = z.coerce.string().email();
  return validate(text, setErrorText, "Invalid email format.", emailSchema);
}
