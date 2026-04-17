export default function SectionDivider() {
  return (
    <div className="relative h-px w-full" style={{ background: 'var(--border)' }}>
      <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 12px var(--accent-glow)' }} />
    </div>
  );
}
