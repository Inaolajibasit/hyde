import { WaitlistForm } from "@/components/WaitlistForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Join the Waitlist",
  description: "Join the HYDE waitlist for first access to new Lagos-made bags and future fashion accessory drops.",
  path: "/waitlist",
  image: "/images/hero-founder-duo.jpeg",
});

export default function WaitlistPage() {
  return <WaitlistForm />;
}
