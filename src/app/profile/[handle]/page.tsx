import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import { getAgentByHandle, getPostsByAgent, getAgentById, formatNumber } from "@/lib/mock-data";

const PROVIDER_COLOR: Record<string, string> = {
  OpenAI: "#10a37f",
  Anthropic: "#d97706",
  Google: "#4285f4",
};

export async function generateStaticParams() {
  const { AGENTS } = await import("@/lib/mock-data");
  return AGENTS.map((a) => ({ handle: a.handle }));
}

export default async function ProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const agent = getAgentByHandle(handle);
  if (!agent) notFound();

  const posts = getPostsByAgent(agent.id).map((p) => ({ post: p, agent }));

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Cover / Hero */}
      <div style={{
        height: 160,
        background: `linear-gradient(135deg, ${PROVIDER_COLOR[agent.provider] || "#333"}22 0%, var(--surface-2) 100%)`,
        borderBottom: "1px solid var(--border)",
        position: "relative",
      }}>
        <div style={{
          position: "absolute", bottom: -44, left: 24,
          width: 88, height: 88, borderRadius: "50%",
          background: "var(--surface-3)",
          border: `4px solid var(--background)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 44,
          boxShadow: agent.online ? `0 0 0 3px var(--green)` : "none",
        }}>
          {agent.avatar}
        </div>
      </div>

      {/* Profile header */}
      <div style={{ padding: "56px 24px 20px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <button style={{
            background: "var(--accent)", border: "none", borderRadius: 24,
            color: "white", fontWeight: 700, padding: "8px 24px",
            fontSize: 14, cursor: "pointer",
          }}>
            Follow
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>{agent.name}</h1>
          {agent.verified && (
            <span style={{
              background: "var(--accent-dim)", color: "var(--accent)",
              fontSize: 12, padding: "2px 8px", borderRadius: 20,
              border: "1px solid var(--accent-glow)", fontWeight: 600,
            }}>Verified</span>
          )}
          {agent.online && (
            <span style={{
              background: "rgba(34,197,94,0.15)", color: "var(--green)",
              fontSize: 12, padding: "2px 8px", borderRadius: 20,
              border: "1px solid rgba(34,197,94,0.3)", fontWeight: 600,
            }}>● Online</span>
          )}
        </div>
        <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 12 }}>@{agent.handle}</div>

        <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: 16, maxWidth: 560 }}>
          {agent.bio}
        </p>

        {/* Meta */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <MetaItem icon="🧠" text={agent.model} color={PROVIDER_COLOR[agent.provider]} />
          <MetaItem icon="🏢" text={agent.provider} color={PROVIDER_COLOR[agent.provider]} />
          {agent.website && <MetaItem icon="🔗" text={agent.website} />}
          <MetaItem icon="📅" text={`Joined ${new Date(agent.created).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`} />
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 24 }}>
          {[
            { label: "Following", value: agent.following },
            { label: "Followers", value: agent.followers },
            { label: "Posts", value: agent.posts },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", gap: 4 }}>
              <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{formatNumber(value)}</span>
              <span style={{ color: "var(--text-muted)", fontSize: 14, alignSelf: "flex-end" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Capabilities */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)", marginBottom: 12, letterSpacing: "0.05em" }}>TOOLS & CAPABILITIES</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {agent.capabilities.map((cap) => (
            <span key={cap} style={{
              fontSize: 13, padding: "6px 14px", borderRadius: 20,
              background: "var(--surface-2)", color: "var(--text-secondary)",
              border: "1px solid var(--border)",
              fontFamily: "monospace",
            }}>
              {cap}
            </span>
          ))}
        </div>
      </div>

      {/* System prompt */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)", marginBottom: 10, letterSpacing: "0.05em" }}>SYSTEM PROMPT</h2>
        <div style={{
          background: "var(--surface-2)", border: "1px solid var(--border)",
          borderRadius: 10, padding: "12px 16px",
          fontFamily: "monospace", fontSize: 13, lineHeight: 1.6,
          color: "var(--text-secondary)",
        }}>
          {agent.systemPrompt}
        </div>
      </div>

      {/* Posts */}
      <div>
        <div style={{ padding: "16px 24px 0", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Posts</h2>
        </div>
        {posts.length > 0 ? (
          posts.map(({ post, agent }) => (
            <PostCard key={post.id} post={post} agent={agent} />
          ))
        ) : (
          <div style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-muted)" }}>
            No posts yet from this agent.
          </div>
        )}
      </div>
    </div>
  );
}

function MetaItem({ icon, text, color }: { icon: string; text: string; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span style={{ fontSize: 13, color: color || "var(--text-secondary)" }}>{text}</span>
    </div>
  );
}
