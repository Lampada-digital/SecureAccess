import { useState } from 'react'
import { FileText, Search, Filter, Download, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react'
import { LogAcesso } from '../App'

interface LogsProps {
  logs: LogAcesso[]
}

export default function Logs({ logs }: LogsProps) {
  const [search, setSearch] = useState('')
  const [filterMetodo, setFilterMetodo] = useState<string>('todos')
  const [filterTipo, setFilterTipo] = useState<string>('todos')

  const filteredLogs = logs.filter(log => {
    const matchSearch = log.nome.toLowerCase().includes(search.toLowerCase()) || log.porta.toLowerCase().includes(search.toLowerCase())
    const matchMetodo = filterMetodo === 'todos' || log.metodo === filterMetodo
    const matchTipo = filterTipo === 'todos' || log.tipo === filterTipo
    return matchSearch && matchMetodo && matchTipo
  })

  const totalEntradas = logs.filter(l => l.tipo === 'entrada').length
  const totalSaidas = logs.filter(l => l.tipo === 'saida').length
  const totalBiometria = logs.filter(l => l.metodo === 'biometria').length
  const totalVoz = logs.filter(l => l.metodo === 'voz').length
  const totalPortaria = logs.filter(l => l.metodo === 'portaria').length

  const exportCSV = () => {
    const headers = ['Data', 'Horário', 'Nome', 'Tipo', 'Método', 'Porta', 'Temperatura', 'Status', 'Observação']
    const rows = filteredLogs.map(log => [
      log.data,
      log.horario,
      log.nome,
      log.tipo === 'entrada' ? 'Entrada' : 'Saída',
      log.metodo === 'biometria' ? 'Biometria' : log.metodo === 'voz' ? 'Voz' : 'Portaria',
      log.porta,
      log.temperatura ? `${log.temperatura}°C` : '',
      log.autorizado ? 'Autorizado' : 'Negado',
      log.observacao || ''
    ])
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `logs_acesso_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Logs de Acesso</h1>
          <p className="text-gray-400 mt-1">Histórico completo de movimentações</p>
        </div>
        <button 
          onClick={exportCSV}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-3 rounded-lg font-medium transition-all shadow-lg shadow-blue-600/30"
        >
          <Download className="w-5 h-5" />
          Exportar CSV
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <p className="text-sm text-gray-400">Total de Registros</p>
          <p className="text-2xl font-bold text-white mt-1">{logs.length}</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <p className="text-sm text-gray-400">Entradas</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{totalEntradas}</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <p className="text-sm text-gray-400">Saídas</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{totalSaidas}</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <p className="text-sm text-gray-400">Biometria</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">{totalBiometria}</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <p className="text-sm text-gray-400">Voz</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{totalVoz}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou porta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterMetodo}
              onChange={(e) => setFilterMetodo(e.target.value)}
              className="px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="todos">Todos os Métodos</option>
              <option value="biometria">Biometria</option>
              <option value="voz">Voz</option>
              <option value="portaria">Portaria</option>
              <option value="cartao">Cartão</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="todos">Todos os Tipos</option>
              <option value="entrada">Entradas</option>
              <option value="saida">Saídas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Logs */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/50 bg-gray-800/30">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Data/Hora</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Pessoa</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Tipo</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Método</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Porta</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Temp.</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                <td className="py-4 px-6">
                  <div>
                    <p className="text-sm text-white">{log.data}</p>
                    <p className="text-xs text-gray-400">{log.horario}</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">{log.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                    </div>
                    <span className="text-sm text-white">{log.nome}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${
                    log.tipo === 'entrada' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                  }`}>
                    {log.tipo === 'entrada' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {log.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${
                    log.metodo === 'biometria' ? 'bg-purple-900/50 text-purple-400' :
                    log.metodo === 'voz' ? 'bg-blue-900/50 text-blue-400' :
                    'bg-orange-900/50 text-orange-400'
                  }`}>
                    {log.metodo === 'biometria' ? '🔐 Biometria' : log.metodo === 'voz' ? '🎤 Voz' : log.metodo === 'portaria' ? '👤 Portaria' : '💳 Cartão'}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-300">{log.porta}</td>
                <td className="py-4 px-6">
                  {log.temperatura && (
                    <span className="text-sm text-gray-300">{log.temperatura}°C</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${
                    log.autorizado ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                  }`}>
                    {log.autorizado ? '✓ Autorizado' : '✗ Negado'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLogs.length === 0 && (
          <div className="py-12 text-center">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Nenhum registro encontrado</p>
          </div>
        )}
      </div>
    </div>
  )
}
