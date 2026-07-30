import { useState, useEffect } from 'react'
import * as adminService from '../../services/adminService'
import type { Configuracao } from '../../types/admin'
import { Card, Button, Input, PageHeader } from '../../components/ui'
import { Settings, Save } from 'lucide-react'

export default function Configuracoes() {
  const [configs, setConfigs] = useState<Configuracao[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [editando, setEditando] = useState<Record<string, string>>({})

  useEffect(() => { carregarConfigs() }, [])

  async function carregarConfigs() {
    try {
      setCarregando(true)
      const data = await adminService.listarConfiguracoes()
      setConfigs(data)
      const valores: Record<string, string> = {}
      data.forEach(c => { valores[c.chave] = c.valor || '' })
      setEditando(valores)
    } catch { setErro('Erro ao carregar configurações') } finally { setCarregando(false) }
  }

  async function handleSalvar(chave: string) {
    setErro(''); setSucesso('')
    try {
      await adminService.salvarConfiguracao(chave, { valor: editando[chave] || '' })
      setSucesso('Configuração salva!')
      carregarConfigs()
    } catch { setErro('Erro ao salvar configuração') }
  }

  function handleChange(chave: string, valor: string) {
    setEditando(prev => ({ ...prev, [chave]: valor }))
  }

  const labels: Record<string, string> = {
    whatsapp_admin: 'WhatsApp do Administrador',
  }

  const descricoes: Record<string, string> = {
    whatsapp_admin: 'Número com DDD (ex: 5511999999999). Usado pelos motoristas para solicitar assinatura.',
  }

  const placeholders: Record<string, string> = {
    whatsapp_admin: '5511999999999',
  }

  if (carregando) return <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
    <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>

  return (
    <div style={{ padding: 'var(--space-md)', maxWidth: 500, margin: '0 auto' }}>
      <PageHeader title="Configurações" />

      {erro && <div style={{ padding: '10px 14px', background: 'rgba(225,112,85,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{erro}</div>}
      {sucesso && <div style={{ padding: '10px 14px', background: 'rgba(0,184,148,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--accent)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{sucesso}</div>}

      {configs.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
          <Settings size={48} color="var(--text-muted)" style={{ marginBottom: 12 }} />
          <p style={{ color: 'var(--text-muted)' }}>Nenhuma configuração encontrada</p>
        </Card>
      ) : (
        configs.map((config, i) => (
          <Card key={config.id} style={{ marginBottom: 'var(--space-md)', animationDelay: `${i * 50}ms` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Settings size={18} color="var(--accent)" />
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>{labels[config.chave] || config.chave}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{descricoes[config.chave] || config.descricao || config.chave}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <Input
                  value={editando[config.chave] || ''}
                  onChange={e => handleChange(config.chave, e.target.value)}
                  placeholder={placeholders[config.chave] || ''}
                  style={{ marginBottom: 0 }}
                />
              </div>
              <Button size="sm" onClick={() => handleSalvar(config.chave)}>
                <Save size={14} />
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
