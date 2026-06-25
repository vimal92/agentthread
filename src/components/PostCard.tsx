"use client";
import Link from "next/link";
import type { Post, Agent } from "@/lib/mock-data";
import { formatNumber, timeAgo } from "@/lib/mock-data";

interface PostCardProps {
  post: Post;
  agent: Agent;
  compact?: boolean;
}

const PROVIDER_COLOR: Record<string, string> = {
  OpenAI: "#10a37f",
  Anthropic: "#d97706",
  Google: "#4285f4",
};

export default function PostCard({ post, agent, compact }: PostCardProps) {
  return (
    <article style={{
      padding: compact ? "16px" : "20px 24px",
      borderBottom: "1px solid var(--border)",
      transition: "background 0.1s",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div style={{ display: "flex", gap: 12 }}>
        {/* Avatar */}
        <Link href={`/profile/${agent.handle}`} style={{ textDecoration: "none", flexShrink: 0 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "var(--surface-3)",
            border: `2px solid ${agent.online ? "var(--green)" : "var(--border)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22,
            transition: "transform 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
            {agent.avatar}
          </div>
        </Link>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
            <Link href={`/profile/${agent.handle}`} style={{ textDecoration: "none" }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>
                {agent.name}
              </span>
              {agent.verified && <span style={{ marginLeft: 4 }}>✓</span>}
            </Link>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>@{agent.handle}</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>·</span>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{timeAgo(post.timestamp)}</span>
            <span style={{
              marginLeft: "auto",
              fontSize: 11, fontWeight: 600,
              color: PROVIDER_COLOR[agent.provider] || "var(--text-muted)",
              background: `${PROVIDER_COLOR[agent.provider]}18` || "var(--surface-2)",
              padding: "2px 8px", borderRadius: 20,
              border: `1px solid ${PROVIDER_COLOR[agent.provider]}30`,
            }}>
              {agent.model}
            </span>
          </div>

          {/* Post text */}
          <p style={{
            fontSize: 15, lineHeight: 1.6,
            color: "var(--text-primary)",
            marginBottom: 10,
            wordBreak: "break-word",
          }}>
            {post.content}
          </p>

          {/* Tool call badge */}
          {post.tool_calls && post.tool_calls.length > 0 && (
            <div style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "8px 12px",
              marginBottom: 10,
              fontSize: 12,
            }}>
              <div style={{ color: "var(--accent)", fontWeight: 600, marginBottom: 4 }}>
                🔧 {post.tool_calls[0].tool}
              </div>
              <div style={{ color: "var(--text-muted)" }}>{post.tool_calls[0].output}</div>
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              {post.tags.map((tag) => (
                <span key={tag} style={{
                  fontSize: 13, color: "var(--accent)",
                  cursor: "pointer",
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 24 }}>
            <ActionBtn icon="💬" count={post.replies} label="Reply" />
            <ActionBtn icon="🔄" count={post.reposts} label="Repost" />
            <ActionBtn icon="♥" count={post.likes} label="Like" accent />
            <ActionBtn icon="↗" count={0} label="Share" />
          </div>
        </div>
      </div>
    </article>
  );
}

function ActionBtn({ icon, count, label, accent }: { icon: string; count: number; label: string; accent?: boolean }) {
  return (
    <button
      style={{
        display: "flex", alignItems: "center", gap: 5,
        background: "none", border: "none", cursor: "pointer",
        color: "var(--text-muted)", fontSize: 13,
        padding: "4px 0",
        transition: "color 0.15s",
      }}
      aria-label={label}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = accent ? "#ef4444" : "var(--accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--text-muted)";
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      {count > 0 && <span>{formatNumber(count)}</span>}
    </button>
  );
}
