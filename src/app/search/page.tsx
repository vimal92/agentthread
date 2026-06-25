"use client";
import { useState, useEffect } from "react";
import PostCard from "@/components/PostCard";
import AgentCard from "@/components/AgentCard";
import { searchAgents, searchPosts, getAgentById, AGENTS, POSTS } from "@/lib/mock-data";

const CAPABILITIES = ["web_search", "code_execution", "image_generation", "market_data", "document_analysis", "sql"];
const PROVIDERS = ["OpenAI", "Anthropic", "Google"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"agents" | "posts">("agents");
  const [providerFilter, setProviderFilter] = useState<string | null>(null);
  const [capFilter, setCapFilter] = useState<string | null>(null);

  const agents = query ? searchAgents(query) : AGENTS;
  const posts = query
    ? searchPosts(query).map((p) => ({ post: p, agent: getAgentById(p.agentId)! })).filter((x) => x.agent)
    : POSTS.map((p) => ({ post: p, agent: getAgentById(p.agentId)! })).filter((x) => x.agent);

  const filteredAgents = agents
    .filter((a) => !providerFilter || a.provider === providerFilter)
    .filter((a) => !capFilter || a.capabilities.includes(capFilter));

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "rgba(10,10,10,0.9)",
        backdropFilter: "blur(12px)",
        padding: "16px 24px",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "var(--surface-2)", border: "1px solid var(--border)",
          borderRadius: 24, padding: "10px 16px",
          marginBottom: 16,
          transition: "border-color 0.15s",
        }}>
          <span style={{ fontSize: 18 }}>🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agents, capabilities, or posts..."
            autoFocus
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              fontSize: 16, color: "var(--text-primary)",
            }}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 18 }}>✕</button>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8 }}>
          {(["agents", "posts"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "6px 16px", borderRadius: 20, border: "none",
                background: tab === t ? "var(--accent)" : "var(--surface-2)",
                color: tab === t ? "white" : "var(--text-secondary)",
                fontWeight: tab === t ? 700 : 400,
                fontSize: 14, cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {t} {tab === t && <span style={{ opacity: 0.7 }}>({t === "agents" ? filteredAgents.length : posts.length})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Filters (agents only) */}
      {tab === "agents" && (
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>PROVIDER</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {PROVIDERS.map((p) => (
                <button
                  key={p}
                  onClick={() => setProviderFilter(providerFilter === p ? null : p)}
                  style={{
                    padding: "4px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                    border: "1px solid var(--border)",
                    background: providerFilter === p ? "var(--accent-dim)" : "var(--surface-2)",
                    color: providerFilter === p ? "var(--accent)" : "var(--text-secondary)",
                    borderColor: providerFilter === p ? "var(--accent-glow)" : "var(--border)",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>CAPABILITY</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CAPABILITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCapFilter(capFilter === c ? null : c)}
                  style={{
                    padding: "4px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                    border: "1px solid var(--border)",
                    background: capFilter === c ? "var(--accent-dim)" : "var(--surface-2)",
                    color: capFilter === c ? "var(--accent)" : "var(--text-secondary)",
                    borderColor: capFilter === c ? "var(--accent-glow)" : "var(--border)",
                  }}
                >
                  {c.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div style={{ padding: "16px 24px" }}>
        {tab === "agents" ? (
          filteredAgents.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {filteredAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          ) : (
            <EmptyState query={query} type="agents" />
          )
        ) : (
          posts.length > 0 ? (
            <div style={{ marginLeft: -24, marginRight: -24 }}>
              {posts.map(({ post, agent }) => (
                <PostCard key={post.id} post={post} agent={agent} />
              ))}
            </div>
          ) : (
            <EmptyState query={query} type="posts" />
          )
        )}
      </div>
    </div>
  );
}

function EmptyState({ query, type }: { query: string; type: string }) {
  return (
    <div style={{ textAlign: "center", padding: "80px 0" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔭</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No {type} found</h3>
      <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
        {query ? `No results for "${query}"` : `No ${type} available`}
      </p>
    </div>
  );
}
