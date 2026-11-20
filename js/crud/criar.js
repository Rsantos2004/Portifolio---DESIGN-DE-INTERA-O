// Página projeto-criar.html - CRIAR projeto (CREATE)
import { API_URL, PUBLISHABLE_KEY } from './config.js';
import { escapar } from './projetos.js';

const projetoForm = document.querySelector('#projetoForm');
const tituloInput = document.querySelector('#titulo');
const descricaoInput = document.querySelector('#descricao');
const tecnologiaInput = document.querySelector('#tecnologia');
const statusInput = document.querySelector('#status');
const dataInput = document.querySelector('#dataConclusao');
const linkInput = document.querySelector('#link');
const submitBtn = document.querySelector('#submitBtn');
const mensagem = document.querySelector('#mensagem');

// Ouvinte de evento
projetoForm.addEventListener('submit', criarProjeto);

// CREATE - Envia o POST para a API
async function criarProjeto(e) {
    e.preventDefault(); // Impede o HTML de recarregar a página inteira

    // Objeto literal com os dados do formulário (os nomes são as colunas da tabela)
    const projetoData = {
        titulo: tituloInput.value.trim(),
        descricao: descricaoInput.value.trim(),
        tecnologia: tecnologiaInput.value,
        status: statusInput.value,
        data_conclusao: dataInput.value || null, // campo vazio vai como null
        link: linkInput.value.trim() || null
    };

    if (projetoData.titulo.length < 3 || projetoData.descricao === '') {
        mensagem.innerHTML = 'Preencha o título (mínimo 3 letras) e a descrição.';
        mensagem.className = 'mensagem erro';
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Salvando...';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                apikey: PUBLISHABLE_KEY,
                'Content-Type': 'application/json',
                Prefer: 'return=representation'
            },
            body: JSON.stringify(projetoData)
        });
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        const novoProjeto = await response.json();

        mensagem.innerHTML = `Projeto "${escapar(novoProjeto[0].titulo)}" cadastrado com sucesso!<br>
                              Preencha o formulário novamente para cadastrar outro.`;
        mensagem.className = 'mensagem';
        projetoForm.reset();
    } catch (error) {
        mensagem.innerHTML = 'Não foi possível cadastrar o projeto. Tente novamente.';
        mensagem.className = 'mensagem erro';
        console.error('Erro ao criar projeto:', error);
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Cadastrar projeto';
}
