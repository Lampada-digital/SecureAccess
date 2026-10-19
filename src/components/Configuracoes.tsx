import { useState } from 'react'
import { Settings, Shield, Bell, Database, Wifi, Key, Monitor, Save, ToggleLeft, ToggleRight } from 'lucide-react'

export default function Configuracoes() {
  const [settings, setSettings] = useState({
    biometriaAtiva: true,
    vozAtiva: true,
    notificacoesEmail: true,
    notificacoesPush: false,
    autoBloqueio: true,
    tempoBloqueio: 5,
    maxTentativas: 3,
    nivelSeguranca: 'alto',
    gravarLogs: true,
    backupAutomatico: true,
    intervaloBackup: 24,
    ipPortaria: '192.168.1.100',
    portaComunicacao: '8080',
    servidorBiometria: '192.168.1.101',
    servidorVoz: '192.168.1.102',
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Configurações</h1>
          <p className="text-gray-400 mt-1">Gerencie as configurações do sistema</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all shadow-lg ${
            saved
              ? 'bg-green-600 text-white shadow-green-600/30'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
          }`}
        >
          <Save className="w-5 h-5" />
          {saved ? 'Salvo!' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Métodos de Autenticação */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Métodos de Autenticação
            </h2>
            <p className="text-sm text-gray-400 mt-1">Configure os métodos de reconhecimento disponíveis</p>
          </div>
          <div className="p-6 space-y-6">
            <ToggleRow
              label="Reconhecimento Biométrico"
              description="Habilitar leitura de impressão digital"
              enabled={settings.biometriaAtiva}
              onToggle={() => toggleSetting('biometriaAtiva')}
            />
            <ToggleRow
              label="Reconhecimento de Voz"
              description="Habilitar identificação por padrão vocal"
              enabled={settings.vozAtiva}
              onToggle={() => toggleSetting('vozAtiva')}
            />
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-white font-medium">Nível de Segurança</p>
                <p className="text-sm text-gray-400">Define a sensibilidade dos sensores</p>
              </div>
              <select
                value={settings.nivelSeguranca}
                onChange={(e) => setSettings({...settings, nivelSeguranca: e.target.value})}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="baixo">Baixo</option>
                <option value="medio">Médio</option>
                <option value="alto">Alto</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-white font-medium">Máximo de Tentativas</p>
                <p className="text-sm text-gray-400">Bloqueia após X tentativas falhas</p>
              </div>
              <input
                type="number"
                value={settings.maxTentativas}
                onChange={(e) => setSettings({...settings, maxTentativas: parseInt(e.target.value)})}
                className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm text-center focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Conexão com Portaria */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Wifi className="w-5 h-5 text-green-400" />
              Conexão com Portaria
            </h2>
            <p className="text-sm text-gray-400 mt-1">Configure a comunicação com os dispositivos</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">IP da Portaria</label>
                <input
                  type="text"
                  value={settings.ipPortaria}
                  onChange={(e) => setSettings({...settings, ipPortaria: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Porta de Comunicação</label>
                <input
                  type="text"
                  value={settings.portaComunicacao}
                  onChange={(e) => setSettings({...settings, portaComunicacao: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Servidor Biométrico</label>
                <input
                  type="text"
                  value={settings.servidorBiometria}
                  onChange={(e) => setSettings({...settings, servidorBiometria: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Servidor de Voz</label>
                <input
                  type="text"
                  value={settings.servidorVoz}
                  onChange={(e) => setSettings({...settings, servidorVoz: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400">Conexão com todos os dispositivos está ativa</span>
            </div>
          </div>
        </div>

        {/* Notificações */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-400" />
              Notificações
            </h2>
            <p className="text-sm text-gray-400 mt-1">Configure alertas e notificações do sistema</p>
          </div>
          <div className="p-6 space-y-6">
            <ToggleRow
              label="Notificações por Email"
              description="Receba alertas de acesso por email"
              enabled={settings.notificacoesEmail}
              onToggle={() => toggleSetting('notificacoesEmail')}
            />
            <ToggleRow
              label="Notificações Push"
              description="Receba notificações em tempo real no navegador"
              enabled={settings.notificacoesPush}
              onToggle={() => toggleSetting('notificacoesPush')}
            />
            <ToggleRow
              label="Auto-bloqueio por Inatividade"
              description="Bloqueia o sistema após período de inatividade"
              enabled={settings.autoBloqueio}
              onToggle={() => toggleSetting('autoBloqueio')}
            />
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-white font-medium">Tempo de Bloqueio (minutos)</p>
                <p className="text-sm text-gray-400">Após inatividade do operador</p>
              </div>
              <input
                type="number"
                value={settings.tempoBloqueio}
                onChange={(e) => setSettings({...settings, tempoBloqueio: parseInt(e.target.value)})}
                className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm text-center focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Backup e Dados */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              Backup e Armazenamento
            </h2>
            <p className="text-sm text-gray-400 mt-1">Configure backup automático e retenção de dados</p>
          </div>
          <div className="p-6 space-y-6">
            <ToggleRow
              label="Backup Automático"
              description="Realiza backup dos dados periodicamente"
              enabled={settings.backupAutomatico}
              onToggle={() => toggleSetting('backupAutomatico')}
            />
            <ToggleRow
              label="Gravar Logs Detalhados"
              description="Armazena logs completos de todas as operações"
              enabled={settings.gravarLogs}
              onToggle={() => toggleSetting('gravarLogs')}
            />
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-white font-medium">Intervalo de Backup (horas)</p>
                <p className="text-sm text-gray-400">Frequência do backup automático</p>
              </div>
              <input
                type="number"
                value={settings.intervaloBackup}
                onChange={(e) => setSettings({...settings, intervaloBackup: parseInt(e.target.value)})}
                className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm text-center focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Armazenamento Utilizado</span>
                <span className="text-sm text-gray-400">2.4 GB / 10 GB</span>
              </div>
              <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                <div className="h-full w-[24%] bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Informações do Sistema */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Monitor className="w-5 h-5 text-cyan-400" />
              Informações do Sistema
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Versão do Sistema" value="SecureAccess v2.5.1" />
              <InfoRow label="Última Atualização" value="15/03/2024" />
              <InfoRow label="Licença" value="Enterprise (50 usuários)" />
              <InfoRow label="Suporte" value="suporte@secureaccess.com" />
              <InfoRow label="Servidor" value="Ubuntu 22.04 LTS" />
              <InfoRow label="Banco de Dados" value="PostgreSQL 15.2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ToggleRow({ label, description, enabled, onToggle }: {
  label: string
  description: string
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-white font-medium">{label}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <button onClick={onToggle} className="transition-colors">
        {enabled ? (
          <ToggleRight className="w-10 h-10 text-blue-400" />
        ) : (
          <ToggleLeft className="w-10 h-10 text-gray-500" />
        )}
      </button>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm text-white font-medium">{value}</span>
    </div>
  )
}
