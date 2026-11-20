// Seleciona o container onde o menu gerado (preview) fica dentro da tela
const menu = document.querySelector('#generatedMenuContainer');
// Seleciona a lista (ul) onde os itens do menu gerado são inseridos
const lista = document.querySelector('#generatedMenuList');
// Cria pelo JS a tag de imagem usada para mostrar a figura enviada pelo usuário.
// Ela só entra na página quando o usuário escolhe um arquivo
// (uma <img> sem src é um erro no validador da W3C)
const imagem = document.createElement('img');
// Define o id (usado no CSS) e o texto alternativo da imagem
imagem.id = 'generatedImage';
imagem.alt = 'Figura inserida pelo usuário';
// Seleciona o campo numérico que indica qual item será editado ou removido
const itemNum = document.querySelector('#itemNum');
// Seleciona o campo de texto usado para digitar o novo texto do item escolhido
const itemNewText = document.querySelector('#itemNewText');
// Seleciona o botão de editar o texto do item escolhido
const editBtn = document.querySelector('#editItemBtn');
// Seleciona o botão de remover o item escolhido
const removeBtn = document.querySelector('#removeItemBtn');

// Função que habilita ou desabilita os campos de editar/remover item
function atualizarControles() {
    // Verifica se existe pelo menos um item na lista do menu gerado
    const tem = lista.children.length > 0;
    // Se não houver item, desabilita os 4 campos ao mesmo tempo (evita erro do usuário)
    itemNum.disabled = itemNewText.disabled = editBtn.disabled = removeBtn.disabled = !tem;
    // Atualiza o valor máximo aceito no campo numérico, conforme a quantidade de itens
    itemNum.max = lista.children.length;
}

// Função que lê todos os valores do formulário e aplica no menu gerado
function aplicarEstilos() {
    // Aplica a cor de fundo escolhida no container do menu
    menu.style.backgroundColor = document.querySelector('#menuBg').value;
    // Aplica o alinhamento/distribuição escolhido na lista de itens
    lista.style.justifyContent = document.querySelector('#alignment').value;
    // Aplica o espaçamento entre os itens (gap) com o valor escolhido, em pixels
    lista.style.gap = document.querySelector('#spacing').value + 'px';

    // Monta um objeto com todos os estilos que devem ser aplicados em cada item
    const estilo = {
        // Cor de fundo de cada item do menu
        backgroundColor: document.querySelector('#itemBg').value,
        // Cor do texto de cada item do menu
        color: document.querySelector('#textColor').value,
        // Tamanho da fonte do texto de cada item, em pixels
        fontSize: document.querySelector('#fontSize').value + 'px',
        // Espaçamento interno (padding) de cada item, em pixels
        padding: document.querySelector('#spacing').value + 'px',
        // Borda de cada item: espessura fixa de 2px + estilo e cor escolhidos
        border: `2px ${document.querySelector('#borderStyle').value} ${document.querySelector('#borderColor').value}`
    };
    // Percorre todos os itens já criados na lista e aplica o objeto de estilo em cada um
    [...lista.children].forEach(item => Object.assign(item.style, estilo));
}

// Evento disparado quando o usuário escolhe um arquivo de imagem
document.querySelector('#imgInput').addEventListener('change', e => {
    // Pega o primeiro arquivo selecionado pelo usuário
    const arquivo = e.target.files[0];
    // Se nenhum arquivo foi selecionado, encerra a função
    if (!arquivo) return;
    // Cria um leitor de arquivos para converter a imagem em uma URL utilizável
    const leitor = new FileReader();
    // Quando a leitura terminar, coloca a imagem no início do menu gerado, antes da lista
    leitor.onload = ev => { imagem.src = ev.target.result; menu.prepend(imagem); };
    // Inicia a leitura do arquivo como uma URL de dados (base64)
    leitor.readAsDataURL(arquivo);
    // Habilita o botão de remover imagem, já que agora existe uma imagem inserida
    document.querySelector('#removeImgBtn').disabled = false;
});

// Evento disparado quando o usuário clica no botão de remover imagem
document.querySelector('#removeImgBtn').addEventListener('click', () => {
    // Tira a tag de imagem da página
    imagem.remove();
    // Remove o atributo src por completo, em vez de deixá-lo vazio (src="" é inválido em HTML)
    imagem.removeAttribute('src');
    // Limpa o valor do input de arquivo, permitindo reenviar a mesma imagem depois
    document.querySelector('#imgInput').value = '';
    // Desabilita novamente o botão de remover, já que não há mais imagem
    document.querySelector('#removeImgBtn').disabled = true;
});

// Evento disparado quando o usuário clica no botão de adicionar item
document.querySelector('#addItemBtn').addEventListener('click', () => {
    // Seleciona o campo de texto onde o novo item foi digitado
    const campo = document.querySelector('#itemText');
    // Se o campo estiver vazio (ou só com espaços), não faz nada
    if (!campo.value.trim()) return;
    // Cria um novo elemento de lista (li) para representar o item do menu
    const li = document.createElement('li');
    // Define o texto do novo item com o valor digitado pelo usuário
    li.textContent = campo.value.trim();
    // Adiciona o novo item dentro da lista do menu gerado
    lista.appendChild(li);
    // Limpa o campo de texto após adicionar o item
    campo.value = '';
    // Atualiza os controles de editar/remover, já que agora existe pelo menos 1 item
    atualizarControles();
    // Reaplica os estilos atuais no novo item recém-criado
    aplicarEstilos();
});

// Evento disparado quando o usuário clica no botão de editar item
editBtn.addEventListener('click', () => {
    // Busca o item da lista na posição informada pelo usuário (índice começa em 0)
    const item = lista.children[itemNum.value - 1];
    // Se o item existir e o novo texto não estiver vazio, atualiza o texto do item
    if (item && itemNewText.value.trim()) {
        item.textContent = itemNewText.value.trim();
        // Limpa o campo de novo texto depois de aplicar a edição
        itemNewText.value = '';
    }
});

// Evento disparado quando o usuário clica no botão de remover item
removeBtn.addEventListener('click', () => {
    // Busca o item da lista na posição informada pelo usuário
    const item = lista.children[itemNum.value - 1];
    // Se o item existir, remove ele da lista
    if (item) item.remove();
    // Atualiza os controles, pois a quantidade de itens pode ter mudado (ou chegado a zero)
    atualizarControles();
});

// Seleciona todos os campos de estilo (cores, fonte, espaçamento, alinhamento e borda)
document.querySelectorAll('#menuBg, #itemBg, #textColor, #fontSize, #spacing, #alignment, #borderStyle, #borderColor')
    // Para cada um desses campos, escuta o evento "input" e reaplica os estilos em tempo real
    .forEach(input => input.addEventListener('input', aplicarEstilos));

// Executa uma vez ao carregar a página, para deixar os controles de item no estado correto
atualizarControles();
// Executa uma vez ao carregar a página, para já mostrar o menu com os estilos padrão
aplicarEstilos();
