class TentativaDeUpoload {
    constructor() {
        this.intervalo = 1000; // começa em 1s
        this.IntervaloMaximo = 60 * 1000; // nao demora mais de 1 minuto 
    }
    /**
    *
    Chame a função depois de esperar
    *
    * @param {function} fn Função para invocar
    */
    retry(fn) {
        setTimeout(fn, this.intervalo);
        this.intervalo = this.proximoIntervalo();
    }
    /**
    * Reinicie o contador (por exemplo, após uma solicitação bem-sucedida).
    */
    reinicia() {
        this.intervalo = 1000;
    }
    /**
    * Calcule o próximo tempo de espera.
    * @return {number} Próximo intervalo de espera, em milissegundos
    *
    * @private
    */
    proximoIntervalo() {
        var intervalo = this.intervalo * 2 + this.gerarIntAleatorio(0, 1000);
        return Math.min(intervalo, this.IntervaloMaximo);
    }
    /**
    * Obtenha um int aleatório no intervalo de mín. A máx. Usado para adicionar jitter aos tempos de espera.
    *
    * @param {number} min Lower bounds
    * @param {number} max Upper bounds
    * @private
    */
    gerarIntAleatorio(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
