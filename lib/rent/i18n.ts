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
  daysUnit: (n: number) => string;
  kitPhotoPlaceholder: string;
  metaTitle: string;
  metaKitTitle: (name: string) => string;
};

const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
function toArDigits(n: number | string) {
  return String(n).replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)] ?? d);
}

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
  daysUnit: (n) => (n === 1 ? "1 day" : `${n} days`),
  kitPhotoPlaceholder: "[ KIT PHOTO ]",
  metaTitle: "Gear — [YOUR BRAND]",
  metaKitTitle: (name) => `${name} — reserve`,
};

const ar: RentCopy = {
  brandPlaceholder: "[YOUR BRAND]",
  navHelp: "تحتاج مساعدة؟",
  navWhatsapp: "راسلنا على واتساب",
  localeSwitchTo: "English",
  heroBrand: "[YOUR BRAND]",
  heroHeadline: "معدات تصوير محجوزة لتصويرك.",
  heroSupport: "اختر عدة، حدد التواريخ بالرياض، واحجزها ٢٤ ساعة.",
  heroCta: "تصفح المعدات",
  gearHeading: "المعدات",
  gearSupport: "كل قطعة بالمستودع. افتح واحدة تشوف السعر والتواريخ وتحجزها. أسماء المعدات بالإنجليزي كما هي بالمستودع.",
  gearEmpty: "ما فيه معدات مدرجة الحين.",
  category: { camera: "كاميرات", lighting: "إضاءة", grip: "قبضة ومساند" },
  statusAvailable: "بالمستودع",
  statusOut: "خارج",
  statusMaintenance: "صيانة",
  breadcrumbHome: "الرئيسية",
  freeDays: (free, total) => `${toArDigits(free)} من ${toArDigits(total)} أيام متاحة`,
  kitFallbackDescription: "توصيل لموقعك بالرياض، أو استلام من الورشة.",
  next14: "الـ ١٤ يوم الجاية",
  next14Hint: "من المستودع. اليوم المحجوز ما ينحجز مرتين.",
  booked: "محجوز",
  free: "متاح",
  whatArrives: "وش يوصل",
  perDay: "/ يوم",
  heldUntil: (label) => `محجوز إلى ${label}. نأكد على واتساب. ما في خصم من البطاقة بعد.`,
  openWhatsapp: "افتح تأكيد واتساب",
  openWhatsappHint: "يفتح محادثة واتساب مع بيت التأجير، والحجز جاهز للإرسال.",
  pickup: "الاستلام",
  return: "الإرجاع",
  howYouGetIt: "طريقة الاستلام",
  deliverInRiyadh: "توصيل بالرياض",
  collect: "استلام ذاتي",
  deliveryZone: "منطقة التوصيل",
  chooseZone: "اختر المنطقة",
  feeDelivery: "توصيل واستلام بالرياض",
  feeCollect: "استلام من الورشة",
  vat: "ضريبة ١٥٪",
  total: "الإجمالي",
  name: "الاسم",
  phone: "واتساب",
  phonePlaceholder: "05xxxxxxxx",
  reserve: "احجز هالتواريخ",
  reserving: "جارٍ الحجز…",
  holdHint: "يحجز المعدات ٢٤ ساعة. ما في خصم من البطاقة بعد. نأكد على واتساب بعدين تدفع.",
  rangeTaken: "هالمدى فيه يوم محجوز.",
  daysUnit: (n) => `${toArDigits(n)} ${n === 1 ? "يوم" : "أيام"}`,
  kitPhotoPlaceholder: "[ صورة العدة ]",
  metaTitle: "المعدات — [YOUR BRAND]",
  metaKitTitle: (name) => `${name} — احجز`,
};

export const reserveErrors = {
  en: {
    rateIp: "Too many reserves from this network. Wait a few minutes and try again.",
    ratePhone: "Too many reserves with this phone. Wait a few minutes and try again.",
    missing: "That piece is no longer listed.",
    maintenance: "This piece is in maintenance.",
    past: "Pickup can't be in the past.",
    returnAfter: "Return must be after pickup.",
    taken: "Those dates are already taken.",
    zone: "Choose a delivery zone.",
    race: "Those dates were just reserved.",
    save: "The hold didn't save. Try those dates again.",
    invalid: "Check the form and try again.",
  },
  ar: {
    rateIp: "طلبات كثيرة من هالشبكة. انتظر شوي وجرب مرة ثانية.",
    ratePhone: "طلبات كثيرة بهالرقم. انتظر شوي وجرب مرة ثانية.",
    missing: "هالقطعة مو مدرجة الحين.",
    maintenance: "هالقطعة بالصيانة.",
    past: "الاستلام ما يقدر يكون بالماضي.",
    returnAfter: "الإرجاع لازم بعد الاستلام.",
    taken: "هالتواريخ محجوزة.",
    zone: "اختر منطقة التوصيل.",
    race: "هالتواريخ انحجزت الحين.",
    save: "الحجز ما انحفظ. جرب التواريخ مرة ثانية.",
    invalid: "تحقق من الحقول وجرب مرة ثانية.",
  },
} as const;

/** Map English zod messages from reserveSchema into the active locale. */
const RESERVE_FORM_EN_TO_KEY: Record<string, keyof (typeof reserveErrors)["en"]> = {
  "Choose a piece of gear.": "missing",
  "Choose a pickup date.": "invalid",
  "Choose a return date.": "invalid",
  "Choose delivery or collection.": "invalid",
  "Enter your name.": "invalid",
  "Name is too long.": "invalid",
  "Enter a WhatsApp number.": "invalid",
  "Return must be after pickup.": "returnAfter",
  "Choose a delivery zone.": "zone",
};

export function localizeReserveFormError(message: string, locale: RentLocale): string {
  const key = RESERVE_FORM_EN_TO_KEY[message];
  if (key) return reserveErrors[locale][key];
  return locale === "ar" ? reserveErrors.ar.invalid : message;
}

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
