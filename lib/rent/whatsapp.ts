/**
 * Normalize a typed phone to digits suitable for wa.me.
 * Saudi mobiles typed as 05xxxxxxxx / 5xxxxxxxx become 9665xxxxxxxx.
 * Empty input → null. We store that form in rental_settings.business_whatsapp
 * so the public reserve button can build wa.me links without re-parsing.
 */
export function normalizeWhatsappDigits(phone: string): string | null {
  let digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.length === 10 && digits.startsWith("05")) digits = `966${digits.slice(1)}`;
  else if (digits.length === 9 && digits.startsWith("5")) digits = `966${digits}`;
  return digits;
}

/** True when digits are a Saudi mobile already in wa.me form (9665 + 8 digits). */
export function isSaudiMobileDigits(digits: string): boolean {
  return /^9665\d{8}$/.test(digits);
}

/**
 * A wa.me link for a customer's number. Saudi mobiles are usually typed as
 * 05xxxxxxxx; wa.me needs the country code and no leading zero or plus.
 */
export function whatsappLink(phone: string, text?: string) {
  const digits = normalizeWhatsappDigits(phone) ?? phone.replace(/\D/g, "");
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${query}`;
}

/** Prefilled text for the hold confirmation chat between the house and the customer. */
export function confirmationText(details: {
  customerName: string;
  gearName: string;
  barcode: string;
  start: string;
  end: string;
}) {
  return `Hello ${details.customerName}, please confirm your hold on ${details.gearName} (${details.barcode}), pickup ${details.start}, return ${details.end}.`;
}
