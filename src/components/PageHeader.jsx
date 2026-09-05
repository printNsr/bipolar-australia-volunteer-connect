import BrandLogo from "@/components/BrandLogo";

export default function PageHeader({ label, children, width = "max-w-6xl" }) {
  return (
    <header className="border-b border-border px-6 py-4">
      <div className={`mx-auto flex ${width} items-center justify-between gap-4`}>
        <BrandLogo />
        <div className="flex items-center gap-5">
          {label && <p className="text-sm text-muted-foreground">{label}</p>}
          {children}
        </div>
      </div>
    </header>
  );
}