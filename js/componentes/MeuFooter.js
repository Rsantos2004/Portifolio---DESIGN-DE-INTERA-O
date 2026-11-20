// Custom element do rodapé do site: <meu-footer></meu-footer>
class MeuFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <p class="footer-autor">Rafael dos Santos Pinto</p>
                <p class="footer-info">Design de Interação — TADS — IFRS</p>
            </footer>`;
    }
}

customElements.define('meu-footer', MeuFooter);

export default MeuFooter;
