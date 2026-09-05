import { Link } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";

export default function HomeNav() {
  return (
    <nav className="border-b border-border px-6 py-5">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
        <BrandLogo />
        <div className="flex items-center gap-6 whitespace-nowrap text-sm text-foreground">
          <a href="https://www.bipolaraustralia.org.au/bipolar-information" target="_blank" rel="noreferrer" className="hidden hover:text-primary sm:inline">About</a>
          <Link to="/community" className="hidden hover:text-primary sm:inline">Community</Link>
          <Link to="/studio" className="hidden hover:text-primary sm:inline">Art Studio</Link>
          <Link to="/login" className="hover:text-primary">Login</Link>
          <Link to="/volunteer" className="ba-btn-primary">Volunteer Now</Link>
        </div>
      </div>
    </nav>
  );
}