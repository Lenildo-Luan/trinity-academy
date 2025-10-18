# Setup - Perfil de Usuário

Este documento descreve como configurar o sistema de perfil de usuário no Supabase.

## 1. Executar o Schema SQL de Perfil

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **SQL Editor** no menu lateral
3. Clique em **New Query**
4. Copie e cole todo o conteúdo do arquivo `supabase-profile-schema.sql`
5. Clique em **Run** para executar

O script irá criar:
- Tabela `user_profiles`
- Índices para performance
- Triggers para auto-update de `updated_at`
- Políticas de Row Level Security (RLS)
- Storage policies para o bucket de fotos
- Trigger automático para criar perfil quando novo usuário se registra

## 2. Criar Bucket de Storage

1. No Supabase Dashboard, vá em **Storage** no menu lateral
2. Clique em **Create a new bucket**
3. Configure o bucket:
   - **Name**: `profile-photos`
   - **Public bucket**: ✅ Marcar como público
   - **File size limit**: 2 MB
   - **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`
4. Clique em **Save**

As políticas de storage já foram criadas pelo script SQL e permitirão:
- ✅ Usuários podem fazer upload de suas próprias fotos
- ✅ Qualquer pessoa pode visualizar fotos (bucket público)
- ✅ Usuários podem atualizar/deletar apenas suas próprias fotos

## 3. Executar o Schema SQL de Estatísticas

1. No Supabase Dashboard, vá em **SQL Editor** novamente
2. Clique em **New Query**
3. Copie e cole todo o conteúdo do arquivo `supabase-stats-functions.sql`
4. Clique em **Run** para executar

O script irá criar:
- Função `get_user_streak()` - Calcula dias consecutivos de estudo
- Função `get_total_study_time()` - Soma tempo total de estudo
- Função `get_user_statistics()` - Retorna todas as estatísticas de uma vez
- Grants para usuários autenticados executarem as funções

**Importante:** Execute este script APÓS o `supabase-quiz-schema.md`, pois ele depende das tabelas de quiz.

### Erro de "recursive query column has type date"?

Se você recebeu este erro ao acessar `/perfil`:
```
recursive query "date_series" column 1 has type date in non-recursive term
but type timestamp without time zone overall
```

**Solução:** Execute o arquivo `supabase-stats-functions-fix.sql` no SQL Editor.

Isso atualiza a função `get_user_streak()` para corrigir incompatibilidade de tipos.

## 4. Verificar Instalação

Execute estas queries para verificar se tudo foi criado corretamente:

```sql
-- Verificar se a tabela foi criada
SELECT * FROM user_profiles LIMIT 1;

-- Verificar se as políticas RLS foram criadas
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';

-- Verificar se o bucket foi criado
SELECT * FROM storage.buckets WHERE id = 'profile-photos';

-- Verificar políticas do storage
SELECT * FROM storage.policies WHERE bucket_id = 'profile-photos';

-- Verificar se as funções de estatísticas foram criadas
SELECT proname FROM pg_proc WHERE proname LIKE 'get_user_%';
-- Deve retornar: get_user_streak, get_total_study_time, get_user_statistics
```

## 5. Testar Funcionalidade

1. Acesse a aplicação em modo desenvolvimento:
   ```bash
   npm run dev
   ```

2. Faça login com um usuário

3. Navegue para `/perfil`

4. Teste as funcionalidades:
   - ✅ Visualizar perfil (deve criar automaticamente se não existir)
   - ✅ Editar nome completo
   - ✅ Fazer upload de foto (JPG, PNG ou WebP até 2MB)
   - ✅ Remover foto
   - ✅ Ver estatísticas (progresso, nota média, tempo de estudo, streak)

## 6. Estrutura de Arquivos Criados

```
src/
├── app/
│   └── (centered)/
│       └── perfil/
│           └── page.tsx              # Página de perfil com estatísticas
├── components/
│   ├── profile-header.tsx            # Seção de header do perfil
│   ├── profile-photo-upload.tsx      # Upload de foto
│   └── profile-stats-cards.tsx       # Cards de estatísticas
├── hooks/
│   ├── use-user-profile.ts           # Hook de gerenciamento de perfil
│   └── use-user-stats.ts             # Hook de estatísticas
├── lib/
│   ├── profile-service.ts            # Serviços de perfil
│   └── stats-service.ts              # Serviços de estatísticas
└── types/
    └── database.ts                   # Tipos TypeScript (atualizado)

Arquivos SQL:
├── supabase-profile-schema.sql       # Schema de perfil e storage
└── supabase-stats-functions.sql      # Funções de estatísticas
```

## 7. Próximas Fases

Conforme o `PROFILE_PAGE_PLAN.md`, as próximas implementações serão:

### ~~Fase 2: Estatísticas Principais~~ ✅ IMPLEMENTADO
- ✅ Cards de estatísticas (5 cards)
- ✅ Progresso geral
- ✅ Lições completadas
- ✅ Nota média
- ✅ Tempo total de estudo
- ✅ Streak de dias consecutivos

### Fase 2.2: Estatísticas Avançadas (Próximo)
- Progresso por módulo
- Feed de atividade recente

### Fase 3: Sistema de Conquistas
- Tabelas de conquistas
- Lógica de desbloqueio automático
- Notificações de conquistas

### Fase 4: Melhorias e Polimento
- Gráficos de progresso
- Animações
- Testes de acessibilidade
- SEO

## Problemas Comuns

### "Usuário não autenticado"
- Certifique-se de estar logado na aplicação
- Verifique se as variáveis de ambiente do Supabase estão corretas

### "Erro ao fazer upload da foto"
- Verifique se o bucket `profile-photos` foi criado
- Confirme que o bucket está marcado como público
- Verifique se as storage policies foram criadas corretamente

### "Perfil não encontrado"
- O perfil é criado automaticamente no primeiro acesso
- Se o erro persistir, verifique se o trigger `on_auth_user_created` foi criado

### Foto não aparece após upload
- Verifique se o bucket é público
- Confirme que a URL está sendo salva corretamente em `user_profiles.photo_url`
- Tente fazer hard refresh (Ctrl+Shift+R) no navegador

## Comandos Úteis

```bash
# Rodar em desenvolvimento
npm run dev

# Verificar erros de TypeScript
npx tsc --noEmit

# Limpar cache do Next.js
rm -rf .next
npm run dev
```
