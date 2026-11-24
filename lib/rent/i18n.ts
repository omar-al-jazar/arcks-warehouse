export type RentLocale = "en" | "ar";

export const RENT_LOCALE_COOKIE = "rent_locale";

export type RentCopy = {
  brandPlaceholder: string;
  navHelp: string;
  navWhatsapp: string;
  localeSwitchTo: string;
  heroBrand: string;
  heroHeadline: string;
  heroSupport: string;
  heroCta: string;
  gearHeading: string;
  gearSupport: string;
  gearEmpty: string;
  category: Record<"camera" | "lighting" | "grip", string>;
  statusAvailable: string;
  statusOut: string;
  statusMaintenance: string;
  breadcrumbHome: string;
  freeDays: (free: number, total: number) => string;
  kitFallbackDescription: string;
  next14: string;
  next14Hint: string;
  booked: string;
  free: string;
  whatArrives: string;
  perDay: string;
  heldUntil: (label: string) => string;
  openWhatsapp: string;
  openWhatsappHint: string;
  pickup: string;
  return: string;
  howYouGetIt: string;
  deliverInRiyadh: string;
  collect: string;
  deliveryZone: string;
  chooseZone: string;
  feeDelivery: string;
  feeCollect: string;
  vat: string;
  total: string;
  name: string;
  phone: string;
  phonePlaceholder: string;
  reserve: string;
  reserving: string;
  holdHint: string;
  rangeTaken: string;
};

const en: RentCopy = {
  brandPlaceholder: "[YOUR BRAND]",
  navHelp: "Need help?",
  navWhatsapp: "WhatsApp us",
  localeSwitchTo: "العربية",
  heroBrand: "[YOUR BRAND]",
  heroHeadline: "Film gear, held for your shoot.",
  heroSupport: "Pick a kit, choose dates in Riyadh, reserve a 24-hour hold.",
  heroCta: "Browse the gear",
  gearHeading: "The gear",
  gearSupport: "Every piece in the warehouse. Open one to see the price, the dates, and reserve it.",
  gearEmpty: "No gear is listed yet.",
  category: { camera: "Camera", lighting: "Lighting", grip: "Grip" },
  statusAvailable: "In the warehouse",
  statusOut: "Out",
  statusMaintenance: "Maintenance",
  breadcrumbHome: "Home",
  freeDays: (free, total) => `${free} of ${total} days free`,
  kitFallbackDescription: "Delivered to your location in Riyadh, or collected from the workshop.",
  next14: "Next 14 days",
  next14Hint: "Pulled from the warehouse. A booked day cannot be reserved twice.",
  booked: "BOOKED",
  free: "FREE",
  whatArrives: "What arrives",
  perDay: "/ day",
  heldUntil: (label) => `Held until ${label}. We will confirm on WhatsApp. No card charged yet.`,
  openWhatsapp: "Open the WhatsApp confirmation",
  openWhatsappHint: "Opens a WhatsApp chat with the rental house, with this hold ready to send.",
  pickup: "Pickup",
  return: "Return",
  howYouGetIt: "How you get it",
  deliverInRiyadh: "Deliver in Riyadh",
  collect: "Collect",
  deliveryZone: "Delivery zone",
  chooseZone: "Choose a zone",
  feeDelivery: "Riyadh delivery + pickup",
  feeCollect: "Collect from the workshop",
  vat: "VAT 15%",
  total: "Total",
  name: "Name",
  phone: "WhatsApp",
  phonePlaceholder: "05xxxxxxxx",
  reserve: "Reserve these dates",
  reserving: "Reserving…",
  holdHint: "Holds the gear for 24h. No card charged yet. We confirm on WhatsApp, then you pay.",
  rangeTaken: "That range includes a booked day.",
};

const ar: RentCopy = {
  brandPlaceholder: "[YOUR BRAND]",
  navHelp: "تحتاج مساعدة؟",
  navWhatsapp: "راسلنا على واتساب",
  localeSwitchTo: "English",
  heroBrand: "[YOUR BRAND]",
  heroHeadline: "معدات تصوير محجوزة لتصويرك.",
  heroSupport: "اختر عدة، حدد التواريخ في الرياض، واحجزها لمدة ٢٤ ساعة.",
  heroCta: "تصفح المعدات",
  gearHeading: "المعدات",
  gearSupport: "كل قطعة في المستودع. افتح واحدة لترى السعر والتواريخ واحجزها.",
  gearEmpty: "لا توجد معدات مدرجة بعد.",
  category: { camera: "كاميرات", lighting: "إضاءة", grip: "قبضة ومساند" },
  statusAvailable: "في المستودع",
  statusOut: "خارج",
  statusMaintenance: "صيانة",
  breadcrumbHome: "الرئيسية",
  freeDays: (free, total) => `${free} من ${total} أيام متاحة`,
  kitFallbackDescription: "توصيل إلى موقعك في الرياض، أو استلام من الورشة.",
  next14: "الـ ١٤ يوماً القادمة",
  next14Hint: "من المستودع. اليوم المحجوز لا يُحجز مرتين.",
  booked: "محجوز",
  free: "متاح",
  whatArrives: "ماذا يصل",
  perDay: "/ يوم",
  heldUntil: (label) => `محجوز حتى ${label}. نؤكد عبر واتساب. لا خصم من البطاقة بعد.`,
  openWhatsapp: "افتح تأكيد واتساب",
  openWhatsappHint: "يفتح محادثة واتساب مع بيت التأجير، مع الحجز جاهزاً للإرسال.",
  pickup: "الاستلام",
  return: "الإرجاع",
  howYouGetIt: "طريقة الاستلام",
  deliverInRiyadh: "توصيل في الرياض",
  collect: "استلام ذاتي",
  deliveryZone: "منطقة التوصيل",
  chooseZone: "اختر المنطقة",
  feeDelivery: "توصيل واستلام في الرياض",
  feeCollect: "استلام من الورشة",
  vat: "ضريبة ١٥٪",
  total: "الإجمالي",
  name: "الاسم",
  phone: "واتساب",
  phonePlaceholder: "05xxxxxxxx",
  reserve: "احجز هذه التواريخ",
  reserving: "جارٍ الحجز…",
  holdHint: "يحجز المعدات ٢٤ ساعة. لا خصم من البطاقة بعد. نؤكد عبر واتساب ثم تدفع.",
  rangeTaken: "هذا المدى يشمل يوماً محجوزاً.",
};

const COPY: Record<RentLocale, RentCopy> = { en, ar };

export function isRentLocale(value: string | null | undefined): value is RentLocale {
  return value === "en" || value === "ar";
}

export function rentCopy(locale: RentLocale): RentCopy {
  return COPY[locale];
}

export function formatSarLocale(amount: number | null, placeholder: string, locale: RentLocale) {
  if (amount == null) return locale === "ar" ? `ر.س ${placeholder}` : `SAR ${placeholder}`;
  const formatted = amount.toLocaleString(locale === "ar" ? "ar-SA" : "en-SA", {
    maximumFractionDigits: 2,
  });
  return locale === "ar" ? `ر.س ${formatted}` : `SAR ${formatted}`;
}
