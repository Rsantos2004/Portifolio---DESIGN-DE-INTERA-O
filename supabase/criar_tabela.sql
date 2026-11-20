-- Script para criar a tabela do CRUD no Supabase.
-- Como usar: no painel do Supabase, abra "SQL Editor", cole este script e clique em "Run".

create table if not exists public.projetos (
    id              bigint generated always as identity primary key,
    titulo          text not null check (char_length(titulo) between 3 and 100),
    descricao       text not null check (char_length(descricao) <= 500),
    tecnologia      text not null,
    status          text not null default 'Em andamento'
                    check (status in ('Planejado', 'Em andamento', 'Concluído')),
    data_conclusao  date,
    link            text,
    created_at      timestamptz not null default now()
);

-- Row Level Security: com o RLS ligado, o Supabase bloqueia tudo por padrão.
-- As políticas abaixo liberam leitura e escrita para a chave pública (papel "anon"),
-- já que o site não tem login.
alter table public.projetos enable row level security;

create policy "Leitura pública"  on public.projetos for select to anon using (true);
create policy "Inserção pública" on public.projetos for insert to anon with check (true);
create policy "Edição pública"   on public.projetos for update to anon using (true) with check (true);
create policy "Exclusão pública" on public.projetos for delete to anon using (true);

grant select, insert, update, delete on public.projetos to anon;

-- Alguns registros de exemplo (opcional)
insert into public.projetos (titulo, descricao, tecnologia, status, data_conclusao, link) values
    ('Editor de Menus', 'Formulário que cria e personaliza um menu em tempo real.', 'JavaScript', 'Concluído', '2026-09-15', null),
    ('Prova On-line', 'Prova de múltipla escolha feita como web component, com correção automática.', 'Web Components', 'Concluído', '2026-10-20', null),
    ('CRUD de Projetos', 'Cadastro de projetos usando a API REST do Supabase com fetch.', 'JavaScript', 'Em andamento', null, null);
