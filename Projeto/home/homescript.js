
import {app, auth} from '../config/firebase.js'
import {signOut} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import {db} from '../config/firebase.js'
import {query, collection, onSnapshot, where} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js"

const arrayVacinas2 = []

const pesquisaVacina = () =>{
    
    document.getElementById("pesquisaBarra").addEventListener('keyup', () => {
        const pesquisaTexto = document.getElementById("pesquisaBarra").value.trim()
        showCardsVacinas(arrayVacinas2.filter(vacinas => vacinas.nome.includes(pesquisaTexto)))
    })
}

const carregaTodasVacinas = () => {
    
    const qy = query(collection(db, "usuarios/"+sessionStorage.getItem("user")+"/vacinas"))

    onSnapshot(qy, (results) => {
        results.forEach((documento) => {
            arrayVacinas2.push({
                id: documento.id,
                dataVac: documento.data().dataVac,
                nome: documento.data().nomeVac,
                dose: documento.data().dose,
                proxVac: documento.data().proxVac,
                url: documento.data().urlFoto,
            })
        })
        showCardsVacinas(arrayVacinas2)       
    })
}

const showCardsVacinas = (lista) =>{
    
    document.getElementsByClassName("grid")[0].innerHTML = ""
    
    lista.forEach((documento) => {
        cardVacina2(documento.nome, documento.id, documento.dataVac, documento.dose, documento.proxVac, documento.url)
    })
}

const cardVacina2 = (nome, id, dataVac, dose, proximaVacina, url) => {
    
    let nomeVacina = document.createElement("p")
    nomeVacina.classList.add("nomeVacina")
    let pDose = document.createElement("p")
    pDose.classList.add("Dose")
    let pData = document.createElement("p")
    pData.classList.add("Data")
    let pProxVacina = document.createElement("p")
    pProxVacina.classList.add("ProximaDose")
    let divInterna = document.createElement("div")
    divInterna.classList.add("Imagem")

    const inputHiddenId = document.createElement("input")
    inputHiddenId.type = 'hidden'
    inputHiddenId.hidden = id

    /* Adiciona um conteúdo para os campos html criados */
    pDose.innerHTML = dose
    nomeVacina.innerHTML = nome
    pData.innerHTML = dataVac
    pProxVacina.innerHTML = proximaVacina
    divInterna.innerHTML = "<img class= 'imgv' src =" + url + "\>"

   fazAppend2(nomeVacina, pDose, pData, pProxVacina, divInterna, inputHiddenId, id)

}

const fazAppend2 = (nomeVacina, pDose, pData, pProxVacina, divInterna, inputHiddenId, id) => {

    const gridFilho = document.createElement("div")
    gridFilho.classList.add("grid-filho")

    /* Adciona o conteúdo no gridFilho, que é a classe div principal dos cards */
    gridFilho.appendChild(nomeVacina)
    gridFilho.appendChild(pDose)
    gridFilho.appendChild(pData)
    gridFilho.appendChild(divInterna)
    gridFilho.appendChild(pProxVacina)
    gridFilho.appendChild(inputHiddenId)
    gridFilho.onclick = () => editarVacinas(id)

    document.getElementsByClassName("grid")[0].appendChild(gridFilho)

}

/* onclick  para abrir tela de vacina com os dados da vacina clicada */
const editarVacinas = (id) => {
    sessionStorage.setItem("editarCadastrar", 1);
    sessionStorage.setItem("idVacina", id);
    document.location = "../nova-vacina/cadastro.html"
}

const cadastrarVacinas = () => {
    sessionStorage.setItem("editarCadastrar", 2);
    document.location = "../nova-vacina/cadastro.html"
}

const logar = () => {
    auth.onAuthStateChanged(function(user) {
        if(!auth.currentUser)
            window.location.href = "../entrar/entrar.html"
        })
}  

/* Voltar para a tela principal */
const logout = () => {
    signOut(auth)
}

/* Funções a serem executados quando a pagina é executada */
window.onload = () => {
    
    logar();
    
    let header1 = document.getElementById("criatopo")
    header1.appendChild(criaHeader(2))      
    
    //preenche();
    carregaTodasVacinas();
    
    document.getElementsByClassName("botaoembaixo")[0].addEventListener('click', cadastrarVacinas)
    
    pesquisaVacina()

    document.getElementById("botao-logout").addEventListener('click', logout)
    document.getElementById("botao-vacinas").addEventListener('click', goMinhasVacinas)
    document.getElementById("goIndex").addEventListener('click', goMinhasVacinas)
}
