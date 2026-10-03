import "server-only";
import type { EquipmentCategory } from "@/lib/supabase/types";
import { getGeminiApiKey } from "@/lib/env";
import { UserError } from "@/lib/errors";

const TRY_AGAIN = "Try again, or add the item manually.";

export type EquipmentPhotoSuggestion = {
  name: string;
  category: EquipmentCategory;
  serialNumber: string | null;
};

const VALID_CATEGORIES: EquipmentCategory[] = ["camera", "lighting", "grip"];

const GEMINI_MODEL = "gemini-3.6-flash";

const PROMPT = `You're helping a film equipment warehouse catalog gear from a photo. The photo may show the item itself, or the item still inside its bag/case — read any visible labels, model markings, or engraved text even if partially obscured.

Reply with ONLY a JSON object, no markdown fences, no other text:
{"name": "<specific model name, e.g. 'Arri Alexa Mini LF'>", "category": "<one of: camera, lighting, grip>", "serialNumber": "<serial number if visible, else null>"}

If you cannot identify the item with reasonable confidence, still return your best guess for name and category — never leave name empty.`;

export async function identifyEquipmentPhoto(
  imageBase64: string,
  mediaType: string
): Promise<EquipmentPhotoSuggestion> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new UserError("Photo identification isn't set up on this server yet.");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: PROMPT },
              { inline_data: { mime_type: mediaType, data: imageBase64 } },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error(`[vision] request failed (${response.status}): ${detail.slice(0, 200)}`);
    throw new UserError(`Couldn't reach the photo-identification service. ${TRY_AGAIN}`);
  }

  const data = await response.json();
  const text: string | undefined = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    console.error("[vision] response had no text content");
    throw new UserError(`Couldn't identify that photo. ${TRY_AGAIN}`);
  }

  // Gemini sometimes wraps JSON in markdown fences despite the prompt asking
  // it not to — strip them before parsing rather than failing on them.
  const cleaned = text.trim().replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

  let parsed: { name?: string; category?: string; serialNumber?: string | null };
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error("[vision] response wasn't valid JSON:", cleaned.slice(0, 200));
    throw new UserError(`Couldn't identify that photo. ${TRY_AGAIN}`);
  }

  const category = VALID_CATEGORIES.includes(parsed.category as EquipmentCategory)
    ? (parsed.category as EquipmentCategory)
    : "camera";

  return {
    name: parsed.name?.trim() || "Unidentified item",
    category,
    serialNumber: parsed.serialNumber?.trim() || null,
  };
}
