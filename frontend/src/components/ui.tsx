import type { ReactNode, CSSProperties } from 'react'

// Card component
export function Card({ children, style, className = '' }: { children: ReactNode; style?: CSSProperties; className?: string }) {
  return (
    <div
      className={`glass animate-fade-in ${className}`}
      style={{
        padding: 'var(--space-md)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// Button component
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  style,
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
  style?: CSSProperties
}) {
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
      color: '#fff',
      border: 'none',
    },
    secondary: {
      background: 'var(--bg-input)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
    },
    danger: {
      background: 'linear-gradient(135deg, var(--danger), var(--danger-light))',
      color: '#fff',
      border: 'none',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border)',
    },
  }

  const sizes = {
    sm: { padding: '8px 14px', fontSize: 13 },
    md: { padding: '12px 20px', fontSize: 14 },
    lg: { padding: '14px 24px', fontSize: 15 },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variants[variant],
        ...sizes[size],
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'all var(--transition-fast)',
        width: fullWidth ? '100%' : 'auto',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// Input component
export function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  min,
  max,
  step,
  style,
}: {
  label?: string
  type?: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  min?: string | number
  max?: string | number
  step?: string | number
  style?: CSSProperties
}) {
  return (
    <div style={{ marginBottom: 'var(--space-md)', ...style }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--text-secondary)',
          marginBottom: 6,
        }}>{label}</label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        style={{
          width: '100%',
          padding: '12px 14px',
          background: 'var(--bg-input)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)',
          fontSize: 15,
          outline: 'none',
          transition: 'border-color var(--transition-fast)',
          opacity: disabled ? 0.6 : 1,
        }}
      />
    </div>
  )
}

// Select component
export function Select({
  label,
  value,
  onChange,
  options,
  style,
}: {
  label?: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string | number; label: string }[]
  style?: CSSProperties
}) {
  return (
    <div style={{ marginBottom: 'var(--space-md)', ...style }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--text-secondary)',
          marginBottom: 6,
        }}>{label}</label>
      )}
      <select
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          padding: '12px 14px',
          background: 'var(--bg-input)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)',
          fontSize: 15,
          outline: 'none',
          cursor: 'pointer',
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

// Badge component
export function Badge({ children, variant = 'default' }: { children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' }) {
  const colors = {
    default: { bg: 'var(--bg-input)', color: 'var(--text-secondary)' },
    success: { bg: 'rgba(0, 184, 148, 0.15)', color: 'var(--accent)' },
    warning: { bg: 'rgba(253, 203, 110, 0.15)', color: 'var(--warning)' },
    danger: { bg: 'rgba(225, 112, 85, 0.15)', color: 'var(--danger)' },
    info: { bg: 'rgba(116, 185, 255, 0.15)', color: 'var(--info)' },
  }

  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 'var(--radius-full)',
      fontSize: 12,
      fontWeight: 600,
      background: colors[variant].bg,
      color: colors[variant].color,
    }}>
      {children}
    </span>
  )
}

// Empty state component
export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description?: string }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: 'var(--space-2xl) var(--space-md)',
      color: 'var(--text-muted)',
    }}>
      <div style={{ marginBottom: 'var(--space-md)', opacity: 0.5 }}>{icon}</div>
      <h3 style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 4 }}>{title}</h3>
      {description && <p style={{ fontSize: 14 }}>{description}</p>}
    </div>
  )
}

// Page header component
export function PageHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 'var(--space-lg)',
    }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>{title}</h1>
      {action}
    </div>
  )
}

// Stat card component
export function StatCard({
  title,
  value,
  icon,
  color = 'var(--accent)',
  trend,
}: {
  title: string
  value: string
  icon: ReactNode
  color?: string
  trend?: { value: string; positive: boolean }
}) {
  return (
    <Card style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      animation: 'slideUp var(--transition-slow) forwards',
    }}>
      <div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{title}</p>
        <p style={{ fontSize: 22, fontWeight: 700, color }}>{value}</p>
        {trend && (
          <p style={{ fontSize: 12, color: trend.positive ? 'var(--accent)' : 'var(--danger)', marginTop: 4 }}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </p>
        )}
      </div>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 'var(--radius-md)',
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color,
      }}>
        {icon}
      </div>
    </Card>
  )
}
