import { LayoutDashboard, UserPlus, Fingerprint, Shield, FileText, Settings, LogOut, BarChart3, Bell, X, Check, AlertTriangle, Info } from 'lucide-react'
import { Page, Notificacao } from '../App'
import { useState } from 'react'

interface SidebarProps {
  currentPage: Page
  setCurrentPage: (page: Page) => void
  notificacoes: Notificacao[]
  setNotificacoes: (n: Notificacao[]) => void
}

const menuItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'reconhecimento' as Page, label: 'Reconhecimento', icon: Fingerprint },
  { id: 'registro' as Page, label: 'Cadastro', icon: UserPlus },
  { id: 'portaria' as Page, label: 'Portaria Digital', icon: Shield },
  { id: 'logs' as Page, label: 'Logs de Acesso', icon: FileText },
  { id: 'relatorios' as Page, label: 'Relatórios', icon: BarChart3 },
  { id: 'configuracoes' as Page, label: 'Configurações', icon: Settings },
]

export default function Sidebar({ currentPage, setCurrentPage, notificacoes, setNotificacoes }: SidebarProps) {
  const [showNotificacoes, setShowNotificacoes] = useState(false)
  const naoLidas = notificacoes.filter(n => !n.lida).length

  const marcarComoLida = (id: string) => {
    setNotificacoes(notificacoes.map(n => n.id === id ? { ...n, lida: true } : n))
  }

  const marcarTodasComoLidas = () => {
    setNotificacoes(notificacoes.map(n => ({ ...n, lida: true })))
  }

  const getNotificacaoIcon = (tipo: Notificacao['tipo']) => {
    switch (tipo) {
      case 'sucesso': return <Check className="w-4 h-4 text-green-400" />
      case 'alerta': return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case 'erro': return <X className="w-4 h-4 text-red-400" />
      case 'info': return <Info className="w-4 h-4 text-blue-400" />
    }
  }

  return (
    <aside className="w-72 bg-gray-800/95 backdrop-blur-sm border-r border-gray-700/50 flex flex-col relative">
      {/* Logo */}
      <div className="p-5 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">SecureAccess</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Enterprise v2.5</p>
          </div>
        </div>
      </div>

      {/* Status do Sistema */}
      <div className="px-4 py-3 mx-4 mt-4 bg-gradient-to-r from-green-900/30 to-emerald-900/20 border border-green-700/30 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
              <div className="absolute inset-0 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <span className="text-xs text-green-400 font-semibold">Sistema Online</span>
          </div>
          <span className="text-[10px] text-gray-500">v2.5.1</span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <div className="text-center">
            <p className="text-[10px] text-gray-500">Portaria</p>
            <p className="text-[10px] text-green-400 font-medium">● Conectada</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-500">Biometria</p>
            <p className="text-[10px] text-green-400 font-medium">● Ativa</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-500">Voz</p>
            <p className="text-[10px] text-green-400 font-medium">● Ativa</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Menu Principal</p>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20'
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Notificações */}
      <div className="px-3 pb-2">
        <button
          onClick={() => setShowNotificacoes(!showNotificacoes)}
          className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-700/50 hover:text-white transition-all relative"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4" />
            Notificações
          </div>
          {naoLidas > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {naoLidas}
            </span>
          )}
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-xs font-bold">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Administrador</p>
            <p className="text-[10px] text-gray-400 truncate">admin@empresa.com</p>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors p-1">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Painel de Notificações */}
      {showNotificacoes && (
        <div className="absolute top-0 right-0 w-80 h-full bg-gray-800 border-l border-gray-700/50 z-50 flex flex-col shadow-2xl">
          <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Notificações</h3>
            <div className="flex items-center gap-2">
              <button onClick={marcarTodasComoLidas} className="text-[10px] text-blue-400 hover:text-blue-300">
                Marcar todas como lidas
              </button>
              <button onClick={() => setShowNotificacoes(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {notificacoes.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                Nenhuma notificação
              </div>
            ) : (
              notificacoes.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => marcarComoLida(notif.id)}
                  className={`p-3 rounded-lg mb-2 cursor-pointer transition-all ${
                    notif.lida ? 'bg-gray-700/30' : 'bg-gray-700/60 border border-blue-500/20'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">{getNotificacaoIcon(notif.tipo)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white">{notif.titulo}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{notif.mensagem}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{notif.timestamp}</p>
                    </div>
                    {!notif.lida && <div className="w-2 h-2 bg-blue-400 rounded-full mt-1"></div>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </aside>
  )
}
