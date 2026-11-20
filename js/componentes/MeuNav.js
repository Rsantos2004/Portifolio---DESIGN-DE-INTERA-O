// Custom element do menu de navegação: <meu-nav ativo="index"></meu-nav>
// O atributo "ativo" diz qual página está aberta, para destacar o link dela
class MeuNav extends HTMLElement {
    // Array de objetos literais com as páginas do site.
    // Para adicionar uma página no menu, basta adicionar um objeto aqui.
    static paginas = [
        { id: 'index', href: 'index.html', texto: 'Apresentação' },
        { id: 'editor', href: 'editor.html', texto: 'Trabalho 1 (Editor)' },
        { id: 'prova', href: 'prova.html', texto: 'Trabalho 2 (Prova)' },
        { id: 'projetos', href: 'projetos.html', texto: 'Trabalho 3: Consultar' },
        { id: 'criar', href: 'projeto-criar.html', texto: 'Cadastrar' },
        { id: 'alterar', href: 'projeto-alterar.html', texto: 'Alterar' },
        { id: 'excluir', href: 'projeto-excluir.html', texto: 'Excluir' }
    ];

    connectedCallback() {
        // Lê o atributo "ativo" da tag
        const ativo = this.getAttribute('ativo');

        // Monta um <li> para cada página usando map e junta tudo com join
        const itens = MeuNav.paginas.map(pagina => {
            // Na página atual, marca o link com aria-current (acessibilidade) e a classe "ativo"
            const atual = pagina.id === ativo ? ' class="ativo" aria-current="page"' : '';
            return `<li><a href="${pagina.href}"${atual}>${pagina.texto}</a></li>`;
        }).join('');

        this.innerHTML = `
            <nav class="main-nav">
                <ul>${itens}</ul>
            </nav>`;
    }
}

customElements.define('meu-nav', MeuNav);

export default MeuNav;
