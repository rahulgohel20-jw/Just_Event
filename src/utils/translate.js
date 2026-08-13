import { Translateapi } from "@/services/apiServices";

/**
 * Wraps Translateapi and normalizes the response into the
 * { hindi, gujarati } shape MultiLangInputBox's onTranslate expects.
 *
 * TODO: confirm the actual response shape from Swagger/browser console —
 * the key names below (hindi/gujarati vs hi/gu vs Hindi/Gujarati) are a
 * best guess and likely need adjusting once you see a real response.
 */
export async function translateText(englishText) {
  if (!englishText || !englishText.trim()) return null;

  try {
    const res = await Translateapi(encodeURIComponent(englishText));
    const body = res?.data?.data ?? res?.data ?? {};

    return {
      hindi: body.hindi ?? body.hi ?? body.Hindi ?? "",
      gujarati: body.gujarati ?? body.gu ?? body.Gujarati ?? "",
    };
  } catch (err) {
    console.error("Translation failed:", err);
    return null;
  }
}