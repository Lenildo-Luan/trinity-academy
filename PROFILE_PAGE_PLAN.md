# Plano de Implementação - Página de Perfil

## Visão Geral

Implementar uma página de perfil completa onde o usuário pode visualizar e editar sua foto de perfil, além de acompanhar estatísticas detalhadas sobre seu progresso no curso "Introdução a Programação".

## 1. Estrutura da Página

### 1.1 Localização e Roteamento
- **Rota**: `/perfil` ou `/profile`
- **Layout**: Usar layout `(centered)` similar às páginas de recursos e entrevistas
- **Autenticação**: Página protegida - requer login
- **Arquivo**: `src/app/(centered)/perfil/page.tsx`

### 1.2 Seções da Página

```
┌─────────────────────────────────────────┐
│         HEADER / PERFIL                 │
│  ┌────────┐                             │
│  │ FOTO   │  Nome do Usuário            │
│  │ PERFIL │  Email                      │
│  └────────┘  [Editar Perfil]            │
├─────────────────────────────────────────┤
│      ESTATÍSTICAS PRINCIPAIS            │
│  ┌──────┐  ┌──────┐  ┌──────┐          │
│  │ 85%  │  │ 12/14│  │  8.5 │          │
│  │Progr.│  │Aulas │  │ Nota │          │
│  └──────┘  └──────┘  └──────┘          │
├─────────────────────────────────────────┤
│      PROGRESSO POR MÓDULO               │
│  ● Fundamentos          [████░] 75%    │
│  ● Fluxo de execução    [███░░] 60%    │
│  ● Estruturas de dados  [██░░░] 40%    │
├─────────────────────────────────────────┤
│      ATIVIDADE RECENTE                  │
│  🏆 Quiz aprovado - Aula 12  (há 2h)   │
│  📝 Quiz iniciado - Aula 11  (ontem)   │
├─────────────────────────────────────────┤
│      CONQUISTAS / BADGES                │
│  🎯 Primeira aprovação                  │
│  🔥 3 dias consecutivos                 │
│  ⭐ Nota 10 em um quiz                 │
└─────────────────────────────────────────┘
```

## 2. Funcionalidades Detalhadas

### 2.1 Foto de Perfil

#### 2.1.1 Upload de Foto
- **Componente**: `ProfilePhotoUpload`
- **Localização**: `src/components/profile-photo-upload.tsx`
- **Tecnologia**: Supabase Storage
- **Bucket**: `profile-photos` (público)

**Funcionalidades**:
- Upload de imagem (JPG, PNG, WebP)
- Limite de tamanho: 2MB
- Redimensionamento automático: 400x400px
- Crop circular via modal/preview
- Fallback: Avatar com iniciais do nome

**Fluxo**:
1. Usuário clica na foto ou botão "Alterar foto"
2. Abre input de arquivo
3. Preview da imagem com crop circular
4. Confirma upload
5. Imagem é enviada para Supabase Storage
6. URL da imagem é salva no perfil do usuário

#### 2.1.2 Schema do Banco de Dados
Adicionar tabela `user_profiles`:

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### 2.2 Estatísticas Principais (Cards de Destaque)

#### Card 1: Progresso Geral
- **Métrica**: Percentual de conclusão do curso
- **Cálculo**: `(lições_completadas / total_lições) × 100`
- **Fonte**: View `completed_lessons` + contagem total de lições
- **Visual**: Círculo de progresso com percentual no centro
- **Cor**: Verde se >= 70%, amarelo se >= 40%, cinza se < 40%

#### Card 2: Lições Completadas
- **Métrica**: "X de Y lições"
- **Fonte**: View `completed_lessons`
- **Visual**: Número grande com fração
- **Info adicional**: Hover mostra próxima lição

#### Card 3: Nota Média
- **Métrica**: Média geral dos quizzes
- **Fonte**: Função `get_overall_grade(user_id)`
- **Visual**: Nota de 0-10 com uma casa decimal
- **Cor**: Verde se >= 7.0, amarelo se >= 5.0, vermelho se < 5.0

#### Card 4: Tempo Total de Estudo
- **Métrica**: Soma do tempo gasto em todos os quizzes
- **Fonte**: `SUM(time_spent)` da tabela `quiz_attempts`
- **Visual**: Horas e minutos formatados (ex: "12h 45min")
- **Info adicional**: Tempo médio por quiz

#### Card 5: Sequência de Dias (Streak)
- **Métrica**: Dias consecutivos com atividade
- **Fonte**: Nova função SQL (criar)
- **Visual**: 🔥 emoji + número de dias
- **Cor**: Efeito animado se streak > 7 dias

### 2.3 Progresso por Módulo

**Componente**: `ModuleProgressList`
**Arquivo**: `src/components/module-progress-list.tsx`

Para cada módulo:
- Nome do módulo
- Barra de progresso (lições completadas / total de lições)
- Percentual
- Badge se módulo 100% completo

**Dados necessários**:
```typescript
type ModuleProgress = {
  moduleId: string;
  moduleName: string;
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  isComplete: boolean;
};
```

**Query SQL**:
```sql
-- Criar view module_progress
CREATE VIEW module_progress AS
SELECT
  m.module_id,
  m.module_name,
  COUNT(DISTINCT l.lesson_id) as total_lessons,
  COUNT(DISTINCT cl.lesson_id) as completed_lessons,
  ROUND(
    COUNT(DISTINCT cl.lesson_id)::DECIMAL /
    NULLIF(COUNT(DISTINCT l.lesson_id), 0) * 100,
    2
  ) as percentage
FROM modules m
LEFT JOIN lessons l ON l.module_id = m.module_id
LEFT JOIN completed_lessons cl ON cl.lesson_id = l.lesson_id
GROUP BY m.module_id, m.module_name;
```

### 2.4 Atividade Recente

**Componente**: `RecentActivityFeed`
**Arquivo**: `src/components/recent-activity-feed.tsx`

Mostrar últimas 5-10 atividades:
- Quiz aprovado (score >= 70%)
- Quiz reprovado (score < 70%)
- Lição iniciada
- Conquista desbloqueada

**Formato**:
```
🏆 Quiz aprovado - Bem-vindos ao Futuro (85%)
   há 2 horas

📝 Quiz completado - Os Primeiros Blocos (65%)
   ontem às 14:30

✨ Conquista desbloqueada: Primeira Aprovação
   há 3 dias
```

**Query SQL**:
```sql
-- Usar quiz_attempt_details ordenado por finished_at DESC
SELECT
  qa.quiz_id,
  qa.lesson_id,
  qa.finished_at,
  qa.score_percentage,
  qa.status
FROM quiz_attempt_details qa
WHERE qa.user_id = auth.uid()
  AND qa.status = 'completed'
ORDER BY qa.finished_at DESC
LIMIT 10;
```

### 2.5 Sistema de Conquistas (Badges/Achievements)

**Componente**: `AchievementsList`
**Arquivo**: `src/components/achievements-list.tsx`

#### Conquistas Propostas:

1. **🎯 Primeira Aprovação**
   - Critério: Passar no primeiro quiz com nota >= 70%

2. **🔥 Sequência de 3 dias**
   - Critério: Completar quizzes por 3 dias consecutivos

3. **🔥 Sequência de 7 dias**
   - Critério: Completar quizzes por 7 dias consecutivos

4. **⭐ Nota 10**
   - Critério: Tirar 100% em qualquer quiz

5. **💯 Perfeccionista**
   - Critério: Tirar 100% em 3 quizzes diferentes

6. **📚 Metade do Caminho**
   - Critério: Completar 50% do curso

7. **🎓 Curso Completo**
   - Critério: Completar 100% das lições

8. **⚡ Velocista**
   - Critério: Completar um quiz em menos de 5 minutos

9. **🎯 Nota Máxima no Módulo**
   - Critério: Tirar 100% em todas as lições de um módulo

10. **🏆 Aluno Dedicado**
    - Critério: Estudar por mais de 10 horas no total

#### Schema do Banco de Dados:

```sql
-- Tabela de conquistas
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de conquistas do usuário
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES achievements(id),
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- RLS
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);
```

### 2.6 Gráfico de Progresso ao Longo do Tempo (Opcional - Fase 2)

**Componente**: `ProgressChart`
**Biblioteca**: Chart.js ou Recharts

Mostrar gráfico de linha com:
- Eixo X: Datas
- Eixo Y: Número de lições completadas
- Tooltip: Detalhes da lição

## 3. Estrutura de Componentes

```
src/components/
├── profile/
│   ├── profile-header.tsx          # Seção de foto e nome
│   ├── profile-photo-upload.tsx    # Upload de foto
│   ├── profile-stats-cards.tsx     # Cards de estatísticas
│   ├── module-progress-list.tsx    # Lista de progresso por módulo
│   ├── recent-activity-feed.tsx    # Feed de atividades
│   └── achievements-list.tsx       # Lista de conquistas
```

## 4. Serviços e Hooks

### 4.1 Serviço de Perfil
**Arquivo**: `src/lib/profile-service.ts`

```typescript
// Upload de foto
async function uploadProfilePhoto(userId: string, file: File): Promise<string>

// Buscar perfil
async function getUserProfile(userId: string): Promise<UserProfile>

// Atualizar perfil
async function updateUserProfile(userId: string, data: Partial<UserProfile>)

// Deletar foto
async function deleteProfilePhoto(userId: string): Promise<void>
```

### 4.2 Serviço de Estatísticas
**Arquivo**: `src/lib/stats-service.ts`

```typescript
// Buscar estatísticas gerais
async function getUserStats(userId: string): Promise<UserStats>

// Buscar progresso por módulo
async function getModuleProgress(userId: string): Promise<ModuleProgress[]>

// Buscar atividade recente
async function getRecentActivity(userId: string): Promise<Activity[]>

// Calcular streak de dias
async function getUserStreak(userId: string): Promise<number>

// Buscar conquistas
async function getUserAchievements(userId: string): Promise<Achievement[]>

// Verificar e desbloquear conquistas
async function checkAndUnlockAchievements(userId: string): Promise<Achievement[]>
```

### 4.3 Hooks Personalizados

```typescript
// src/hooks/use-user-profile.ts
function useUserProfile()

// src/hooks/use-user-stats.ts
function useUserStats()

// src/hooks/use-module-progress.ts
function useModuleProgress()

// src/hooks/use-recent-activity.ts
function useRecentActivity()

// src/hooks/use-achievements.ts
function useAchievements()
```

## 5. Fluxo de Dados

### 5.1 Ao Carregar a Página
1. Verificar autenticação
2. Buscar perfil do usuário (foto, nome)
3. Buscar estatísticas gerais (queries em paralelo):
   - Progresso geral (completed_lessons)
   - Nota média (get_overall_grade)
   - Tempo total (SUM time_spent)
   - Streak de dias
4. Buscar progresso por módulo
5. Buscar atividade recente
6. Buscar conquistas desbloqueadas

### 5.2 Ao Fazer Upload de Foto
1. Validar arquivo (tipo, tamanho)
2. Criar preview com crop
3. Upload para Supabase Storage
4. Atualizar `user_profiles.photo_url`
5. Revalidar estado local

### 5.3 Sistema de Conquistas (Background)
- Criar função de trigger no Supabase que verifica conquistas após cada quiz completado
- Trigger roda automaticamente ao inserir/atualizar `quiz_attempts`
- Conquistas desbloqueadas são inseridas em `user_achievements`

## 6. Design e UX

### 6.1 Paleta de Cores
- **Sucesso/Aprovação**: Verde (#10b981 - green-500)
- **Atenção/Pendente**: Amarelo (#f59e0b - amber-500)
- **Erro/Reprovação**: Vermelho (#ef4444 - red-500)
- **Neutro**: Cinza (zinc-500, zinc-700)
- **Destaque**: Azul (#3b82f6 - blue-500)

### 6.2 Animações
- Fade in ao carregar estatísticas
- Hover effects em cards
- Animação de progresso em barras
- Confete ao desbloquear conquista (opcional)
- Pulse animation no streak se > 7 dias

### 6.3 Responsividade
- Desktop: Layout em grid 2-3 colunas
- Tablet: Grid adaptativo
- Mobile: Stack vertical, cards full-width

### 6.4 Estados de Loading e Erro
- Skeleton screens para estatísticas
- Mensagens de erro amigáveis
- Retry buttons em caso de falha
- Empty states para usuários sem progresso

## 7. Fases de Implementação

### Fase 1: Estrutura Básica (MVP)
1. Criar rota `/perfil`
2. Implementar layout básico
3. Criar schema `user_profiles`
4. Componente de foto de perfil com upload
5. Cards de estatísticas principais (progresso, lições, nota)

### Fase 2: Estatísticas Avançadas
1. Implementar progresso por módulo
2. Feed de atividade recente
3. Cálculo de streak de dias
4. Card de tempo total de estudo

### Fase 3: Sistema de Conquistas
1. Criar tabelas de conquistas
2. Implementar lógica de desbloqueio
3. Componente de lista de conquistas
4. Notificações de conquistas desbloqueadas

### Fase 4: Melhorias e Polimento
1. Gráfico de progresso (Chart.js)
2. Animações e transições
3. Melhorias de performance
4. Testes de acessibilidade
5. SEO e meta tags

## 8. Considerações Técnicas

### 8.1 Performance
- Usar React Query / SWR para caching de dados
- Lazy loading de componentes pesados
- Otimização de imagens (Next.js Image)
- Pagination no feed de atividades se necessário

### 8.2 Segurança
- RLS em todas as tabelas
- Validação de upload de imagem no servidor
- Sanitização de inputs
- Rate limiting em uploads

### 8.3 Acessibilidade
- ARIA labels em gráficos e estatísticas
- Contraste adequado de cores
- Navegação por teclado
- Screen reader friendly

### 8.4 SEO
- Meta tags personalizadas
- Open Graph para compartilhamento
- Structured data (Schema.org)

## 9. Testes

### 9.1 Unitários
- Funções de cálculo de estatísticas
- Validação de upload de arquivo
- Formatação de datas e números

### 9.2 Integração
- Upload de foto para Supabase
- Queries de estatísticas
- Desbloqueio de conquistas

### 9.3 E2E
- Fluxo completo de upload de foto
- Visualização de estatísticas
- Navegação entre perfil e lições

## 10. Métricas de Sucesso

- Taxa de usuários que fazem upload de foto: > 60%
- Tempo médio na página de perfil: > 2 minutos
- Taxa de retorno à página de perfil: > 40%
- Engajamento com conquistas: > 70% desbloqueiam ao menos 3

## 11. Próximos Passos Após Implementação

1. Dashboard de professor/admin (ver estatísticas de todos os alunos)
2. Ranking/leaderboard de alunos
3. Compartilhamento de conquistas em redes sociais
4. Certificado de conclusão do curso
5. Perfil público (opcional, opt-in)
6. Histórico de revisões (re-fazer quizzes antigos)

---

**Data de criação**: 2025-10-18
**Versão**: 1.0
