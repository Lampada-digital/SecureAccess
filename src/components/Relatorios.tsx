import { BarChart3, TrendingUp, Users, Clock, Calendar } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { LogAcesso, Pessoa } from '../App'

interface RelatoriosProps {
  logs: LogAcesso[]
  pessoas: Pessoa[]
}

export default function Relatorios({ logs, pessoas }: RelatoriosProps) {
  // Dados para gráficos
  const dataDepartamentos = Object.entries(
    logs.reduce((acc, log) => {
      const pessoa = pessoas.find(p => p.id === log.pessoaId)
      const dept = pessoa?.departamento || 'Externo'
      acc[dept] = (acc[dept] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  const dataMetodos = [
    { name: 'Biometria', value: logs.filter(l => l.metodo === 'biometria').length, color: '#8B5CF6' },
    { name: 'Voz', value: logs.filter(l => l.metodo === 'voz').length, color: '#10B981' },
    { name: 'Portaria', value: logs.filter(l => l.metodo === 'portaria').length, color: '#F59E0B' },
    { name: 'Cartão', value: logs.filter(l => l.metodo === 'cartao').length, color: '#3B82F6' },
  ]

  const dataPortas = Object.entries(
    logs.reduce((acc, log) => {
      acc[log.porta] = (acc[log.porta] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  const dataHorarios = Array.from({ length: 24 }, (_, i) => {
    const hora = `${i.toString().padStart(2, '0')}h`
    const count = logs.filter(l => {
      const logHour = parseInt(l.horario.split(':')[0])
      return logHour === i
    }).length
    return { hora, count }
  })

  // Estatísticas
  const totalAcessos = logs.length
  const mediaDiaria = Math.round(totalAcessos / 7) // considerando 7 dias de dados
  const picoHorario = dataHorarios.reduce((max, curr) => curr.count > max.count ? curr : max, dataHorarios[0])
  const departamentoMaisAtivo = dataDepartamentos.reduce((max, curr) => curr.value > max.value ? curr : max, dataDepartamentos[0])

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Relatórios</h1>
        <p className="text-gray-400 mt-1">Análise detalhada do sistema de controle de acesso</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/5 border border-blue-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">{totalAcessos}</h3>
          <p className="text-sm text-gray-400 mt-1">Total de Acessos</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/5 border border-purple-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-6 h-6 text-purple-400" />
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">{mediaDiaria}</h3>
          <p className="text-sm text-gray-400 mt-1">Média Diária</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/5 border border-green-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <Calendar className="w-6 h-6 text-green-400" />
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">{picoHorario.hora}</h3>
          <p className="text-sm text-gray-400 mt-1">Horário de Pico</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/5 border border-orange-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <Users className="w-6 h-6 text-orange-400" />
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <h3 className="text-lg font-bold text-white truncate">{departamentoMaisAtivo?.name}</h3>
          <p className="text-sm text-gray-400 mt-1">Depto. Mais Ativo</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Fluxo por Horário */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Fluxo por Horário (24h)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dataHorarios}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hora" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" fill="url(#gradientHorarios)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="gradientHorarios" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Métodos de Acesso */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Métodos de Acesso
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={dataMetodos}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {dataMetodos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {dataMetodos.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-300">{item.name}</span>
                </div>
                <span className="text-white font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Departamentos */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Acessos por Departamento
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dataDepartamentos} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis type="category" dataKey="name" stroke="#9CA3AF" width={120} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" fill="url(#gradientDeptos)" radius={[0, 4, 4, 0]} />
              <defs>
                <linearGradient id="gradientDeptos" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Portas */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-400" />
            Utilização por Porta
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dataPortas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" angle={-15} textAnchor="end" height={80} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" fill="url(#gradientPortas)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="gradientPortas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
