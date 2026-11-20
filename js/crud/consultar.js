// Página projetos.html - CONSULTAR projetos (READ)
import { buscarProjetos, cartaoProjeto } from './projetos.js';

const projetosContainer = document.querySelector('#projetosContainer');
const mensagem = document.querySelector('#mensagem');
const formBusca = document.querySelector('#formBusca');
const campoBusca = document.querySelector('#busca');
const filtroTecnologia = document.querySelector('#filtroTecnologia');

// O JSON com os dados do servidor será armazenado nesta variável
let localProjetos = [];

// Ouvintes de eventos: a lista é filtrada enquanto o usuário digita ou escolhe
campoBusca.addEventListener('input', renderProjetos);
filtroTecnologia.addEventListener('change', renderProjetos);
formBusca.addEventListener('submit', (e) => e.preventDefault());

// Busca os projetos na API
async function carregarProjetos() {
    try {
        localProjetos = await buscarProjetos();
        renderProjetos();
    } catch (error) {
        mensagem.innerHTML = 'Erro ao carregar os dados. Tente novamente mais tarde.';
        mensagem.className = 'mensagem erro';
        console.error(error);
    }
}

// Mostra na tela os projetos que passam na busca e no filtro
function renderProjetos() {
    const busca = campoBusca.value.trim().toLowerCase();
    const tecnologia = filtroTecnologia.value;

    // filter: fica só com os projetos cujo título contém o texto buscado
    // e que são da tecnologia escolhida ("" = todas)
    const filtrados = localProjetos
        .filter((projeto) => projeto.titulo.toLowerCase().includes(busca))
        .filter((projeto) => tecnologia === '' || projeto.tecnologia === tecnologia);

    // reduce: conta quantos projetos já estão concluídos
    const concluidos = localProjetos.reduce((acumulador, projeto) => {
        if (projeto.status === 'Concluído') {
            return acumulador + 1;
        }
        return acumulador;
    }, 0);

    mensagem.className = 'mensagem';
    mensagem.innerHTML = `Mostrando ${filtrados.length} de ${localProjetos.length} projetos
                          (${concluidos} concluídos).`;

    if (filtrados.length === 0) {
        projetosContainer.innerHTML = '<p>Nenhum projeto encontrado.</p>';
        return;
    }

    projetosContainer.innerHTML = '';
    filtrados.forEach((projeto) => {
        projetosContainer.innerHTML += cartaoProjeto(projeto);
    });
}

carregarProjetos(); // Carrega os projetos ao iniciar a página
