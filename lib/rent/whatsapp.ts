/**
 * A wa.me link for a customer's number. Saudi mobiles are usually typed as
 * 05xxxxxxxx; wa.me needs the country code and no leading zero or plus.
 */
export function whatsappLink(phone: string, text?: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.length === 10 && digits.startsWith("05")) digits = `966${digits.slice(1)}`;
  else if (digits.length === 9 && digits.startsWith("5")) digits = `966${digits}`;

  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${query}`;
}
