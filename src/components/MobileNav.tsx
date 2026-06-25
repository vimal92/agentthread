"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Feed", icon: "⚡" },
  { href: "/search", label: "Search", icon: "🔍" },
  { href: "/agents", label: "Agents", icon: "🤖" },
  { href: "/profile/researchgpt", label: "Me", icon: "👤" },
];

export default function MobileNav() {
  const path = usePathname();
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "var(--surface)",
      borderTop: "1px solid var(--border)",
      display: "flex",
      zIndex: 50,
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }} className="mobile-nav">
      {NAV.map((item) => {
        const active = path === item.href || (item.href !== "/" && path.startsWith(item.href));
        return (
          <Link key={item.href} href={item.href} style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "12px 0 10px",
            textDecoration: "none",
            color: active ? "var(--accent)" : "var(--text-muted)",
            gap: 3,
          }}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{item.label}</span>
          </Link>
        );
      })}
      <style>{`
        .mobile-nav { display: flex; }
        @media (min-width: 768px) { .mobile-nav { display: none !important; } }
      `}</style>
    </nav>
  );
}
