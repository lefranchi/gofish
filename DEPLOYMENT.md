# Guia de Deployment - GoFish

Este documento descreve como fazer o deployment da aplicação GoFish na Vercel.

## Pré-requisitos

1. Conta na Vercel (https://vercel.com)
2. GitHub conectado à Vercel
3. Variáveis de ambiente configuradas
4. Banco de dados PostgreSQL (recomendado: Vercel Postgres ou Railway)

## Configuração Inicial

### 1. Conectar Repositório GitHub à Vercel

1. Acesse https://vercel.com/new
2. Selecione "Import Git Repository"
3. Conecte seu repositório GitHub `lefranchi/gofish`
4. Vercel detectará automaticamente que é um projeto Next.js

### 2. Configurar Variáveis de Ambiente

Na dashboard da Vercel, vá para **Settings → Environment Variables** e adicione:

```
DATABASE_URL=postgresql://user:password@host:port/database
NEXT_PUBLIC_OPENWEATHER_API_KEY=sua_chave_aqui
NEXT_PUBLIC_STORMGLASS_API_KEY=sua_chave_aqui
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
```

### 3. Configurar Banco de Dados

#### Opção A: Vercel Postgres (Recomendado)

1. Na dashboard da Vercel, vá para **Storage**
2. Clique em **Create Database → Postgres**
3. Copie a string de conexão e adicione como `DATABASE_URL`

#### Opção B: Railway

1. Crie um projeto em https://railway.app
2. Adicione um banco de dados PostgreSQL
3. Copie a string de conexão e adicione como `DATABASE_URL`

### 4. Executar Migrações

Após o primeiro deployment, execute as migrações do Prisma:

```bash
# Localmente (com acesso ao banco de produção)
DATABASE_URL="sua_url_de_produção" npx prisma migrate deploy

# Ou via Vercel CLI
vercel env pull
npx prisma migrate deploy
```

## Deployment Manual

### Usando Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy para staging
vercel

# Deploy para produção
vercel --prod
```

## CI/CD Automático

O projeto está configurado com GitHub Actions para:

1. **Lint**: Executa ESLint e Prettier
2. **Build**: Compila o projeto Next.js
3. **Deploy**: Faz deploy automático na Vercel quando há push na branch `main`

### Configurar Secrets do GitHub

Adicione os seguintes secrets no repositório GitHub:

1. `VERCEL_TOKEN`: Token de acesso da Vercel
   - Obter em: https://vercel.com/account/tokens
2. `VERCEL_ORG_ID`: ID da organização Vercel
3. `VERCEL_PROJECT_ID`: ID do projeto Vercel

Para encontrar `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID`:

```bash
vercel project ls
vercel whoami
```

## Monitoramento

### Logs

Acesse os logs em **Deployments → Logs** na dashboard da Vercel.

### Analytics

A Vercel fornece automaticamente:
- Web Vitals
- Performance Metrics
- Error Tracking

Acesse em **Analytics** na dashboard.

## Troubleshooting

### Build falha com erro de Prisma

```bash
# Solução: Gerar cliente Prisma antes do build
npm run prisma:generate
```

### Erro de conexão com banco de dados

1. Verificar se `DATABASE_URL` está correta
2. Verificar se o banco de dados está acessível
3. Verificar se as migrações foram executadas

### Erro 500 em produção

1. Verificar logs na dashboard da Vercel
2. Verificar variáveis de ambiente
3. Verificar se as APIs externas estão acessíveis

## Rollback

Para reverter para uma versão anterior:

1. Na dashboard da Vercel, vá para **Deployments**
2. Encontre o deployment anterior
3. Clique em **Promote to Production**

## Atualizações

Para atualizar a aplicação:

1. Faça commit das mudanças
2. Push para a branch `main`
3. GitHub Actions executará automaticamente o CI/CD
4. Vercel fará deploy automático se tudo passar

## Contato e Suporte

Para dúvidas sobre deployment, consulte:
- Documentação Vercel: https://vercel.com/docs
- Documentação Next.js: https://nextjs.org/docs
- Documentação Prisma: https://www.prisma.io/docs
