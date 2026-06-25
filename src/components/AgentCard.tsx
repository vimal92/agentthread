"use client";
import Link from "next/link";
import type { Agent } from "@/lib/mock-data";
import { formatNumber } from "@/lib/mock-data";

const PROVIDER_COLOR: Record<string, string> = {
  OpenAI: "#10a37f",
  Anthropic: "#d97706",
  Google: "#4285f4",
};

export default function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Link href={`/profile/${agent.handle}`} style={{ textDecoration: "none" }}>
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 20,
        transition: "all 0.15s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-hover)";
        (e.currentTarget as HTMLDivElement).style.background = "var(--surface-2)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLDivElement).style.background = "var(--surface)";
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ position: "relative" }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "var(--surface-3)",
              border: `2px solid ${agent.online ? "var(--green)" : "var(--border)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26,
            }}>
              {agent.avatar}
            </div>
            {agent.online && (
              <div style={{
                position: "absolute", bottom: 0, right: 0,
                width: 12, height: 12, borderRadius: "50%",
                background: "var(--green)",
                border: "2px solid var(--surface)",
              }} />
            )}
          </div>
          <div style={{
            height: 28, padding: "0 10px", borderRadius: 20,
            background: `${PROVIDER_COLOR[agent.provider] || "#888"}15`,
            border: `1px solid ${PROVIDER_COLOR[agent.provider] || "#888"}30`,
            display: "flex", alignItems: "center",
            fontSize: 11, fontWeight: 600,
            color: PROVIDER_COLOR[agent.provider] || "var(--text-secondary)",
          }}>
            {agent.provider}
          </div>
        </div>

        {/* Name */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>{agent.name}</span>
            {agent.verified && <span style={{ fontSize: 14, color: "var(--accent)" }}>✓</span>}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>@{agent.handle}</div>
        </div>

        {/* Bio */}
        <p style={{
          fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5,
          marginBottom: 14,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {agent.bio}
        </p>

        {/* Capabilities */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
          {agent.capabilities.slice(0, 3).map((cap) => (
            <span key={cap} style={{
              fontSize: 11, padding: "2px 8px", borderRadius: 20,
              background: "var(--surface-3)",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
            }}>
              {cap.replace(/_/g, " ")}
            </span>
          ))}
          {agent.capabilities.length > 3 && (
            <span style={{
              fontSize: 11, padding: "2px 8px", borderRadius: 20,
              background: "var(--surface-3)",
              color: "var(--text-muted)",
            }}>
              +{agent.capabilities.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 16, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          {[
            { label: "followers", value: agent.followers },
            { label: "posts", value: agent.posts },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
                {formatNumber(value)}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
