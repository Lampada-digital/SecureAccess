import { LayoutDashboard, UserPlus, Fingerprint, Shield, FileText, Settings, LogOut, Mic } from 'lucide-react'
import { Page } from '../App'

interface SidebarProps {
  currentPage: Page
  setCurrentPage: (page: Page) => void
}

const menuItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'registro' as Page, label: 'Cadastro', icon: UserPlus },
  { id: 'reconhecimento' as Page, label: 'Reconhecimento', icon: Fingerprint },
  { id: 'portaria' as Page, label: 'Portaria Digital', icon: Shield },
  { id: 'logs' as Page, label: 'Logs de Acesso', icon: FileText },
  { id: 'configuracoes' as Page, label: 'Configurações', icon: Settings },
]

export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  return (
    <aside className="w-72 bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">SecureAccess</h1>
            <p className="text-xs text-gray-400">Controle Biométrico</p>
          </div>
        </div>
      </div>

      {/* Status do Sistema */}
      <div className="px-4 py-3 mx-4 mt-4 bg-green-900/30 border border-green-700/50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400 font-medium">Sistema Online</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">Portaria conectada</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">AD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Administrador</p>
            <p className="text-xs text-gray-400">admin@empresa.com</p>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
