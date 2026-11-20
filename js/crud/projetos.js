// Funções usadas por todas as páginas do CRUD
import { API_URL, PUBLISHABLE_KEY } from './config.js';

// READ - Busca todos os projetos na API (GET)
// Devolve o array de projetos convertido de JSON para objetos JavaScript
export async function buscarProjetos() {
    const response = await fetch(`${API_URL}?order=id.desc`, {
        method: 'GET',
        headers: {
            apikey: PUBLISHABLE_KEY,
            Accept: 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}

// Troca os caracteres especiais do HTML, para que um texto digitado
// pelo usuário (ex.: "<b>") apareça como texto e não vire uma tag
export function escapar(texto) {
    return String(texto)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
}

// Converte a data do banco (2026-11-20) para o formato brasileiro (20/11/2026)
export function formatarData(data) {
    if (!data) {
        return 'Sem data';
    }
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Monta o HTML do cartão de um projeto.
// O parâmetro "botoes" recebe o HTML dos botões da página (Editar, Excluir...)
export function cartaoProjeto(projeto, botoes = '') {
    let link = '';
    if (projeto.link && projeto.link.startsWith('http')) {
        link = `<a class="projeto-link" href="${escapar(projeto.link)}" target="_blank" rel="noopener">Ver projeto ↗</a>`;
    }

    return `
        <div class="projeto">
            <div class="projeto-topo">
                <h3>${escapar(projeto.titulo)}</h3>
                <span class="projeto-status">${escapar(projeto.status)}</span>
            </div>
            <p class="projeto-info">${escapar(projeto.tecnologia)} · Conclusão: ${formatarData(projeto.data_conclusao)}</p>
            <p class="projeto-descricao">${escapar(projeto.descricao)}</p>
            ${link}
            ${botoes}
        </div>
    `;
}
