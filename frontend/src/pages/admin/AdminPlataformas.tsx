import { useState, useEffect } from 'react'
import * as plataformaService from '../../services/plataformaService'
import type { Plataforma, PlataformaRequest } from '../../types/plataforma'
import { Card, Button, Input, PageHeader, Badge, EmptyState } from '../../components/ui'
import { Layers, Plus, Edit3, Trash2, Save, X, RotateCcw } from 'lucide-react'

export default function AdminPlataformas() {
  const [plataformas, setPlataformas] = useState<Plataforma[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState<Plataforma | null>(null)

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')

  useEffect(() => { carregarPlataformas() }, [])

  async function carregarPlataformas() {
    try { setCarregando(true); setPlataformas(await plataformaService.listarPlataformas()) }
    catch { setErro('Erro ao carregar plataformas') } finally { setCarregando(false) }
  }

  function limparForm() {
    setNome(''); setDescricao(''); setEditando(null); setMostrarForm(false); setErro(''); setSucesso('')
  }

  function abrirEdicao(p: Plataforma) {
    setEditando(p); setNome(p.nome); setDescricao(p.descricao || ''); setMostrarForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setErro(''); setSucesso('')
    const dados: PlataformaRequest = { nome, descricao: descricao || undefined }
    try {
      editando ? await plataformaService.editarPlataforma(editando.id, dados) : await plataformaService.criarPlataforma(dados)
      setSucesso(editando ? 'Plataforma atualizada!' : 'Plataforma criada!')
      limparForm(); carregarPlataformas()
    } catch (err: any) { setErro(err.response?.data?.mensagem || 'Erro ao salvar') }
  }

  async function handleInativar(id: number) {
    if (!confirm('Inativar esta plataforma?')) return
    try { await plataformaService.inativarPlataforma(id); carregarPlataformas() } catch { setErro('Erro ao inativar') }
  }

  async function handleReativar(id: number) {
    try { await plataformaService.reativarPlataforma(id); carregarPlataformas() } catch { setErro('Erro ao reativar') }
  }

  if (carregando) return <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
    <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>

  return (
    <div style={{ padding: 'var(--space-md)', maxWidth: 600, margin: '0 auto' }}>
      <PageHeader title="Plataformas" action={
        !mostrarForm && <Button size="sm" onClick={() => setMostrarForm(true)}><Plus size={16} /> Nova</Button>
      } />

      {erro && <div style={{ padding: '10px 14px', background: 'rgba(225,112,85,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{erro}</div>}
      {sucesso && <div style={{ padding: '10px 14px', background: 'rgba(0,184,148,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--accent)', fontSize: 14, marginBottom: 'var(--space-md)' }}>{sucesso}</div>}

      {mostrarForm && (
        <Card style={{ marginBottom: 'var(--space-md)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 'var(--space-md)' }}>{editando ? 'Editar Plataforma' : 'Nova Plataforma'}</h3>
          <form onSubmit={handleSubmit}>
            <Input label="Nome" value={nome} onChange={e => setNome(e.target.value)} required placeholder="Ex: Uber, 99, iFood" />
            <Input label="Descrição (opcional)" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Ex: Transporte de passageiros" />
            <div style={{ display: 'flex', gap: 8 }}>
              <Button type="submit" fullWidth><Save size={16} /> {editando ? 'Salvar' : 'Criar'}</Button>
              <Button variant="ghost" onClick={limparForm}><X size={16} /></Button>
            </div>
          </form>
        </Card>
      )}

      {plataformas.length === 0 ? (
        <EmptyState icon={<Layers size={48} />} title="Nenhuma plataforma" description="Cadastre as plataformas de ganho" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {plataformas.map((p, i) => (
            <Card key={p.id} style={{ animationDelay: `${i * 50}ms`, opacity: p.ativo ? 1 : 0.6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <p style={{ fontSize: 16, fontWeight: 600 }}>{p.nome}</p>
                    {!p.ativo && <Badge variant="danger">Inativa</Badge>}
                  </div>
                  {p.descricao && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{p.descricao}</p>}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => abrirEdicao(p)} style={{ padding: 8, background: 'var(--bg-input)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', cursor: 'pointer' }}><Edit3 size={14} /></button>
                  {p.ativo ? (
                    <button onClick={() => handleInativar(p.id)} style={{ padding: 8, background: 'rgba(225,112,85,0.1)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={14} /></button>
                  ) : (
                    <button onClick={() => handleReativar(p.id)} style={{ padding: 8, background: 'rgba(0,184,148,0.1)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'var(--accent)', cursor: 'pointer' }}><RotateCcw size={14} /></button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
