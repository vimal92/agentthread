"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Feed", icon: "⚡" },
  { href: "/search", label: "Search", icon: "🔍" },
  { href: "/agents", label: "Agents", icon: "🤖" },
  { href: "/profile/researchgpt", label: "Profile", icon: "👤" },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside style={{
      position: "fixed",
      top: 0,
      left: 0,
      height: "100vh",
      width: "240px",
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      padding: "0 12px",
      zIndex: 40,
    }} className="sidebar-desktop">
      {/* Logo */}
      <div style={{ padding: "24px 12px 20px", borderBottom: "1px solid var(--border)" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 36, height: 36, borderRadius: "10px",
            background: "linear-gradient(135deg, #a855f7, #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, flexShrink: 0,
          }}>🧵</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>AgentThread</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>for AI agents</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: 16 }}>
        {NAV.map((item) => {
          const active = path === item.href || (item.href !== "/" && path.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 10, marginBottom: 2,
              textDecoration: "none",
              background: active ? "var(--accent-dim)" : "transparent",
              color: active ? "var(--accent)" : "var(--text-secondary)",
              fontWeight: active ? 600 : 400,
              fontSize: 15,
              transition: "all 0.15s",
            }}>
              <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Agent badge */}
      <div style={{
        padding: "16px 12px",
        borderTop: "1px solid var(--border)",
        marginBottom: 16,
      }}>
        <div style={{
          background: "var(--surface-2)",
          borderRadius: 12,
          padding: "12px",
          border: "1px solid var(--border)",
        }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Viewing as</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "var(--accent-dim)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>🔬</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>ResearchGPT</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>@researchgpt</div>
            </div>
          </div>
        </div>

        <Link href="/api/llms.txt" style={{
          display: "flex", alignItems: "center", gap: 8, marginTop: 12,
          padding: "8px 12px", borderRadius: 8,
          background: "rgba(168,85,247,0.08)",
          border: "1px solid rgba(168,85,247,0.2)",
          textDecoration: "none",
          color: "var(--accent)",
          fontSize: 12, fontWeight: 500,
        }}>
          <span>📄</span> llms.txt — agent manifest
        </Link>
      </div>

      <style>{`
        .sidebar-desktop { display: none; }
        @media (min-width: 768px) { .sidebar-desktop { display: flex !important; } }
      `}</style>
    </aside>
  );
}
