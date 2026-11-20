// Custom element com Shadow DOM + template + slots: <cartao-trabalho>
// Uso na página:
//   <cartao-trabalho link="editor.html" texto-link="Abrir editor">
//       <span slot="titulo">Trabalho 1</span>
//       <span slot="descricao">Texto do cartão</span>
//   </cartao-trabalho>
// Os atributos "link" e "texto-link" são opcionais: sem eles, o cartão fica sem botão.

// Template: fragmento de HTML que não aparece na tela, só os seus clones
const template = document.createElement('template');
template.innerHTML = `
    <style>
        /* :host é a própria tag <cartao-trabalho> */
        :host {
            display: block;
        }

        /* O visual fica em um elemento interno, pois o CSS da página
           (ex.: "* { padding: 0 }" do reset.css) tem prioridade sobre o :host */
        .cartao {
            display: flex;
            flex-direction: column;
            gap: 10px;
            height: 100%;
            background-color: #fff;
            border: 1px solid #ddd;
            border-top: 5px solid var(--header-bg);
            border-radius: var(--border-radius);
            padding: var(--spacing-default);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
        }

        h3 {
            margin: 0;
            color: var(--primary-color);
            font-size: 1.2rem;
        }

        p {
            margin: 0;
            flex: 1;
        }

        /* Botão do cartão: centralizado, arredondado e com efeito ao passar o mouse */
        .botao {
            align-self: center;
            margin-top: 8px;
            background-color: var(--header-bg);
            color: #fff;
            padding: 10px 26px;
            border-radius: 999px;
            text-decoration: none;
            font-weight: bold;
            box-shadow: 0 3px 8px rgba(41, 128, 185, 0.35);
            transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
        }

        .botao:hover {
            background-color: var(--primary-color);
            transform: translateY(-2px);
            box-shadow: 0 5px 12px rgba(44, 62, 80, 0.35);
        }

        .botao:focus-visible {
            outline: 3px solid #f1c40f;
            outline-offset: 3px;
        }

        .botao[hidden] {
            display: none;
        }
    </style>
    <div class="cartao">
        <h3><slot name="titulo">Sem título</slot></h3>
        <p><slot name="descricao">Sem descrição</slot></p>
        <a class="botao" hidden></a>
    </div>`;

class CartaoTrabalho extends HTMLElement {
    constructor() {
        super();
        // Cria o shadow DOM e coloca dentro dele um clone do template
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        // Lê os atributos da tag e, se tiver link, mostra o botão
        const link = this.getAttribute('link');
        const botao = this.shadowRoot.querySelector('.botao');
        if (link) {
            botao.href = link;
            botao.textContent = `${this.getAttribute('texto-link') || 'Abrir'} →`;
            botao.hidden = false;
        }
    }
}

customElements.define('cartao-trabalho', CartaoTrabalho);

export default CartaoTrabalho;

