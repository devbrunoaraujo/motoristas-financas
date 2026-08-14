import type { CSSProperties } from 'react'

export const colors = {
  bg: '#0a0a1a',
  card: 'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.08)',
  accent: '#00b894',
  accentLight: '#00cec9',
  danger: '#e17055',
  warning: '#fdcb6e',
  info: '#74b9ff',
  text: '#ffffff',
  textSecondary: '#a0a0c0',
  textMuted: '#6c6c8a',
  input: 'rgba(255,255,255,0.08)',
}

export function Card({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ background: colors.card, borderRadius: 16, padding: 16, border: `1px solid ${colors.border}`, ...style }}>
      {children}
    </div>
  )
}

export function Button({ children, onClick, variant = 'primary', disabled = false, fullWidth = true, style }: {
  children: React.ReactNode; onClick: () => void; variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  disabled?: boolean; fullWidth?: boolean; style?: CSSProperties
}) {
  const variants: Record<string, CSSProperties> = {
    primary: { background: colors.accent, border: 'none' },
    secondary: { background: colors.input, border: `1px solid ${colors.border}` },
    danger: { background: colors.danger, border: 'none' },
    ghost: { background: 'transparent', border: `1px solid ${colors.border}` },
  }
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '14px 24px', borderRadius: 12, cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1, fontWeight: 600, display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: 8, transition: 'all 0.2s', width: fullWidth ? '100%' : 'auto',
      color: variant === 'ghost' ? colors.textSecondary : '#fff', fontSize: 15,
      ...variants[variant], ...style,
    }}>
      {children}
    </button>
  )
}

export function Input({ label, value, onChange, placeholder, type = 'text', style }: {
  label?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string; type?: string; style?: CSSProperties
}) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      {label && <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.textSecondary, marginBottom: 6 }}>{label}</label>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{
        width: '100%', padding: '14px', background: colors.input, border: `1px solid ${colors.border}`,
        borderRadius: 12, color: colors.text, fontSize: 15, outline: 'none', boxSizing: 'border-box',
      }} />
    </div>
  )
}

export function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 48 }}>
      <div style={{ width: 32, height: 32, border: `3px solid ${colors.border}`, borderTopColor: colors.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export function EmptyState({ icon, title, description }: { icon: string; title: string; description?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: 48 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.textSecondary, marginBottom: 4 }}>{title}</h3>
      {description && <p style={{ fontSize: 14, color: colors.textMuted }}>{description}</p>}
    </div>
  )
}

export function Badge({ children, variant = 'success' }: { children: React.ReactNode; variant?: 'success' | 'warning' | 'danger' | 'info' }) {
  const bg = { success: 'rgba(0,184,148,0.15)', warning: 'rgba(253,203,110,0.15)', danger: 'rgba(225,112,85,0.15)', info: 'rgba(116,185,255,0.15)' }
  const fg = { success: colors.accent, warning: colors.warning, danger: colors.danger, info: colors.info }
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: bg[variant], color: fg[variant] }}>
      {children}
    </span>
  )
}

export function StatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <Card style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 12, right: 12, opacity: 0.15, color }}>{icon}</div>
      <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>{title}</p>
      <p style={{ fontSize: 18, fontWeight: 700, color }}>{value}</p>
    </Card>
  )
}

export function PageHeader({ title }: { title: string }) {
  return (
    <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.text, marginBottom: 4 }}>{title}</h1>
  )
}

export function ProgressBar({ label, realizado, meta, percentual, cor }: { label: string; realizado: number; meta: number; percentual: number; cor: string }) {
  const pct = Math.min(percentual, 100)
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: colors.textMuted }}>{label}</span>
        <span style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 600 }}>{pct.toFixed(0)}%</span>
      </div>
      <div style={{ height: 8, background: colors.input, borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${cor}, ${cor}aa)`,
          borderRadius: 999,
          transition: 'width 0.8s ease',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <span style={{ fontSize: 11, color: colors.textMuted }}>{realizado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        <span style={{ fontSize: 11, color: colors.textMuted }}>{meta.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
      </div>
    </div>
  )
}
