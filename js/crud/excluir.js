// Página projeto-excluir.html - EXCLUIR projeto (DELETE)
import { API_URL, PUBLISHABLE_KEY } from './config.js';
import { buscarProjetos, cartaoProjeto, escapar } from './projetos.js';

const projetosContainer = document.querySelector('#projetosContainer');
const mensagem = document.querySelector('#mensagem');

// O JSON com os dados do servidor será armazenado nesta variável
let localProjetos = [];

// READ - Busca os projetos para o usuário escolher qual excluir
async function carregarProjetos() {
    try {
        localProjetos = await buscarProjetos();
        renderProjetos();
    } catch (error) {
        projetosContainer.innerHTML = 'Erro ao carregar os dados.';
        console.error(error);
    }
}

// Mostra os projetos, cada um com o botão Excluir
function renderProjetos() {
    if (localProjetos.length === 0) {
        projetosContainer.innerHTML = '<p>Nenhum projeto encontrado.</p>';
        return;
    }

    projetosContainer.innerHTML = '';
    localProjetos.forEach((projeto) => {
        const botoes = `<div class="projeto-acoes">
                            <button type="button" class="btn-excluir" value="${projeto.id}">Excluir</button>
                        </div>`;
        projetosContainer.innerHTML += cartaoProjeto(projeto, botoes);
    });

    // Coloca o evento de clique em cada botão Excluir (o value do botão guarda o id)
    document.querySelectorAll('.btn-excluir').forEach((botao) => {
        botao.addEventListener('click', () => deletarProjeto(Number(botao.value)));
    });
}

// DELETE - Envia o DELETE para a API
async function deletarProjeto(id) {
    const projeto = localProjetos.find((p) => p.id === id);

    // Pede confirmação antes de excluir (evita excluir por engano)
    if (!confirm(`Deseja realmente excluir o projeto "${projeto.titulo}"?`)) return;

    try {
        const response = await fetch(`${API_URL}?id=eq.${id}`, {
            method: 'DELETE',
            headers: {
                apikey: PUBLISHABLE_KEY
            }
        });
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }

        mensagem.innerHTML = `Projeto "${escapar(projeto.titulo)}" excluído com sucesso!<br>
                              Escolha outro projeto para excluir.`;
        mensagem.className = 'mensagem';
        carregarProjetos(); // Atualiza a lista depois da exclusão
    } catch (error) {
        mensagem.innerHTML = 'Não foi possível excluir o projeto. Tente novamente.';
        mensagem.className = 'mensagem erro';
        console.error('Erro ao excluir projeto:', error);
    }
}

carregarProjetos(); // Carrega os projetos ao iniciar a página
