import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Registro from './components/Registro'
import Reconhecimento from './components/Reconhecimento'
import Portaria from './components/Portaria'
import Logs from './components/Logs'
import Configuracoes from './components/Configuracoes'
import Relatorios from './components/Relatorios'

export type Page = 'dashboard' | 'registro' | 'reconhecimento' | 'portaria' | 'logs' | 'configuracoes' | 'relatorios'

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
  email?: string
  telefone?: string
  cracha?: string
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
  temperatura?: number
  observacao?: string
}

export interface Notificacao {
  id: string
  tipo: 'sucesso' | 'alerta' | 'erro' | 'info'
  titulo: string
  mensagem: string
  timestamp: string
  lida: boolean
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([
    {
      id: '1',
      tipo: 'sucesso',
      titulo: 'Acesso Liberado',
      mensagem: 'Carlos Silva entrou pela Entrada Principal',
      timestamp: '08:02',
      lida: false
    },
    {
      id: '2',
      tipo: 'alerta',
      titulo: 'Tentativa Não Autorizada',
      mensagem: 'Biometria não reconhecida na Entrada de Serviço',
      timestamp: '07:45',
      lida: false
    },
  ])

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
      status: 'ativo',
      email: 'carlos.silva@empresa.com',
      telefone: '(11) 98765-4321',
      cracha: 'CR001'
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
      status: 'ativo',
      email: 'ana.oliveira@empresa.com',
      telefone: '(11) 91234-5678',
      cracha: 'CR002'
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
      status: 'ativo',
      email: 'roberto.santos@empresa.com',
      telefone: '(11) 99876-5432',
      cracha: 'CR003'
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
      status: 'ativo',
      email: 'maria@email.com',
      telefone: '(11) 98888-7777',
      cracha: 'VT001'
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
      status: 'ativo',
      email: 'joao.pereira@manutencao.com',
      telefone: '(11) 97777-6666',
      cracha: 'PS001'
    },
    {
      id: '6',
      nome: 'Fernanda Costa',
      cpf: '789.123.456-00',
      cargo: 'Analista Financeiro',
      departamento: 'Financeiro',
      tipo: 'funcionario',
      foto: '',
      biometriaRegistrada: true,
      vozRegistrada: true,
      dataCadastro: '2024-01-20',
      status: 'ativo',
      email: 'fernanda.costa@empresa.com',
      telefone: '(11) 96666-5555',
      cracha: 'CR004'
    },
    {
      id: '7',
      nome: 'Paulo Mendes',
      cpf: '147.258.369-00',
      cargo: 'Desenvolvedor',
      departamento: 'Tecnologia',
      tipo: 'funcionario',
      foto: '',
      biometriaRegistrada: true,
      vozRegistrada: false,
      dataCadastro: '2024-02-10',
      status: 'ativo',
      email: 'paulo.mendes@empresa.com',
      telefone: '(11) 95555-4444',
      cracha: 'CR005'
    },
    {
      id: '8',
      nome: 'Lucia Almeida',
      cpf: '258.369.147-00',
      cargo: 'Gerente Comercial',
      departamento: 'Comercial',
      tipo: 'funcionario',
      foto: '',
      biometriaRegistrada: true,
      vozRegistrada: true,
      dataCadastro: '2024-01-25',
      status: 'ativo',
      email: 'lucia.almeida@empresa.com',
      telefone: '(11) 94444-3333',
      cracha: 'CR006'
    }
  ])

  const [logs, setLogs] = useState<LogAcesso[]>([
    { id: '1', pessoaId: '1', nome: 'Carlos Silva', tipo: 'entrada', metodo: 'biometria', horario: '08:02', data: '2024-03-15', autorizado: true, porta: 'Entrada Principal', temperatura: 36.5 },
    { id: '2', pessoaId: '2', nome: 'Ana Oliveira', tipo: 'entrada', metodo: 'voz', horario: '08:15', data: '2024-03-15', autorizado: true, porta: 'Entrada Principal', temperatura: 36.3 },
    { id: '3', pessoaId: '3', nome: 'Roberto Santos', tipo: 'entrada', metodo: 'biometria', horario: '07:45', data: '2024-03-15', autorizado: true, porta: 'Entrada Executiva', temperatura: 36.7 },
    { id: '4', pessoaId: '4', nome: 'Maria Fernandes', tipo: 'entrada', metodo: 'portaria', horario: '09:30', data: '2024-03-15', autorizado: true, porta: 'Entrada Principal', temperatura: 36.4, observacao: 'Visitante autorizado por Ana Oliveira' },
    { id: '5', pessoaId: '1', nome: 'Carlos Silva', tipo: 'saida', metodo: 'biometria', horario: '17:30', data: '2024-03-15', autorizado: true, porta: 'Entrada Principal', temperatura: 36.6 },
    { id: '6', pessoaId: '5', nome: 'João Pereira', tipo: 'entrada', metodo: 'voz', horario: '10:00', data: '2024-03-15', autorizado: true, porta: 'Entrada de Serviço', temperatura: 36.8 },
    { id: '7', pessoaId: '2', nome: 'Ana Oliveira', tipo: 'saida', metodo: 'biometria', horario: '17:05', data: '2024-03-15', autorizado: true, porta: 'Entrada Principal', temperatura: 36.4 },
    { id: '8', pessoaId: '4', nome: 'Maria Fernandes', tipo: 'saida', metodo: 'portaria', horario: '11:45', data: '2024-03-15', autorizado: true, porta: 'Entrada Principal', temperatura: 36.5 },
    { id: '9', pessoaId: '6', nome: 'Fernanda Costa', tipo: 'entrada', metodo: 'biometria', horario: '08:30', data: '2024-03-15', autorizado: true, porta: 'Entrada Principal', temperatura: 36.2 },
    { id: '10', pessoaId: '7', nome: 'Paulo Mendes', tipo: 'entrada', metodo: 'biometria', horario: '09:15', data: '2024-03-15', autorizado: true, porta: 'Entrada Principal', temperatura: 36.9 },
    { id: '11', pessoaId: '8', nome: 'Lucia Almeida', tipo: 'entrada', metodo: 'voz', horario: '08:45', data: '2024-03-15', autorizado: true, porta: 'Entrada Principal', temperatura: 36.3 },
    { id: '12', pessoaId: '6', nome: 'Fernanda Costa', tipo: 'saida', metodo: 'biometria', horario: '17:45', data: '2024-03-15', autorizado: true, porta: 'Entrada Principal', temperatura: 36.5 },
  ])

  const addNotificacao = (tipo: Notificacao['tipo'], titulo: string, mensagem: string) => {
    const novaNotificacao: Notificacao = {
      id: Date.now().toString(),
      tipo,
      titulo,
      mensagem,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      lida: false
    }
    setNotificacoes([novaNotificacao, ...notificacoes])
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard pessoas={pessoas} logs={logs} notificacoes={notificacoes} />
      case 'registro':
        return <Registro pessoas={pessoas} setPessoas={setPessoas} addNotificacao={addNotificacao} />
      case 'reconhecimento':
        return <Reconhecimento pessoas={pessoas} logs={logs} setLogs={setLogs} addNotificacao={addNotificacao} />
      case 'portaria':
        return <Portaria pessoas={pessoas} logs={logs} setLogs={setLogs} addNotificacao={addNotificacao} />
      case 'logs':
        return <Logs logs={logs} />
      case 'configuracoes':
        return <Configuracoes />
      case 'relatorios':
        return <Relatorios logs={logs} pessoas={pessoas} />
      default:
        return <Dashboard pessoas={pessoas} logs={logs} notificacoes={notificacoes} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        notificacoes={notificacoes}
        setNotificacoes={setNotificacoes}
      />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
