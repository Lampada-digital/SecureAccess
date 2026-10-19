import { useState } from 'react'
import { Fingerprint, Mic, Shield, Check, X, AlertTriangle, Camera, Volume2 } from 'lucide-react'
import { Pessoa, LogAcesso } from '../App'

interface ReconhecimentoProps {
  pessoas: Pessoa[]
  logs: LogAcesso[]
  setLogs: (logs: LogAcesso[]) => void
}

type Status = 'idle' | 'scanning' | 'recognized' | 'denied'

export default function Reconhecimento({ pessoas, logs, setLogs }: ReconhecimentoProps) {
  const [biometriaStatus, setBiometriaStatus] = useState<Status>('idle')
  const [vozStatus, setVozStatus] = useState<Status>('idle')
  const [recognizedPerson, setRecognizedPerson] = useState<Pessoa | null>(null)
  const [accessGranted, setAccessGranted] = useState(false)

  const handleBiometriaScan = () => {
    setBiometriaStatus('scanning')
    setAccessGranted(false)
    setRecognizedPerson(null)

    setTimeout(() => {
      const pessoasComBiometria = pessoas.filter(p => p.biometriaRegistrada)
      if (pessoasComBiometria.length > 0) {
        const random = pessoasComBiometria[Math.floor(Math.random() * pessoasComBiometria.length)]
        setRecognizedPerson(random)
        setBiometriaStatus('recognized')
        setAccessGranted(true)

        const novoLog: LogAcesso = {
          id: Date.now().toString(),
          pessoaId: random.id,
          nome: random.nome,
          tipo: 'entrada',
          metodo: 'biometria',
          horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          data: new Date().toISOString().split('T')[0],
          autorizado: true,
          porta: 'Entrada Principal'
        }
        setLogs([novoLog, ...logs])
      } else {
        setBiometriaStatus('denied')
      }
    }, 3000)
  }

  const handleVozScan = () => {
    setVozStatus('scanning')
    setAccessGranted(false)
    setRecognizedPerson(null)

    setTimeout(() => {
      const pessoasComVoz = pessoas.filter(p => p.vozRegistrada)
      if (pessoasComVoz.length > 0) {
        const random = pessoasComVoz[Math.floor(Math.random() * pessoasComVoz.length)]
        setRecognizedPerson(random)
        setVozStatus('recognized')
        setAccessGranted(true)

        const novoLog: LogAcesso = {
          id: Date.now().toString(),
          pessoaId: random.id,
          nome: random.nome,
          tipo: 'entrada',
          metodo: 'voz',
          horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          data: new Date().toISOString().split('T')[0],
          autorizado: true,
          porta: 'Entrada Principal'
        }
        setLogs([novoLog, ...logs])
      } else {
        setVozStatus('denied')
      }
    }, 3500)
  }

  const resetAll = () => {
    setBiometriaStatus('idle')
    setVozStatus('idle')
    setRecognizedPerson(null)
    setAccessGranted(false)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Sistema de Reconhecimento</h1>
        <p className="text-gray-400 mt-1">Identificação biométrica e por voz para liberação de acesso</p>
      </div>

      {/* Status do Acesso */}
      {accessGranted && (
        <div className="mb-8 bg-green-900/30 border border-green-500/50 rounded-xl p-6 flex items-center gap-4 animate-pulse">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-400">ACESSO LIBERADO</h3>
            <p className="text-green-300">
              {recognizedPerson?.nome} identificado(a) com sucesso • Porta destrancada
            </p>
          </div>
          <div className="ml-auto">
            <div className="w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reconhecimento Biométrico */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-purple-900/30 to-transparent">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Fingerprint className="w-6 h-6 text-purple-400" />
              Reconhecimento Biométrico
            </h2>
            <p className="text-sm text-gray-400 mt-1">Escaneamento de impressão digital</p>
          </div>

          <div className="p-8 flex flex-col items-center">
            {biometriaStatus === 'idle' && (
              <>
                <div className="relative w-48 h-48 mb-6">
                  <div className="absolute inset-0 bg-purple-900/20 rounded-full border-2 border-purple-500/30"></div>
                  <div className="absolute inset-4 bg-purple-900/30 rounded-full border border-purple-500/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Fingerprint className="w-20 h-20 text-purple-400/60" />
                  </div>
                </div>
                <p className="text-gray-400 text-center mb-6">Posicione o dedo no leitor biométrico</p>
                <button
                  onClick={handleBiometriaScan}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50"
                >
                  Iniciar Escaneamento
                </button>
              </>
            )}

            {biometriaStatus === 'scanning' && (
              <>
                <div className="relative w-48 h-48 mb-6">
                  <div className="absolute inset-0 bg-purple-900/30 rounded-full border-2 border-purple-500 animate-pulse"></div>
                  <div className="absolute inset-4 bg-purple-900/40 rounded-full border border-purple-400 animate-pulse"></div>
                  <div className="absolute inset-8 bg-purple-800/50 rounded-full flex items-center justify-center">
                    <Fingerprint className="w-16 h-16 text-purple-300 animate-pulse" />
                  </div>
                  {/* Scanning animation */}
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
                  </div>
                </div>
                <p className="text-purple-400 text-center animate-pulse font-medium">Escaneando impressão digital...</p>
                <p className="text-gray-500 text-sm mt-2">Aguarde, não remova o dedo</p>
              </>
            )}

            {biometriaStatus === 'recognized' && (
              <>
                <div className="relative w-48 h-48 mb-6">
                  <div className="absolute inset-0 bg-green-900/30 rounded-full border-2 border-green-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-20 h-20 text-green-400" />
                  </div>
                </div>
                <p className="text-green-400 text-center font-bold text-lg">Identificado!</p>
                {recognizedPerson && (
                  <div className="mt-4 bg-gray-700/50 rounded-xl p-4 w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">{recognizedPerson.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{recognizedPerson.nome}</p>
                        <p className="text-sm text-gray-400">{recognizedPerson.cargo} • {recognizedPerson.departamento}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-green-400">Confiança: 98.7%</span>
                    </div>
                  </div>
                )}
                <button onClick={resetAll} className="mt-4 text-sm text-gray-400 hover:text-white underline">
                  Nova verificação
                </button>
              </>
            )}

            {biometriaStatus === 'denied' && (
              <>
                <div className="relative w-48 h-48 mb-6">
                  <div className="absolute inset-0 bg-red-900/30 rounded-full border-2 border-red-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <X className="w-20 h-20 text-red-400" />
                  </div>
                </div>
                <p className="text-red-400 text-center font-bold text-lg">Não Reconhecido</p>
                <p className="text-gray-400 text-center text-sm mt-2">Biometria não encontrada no sistema</p>
                <button onClick={resetAll} className="mt-4 text-sm text-gray-400 hover:text-white underline">
                  Tentar novamente
                </button>
              </>
            )}
          </div>
        </div>

        {/* Reconhecimento de Voz */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-green-900/30 to-transparent">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Volume2 className="w-6 h-6 text-green-400" />
              Reconhecimento de Voz
            </h2>
            <p className="text-sm text-gray-400 mt-1">Identificação por padrão vocal</p>
          </div>

          <div className="p-8 flex flex-col items-center">
            {vozStatus === 'idle' && (
              <>
                <div className="relative w-48 h-48 mb-6">
                  <div className="absolute inset-0 bg-green-900/20 rounded-full border-2 border-green-500/30"></div>
                  <div className="absolute inset-4 bg-green-900/30 rounded-full border border-green-500/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Mic className="w-20 h-20 text-green-400/60" />
                  </div>
                </div>
                <p className="text-gray-400 text-center mb-2">Fale sua frase de identificação</p>
                <p className="text-gray-500 text-sm text-center mb-6 italic">"Olá, meu nome é [seu nome]"</p>
                <button
                  onClick={handleVozScan}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-green-600/30 hover:shadow-green-600/50"
                >
                  Iniciar Reconhecimento
                </button>
              </>
            )}

            {vozStatus === 'scanning' && (
              <>
                <div className="relative w-48 h-48 mb-6">
                  <div className="absolute inset-0 bg-green-900/30 rounded-full border-2 border-green-500 animate-pulse"></div>
                  <div className="absolute inset-4 bg-green-900/40 rounded-full border border-green-400 animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Mic className="w-16 h-16 text-green-300 animate-pulse" />
                  </div>
                </div>
                <p className="text-green-400 text-center animate-pulse font-medium">Analisando padrão de voz...</p>
                <div className="flex items-center gap-1 mt-4">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-green-500 rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 32 + 8}px`,
                        animationDelay: `${i * 0.05}s`,
                        animationDuration: `${0.5 + Math.random() * 0.5}s`
                      }}
                    ></div>
                  ))}
                </div>
                <p className="text-gray-500 text-sm mt-4">Comparando com amostras cadastradas...</p>
              </>
            )}

            {vozStatus === 'recognized' && (
              <>
                <div className="relative w-48 h-48 mb-6">
                  <div className="absolute inset-0 bg-green-900/30 rounded-full border-2 border-green-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-20 h-20 text-green-400" />
                  </div>
                </div>
                <p className="text-green-400 text-center font-bold text-lg">Voz Identificada!</p>
                {recognizedPerson && (
                  <div className="mt-4 bg-gray-700/50 rounded-xl p-4 w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">{recognizedPerson.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{recognizedPerson.nome}</p>
                        <p className="text-sm text-gray-400">{recognizedPerson.cargo} • {recognizedPerson.departamento}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-green-400">Confiança: 96.2%</span>
                    </div>
                  </div>
                )}
                <button onClick={resetAll} className="mt-4 text-sm text-gray-400 hover:text-white underline">
                  Nova verificação
                </button>
              </>
            )}

            {vozStatus === 'denied' && (
              <>
                <div className="relative w-48 h-48 mb-6">
                  <div className="absolute inset-0 bg-red-900/30 rounded-full border-2 border-red-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AlertTriangle className="w-20 h-20 text-red-400" />
                  </div>
                </div>
                <p className="text-red-400 text-center font-bold text-lg">Voz Não Reconhecida</p>
                <p className="text-gray-400 text-center text-sm mt-2">Padrão vocal não encontrado no sistema</p>
                <button onClick={resetAll} className="mt-4 text-sm text-gray-400 hover:text-white underline">
                  Tentar novamente
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Câmeras de Monitoramento */}
      <div className="mt-8 bg-gray-800 rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-400" />
          Monitoramento em Tempo Real
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Entrada Principal', 'Entrada Executiva', 'Entrada de Serviço'].map((porta, i) => (
            <div key={i} className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
              <div className="aspect-video bg-gray-900 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-transparent"></div>
                <div className="text-center z-10">
                  <Camera className="w-8 h-8 text-gray-600 mx-auto mb-1" />
                  <span className="text-xs text-gray-500">Câmera {i + 1}</span>
                </div>
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-400">REC</span>
                </div>
                <div className="absolute bottom-2 right-2">
                  <span className="text-xs text-gray-500">{new Date().toLocaleTimeString('pt-BR')}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{porta}</span>
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  Online
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
