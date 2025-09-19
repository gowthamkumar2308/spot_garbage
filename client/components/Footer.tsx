export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} Spot Garbage. Cleaner cities together.</p>
        <p className="opacity-80">Community-driven waste detection & reporting.</p>
      </div>
    </footer>
  );
}
