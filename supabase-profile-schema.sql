-- ============================================================================
-- SCHEMA SQL - PERFIL DO USUÁRIO
-- ============================================================================

-- Tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================

-- Índice para buscar por ID
CREATE INDEX IF NOT EXISTS idx_user_profiles_id
  ON user_profiles(id);

-- ============================================================================
-- TRIGGERS PARA AUTO-UPDATE
-- ============================================================================

-- Trigger para atualizar updated_at em user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Ativar RLS na tabela
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver qualquer perfil (para futuras features sociais)
CREATE POLICY "Users can view all profiles"
  ON user_profiles
  FOR SELECT
  USING (true);

-- Política: Usuários podem inserir apenas seu próprio perfil
CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Política: Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política: Usuários podem deletar apenas seu próprio perfil
CREATE POLICY "Users can delete their own profile"
  ON user_profiles
  FOR DELETE
  USING (auth.uid() = id);

-- ============================================================================
-- GRANTS (Permissões)
-- ============================================================================

-- Dar permissões para usuários autenticados
GRANT SELECT, INSERT, UPDATE, DELETE ON user_profiles TO authenticated;

-- ============================================================================
-- STORAGE BUCKET PARA FOTOS DE PERFIL
-- ============================================================================

-- Criar bucket para fotos de perfil (executar no painel do Supabase Storage)
-- Nome do bucket: profile-photos
-- Público: true
-- File size limit: 2MB
-- Allowed MIME types: image/jpeg, image/png, image/webp

-- Storage policies (executar após criar o bucket)
-- Policy: Usuários podem fazer upload de suas próprias fotos
CREATE POLICY "Users can upload their own profile photo"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Qualquer pessoa pode ver fotos de perfil
CREATE POLICY "Profile photos are publicly accessible"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'profile-photos');

-- Policy: Usuários podem atualizar suas próprias fotos
CREATE POLICY "Users can update their own profile photo"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Usuários podem deletar suas próprias fotos
CREATE POLICY "Users can delete their own profile photo"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================================
-- FUNÇÃO AUXILIAR - CRIAR PERFIL AUTOMATICAMENTE
-- ============================================================================

-- Função para criar perfil quando usuário é criado
CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_new_user();
