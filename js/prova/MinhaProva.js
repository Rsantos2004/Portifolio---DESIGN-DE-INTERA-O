// Web component da prova on-line: <minha-prova></minha-prova>
// Todo o HTML, CSS e JS da prova fica encapsulado no shadow DOM.
import dadosProva from './questoes.js';
import Questao from './Questao.js';

// CSS da prova (fica dentro do shadow DOM, não afeta o resto do site)
const estilo = `
    :host {
        display: block;
        font-family: inherit;
    }

    * {
        box-sizing: border-box;
    }

    /* Largura máxima e centralização ficam nos elementos internos, pois o CSS
       da página (ex.: "* { margin: 0 }" do reset.css) tem prioridade sobre o :host */
    .cabecalho, form, .resultado {
        max-width: 760px;
        margin-left: auto;
        margin-right: auto;
    }

    .cabecalho {
        background: linear-gradient(135deg, var(--primary-color), var(--header-bg));
        color: #fff;
        padding: 20px;
        border-radius: var(--border-radius) var(--border-radius) 0 0;
    }

    .cabecalho h2 {
        margin: 0 0 6px;
        font-size: 1.5rem;
    }

    .cabecalho p {
        margin: 0;
        opacity: 0.9;
    }

    form, .resultado {
        background-color: #fff;
        border: 1px solid #ddd;
        border-top: none;
        border-radius: 0 0 var(--border-radius) var(--border-radius);
        padding: 20px;
    }

    fieldset {
        border: 1px solid #ddd;
        border-left: 5px solid var(--header-bg);
        border-radius: var(--border-radius);
        margin: 0 0 18px;
        padding: 14px 16px;
    }

    legend {
        font-weight: bold;
        padding: 0 6px;
        color: var(--primary-color);
    }

    .alternativa {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        margin-top: 8px;
        border: 1px solid #e3e3e3;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s, border-color 0.2s;
    }

    .alternativa:hover {
        background-color: #f0f7fc;
        border-color: var(--header-bg);
    }

    /* Destaca a alternativa marcada */
    .alternativa:has(input:checked) {
        background-color: #e3f1fb;
        border-color: var(--header-bg);
    }

    .alternativa input {
        width: 18px;
        height: 18px;
        margin: 0;
        flex-shrink: 0;
        accent-color: var(--header-bg);
    }

    .alternativa label {
        flex: 1;
        cursor: pointer;
    }

    .rodape-form {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }

    .progresso {
        margin: 0;
        color: #555;
    }

    button {
        background-color: var(--header-bg);
        color: #fff;
        border: none;
        padding: 12px 22px;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
    }

    button:hover:not(:disabled) {
        background-color: var(--primary-color);
    }

    button:disabled {
        background-color: #bdc3c7;
        cursor: not-allowed;
    }

    button:focus-visible, input:focus-visible {
        outline: 3px solid #f1c40f;
        outline-offset: 2px;
    }

    /* Resultado */
    .nota {
        text-align: center;
        padding: 16px;
        border-radius: var(--border-radius);
        margin-bottom: 18px;
        color: #fff;
    }

    .nota.aprovado {
        background-color: #27ae60;
    }

    .nota.reprovado {
        background-color: #c0392b;
    }

    .nota strong {
        display: block;
        font-size: 2.4rem;
    }

    .correcao {
        list-style: none;
        margin: 0 0 18px;
        padding: 0;
    }

    .correcao li {
        border: 1px solid #ddd;
        border-left-width: 5px;
        border-radius: 4px;
        padding: 12px;
        margin-bottom: 10px;
    }

    .correcao li.certa {
        border-left-color: #27ae60;
    }

    .correcao li.errada {
        border-left-color: #c0392b;
    }

    .correcao p {
        margin: 6px 0 0;
    }

    .selo {
        font-weight: bold;
    }

    .certa .selo {
        color: #1e8449;
    }

    .errada .selo {
        color: #a93226;
    }

    @media (max-width: 500px) {
        .cabecalho, form, .resultado {
            padding: 14px;
        }

        fieldset {
            padding: 10px;
        }

        button {
            width: 100%;
        }
    }
`;

// Troca caracteres especiais do HTML (ex.: "<script>" no enunciado vira texto, e não uma tag)
function escapar(texto) {
    return String(texto)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
}

class MinhaProva extends HTMLElement {
    // Propriedades privadas do componente
    #questoes;

    constructor() {
        super();
        // Cria o shadow DOM (encapsula HTML, CSS e JS da prova)
        this.attachShadow({ mode: 'open' });
        // Transforma cada objeto literal do JSON em um objeto da classe Questao
        this.#questoes = dadosProva.questoes.map(dados => new Questao(dados));
    }

    connectedCallback() {
        this.#renderizar();
    }

    // Monta o formulário com todas as questões do objeto literal
    #renderizar() {
        // Para cada questão, gera um fieldset com um input radio + label para cada alternativa
        const htmlQuestoes = this.#questoes.map((questao, i) => {
            const htmlAlternativas = questao.alternativas.map((alternativa, j) => `
                <div class="alternativa">
                    <input type="radio" name="q${i}" id="q${i}-a${j}" value="${j}" required>
                    <label for="q${i}-a${j}">${escapar(alternativa)}</label>
                </div>`).join('');

            return `
                <fieldset>
                    <legend>${i + 1}. ${escapar(questao.enunciado)}</legend>
                    ${htmlAlternativas}
                </fieldset>`;
        }).join('');

        this.shadowRoot.innerHTML = `
            <style>${estilo}</style>
            <div class="cabecalho">
                <h2>${escapar(dadosProva.titulo)}</h2>
                <p>Marque uma alternativa em cada questão e clique em "Corrigir prova".</p>
            </div>
            <form novalidate>
                ${htmlQuestoes}
                <div class="rodape-form">
                    <p class="progresso" aria-live="polite"></p>
                    <button type="submit" disabled>Corrigir prova</button>
                </div>
            </form>`;

        const form = this.shadowRoot.querySelector('form');
        // Toda vez que o usuário marca uma alternativa, atualiza o progresso
        form.addEventListener('change', () => this.#atualizarProgresso());
        form.addEventListener('submit', evento => {
            // Evita que o formulário recarregue a página
            evento.preventDefault();
            this.#corrigir();
        });
        this.#atualizarProgresso();
    }

    // Retorna um array com o índice marcado em cada questão (ou null se não respondeu)
    #lerRespostas() {
        return this.#questoes.map((questao, i) => {
            const marcada = this.shadowRoot.querySelector(`input[name="q${i}"]:checked`);
            return marcada ? Number(marcada.value) : null;
        });
    }

    // Mostra quantas questões já foram respondidas e só libera o botão quando todas estiverem respondidas
    // (evita o erro do usuário enviar a prova incompleta)
    #atualizarProgresso() {
        const respondidas = this.#lerRespostas().filter(resposta => resposta !== null).length;
        const total = this.#questoes.length;
        this.shadowRoot.querySelector('.progresso').textContent =
            `${respondidas} de ${total} questões respondidas`;
        this.shadowRoot.querySelector('button[type="submit"]').disabled = respondidas < total;
    }

    // Corrige a prova e mostra nota, o que foi respondido e as respostas corretas
    #corrigir() {
        const respostas = this.#lerRespostas();
        // Segurança extra: não corrige se faltar alguma resposta
        if (respostas.includes(null)) return;

        const total = this.#questoes.length;
        const acertos = this.#questoes.filter((questao, i) => questao.acertou(respostas[i])).length;
        const nota = (acertos / total) * 10;
        const situacao = nota >= 6 ? 'aprovado' : 'reprovado';

        // Monta um item da lista de correção para cada questão
        const htmlCorrecao = this.#questoes.map((questao, i) => {
            const certa = questao.acertou(respostas[i]);
            return `
                <li class="${certa ? 'certa' : 'errada'}">
                    <span class="selo">${certa ? '✔ Acertou' : '✘ Errou'}</span> — ${i + 1}. ${escapar(questao.enunciado)}
                    <p><strong>Sua resposta:</strong> ${escapar(questao.alternativas[respostas[i]])}</p>
                    <p><strong>Resposta correta:</strong> ${escapar(questao.getRespostaCorreta())}</p>
                </li>`;
        }).join('');

        // Troca o formulário pelo resultado (o estilo e o cabeçalho continuam)
        this.shadowRoot.querySelector('form').remove();
        const resultado = document.createElement('div');
        resultado.className = 'resultado';
        resultado.setAttribute('aria-live', 'polite');
        resultado.innerHTML = `
            <div class="nota ${situacao}">
                Sua nota
                <strong>${nota.toFixed(1).replace('.', ',')}</strong>
                ${acertos} de ${total} questões corretas
            </div>
            <ol class="correcao">${htmlCorrecao}</ol>
            <button type="button">Responder novamente</button>`;
        this.shadowRoot.appendChild(resultado);

        // Botão para refazer a prova do zero
        resultado.querySelector('button').addEventListener('click', () => {
            this.#renderizar();
            this.scrollIntoView({ behavior: 'smooth' });
        });

        this.scrollIntoView({ behavior: 'smooth' });
    }
}

customElements.define('minha-prova', MinhaProva);

export default MinhaProva;
