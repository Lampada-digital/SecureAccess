import { Users, Shield, Fingerprint, Mic, ArrowUpRight, ArrowDownRight, Activity, Clock, Thermometer, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Pessoa, LogAcesso, Notificacao } from '../App'

interface DashboardProps {
  pessoas: Pessoa[]
  logs: LogAcesso[]
  notificacoes: Notificacao[]
}

const dataAcessoSemanal = [
  { dia: 'Seg', acessos: 145 },
  { dia: 'Ter', acessos: 132 },
  { dia: 'Qua', acessos: 168 },
  { dia: 'Qui', acessos: 155 },
  { dia: 'Sex', acessos: 178 },
  { dia: 'Sáb', acessos: 42 },
  { dia: 'Dom', acessos: 12 },
]

const dataHorarios = [
  { hora: '07h', pessoas: 35 },
  { hora: '08h', pessoas: 89 },
  { hora: '09h', pessoas: 45 },
  { hora: '10h', pessoas: 12 },
  { hora: '11h', pessoas: 8 },
  { hora: '12h', pessoas: 22 },
  { hora: '13h', pessoas: 18 },
  { hora: '14h', pessoas: 5 },
  { hora: '15h', pessoas: 8 },
  { hora: '16h', pessoas: 15 },
  { hora: '17h', pessoas: 95 },
  { hora: '18h', pessoas: 42 },
]

export default function Dashboard({ pessoas, logs, notificacoes }: DashboardProps) {
  const totalPessoas = pessoas.length
  const ativos = pessoas.filter(p => p.status === 'ativo').length
  const biometria = pessoas.filter(p => p.biometriaRegistrada).length
  const voz = pessoas.filter(p => p.vozRegistrada).length
  const acessosHoje = logs.filter(l => l.data === '2024-03-15').length
  const presentesAgora = logs.filter(l => l.tipo === 'entrada' && !logs.find(s => s.pessoaId === l.pessoaId && s.tipo === 'saida' && s.horario > l.horario)).length

  const dataMetodos = [
    { name: 'Biometria', value: logs.filter(l => l.metodo === 'biometria').length, color: '#8B5CF6' },
    { name: 'Voz', value: logs.filter(l => l.metodo === 'voz').length, color: '#10B981' },
    { name: 'Portaria', value: logs.filter(l => l.metodo === 'portaria').length, color: '#F59E0B' },
    { name: 'Cartão', value: logs.filter(l => l.metodo === 'cartao').length, color: '#3B82F6' },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Visão geral do sistema de controle de acesso</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          title="Pessoas Cadastradas"
          value={totalPessoas.toString()}
          subtitle={`${ativos} ativos`}
          color="blue"
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          icon={<Fingerprint className="w-6 h-6" />}
          title="Biometria"
          value={biometria.toString()}
          subtitle={`${Math.round((biometria/totalPessoas)*100)}% cadastrados`}
          color="purple"
          trend="+8%"
          trendUp={true}
        />
        <StatCard
          icon={<Mic className="w-6 h-6" />}
          title="Voz"
          value={voz.toString()}
          subtitle={`${Math.round((voz/totalPessoas)*100)}% cadastrados`}
          color="green"
          trend="+15%"
          trendUp={true}
        />
        <StatCard
          icon={<Shield className="w-6 h-6" />}
          title="Acessos Hoje"
          value={acessosHoje.toString()}
          subtitle="Movimentação total"
          color="orange"
          trend="+5%"
          trendUp={true}
        />
        <StatCard
          icon={<Activity className="w-6 h-6" />}
          title="Presentes Agora"
          value={presentesAgora.toString()}
          subtitle="Na empresa"
          color="cyan"
          trend="Atual"
          trendUp={true}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Acessos por Dia da Semana
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dataAcessoSemanal}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="dia" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="acessos" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
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

      {/* Fluxo por Horário */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Fluxo de Pessoas por Horário
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dataHorarios}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="hora" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Line type="monotone" dataKey="pessoas" stroke="url(#lineGradient)" strokeWidth={3} dot={{ fill: '#06B6D4', r: 5 }} activeDot={{ r: 7 }} />
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Últimos Acessos */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Últimos Acessos Registrados</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Pessoa</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Tipo</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Método</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Porta</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Horário</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Temp.</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 8).map((log) => (
                <tr key={log.id} className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">{log.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                      </div>
                      <span className="text-sm text-white font-medium">{log.nome}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      log.tipo === 'entrada' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                    }`}>
                      {log.tipo === 'entrada' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {log.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-900/50 text-blue-400">
                      {log.metodo === 'biometria' ? '🔐 Biometria' : log.metodo === 'voz' ? '🎤 Voz' : '👤 Portaria'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300">{log.porta}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{log.horario}</td>
                  <td className="py-3 px-4">
                    {log.temperatura && (
                      <span className="text-sm text-gray-300 flex items-center gap-1">
                        <Thermometer className="w-3 h-3" />
                        {log.temperatura}°C
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      log.autorizado ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                    }`}>
                      {log.autorizado ? '✓ Autorizado' : '✗ Negado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  title: string
  value: string
  subtitle: string
  color: string
  trend: string
  trendUp: boolean
}

function StatCard({ icon, title, value, subtitle, color, trend, trendUp }: StatCardProps) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/30',
    purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/30',
    green: 'from-green-500/20 to-green-600/5 border-green-500/30',
    orange: 'from-orange-500/20 to-orange-600/5 border-orange-500/30',
    cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/30',
  }

  const iconColors: Record<string, string> = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    orange: 'text-orange-400',
    cyan: 'text-cyan-400',
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-5 backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`${iconColors[color]}`}>{icon}</div>
        <span className={`text-xs font-medium flex items-center gap-1 ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      <p className="text-sm text-gray-400 mt-1">{title}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  )
}
