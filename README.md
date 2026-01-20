# GoFish - Previsão de Pesca

Uma aplicação web moderna para análise de condições meteorológicas e recomendações de pesca em tempo real.

## 🎯 Funcionalidades

- **Cadastro de Pesqueiros**: Salve seus locais de pesca favoritos com coordenadas
- **Análise Meteorológica**: Consulte dados de pressão, temperatura, vento e umidade
- **Dados Solunares**: Fases da lua e períodos de maior atividade
- **Previsão de Marés**: Para pesca em água salgada
- **Score de Pesca**: Algoritmo que calcula a qualidade do dia para pesca
- **Histórico de Buscas**: Cache de dados para economizar chamadas à API
- **Interface Mobile-First**: Otimizada para dispositivos móveis

## 🛠️ Tecnologias

- **Frontend**: Next.js 15 + React 18 + TypeScript
- **Styling**: Tailwind CSS + Material UI
- **Backend**: Next.js API Routes
- **Database**: SQLite (desenvolvimento) / PostgreSQL (produção)
- **ORM**: Prisma
- **APIs Externas**: OpenWeatherMap, Stormglass
- **Deploy**: Vercel
- **CI/CD**: GitHub Actions

## 📋 Pré-requisitos

- Node.js 18+
- pnpm (recomendado) ou npm
- Git

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/lefranchi/gofish.git
cd gofish
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Preencha as chaves de API no arquivo `.env.local`:
```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=sua_chave_aqui
NEXT_PUBLIC_STORMGLASS_API_KEY=sua_chave_aqui
DATABASE_URL="file:./prisma/dev.db"
```

5. Configure o banco de dados:
```bash
pnpm exec prisma generate
pnpm exec prisma migrate dev --name init
```

6. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`.

## 📁 Estrutura do Projeto

```
gofish/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Componentes React reutilizáveis
│   ├── lib/             # Funções utilitárias e configurações
│   ├── types/           # Definições de tipos TypeScript
│   └── styles/          # Estilos globais
├── prisma/
│   └── schema.prisma    # Schema do banco de dados
├── public/              # Arquivos estáticos
├── .github/workflows/   # GitHub Actions CI/CD
├── .env.example         # Variáveis de ambiente de exemplo
├── next.config.js       # Configuração do Next.js
├── tailwind.config.ts   # Configuração do Tailwind CSS
├── tsconfig.json        # Configuração do TypeScript
└── package.json         # Dependências do projeto
```

## 🔑 Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|------------|
| `DATABASE_URL` | URL de conexão com o banco de dados | Sim |
| `NEXT_PUBLIC_OPENWEATHER_API_KEY` | Chave da API OpenWeatherMap | Não |
| `NEXT_PUBLIC_STORMGLASS_API_KEY` | Chave da API Stormglass | Não |
| `NEXT_PUBLIC_APP_URL` | URL da aplicação | Não |
| `NODE_ENV` | Ambiente (development/production) | Não |

## 📚 APIs Utilizadas

### OpenWeatherMap
- **Plano Gratuito**: 1.000 chamadas/dia
- **Dados**: Temperatura, pressão, vento, umidade, cobertura de nuvens
- **Documentação**: https://openweathermap.org/api

### Stormglass
- **Plano Gratuito**: 50 chamadas/dia
- **Dados**: Marés, ondas, vento, temperatura da água
- **Documentação**: https://stormglass.io/

## 🧪 Testes

```bash
# Executar linter
pnpm lint

# Formatar código
pnpm format
```

## 📦 Build e Deploy

### Build Local
```bash
pnpm build
pnpm start
```

### Deploy na Vercel
```bash
# Instale o Vercel CLI
npm i -g vercel

# Faça deploy
vercel
```

## 🔄 CI/CD

O projeto utiliza GitHub Actions para:
- Executar linter e testes em cada push
- Build automático
- Deploy automático na Vercel

Veja `.github/workflows/` para mais detalhes.

## 📝 Licença

Este projeto está sob a licença MIT.

## 👥 Contribuições

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, abra uma issue no repositório GitHub.
