import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Registro from './components/Registro'
import Reconhecimento from './components/Reconhecimento'
import Portaria from './components/Portaria'
import Logs from './components/Logs'
import Configuracoes from './components/Configuracoes'

export type Page = 'dashboard' | 'registro' | 'reconhecimento' | 'portaria' | 'logs' | 'configuracoes'

export interface Pessoa {
  id: string
  nome: string
  cpf: string
  cargo: string
  departamento: string
  tipo: 'funcionario' | 'visitante' | 'prestador'
  foto: string
  biometriaRegistrada: boolean
  vozRegistrada: boolean
  dataCadastro: string
  status: 'ativo' | 'inativo'
}

export interface LogAcesso {
  id: string
  pessoaId: string
  nome: string
  tipo: 'entrada' | 'saida'
  metodo: 'biometria' | 'voz' | 'portaria' | 'cartao'
  horario: string
  data: string
  autorizado: boolean
  porta: string
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [pessoas, setPessoas] = useState<Pessoa[]>([
    {
      id: '1',
      nome: 'Carlos Silva',
      cpf: '123.456.789-00',
      cargo: 'Gerente de TI',
      departamento: 'Tecnologia',
      tipo: 'funcionario',
      foto: '',
      biometriaRegistrada: true,
      vozRegistrada: true,
      dataCadastro: '2024-01-15',
      status: 'ativo'
    },
    {
      id: '2',
      nome: 'Ana Oliveira',
      cpf: '987.654.321-00',
      cargo: 'Analista de RH',
      departamento: 'Recursos Humanos',
      tipo: 'funcionario',
      foto: '',
      biometriaRegistrada: true,
      vozRegistrada: true,
      dataCadastro: '2024-02-20',
      status: 'ativo'
    },
    {
      id: '3',
      nome: 'Roberto Santos',
      cpf: '456.789.123-00',
      cargo: 'Diretor',
      departamento: 'Diretoria',
      tipo: 'funcionario',
      foto: '',
      biometriaRegistrada: true,
      vozRegistrada: false,
      dataCadastro: '2024-01-10',
      status: 'ativo'
    },
    {
      id: '4',
      nome: 'Maria Fernandes',
      cpf: '321.654.987-00',
      cargo: 'Visitante',
      departamento: 'Externo',
      tipo: 'visitante',
      foto: '',
      biometriaRegistrada: false,
      vozRegistrada: false,
      dataCadastro: '2024-03-01',
      status: 'ativo'
    },
    {
      id: '5',
      nome: 'João Pereira',
      cpf: '654.321.987-00',
      cargo: 'Técnico de Manutenção',
      departamento: 'Manutenção',
      tipo: 'prestador',
      foto: '',
      biometriaRegistrada: true,
      vozRegistrada: true,
      dataCadastro: '2024-02-01',
      status: 'ativo'
    }
  ])

  const [logs, setLogs] = useState<LogAcesso[]>([
    { id: '1', pessoaId: '1', nome: 'Carlos Silva', tipo: 'entrada', metodo: 'biometria', horario: '08:02', data: '2024-03-15', autorizado: true, porta: 'Entrada Principal' },
    { id: '2', pessoaId: '2', nome: 'Ana Oliveira', tipo: 'entrada', metodo: 'voz', horario: '08:15', data: '2024-03-15', autorizado: true, porta: 'Entrada Principal' },
    { id: '3', pessoaId: '3', nome: 'Roberto Santos', tipo: 'entrada', metodo: 'biometria', horario: '07:45', data: '2024-03-15', autorizado: true, porta: 'Entrada Executiva' },
    { id: '4', pessoaId: '4', nome: 'Maria Fernandes', tipo: 'entrada', metodo: 'portaria', horario: '09:30', data: '2024-03-15', autorizado: true, porta: 'Entrada Principal' },
    { id: '5', pessoaId: '1', nome: 'Carlos Silva', tipo: 'saida', metodo: 'biometria', horario: '17:30', data: '2024-03-15', autorizado: true, porta: 'Entrada Principal' },
    { id: '6', pessoaId: '5', nome: 'João Pereira', tipo: 'entrada', metodo: 'voz', horario: '10:00', data: '2024-03-15', autorizado: true, porta: 'Entrada de Serviço' },
    { id: '7', pessoaId: '2', nome: 'Ana Oliveira', tipo: 'saida', metodo: 'biometria', horario: '17:05', data: '2024-03-15', autorizado: true, porta: 'Entrada Principal' },
    { id: '8', pessoaId: '4', nome: 'Maria Fernandes', tipo: 'saida', metodo: 'portaria', horario: '11:45', data: '2024-03-15', autorizado: true, porta: 'Entrada Principal' },
  ])

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard pessoas={pessoas} logs={logs} />
      case 'registro':
        return <Registro pessoas={pessoas} setPessoas={setPessoas} />
      case 'reconhecimento':
        return <Reconhecimento pessoas={pessoas} logs={logs} setLogs={setLogs} />
      case 'portaria':
        return <Portaria pessoas={pessoas} logs={logs} setLogs={setLogs} />
      case 'logs':
        return <Logs logs={logs} />
      case 'configuracoes':
        return <Configuracoes />
      default:
        return <Dashboard pessoas={pessoas} logs={logs} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
