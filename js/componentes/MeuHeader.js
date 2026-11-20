// Custom element do cabeçalho do site: <meu-header></meu-header>
// Fica escrito em um único lugar e é reutilizado em todas as páginas
class MeuHeader extends HTMLElement {
    // connectedCallback roda quando a tag é colocada na página
    connectedCallback() {
        // Sem shadow DOM: assim o header continua usando o css/style.css do site
        this.innerHTML = `
            <header>
                <h1>Portfólio de Interação Web</h1>
            </header>`;
    }
}

// Registra a tag customizada (o nome precisa ter "-")
customElements.define('meu-header', MeuHeader);

// Exporta a classe para poder ser importada em outro módulo
export default MeuHeader;
