import { Link, useLocation } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";

const LINKS = [
  { to: "/studio/create", label: "Create" },
  { to: "/studio", label: "Collaborations" },
  { to: "/studio/impact", label: "My Impact" },
  { to: "/studio/profile", label: "Profile" }
];

export default function StudioNav() {
  const { pathname } = useLocation();
  return (
    <nav className="border-b border-border px-6 py-4">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <BrandLogo />
        <div className="flex flex-wrap items-center gap-6">
          <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">
            Back to home
          </Link>
          {LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm transition-colors ${
                pathname === to ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}