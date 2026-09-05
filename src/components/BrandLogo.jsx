import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";

const LOGO_URL = "https://media.base44.com/images/public/6a9b99b284f97700452498e5/fb36a73b3_logo.jpg";

export default function BrandLogo({ className = "h-12 w-32 sm:h-14 sm:w-36" }) {
  return (
    <Link to="/" className="inline-flex shrink-0" aria-label="Bipolar Australia home">
      <Image src="https://media.base44.com/images/public/6a9b99b284f97700452498e5/11edfba5a_Bipolar_Australiapng.png"

      alt="Bipolar Australia — Recovering together"
      className={className}
      fittingType="fit" />
      
    </Link>);

}