export type SocialIcon = "instagram" | "tiktok" | "whatsapp";

export type Social = {
  name: string;
  href: string;
  icon: SocialIcon;
};

// PLACEHOLDER handles — replace with real ones before launch. WhatsApp
// numbers use the international format WITHOUT the leading "+" so the
// wa.me deep link resolves correctly across mobile and web.
export const socials: Social[] = [
  { name: "Instagram", href: "https://instagram.com/hyde", icon: "instagram" },
  { name: "TikTok", href: "https://tiktok.com/@hyde", icon: "tiktok" },
  { name: "WhatsApp", href: "https://wa.me/2348000000000", icon: "whatsapp" },
];
