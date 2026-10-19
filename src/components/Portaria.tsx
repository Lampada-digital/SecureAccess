import { useState } from 'react'
import { Shield, Lock, Unlock, DoorOpen, Phone, UserCheck, X, Check, AlertTriangle, Radio } from 'lucide-react'
import { Pessoa, LogAcesso } from '../App'

interface PortariaProps {
  pessoas: Pessoa[]
  logs: LogAcesso[]
  setLogs: (logs: LogAcesso[]) => void
  addNotificacao: (tipo: 'sucesso' | 'alerta' | 'erro' | 'info', titulo: string, mensagem: string) => void
}

export default function Portaria({ pessoas, logs, setLogs, addNotificacao }: PortariaProps) {
  const [portasAbertas, setPortasAbertas] = useState<Record<string, boolean>>({
    'principal': false,
    'executiva': false,
    'servico': false,
  })
  const [visitanteForm, setVisitanteForm] = useState({ nome: '', cpf: '', motivo: '', autorizacao: '' })
  const [showVisitanteModal, setShowVisitanteModal] = useState(false)
  const [intercomStatus, setIntercomStatus] = useState<'idle' | 'calling' | 'connected'>('idle')

  const togglePorta = (porta: string) => {
    setPortasAbertas(prev => ({ ...prev, [porta]: !prev[porta] }))
    if (!portasAbertas[porta]) {
      addNotificacao('info', 'Porta Aberta', `Porta ${porta} foi destrancada`)
      setTimeout(() => {
        setPortasAbertas(prev => ({ ...prev, [porta]: false }))
        addNotificacao('info', 'Porta Trancada', `Porta ${porta} foi trancada automaticamente`)
      }, 5000)
    }
  }

  const handleAutorizarVisitante = () => {
    const novoLog: LogAcesso = {
      id: Date.now().toString(),
      pessoaId: 'visitante-' + Date.now(),
      nome: visitanteForm.nome,
      tipo: 'entrada',
      metodo: 'portaria',
      horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      data: new Date().toISOString().split('T')[0],
      autorizado: true,
      porta: 'Entrada Principal',
      temperatura: 36.5,
      observacao: `Autorizado por ${visitanteForm.autorizacao} - ${visitanteForm.motivo}`
    }
    setLogs([novoLog, ...logs])
    setShowVisitanteModal(false)
    setVisitanteForm({ nome: '', cpf: '', motivo: '', autorizacao: '' })
    togglePorta('principal')
    addNotificacao('sucesso', 'Visitante Autorizado', `${visitanteForm.nome} teve acesso liberado`)
  }

  const handleIntercom = () => {
    setIntercomStatus('calling')
    setTimeout(() => {
      setIntercomStatus('connected')
      addNotificacao('info', 'Interfone', 'Conexão estabelecida com portaria externa')
      setTimeout(() => {
        setIntercomStatus('idle')
        addNotificacao('info', 'Interfone', 'Chamada encerrada')
      }, 5000)
    }, 2000)
  }

  const portas = [
    { id: 'principal', nome: 'Entrada Principal', localizacao: 'Térreo - Lobby', status: portasAbertas['principal'] },
    { id: 'executiva', nome: 'Entrada Executiva', localizacao: 'Térreo - Ala Diretoria', status: portasAbertas['executiva'] },
    { id: 'servico', nome: 'Entrada de Serviço', localizacao: 'Subsolo - Garagem', status: portasAbertas['servico'] },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Portaria Digital</h1>
          <p className="text-gray-400 mt-1">Controle remoto das portas e interfone</p>
        </div>
        <button
          onClick={() => setShowVisitanteModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-5 py-3 rounded-lg font-medium transition-all shadow-lg shadow-green-600/30"
        >
          <UserCheck className="w-5 h-5" />
          Autorizar Visitante
        </button>
      </div>

      {/* Status Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Status do Sistema</p>
            <p className="text-lg font-bold text-green-400">Operacional</p>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Radio className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Interfone</p>
            <p className={`text-lg font-bold ${intercomStatus === 'connected' ? 'text-green-400' : 'text-blue-400'}`}>
              {intercomStatus === 'idle' ? 'Disponível' : intercomStatus === 'calling' ? 'Chamando...' : 'Conectado'}
            </p>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center">
            <DoorOpen className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Portas Ativas</p>
            <p className="text-lg font-bold text-purple-400">
              {Object.values(portasAbertas).filter(v => v).length}/3 abertas
            </p>
          </div>
        </div>
      </div>

      {/* Controle de Portas */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-400" />
          Controle de Portas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portas.map((porta) => (
            <div key={porta.id} className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl border overflow-hidden transition-all ${
              porta.status ? 'border-green-500/50 shadow-lg shadow-green-500/10' : 'border-gray-700/50'
            }`}>
              <div className={`p-4 ${porta.status ? 'bg-green-900/20' : 'bg-gray-800/30'}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{porta.nome}</h3>
                  <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                    porta.status ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${porta.status ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                    {porta.status ? 'Aberta' : 'Trancada'}
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-1">{porta.localizacao}</p>
              </div>

              <div className="p-6 flex flex-col items-center">
                <div className={`w-32 h-40 rounded-lg mb-6 flex items-center justify-center transition-all duration-500 ${
                  porta.status ? 'bg-green-900/30 border-2 border-green-500' : 'bg-gray-700/50 border-2 border-gray-600/50'
                }`}>
                  <div className={`transition-transform duration-500 ${porta.status ? 'rotate-[30deg] origin-left' : ''}`}>
                    <DoorOpen className={`w-16 h-16 ${porta.status ? 'text-green-400' : 'text-gray-500'}`} />
                  </div>
                </div>

                <button
                  onClick={() => togglePorta(porta.id)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    porta.status
                      ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-600/30'
                      : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg shadow-green-600/30'
                  }`}
                >
                  {porta.status ? (
                    <>
                      <Lock className="w-5 h-5" />
                      Trancar Porta
                    </>
                  ) : (
                    <>
                      <Unlock className="w-5 h-5" />
                      Liberar Acesso
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interfone / Comunicação */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-blue-400" />
          Interfone / Comunicação
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/50">
            <h3 className="text-white font-medium mb-3">Chamada para Portaria Externa</h3>
            <p className="text-sm text-gray-400 mb-4">Comunique-se com a portaria externa para autorizações</p>
            <button
              onClick={handleIntercom}
              disabled={intercomStatus !== 'idle'}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                intercomStatus === 'idle'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Phone className="w-5 h-5" />
              {intercomStatus === 'idle' ? 'Chamar Portaria' : intercomStatus === 'calling' ? 'Chamando...' : 'Em comunicação'}
            </button>
            {intercomStatus === 'connected' && (
              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1 bg-green-500 rounded-full animate-pulse" style={{
                      height: `${Math.random() * 16 + 4}px`,
                      animationDelay: `${i * 0.1}s`
                    }}></div>
                  ))}
                </div>
                <span className="text-xs text-green-400">Áudio ativo</span>
              </div>
            )}
          </div>

          <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/50">
            <h3 className="text-white font-medium mb-3">Emergência</h3>
            <p className="text-sm text-gray-400 mb-4">Bloqueio total de todas as portas em caso de emergência</p>
            <button 
              onClick={() => addNotificacao('alerta', 'Emergência', 'Bloqueio de emergência ativado')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all shadow-lg shadow-red-600/30"
            >
              <AlertTriangle className="w-5 h-5" />
              Bloqueio de Emergência
            </button>
          </div>
        </div>
      </div>

      {/* Visitantes Aguardando */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Visitantes na Portaria</h2>
        <div className="space-y-3">
          {[
            { nome: 'Maria Fernandes', motivo: 'Reunião com RH', hora: '09:30', status: 'aguardando' },
            { nome: 'Pedro Almeida', motivo: 'Entrega de documentos', hora: '10:15', status: 'aguardando' },
          ].map((visitante, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-700/30 rounded-xl p-4 border border-gray-600/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-900/50 rounded-full flex items-center justify-center">
                  <span className="text-yellow-400 text-sm font-bold">{visitante.nome.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <p className="text-white font-medium">{visitante.nome}</p>
                  <p className="text-sm text-gray-400">{visitante.motivo} • Desde {visitante.hora}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => addNotificacao('sucesso', 'Visitante Autorizado', `${visitante.nome} teve acesso liberado`)}
                  className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm rounded-lg transition-all flex items-center gap-1"
                >
                  <Check className="w-4 h-4" /> Autorizar
                </button>
                <button 
                  onClick={() => addNotificacao('alerta', 'Visitante Negado', `${visitante.nome} teve acesso negado`)}
                  className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm rounded-lg transition-all flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> Negar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Autorização de Visitante */}
      {showVisitanteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Autorizar Visitante</h2>
              <button onClick={() => setShowVisitanteModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nome do Visitante *</label>
                <input
                  type="text"
                  value={visitanteForm.nome}
                  onChange={(e) => setVisitanteForm({...visitanteForm, nome: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">CPF / Documento *</label>
                <input
                  type="text"
                  value={visitanteForm.cpf}
                  onChange={(e) => setVisitanteForm({...visitanteForm, cpf: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Motivo da Visita *</label>
                <input
                  type="text"
                  value={visitanteForm.motivo}
                  onChange={(e) => setVisitanteForm({...visitanteForm, motivo: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Motivo"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Autorizado por *</label>
                <input
                  type="text"
                  value={visitanteForm.autorizacao}
                  onChange={(e) => setVisitanteForm({...visitanteForm, autorizacao: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Nome do responsável"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-700 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowVisitanteModal(false)}
                className="px-5 py-2.5 text-gray-400 hover:text-white border border-gray-600 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAutorizarVisitante}
                className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all shadow-lg shadow-green-600/30"
              >
                Autorizar Entrada
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
