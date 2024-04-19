
const html = document.querySelector('html');

const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const displayTempo = document.querySelector('#timer');
const botoes = document.querySelectorAll('.app__card-button');
const startPauseBt = document.querySelector('#start-pause');

const cardTimer = document.querySelector('.app__card-primary-button');
const titulo = document.querySelector('.app__title');
const iniciarOuPausarBt = document.querySelector('#start-pause span');
const iniciarOuPausarBtIcone = document.querySelector('.app__card-primary-butto-icon'); 
const tempoNaTela = document.querySelector('#timer');

/*Controle de áudio e o arquivo de áudio*/
const musicaFocoInput = document.querySelector('#alternar-musica');
const musica = new Audio('./sons/luna-rise-part-one.mp3');
/*Garante que a música fique em loop o tempo inteiro*/
musica.loop = true;
/*Para pegar qualquer arquivo dentro do Js: readFile()
Entretanto, não é recomendável neste caso pois o arquivo será carregado junto à pagina.
Ou seja, pode gerar atrasos de renderização da mesma
*/

const audioTempoFinalizado = new Audio('./sons/beep.mp3');
const audioPlay = new Audio('./sons/play.wav');
const audioPausa = new Audio('./sons/pause.mp3');

let tempoDecorridoEmSegundos = 1500;
let intervaloId = null;


musicaFocoInput.addEventListener('change', () => {
    //A música só da play se estiver pausada
    if(musica.paused){
        musica.play();
    } else {
        musica.pause();
    }

});


/*Evento de Clique*/
focoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1500;
    alterarContexto('foco');
    focoBt.classList.add('active');
});

curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300;
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');

});

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900;
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
});

function alterarContexto(contexto) {
    mostrarTempo();
    botoes.forEach(function (contexto) {
        contexto.classList.remove('active');
    })
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `./imagens/${contexto}.png`);
    switch (contexto) {
        case "foco":
            titulo.innerHTML = 
            `Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>`;
        break;
        case "descanso-curto":
            titulo.innerHTML = 
            `Que tal dar uma respirada?<br>
            <strong class="app__title-strong">Faça uma pausa curta!</strong>`;
        break;
        case "descanso-longo":
            titulo.innerHTML = 
            `Hora de voltar à superfície.<br>
            <strong class="app__title-strong">Faça uma pausa longa.</strong>`;
        break;

    }
}

const contagemRegressiva = () => {
    if(tempoDecorridoEmSegundos <= 0){
        audioTempoFinalizado.play();
        alert('Tempo finalizado!');
        zerar();
        return;
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();
}

startPauseBt.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
    if (intervaloId) {
        zerar();
        audioPausa.play();
        return;
    }

    /*setInterval realiza uma função a cada certo período de tempo.
    Esse tempo é sempre passado em milisegundos*/
    intervaloId = setInterval(contagemRegressiva, 1000);
    audioPlay.play();
    iniciarOuPausarBt.textContent = "Pausar";
    iniciarOuPausarBtIcone.setAttribute('src', './imagens/pause.png');
}

/* Zera o intervalo e o retorna ao estado inicial de null */
function zerar() {
    clearInterval(intervaloId);
    iniciarOuPausarBt.textContent = "Começar";
    iniciarOuPausarBtIcone.setAttribute('src', './imagens/play_arrow.png');
    intervaloId = null;
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos*1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute:'2-digit', second: '2-digit'});
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();
