// Classe que representa uma questão de múltipla escolha
class Questao {
    enunciado;
    alternativas;
    // Propriedade privada: a resposta certa não pode ser lida nem alterada de fora da classe
    #correta;

    // Recebe um objeto literal { enunciado, alternativas, correta } do arquivo questoes.js
    constructor(dados) {
        this.enunciado = dados.enunciado;
        this.alternativas = dados.alternativas;
        this.#correta = dados.correta;
    }

    // Retorna true se a alternativa escolhida (índice) for a correta
    acertou(indice) {
        return indice === this.#correta;
    }

    // Retorna o texto da alternativa correta (usado para mostrar o gabarito)
    getRespostaCorreta() {
        return this.alternativas[this.#correta];
    }
}

export default Questao;
