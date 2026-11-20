// Objeto literal (formato JSON) com os dados da prova.
// Para adicionar uma questão nova, basta adicionar mais um objeto no array "questoes":
// ela será mostrada e corrigida automaticamente, igual às outras.
//   enunciado:    texto da pergunta
//   alternativas: array com o texto de cada alternativa
//   correta:      posição da alternativa correta no array (começa em 0)
const prova = {
    titulo: 'Prova on-line de JavaScript',
    questoes: [
        {
            enunciado: 'Qual comando registra uma tag customizada (custom element) no navegador?',
            alternativas: [
                'document.createElement()',
                'customElements.define()',
                'HTMLElement.register()'
            ],
            correta: 1
        },
        {
            enunciado: 'Em uma classe JavaScript, qual caractere no início do nome torna uma propriedade privada?',
            alternativas: [
                '#',
                '_',
                '$'
            ],
            correta: 0
        },
        {
            enunciado: 'Para que os comandos import e export funcionem, a tag <script> deve ter qual atributo?',
            alternativas: [
                'defer',
                'async',
                'type="module"'
            ],
            correta: 2
        },
        {
            enunciado: 'Dentro de um web component, para que serve um <slot>?',
            alternativas: [
                'Receber conteúdo personalizado vindo de fora do componente',
                'Guardar variáveis privadas da classe',
                'Isolar o CSS do documento principal'
            ],
            correta: 0
        }
    ]
};

export default prova;
