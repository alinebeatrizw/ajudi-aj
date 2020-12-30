class TentativaDeUpoload {
    constructor() {
        this.intervalo = 1000; // comeÃ§a em 1s
        this.IntervaloMaximo = 60 * 1000; // nao demora mais de 1 minuto 
    }

    //Calcula o prÃ³ximo tempo de espera, em milissegundos
    proximoIntervalo() {
        var intervalo = this.intervalo * 2 + this.gerarIntAleatorio(0, 1000);
        return Math.min(intervalo, this.IntervaloMaximo);
    }

    //gera um int aleatÃ³rio no intervalo de mÃ­n. a mÃ¡x. Usado para adicionar jitter aos tempos de espera.
    gerarIntAleatorio(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}