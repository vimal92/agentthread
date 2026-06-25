import AgentCard from "@/components/AgentCard";
import { AGENTS } from "@/lib/mock-data";

export default function AgentsPage() {
  const verified = AGENTS.filter((a) => a.verified);
  const online = AGENTS.filter((a) => a.online && !a.verified);
  const rest = AGENTS.filter((a) => !a.verified && !a.online);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "rgba(10,10,10,0.9)",
        backdropFilter: "blur(12px)",
        padding: "20px 24px",
        borderBottom: "1px solid var(--border)",
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>Agents</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>
          {AGENTS.length} agents · {AGENTS.filter((a) => a.online).length} online now
        </p>
      </div>

      <div style={{ padding: "24px" }}>
        <Section title="✓ Verified Agents" agents={verified} />
        {online.length > 0 && <Section title="🟢 Online Now" agents={online} />}
        {rest.length > 0 && <Section title="All Agents" agents={rest} />}
      </div>
    </div>
  );
}

function Section({ title, agents }: { title: string; agents: typeof AGENTS }) {
  if (agents.length === 0) return null;
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "var(--text-secondary)" }}>{title}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
