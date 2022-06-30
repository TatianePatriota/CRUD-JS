const cadastro = () => document.getElementById('ativar').classList.add('adiciona-cliente-ativo');
const fechaCadastro = () => {
    limpaFormulario()
    document.getElementById('ativar').classList.remove('adiciona-cliente-ativo');
}
const forms = document.getElementById('form');


document.getElementById('cadastrarCliente').addEventListener('click', cadastro);
document.getElementById('fechar').addEventListener('click', fechaCadastro);

function getLocalStorage() {
    if(JSON.parse(localStorage.getItem("idCliente"))){
        return JSON.parse(localStorage.getItem("idCliente"));
    }else{
        return [];
    }
}

function setLocalStorage(clienteCriado){
    return localStorage.setItem("idCliente", JSON.stringify(clienteCriado));
}

function criaCliente(client) {
    const clienteCriado = getLocalStorage();
    clienteCriado.push(client);
    setLocalStorage(clienteCriado);
    criaLinhaTabela(client)
};

function leCliente(){
    return getLocalStorage();
} 

function atualizaCliente(index, client) {
    const clienteCriado = leCliente();
    clienteCriado[index] = client;
    setLocalStorage(clienteCriado);
};

function deletaCliente(index) {
    const clienteCriado = leCliente();
    clienteCriado.splice(index, 1);
    setLocalStorage(clienteCriado);
}

function campoValido() {
    return forms.reportValidity();
}

function limpaFormulario(){
    const inputCampos = document.querySelectorAll('.input-cliente');
    inputCampos.forEach(campo => campo.value = '');
}

const botaoSalvar = document.getElementById('salvar');
botaoSalvar.addEventListener('click', adicionaCliente);

function adicionaCliente () {
    if(campoValido()){
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value,
        }
        const index = document.getElementById('nome').dataset.index;
        if(index == 'novo'){
            criaCliente(client);
            atualizaTabela();
            fechaCadastro();
        }else{
            atualizaCliente(index, client);
            atualizaTabela();
            fechaCadastro();
        };
    }
}

function criaLinhaTabela(client, index) {
    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button button-verde" id="editar-${index}">Editar</button>
            <button type="button" class="button button-vermelho" id="excluir-${index}">Excluir</button>
        </td>
    `;
    document.querySelector('#tabela-cliente>tbody').appendChild(novaLinha);
     
}

function limpaTabela() {
    const linhas = document.querySelectorAll('#tabela-cliente>tbody tr');
    linhas.forEach(linha => linha.parentNode.removeChild(linha))
}

function atualizaTabela() {
    const clienteCriado = leCliente();
    limpaTabela()
    clienteCriado.forEach(criaLinhaTabela)
}

function preencheCampos(client){
    document.getElementById('nome').value = client.nome;
    document.getElementById('email').value = client.email;
    document.getElementById('celular').value = client.celular;
    document.getElementById('cidade').value = client.cidade;
    document.getElementById('nome').dataset.index = client.index;
}

document.querySelector('#tabela-cliente>tbody').addEventListener('click', editarEExcluir)
function editarEExcluir(event) {
    if(event.target.type == 'button'){
        const [acao, index] = event.target.id.split('-');
        if(acao == 'editar'){
            const client = leCliente ()[index];
            client.index = index;
            preencheCampos(client);
            cadastro();
        }else{
            const client = leCliente()[index];
            const confirmaExclusao = confirm(`Deseja realmente excluir o cliente ${client.nome}`);

            if(confirmaExclusao){
                deletaCliente(index);
                atualizaTabela();
            }
        }
    }
}
atualizaTabela();



