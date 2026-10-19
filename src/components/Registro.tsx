import { useState } from 'react'
import { UserPlus, Fingerprint, Mic, Camera, Check, X, Search } from 'lucide-react'
import { Pessoa } from '../App'

interface RegistroProps {
  pessoas: Pessoa[]
  setPessoas: (pessoas: Pessoa[]) => void
}

export default function Registro({ pessoas, setPessoas }: RegistroProps) {
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [biometriaStatus, setBiometriaStatus] = useState<'idle' | 'scanning' | 'success'>('idle')
  const [vozStatus, setVozStatus] = useState<'idle' | 'recording' | 'success'>('idle')
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    cargo: '',
    departamento: '',
    tipo: 'funcionario' as 'funcionario' | 'visitante' | 'prestador',
  })

  const filteredPessoas = pessoas.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    p.cpf.includes(search) ||
    p.departamento.toLowerCase().includes(search.toLowerCase())
  )

  const handleBiometria = () => {
    setBiometriaStatus('scanning')
    setTimeout(() => setBiometriaStatus('success'), 2500)
  }

  const handleVoz = () => {
    setVozStatus('recording')
    setTimeout(() => setVozStatus('success'), 3000)
  }

  const handleSubmit = () => {
    const novaPessoa: Pessoa = {
      id: Date.now().toString(),
      nome: formData.nome,
      cpf: formData.cpf,
      cargo: formData.cargo,
      departamento: formData.departamento,
      tipo: formData.tipo,
      foto: '',
      biometriaRegistrada: biometriaStatus === 'success',
      vozRegistrada: vozStatus === 'success',
      dataCadastro: new Date().toISOString().split('T')[0],
      status: 'ativo'
    }
    setPessoas([...pessoas, novaPessoa])
    setShowForm(false)
    setFormData({ nome: '', cpf: '', cargo: '', departamento: '', tipo: 'funcionario' })
    setBiometriaStatus('idle')
    setVozStatus('idle')
  }

  const resetBiometria = () => {
    setBiometriaStatus('idle')
  }

  const resetVoz = () => {
    setVozStatus('idle')
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Cadastro de Pessoas</h1>
          <p className="text-gray-400 mt-1">Registre funcionários, visitantes e prestadores de serviço</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/30"
        >
          <UserPlus className="w-5 h-5" />
          Novo Cadastro
        </button>
      </div>

      {/* Busca */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nome, CPF ou departamento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Lista de Pessoas */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-800/50">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Pessoa</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">CPF</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Cargo</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Departamento</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Tipo</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Biometria</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Voz</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPessoas.map((pessoa) => (
              <tr key={pessoa.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">{pessoa.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                    </div>
                    <span className="text-sm font-medium text-white">{pessoa.nome}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-300">{pessoa.cpf}</td>
                <td className="py-4 px-6 text-sm text-gray-300">{pessoa.cargo}</td>
                <td className="py-4 px-6 text-sm text-gray-300">{pessoa.departamento}</td>
                <td className="py-4 px-6">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    pessoa.tipo === 'funcionario' ? 'bg-blue-900/50 text-blue-400' :
                    pessoa.tipo === 'visitante' ? 'bg-yellow-900/50 text-yellow-400' :
                    'bg-purple-900/50 text-purple-400'
                  }`}>
                    {pessoa.tipo === 'funcionario' ? 'Funcionário' : pessoa.tipo === 'visitante' ? 'Visitante' : 'Prestador'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {pessoa.biometriaRegistrada ? (
                    <span className="text-green-400 text-sm flex items-center gap-1"><Check className="w-4 h-4" /> Registrada</span>
                  ) : (
                    <span className="text-red-400 text-sm flex items-center gap-1"><X className="w-4 h-4" /> Pendente</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  {pessoa.vozRegistrada ? (
                    <span className="text-green-400 text-sm flex items-center gap-1"><Check className="w-4 h-4" /> Registrada</span>
                  ) : (
                    <span className="text-red-400 text-sm flex items-center gap-1"><X className="w-4 h-4" /> Pendente</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    pessoa.status === 'ativo' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                  }`}>
                    {pessoa.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Cadastro */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Novo Cadastro</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Dados Pessoais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-400" />
                  Dados Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Nome completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">CPF</label>
                    <input
                      type="text"
                      value={formData.cpf}
                      onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Cargo</label>
                    <input
                      type="text"
                      value={formData.cargo}
                      onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Cargo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Departamento</label>
                    <input
                      type="text"
                      value={formData.departamento}
                      onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Departamento"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Tipo</label>
                    <select
                      value={formData.tipo}
                      onChange={(e) => setFormData({...formData, tipo: e.target.value as any})}
                      className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="funcionario">Funcionário</option>
                      <option value="visitante">Visitante</option>
                      <option value="prestador">Prestador de Serviço</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Biometria */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Fingerprint className="w-5 h-5 text-purple-400" />
                  Registro Biométrico
                </h3>
                <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                  <div className="flex flex-col items-center">
                    {biometriaStatus === 'idle' && (
                      <>
                        <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center mb-4">
                          <Fingerprint className="w-12 h-12 text-gray-400" />
                        </div>
                        <button
                          onClick={handleBiometria}
                          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Capturar Biometria
                        </button>
                      </>
                    )}
                    {biometriaStatus === 'scanning' && (
                      <>
                        <div className="w-24 h-24 bg-purple-900/50 rounded-full flex items-center justify-center mb-4 animate-pulse border-2 border-purple-500">
                          <Fingerprint className="w-12 h-12 text-purple-400 animate-pulse" />
                        </div>
                        <p className="text-purple-400 text-sm animate-pulse">Escaneando impressão digital...</p>
                        <div className="w-48 h-2 bg-gray-600 rounded-full mt-3 overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full animate-[loading_2.5s_ease-in-out]"></div>
                        </div>
                      </>
                    )}
                    {biometriaStatus === 'success' && (
                      <>
                        <div className="w-24 h-24 bg-green-900/50 rounded-full flex items-center justify-center mb-4 border-2 border-green-500">
                          <Check className="w-12 h-12 text-green-400" />
                        </div>
                        <p className="text-green-400 text-sm font-medium">Biometria registrada com sucesso!</p>
                        <button onClick={resetBiometria} className="mt-2 text-xs text-gray-400 hover:text-white underline">
                          Recapturar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Voz */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Mic className="w-5 h-5 text-green-400" />
                  Registro de Voz
                </h3>
                <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                  <div className="flex flex-col items-center">
                    {vozStatus === 'idle' && (
                      <>
                        <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center mb-4">
                          <Mic className="w-12 h-12 text-gray-400" />
                        </div>
                        <button
                          onClick={handleVoz}
                          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Gravar Amostra de Voz
                        </button>
                        <p className="text-xs text-gray-500 mt-2">Diga: "Meu nome é [nome completo]"</p>
                      </>
                    )}
                    {vozStatus === 'recording' && (
                      <>
                        <div className="w-24 h-24 bg-green-900/50 rounded-full flex items-center justify-center mb-4 animate-pulse border-2 border-green-500">
                          <Mic className="w-12 h-12 text-green-400 animate-pulse" />
                        </div>
                        <p className="text-green-400 text-sm animate-pulse">Gravando amostra de voz...</p>
                        <div className="flex items-center gap-1 mt-3">
                          {[...Array(12)].map((_, i) => (
                            <div
                              key={i}
                              className="w-1 bg-green-500 rounded-full animate-pulse"
                              style={{
                                height: `${Math.random() * 24 + 8}px`,
                                animationDelay: `${i * 0.1}s`
                              }}
                            ></div>
                          ))}
                        </div>
                      </>
                    )}
                    {vozStatus === 'success' && (
                      <>
                        <div className="w-24 h-24 bg-green-900/50 rounded-full flex items-center justify-center mb-4 border-2 border-green-500">
                          <Check className="w-12 h-12 text-green-400" />
                        </div>
                        <p className="text-green-400 text-sm font-medium">Voz registrada com sucesso!</p>
                        <button onClick={resetVoz} className="mt-2 text-xs text-gray-400 hover:text-white underline">
                          Re-gravar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Foto */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-orange-400" />
                  Foto
                </h3>
                <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center border-2 border-dashed border-gray-500">
                    <Camera className="w-10 h-10 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 text-gray-400 hover:text-white border border-gray-600 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/30"
              >
                Salvar Cadastro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
