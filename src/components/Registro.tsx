import { useState } from 'react'
import { UserPlus, Fingerprint, Mic, Camera, Check, X, Search, Edit2, Trash2 } from 'lucide-react'
import { Pessoa } from '../App'

interface RegistroProps {
  pessoas: Pessoa[]
  setPessoas: (pessoas: Pessoa[]) => void
  addNotificacao: (tipo: 'sucesso' | 'alerta' | 'erro' | 'info', titulo: string, mensagem: string) => void
}

export default function Registro({ pessoas, setPessoas, addNotificacao }: RegistroProps) {
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
    email: '',
    telefone: '',
  })

  const filteredPessoas = pessoas.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    p.cpf.includes(search) ||
    p.departamento.toLowerCase().includes(search.toLowerCase())
  )

  const handleBiometria = () => {
    setBiometriaStatus('scanning')
    setTimeout(() => {
      setBiometriaStatus('success')
      addNotificacao('sucesso', 'Biometria Registrada', 'Impressão digital capturada com sucesso')
    }, 2500)
  }

  const handleVoz = () => {
    setVozStatus('recording')
    setTimeout(() => {
      setVozStatus('success')
      addNotificacao('sucesso', 'Voz Registrada', 'Amostra de voz capturada com sucesso')
    }, 3000)
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
      status: 'ativo',
      email: formData.email,
      telefone: formData.telefone,
      cracha: `${formData.tipo.substring(0, 2).toUpperCase()}${String(pessoas.length + 1).padStart(3, '0')}`
    }
    setPessoas([...pessoas, novaPessoa])
    setShowForm(false)
    setFormData({ nome: '', cpf: '', cargo: '', departamento: '', tipo: 'funcionario', email: '', telefone: '' })
    setBiometriaStatus('idle')
    setVozStatus('idle')
    addNotificacao('sucesso', 'Cadastro Realizado', `${novaPessoa.nome} foi cadastrado(a) com sucesso`)
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cadastro?')) {
      setPessoas(pessoas.filter(p => p.id !== id))
      addNotificacao('alerta', 'Cadastro Excluído', 'Pessoa removida do sistema')
    }
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
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-3 rounded-lg font-medium transition-all shadow-lg shadow-blue-600/30"
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
          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
        />
      </div>

      {/* Lista de Pessoas */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/50 bg-gray-800/30">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Pessoa</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">CPF</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Cargo</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Departamento</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Tipo</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Biometria</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Voz</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredPessoas.map((pessoa) => (
              <tr key={pessoa.id} className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-sm font-bold">{pessoa.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white block">{pessoa.nome}</span>
                      <span className="text-xs text-gray-400">{pessoa.cracha}</span>
                    </div>
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
                    <span className="text-green-400 text-sm flex items-center gap-1"><Check className="w-4 h-4" /> Sim</span>
                  ) : (
                    <span className="text-red-400 text-sm flex items-center gap-1"><X className="w-4 h-4" /> Não</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  {pessoa.vozRegistrada ? (
                    <span className="text-green-400 text-sm flex items-center gap-1"><Check className="w-4 h-4" /> Sim</span>
                  ) : (
                    <span className="text-red-400 text-sm flex items-center gap-1"><X className="w-4 h-4" /> Não</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-blue-400 hover:bg-blue-900/30 rounded transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(pessoa.id)}
                      className="p-1.5 text-red-400 hover:bg-red-900/30 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Cadastro */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-800 z-10">
              <h2 className="text-xl font-bold text-white">Novo Cadastro</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white transition-colors">
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
                    <label className="block text-sm text-gray-400 mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Nome completo"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">CPF *</label>
                    <input
                      type="text"
                      value={formData.cpf}
                      onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="email@empresa.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Telefone</label>
                    <input
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Cargo *</label>
                    <input
                      type="text"
                      value={formData.cargo}
                      onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Cargo"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Departamento *</label>
                    <input
                      type="text"
                      value={formData.departamento}
                      onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Departamento"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Tipo *</label>
                    <select
                      value={formData.tipo}
                      onChange={(e) => setFormData({...formData, tipo: e.target.value as any})}
                      className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
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
                <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/50">
                  <div className="flex flex-col items-center">
                    {biometriaStatus === 'idle' && (
                      <>
                        <div className="w-24 h-24 bg-gray-600/50 rounded-full flex items-center justify-center mb-4">
                          <Fingerprint className="w-12 h-12 text-gray-400" />
                        </div>
                        <button
                          onClick={handleBiometria}
                          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium transition-all shadow-lg shadow-purple-600/30"
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
                          <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full animate-[loading_2.5s_ease-in-out]"></div>
                        </div>
                      </>
                    )}
                    {biometriaStatus === 'success' && (
                      <>
                        <div className="w-24 h-24 bg-green-900/50 rounded-full flex items-center justify-center mb-4 border-2 border-green-500">
                          <Check className="w-12 h-12 text-green-400" />
                        </div>
                        <p className="text-green-400 text-sm font-medium">Biometria registrada com sucesso!</p>
                        <button onClick={() => setBiometriaStatus('idle')} className="mt-2 text-xs text-gray-400 hover:text-white underline">
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
                <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/50">
                  <div className="flex flex-col items-center">
                    {vozStatus === 'idle' && (
                      <>
                        <div className="w-24 h-24 bg-gray-600/50 rounded-full flex items-center justify-center mb-4">
                          <Mic className="w-12 h-12 text-gray-400" />
                        </div>
                        <button
                          onClick={handleVoz}
                          className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all shadow-lg shadow-green-600/30"
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
                              className="w-1 bg-gradient-to-t from-green-500 to-green-400 rounded-full animate-pulse"
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
                        <button onClick={() => setVozStatus('idle')} className="mt-2 text-xs text-gray-400 hover:text-white underline">
                          Re-gravar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700 flex items-center justify-end gap-3 sticky bottom-0 bg-gray-800">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 text-gray-400 hover:text-white border border-gray-600 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-600/30"
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
