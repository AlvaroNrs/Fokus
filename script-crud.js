//Encontrar o botão "Adicionar tarefa"

const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const btnCancelarTarefa = document.querySelector('.app__form-footer__button--cancel');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textArea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');

const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTodas = document.querySelector('#btn-remover-todas');

//Array de Tarefas
//JSON.parse faz o inverso do stringfy: pega uma string em formato de JSON e a transforma de volta numa lista
//Se não houver uma lista salva, o Js considera o array vazio
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

function atualizarTarefas () {
    //Armazanando a lista de tarefas no armazanamento local*
    //O primeiro valor do setItem é a chave, enquanto o segundo é o valor em si
    localStorage.setItem('tarefas', JSON.stringify(tarefas));

    /* *Por padrão, a localStorage armazena objetos complexos (neste caso, um array) como uma string. 
    *   Para se evitar isto, deve-se chamar a função de conversão (stringfy) para que, depois, a string possa
        ser transformada de volta em um array
        
        A função está dentro de uma API chamada JSON*/
}

function limparFormulario() {
    textArea.value = '';
    formAdicionarTarefa.classList.add('hidden');
}

function criarElementoTarefa(tarefa) 
{
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
        <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
    </svg>`;

    const paragrafo = document.createElement('p');
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description');

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');

    //Sobrescrevendo o evento de clique do botão
    botao.onclick = () => {
        //Inicia a depuração dentro do navegador
        debugger
        const novaDescricao = prompt("Qual é o novo nome da tarefa?");
        //Dica de Debug
        //console.log('Nova Descrição da tarefa: ', novaDescricao);
        //Uma string vazia ou com valor null é falsa
        if(novaDescricao) {
            paragrafo.textContent = novaDescricao;
            //Atualizando o texto da tarefa
            tarefa.descricao = novaDescricao;
            //Atualizando a Tarefa
            atualizarTarefas();
        }
    };

    btnCancelarTarefa.addEventListener('click', () => {
        limparFormulario();
    });

    const imagemBotao = document.createElement('img');
    imagemBotao.setAttribute('src', '/imagens/edit.png');

    //Adicionando elementos html dentro de um elemento
    botao.append(imagemBotao);

    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    //Caso a tarefa já estiver completa quando a página for carregada, a deixa visualmente correta
    //e com seu botão já desabilitado
    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete');
        li.querySelector('button').setAttribute('disabled', 'disabled');
    } else {
        li.onclick = () => {
            //Para cada elemento encontrado com a classe marcada, faz...
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active');
                });
            if(tarefaSelecionada == tarefa) {
                paragrafoDescricaoTarefa.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return;
            }
    
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;
            paragrafoDescricaoTarefa.textContent = tarefa.descricao;
            
            li.classList.add('app__section-task-list-item-active');
        }
    }

    return li;
}
/*
<li class="app__section-task-list-item">
    <svg>
        
    </svg>
    <p class="app__section-task-list-item-description">
        Estudando localStorage
    </p>
    <button class="app_button-edit">
        <img src="/imagens/edit.png">
    </button>
</li>*/


btnAdicionarTarefa.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden');
});

formAdicionarTarefa.addEventListener('submit', (evento) => {
    //Impdere o comportamento padrão de uma função no botão (neste caso, o padrão de recarregar a página)
    evento.preventDefault();
    //Pegando o valor dentro de um campo e armazenando-o em uma variável
    //const descricaoTarefa = textArea.value;

    const tarefa = {
        descricao: textArea.value
    }
    //Adiciona a tarefa criada ao Array
    tarefas.push(tarefa);
    //Adicionando a tarefa na tela
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);

    //Atualizando as tarefas
    atualizarTarefas();

    //Limpando o textArea e escondendo o formulário
    limparFormulario();
    formAdicionarTarefa.classList.add('hidden');

});

tarefas.forEach( element => {
    const elementoTarefa = criarElementoTarefa(element);
    ulTarefas.append(elementoTarefa);
});

document.addEventListener('FocoFinalizado', () => {
    if(tarefaSelecionada && liTarefaSelecionada) {
        //Atualizando o li após a tarefa ser finalizada, além de desabilitar o botão de edição
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
        tarefaSelecionada.completa = true;
        atualizarTarefas(tarefaSelecionada);
    }
});

const removerTarefas = (somenteCompletas) => {
    //If Ternário
    //Caso somenteCompletas seja true, o seletor recebe a primeira classe. Do contrário, recebe a outra classe
    const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item";
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove();
    });
    //Filtrando as tarefas para armazenar na variável apenas as concluídas
    //Se for para limpar apenas as completas, aplica o filtro primeiro. Do contrário, as tarefas recebem um array vazio
    //(e esse array será salvo na LocalStorage como o novo valor da lista)
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [];
    atualizarTarefas();
}

btnRemoverConcluidas.onclick = () => removerTarefas(true);
btnRemoverTodas.onclick = () => removerTarefas(false);
