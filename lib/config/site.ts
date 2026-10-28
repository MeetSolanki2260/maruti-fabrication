import { PHONE_DISPLAY } from "@/shared/constants";
export const site = {
  name: "Maruti Fabrication",
  phone: PHONE_DISPLAY,
  phoneE164: "+919428280683",
  whatsapp: "https://wa.me/919428280683",
  city: "Jamnagar, Gujarat, India",
  /** Phone-only Call + WhatsApp bar (from the architecture file). Not in the reference design. Set false to remove. */
  showCallBar: true,
  defaultLocale: "en"
} as const;
