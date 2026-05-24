-- Remove política permissiva da tabela companies
DROP POLICY IF EXISTS "Companies: read for authenticated" ON public.companies;

-- SELECT restrito: só empresas vinculadas a projetos do usuário
CREATE POLICY "Companies: read own linked"
ON public.companies
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.project_companies pc
    JOIN public.projects p ON p.id = pc.project_id
    WHERE pc.company_id = companies.id
      AND p.user_id = auth.uid()
  )
);

-- INSERT permitido para autenticados (necessário para salvar leads novos vindos da busca/enriquecimento)
CREATE POLICY "Companies: insert authenticated"
ON public.companies
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);
