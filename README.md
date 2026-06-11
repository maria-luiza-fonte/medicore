# 🏥 MediCore

Um sistema completo de gestão médica desenvolvido com tecnologias modernas, oferecendo agendamentos, gestão de pacientes, registros médicos e um assistente de IA integrado.

## 📋 Descrição do Projeto

O MediCore é um **projeto de curso técnico** que desenvolve uma plataforma completa de saúde digital. O objetivo é aplicar conceitos de desenvolvimento web full-stack, integração de APIs, autenticação e banco de dados em um projeto real.

A plataforma centraliza gerenciamento de:
- **Pacientes**: Cadastro, histórico e documentos
- **Agendamentos**: Agendamento e controle de consultas
- **Registros Médicos**: Documentação e histórico clínico
- **Fila de Urgência**: Triagem e priorização de atendimentos
- **Assistente de IA**: Suporte inteligente e recomendações
- **Chat de Suporte**: Atendimento em tempo real
- **Dashboard Admin**: Gerenciamento centralizado

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React** - Biblioteca UI com Hooks e Context API
- **Vite** - Build tool ultrarrápido
- **CSS3** - Estilos responsivos

### Backend
- **Supabase** - Banco de dados e autenticação
- **Groq** - IA para assistente inteligente

### Ferramentas
- **npm** - Gerenciador de pacotes
- **Git** - Controle de versão

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js (v16 ou superior)
- npm ou yarn
- Variáveis de ambiente configuradas (.env)

### Instalação e Execução

#### 1. Clonar o repositório
```bash
git clone [LINK-DO-FRONTEND]
cd medicore
```

#### 2. Instalar dependências do Frontend
```bash
npm install
```

#### 3. Configurar variáveis de ambiente

Criar arquivo `.env` na raiz do projeto:
```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_supabase
VITE_GROQ_API_KEY=sua_chave_groq
```

#### 4. Executar o Frontend (Vite)
```bash
npm run dev
```
O aplicativo estará disponível em `http://localhost:5173`

#### 5. Acessar a aplicação

Abrir navegador em `http://localhost:5173` e fazer login/registro.

> **Nota:** O backend é gerenciado pelo Supabase, não há servidor separado para rodar localmente.

## 📦 Build para Produção

### Frontend (Vercel)

```bash
npm run build
```

Isso gera uma pasta `dist/` otimizada. 

**Deploy no Vercel:**
1. Conectar repositório GitHub ao Vercel
2. Configurar variáveis de ambiente no dashboard Vercel
3. Vercel faz deploy automático a cada push em `main`

### Backend (Supabase)

O backend é gerenciado pelo Supabase. Não há infraestrutura separada para deploy.

## ✨ Funcionalidades Implementadas

### Autenticação
- ✅ Registro de novos usuários
- ✅ Login com email/senha
- ✅ Integração com Supabase Auth
- ✅ Proteção de rotas

### Dashboard
- ✅ Visão geral do sistema
- ✅ Acesso rápido às principais funcionalidades
- ✅ Indicadores e estatísticas

### Gestão de Pacientes
- ✅ CRUD completo de pacientes
- ✅ Perfil detalhado com histórico
- ✅ Upload de documentos
- ✅ Histórico de consultas

### Agendamentos
- ✅ Agendamento de consultas
- ✅ Visualização de agenda
- ✅ Cancelamento e reagendamento

### Registros Médicos
- ✅ Documentação de consultas
- ✅ Prescrições
- ✅ Histórico clínico

### Fila de Urgência
- ✅ Sistema de triagem
- ✅ Priorização automática
- ✅ Visualização em tempo real

### Assistente de IA
- ✅ Chat com IA integrada
- ✅ Recomendações inteligentes
- ✅ Análise de sintomas

### Chat de Suporte
- ✅ Atendimento em tempo real
- ✅ Histórico de conversas
- ✅ Notificações

### Painel Administrativo
- ✅ Gerenciamento de usuários
- ✅ Relatórios e estatísticas
- ✅ Configurações do sistema

## �🔗 Links Importantes

| Recurso | Link |
|---------|------|
| **GitHub** | [https://github.com/maria-luiza-fonte/medicore] |
| **Site Hospedado (Vercel)** | [https://medicore-delta-three.vercel.app/] |
| **Supabase** | [https://kxiivljlnajkrrizewbm.supabase.co] |
