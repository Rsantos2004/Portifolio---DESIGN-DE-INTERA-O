// Página projeto-alterar.html - ALTERAR projeto (UPDATE)
import { API_URL, PUBLISHABLE_KEY } from './config.js';
import { buscarProjetos, cartaoProjeto, escapar } from './projetos.js';

const projetoForm = document.querySelector('#projetoForm');
const idInput = document.querySelector('#projetoId');
const tituloInput = document.querySelector('#titulo');
const descricaoInput = document.querySelector('#descricao');
const tecnologiaInput = document.querySelector('#tecnologia');
const statusInput = document.querySelector('#status');
const dataInput = document.querySelector('#dataConclusao');
const linkInput = document.querySelector('#link');
const cancelarBtn = document.querySelector('#cancelarBtn');
const projetosContainer = document.querySelector('#projetosContainer');
const mensagem = document.querySelector('#mensagem');

// O JSON com os dados do servidor será armazenado nesta variável
let localProjetos = [];

// Ouvintes de eventos
projetoForm.addEventListener('submit', updateProjeto);
cancelarBtn.addEventListener('click', fecharFormulario);

// READ - Busca os projetos para o usuário escolher qual alterar
async function carregarProjetos() {
    try {
        localProjetos = await buscarProjetos();
        renderProjetos();
    } catch (error) {
        projetosContainer.innerHTML = 'Erro ao carregar os dados.';
        console.error(error);
    }
}

// Mostra os projetos, cada um com o botão Editar
function renderProjetos() {
    if (localProjetos.length === 0) {
        projetosContainer.innerHTML = '<p>Nenhum projeto encontrado.</p>';
        return;
    }

    projetosContainer.innerHTML = '';
    localProjetos.forEach((projeto) => {
        const botoes = `<div class="projeto-acoes">
                            <button type="button" class="btn-editar" value="${projeto.id}">Editar</button>
                        </div>`;
        projetosContainer.innerHTML += cartaoProjeto(projeto, botoes);
    });

    // Coloca o evento de clique em cada botão Editar (o value do botão guarda o id)
    document.querySelectorAll('.btn-editar').forEach((botao) => {
        botao.addEventListener('click', () => prepararEdit(Number(botao.value)));
    });
}

// Preenche o formulário com os dados do projeto escolhido
function prepararEdit(id) {
    const projeto = localProjetos.find((p) => p.id === id);
    if (projeto) {
        idInput.value = projeto.id;
        tituloInput.value = projeto.titulo;
        descricaoInput.value = projeto.descricao;
        tecnologiaInput.value = projeto.tecnologia;
        statusInput.value = projeto.status;
        dataInput.value = projeto.data_conclusao || '';
        linkInput.value = projeto.link || '';

        projetoForm.classList.remove('oculto');
        projetosContainer.classList.add('oculto');
        mensagem.innerHTML = `Altere os dados do projeto "${escapar(projeto.titulo)}" e clique em Salvar.`;
        mensagem.className = 'mensagem';
        tituloInput.focus();
    }
}

// Volta para a lista sem salvar
function fecharFormulario() {
    projetoForm.classList.add('oculto');
    projetosContainer.classList.remove('oculto');
    mensagem.innerHTML = 'Escolha um projeto para editar.';
    mensagem.className = 'mensagem';
}

// UPDATE - Envia o PATCH para a API
async function updateProjeto(e) {
    e.preventDefault(); // Impede o HTML de recarregar a página inteira

    const id = idInput.value;
    const projetoData = {
        titulo: tituloInput.value.trim(),
        descricao: descricaoInput.value.trim(),
        tecnologia: tecnologiaInput.value,
        status: statusInput.value,
        data_conclusao: dataInput.value || null,
        link: linkInput.value.trim() || null
    };

    if (projetoData.titulo.length < 3 || projetoData.descricao === '') {
        mensagem.innerHTML = 'Preencha o título (mínimo 3 letras) e a descrição.';
        mensagem.className = 'mensagem erro';
        return;
    }

    try {
        const response = await fetch(`${API_URL}?id=eq.${id}`, {
            method: 'PATCH',
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

        fecharFormulario();
        mensagem.innerHTML = `Projeto alterado com sucesso!<br>
                              Escolha outro projeto para editar.`;
        carregarProjetos(); // Atualiza a lista depois da alteração
    } catch (error) {
        mensagem.innerHTML = 'Não foi possível alterar o projeto. Tente novamente.';
        mensagem.className = 'mensagem erro';
        console.error('Erro ao alterar projeto:', error);
    }
}

carregarProjetos(); // Carrega os projetos ao iniciar a página
