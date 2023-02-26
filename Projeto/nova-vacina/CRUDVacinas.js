
import { db, storage } from '../config/firebase.js'
import { addDoc, collection, getDoc, doc, updateDoc, deleteDoc} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import {app, auth} from '../config/firebase.js'
import {signOut} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js"
import { uploadBytes, ref, getDownloadURL, deleteObject, uploadBytesResumable, getStorage} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";

var i = 0;
var j = 0;
var file = null;
var url = null;
var pathFoto = null;


const returnNomeVac = () =>{
    return document.getElementById("nomeVac").value
}

const retornaDoseEscolhida = () =>{
    
    let checkedDose = "t";
    let escolha = document.querySelector('.form2Radio:checked').value
    
    if(escolha == 1){
        checkedDose = "1a. Dose";
    }
    else if(escolha == 2){
        checkedDose = "2a. Dose";
    }
    else if(escolha == 3){
        checkedDose = "3a. Dose";
    }
    else if(escolha == 4){
        checkedDose = "Reforço";
    }
    else if(escolha == 5){
        checkedDose = "Dose única";
    }

    return checkedDose
}

const returnData1 = () => {
    let data1 = document.getElementById("data1").value
    return data1;
}

const returnData2 = () => {
    let data2 = document.getElementById("data2").value
    return data2;
}

const returnURL = () =>{
    return url
}

const returnPathFoto = () =>{
    return pathFoto
}

const setPathFoto = (path) =>{
    pathFoto = path;
}
const setURL = (imagem) =>{
    url = imagem;
}


const senhaInvalida2 = () =>{
    if(j == 0){
        document.getElementById('aviso').innerHTML = 
        '<h5 style = "color:#FD7979; margin-left:35%;font-size: 24px;"> Campo(s) em branco ou inválido(s)! </h5>';
    }
    j = 1;
}

const abrirPopUp = (valor) => {
    /* Pega a div popup, deixa o background transparente e tira o display none */
    const popup = document.getElementById("popup")
    popup.className = "popUpBackground"
    popup.style.display = "block";
    /*Coloca nessa div os elementos que serão criados dinamicamente pela função */

    if(valor == 2){
        popup.appendChild(criaPopUpLoading())
    }else{
        popup.appendChild(criaPopUp())
    }
    
}

const nomeaImagem = () =>{
    const nomeimg = "img" + Date.now().toString(8) + Math.random().toString(8)
    return nomeimg.replace(/\./g, '')
}

// cadastro
const cadastrar = () =>{
    if(returnNomeVac() == "" || returnData1() == "" || file == null){       
        senhaInvalida2()
    }else{        
        // Declarar imagem e pegar do storage
        const fileRef = "images/" + nomeaImagem() //onde ta no storage
        // Manda o arquivo para o storage, com base no file
        const uploadBarra = uploadBytesResumable(ref(storage, fileRef), file)

        uploadBarra.on('state_changed',
        (snapshot) => {
            abrirPopUp(2)
            const barprogress = (snapshot.bytesTransferred/snapshot.totalBytes)*100
            let carregando = document.getElementById("progressBar")
            carregando.value = Math.trunc(barprogress)
        },
        (error) => {
            alert("Erro ao enviar arquivo: " + error)
        },
        () => {
            getDownloadURL(ref(storage, fileRef))   
                .then((url) => {

                    pathFoto = fileRef;
                    let data1 = returnData1()
                    let data2 = returnData2()                    
                    data1 = data1.split("-").reverse().join("/")
                    
                    data2 = data2.split("-").reverse().join("/")

                    addDoc(collection(db, "usuarios/"+auth.currentUser.uid+"/vacinas"), {
                        nomeVac: returnNomeVac(),
                        dataVac: data1,
                        dose: retornaDoseEscolhida(),
                        proxVac: data2,
                        urlFoto: url,
                        pathFoto: fileRef
                    })
                    .then((result) => {
                        console.log("Result = " + JSON.stringify(result))
                        minhasvacinas()
                    })
                    .catch((error) => {
                        console.log("Houve um erro com o cadastro" + error)
                        senhaInvalida2()
                    })
                }).catch((error) => {
                    alert("Houve o seguinte erro com a URL: " + error)
                    senhaInvalida2()
                })
            }
        )   
    }
}

const excluirVacinas = (id) =>
{   
    deleteObject(ref(storage, pathFoto))
        .then(() => 
        {
            deleteDoc(doc(db, "usuarios/"+sessionStorage.getItem("user")+"/vacinas", id))
                .then(() => {
                    window.location.href = "../home/home.html"
                })
                .catch((error) => {
                    alert("Erro ao excluir documento: " + error)
                })
        })
        .catch((error) => {
            alert("Erro ao excluir o arquivo.")
        })
}

const editarVacina = () =>{

    var id = sessionStorage.getItem("idVacina")
    let data1 = returnData1()
    let data2 = returnData2()                    
    data1 = data1.split("-").reverse().join("/")
    data2 = data2.split("-").reverse().join("/")

    if(returnNomeVac() == "" || returnData1() == ""){       
        senhaInvalida2()
    }else{
        if (file != null){
            const uploadBarra =  uploadBytesResumable(ref(storage, returnPathFoto()), file)
            uploadBarra.on('state_changed',
                (snapshot) =>
                {
                    abrirPopUp(2)
                    const barprogress = (snapshot.bytesTransferred/snapshot.totalBytes)*100
                    let carregando = document.getElementById("progressBar")
                    carregando.value = Math.trunc(barprogress)
                },
                (error) =>{
                    alert("Ocorreu um erro ao enviar o arquivo: " + error)
                },
                () => {                
                    updateDoc(doc(db, "usuarios/"+sessionStorage.getItem("user")+"/vacinas", id), 
                    {
                        nomeVac: returnNomeVac(),
                        dataVac: data1,
                        dose: retornaDoseEscolhida(),
                        proxVac: data2,
                        urlFoto: returnURL(),
                        pathFoto: returnPathFoto()
                    })
                    .then(() => {
                        window.location.href = "../home/home.html"
                    })
                    .catch((error) => {
                        alert("Erro ao atualizar o documento: " + error)
                    })
                }
            )
        }else{
            updateDoc(doc(db, "usuarios/"+sessionStorage.getItem("user")+"/vacinas", id), {
                nomeVac: returnNomeVac(),
                dataVac: data1,
                dose: retornaDoseEscolhida(),
                proxVac: data2,
                //urlFoto: returnURL(),
                //pathFoto: returnPathFoto()
            })
                .then(() =>{
                    abrirPopUp(2)  
                    let carregando = document.getElementById("progressBar")
                    carregando.value = 100
                    window.location.href = "../home/home.html"
                })
                .catch((error) => 
                {
                    alert("Erro ao atualizar a vacina: " + error)
                })
        }
    }

}

// preencher campo ao carregar pagina
const preencheCampos = (id) =>{
    /* https://www.freecodecamp.org/news/how-to-reverse-a-string-in-javascript-in-3-different-ways-75e4763c68cb/*/
      
    getDoc(doc(db, "usuarios/"+sessionStorage.getItem("user")+"/vacinas", id))
        
        .then((documento) =>{

            let data1 = documento.data().dataVac
            let data2 = documento.data().proxVac
            data1 = data1.split("/").reverse().join("-")
            data2 = data2.split("/").reverse().join("-")
            document.getElementById("data1").value = data1
            document.getElementById("nomeVac").value = documento.data().nomeVac
            document.getElementById(documento.data().dose).checked = true
            document.getElementById("data2").value = data2
            setURL(documento.data().urlFoto)
            document.getElementById("img-cad").src = documento.data().urlFoto
            setPathFoto(documento.data().pathFoto)

        })
        .catch((error) => {
            alert("Erro ao recuperar o documento: " + error)
        })  
}
// Fim das funções de cadastro, editar, excluir.


document.getElementById('abrirFile').onclick = function(){
    document.getElementById('my_file').click();
}


// Verifica o auth se existe o atual usuario logado.
const checarSeEstaLogado = () => {
    auth.onAuthStateChanged(function(user) {
        if(!auth.currentUser)
            window.location.href = "../entrar/entrar.html"
        })
}  

/* Voltar para a tela principal */
const logout = () =>{
    signOut(auth)
}

const fechar = () => {
    document.getElementById("popup").style.display = "none"
}

const minhasvacinas = () =>{
    document.location = "../home/home.html"
}

const criaPopUp = () => {
    let flexPop = document.createElement("div") 
    flexPop.classList.add("flex-pop")

    let flexPopupBranco = document.createElement("div")  
    flexPopupBranco.classList.add("popup-janela")

    let pPergunta = document.createElement("p")
    pPergunta.classList.add("pPergunta")
    pPergunta.innerHTML = "Tem certeza que deseja remover essa vacina?"

    let divSimCancelar = document.createElement("div")
    divSimCancelar.classList.add("divSimCancelar")

    let criaBotaoSim = document.createElement("button")
    criaBotaoSim.innerHTML = "SIM"
    criaBotaoSim.classList.add("popupSim")  

    let criaBotaoCancelar = document.createElement("button")
    criaBotaoCancelar.innerHTML = "CANCELAR"
    criaBotaoCancelar.classList.add("popupCancelar")

    flexPopupBranco.appendChild(pPergunta)
    divSimCancelar.appendChild(criaBotaoSim)
    divSimCancelar.appendChild(criaBotaoCancelar)
    flexPopupBranco.appendChild(divSimCancelar)
    criaBotaoCancelar.onclick = () => fechar() /* Função para fechar o popup, deixando sem o fundo transparente */
    criaBotaoSim.onclick = () => excluirVacinas(sessionStorage.getItem("idVacina"))
    flexPop.appendChild(flexPopupBranco)
    return flexPop
    
}

const criaPopUpLoading = () =>{

    let flexPop = document.createElement("div") 
    flexPop.classList.add("flex-pop")

    let flexPopupBranco = document.createElement("div")  
    flexPopupBranco.classList.add("popup-janela")

    let pPergunta = document.createElement("p")
    pPergunta.classList.add("pPergunta")
    pPergunta.innerHTML = "Loading..."
    pPergunta.style.color = "blue"
    
    flexPop.style.height = "400px"
    flexPop.style.width = "50%"
    flexPop.style.paddingLeft = "25%"
    flexPop.style.marginTop = "10%"
 
    let progresso = document.createElement("progress")
    progresso.value = "0"
    progresso.max = "100"
    progresso.setAttribute("id", "progressBar");

    flexPopupBranco.appendChild(pPergunta)
    flexPopupBranco.appendChild(progresso)
    flexPop.appendChild(flexPopupBranco)

    return flexPop
    
}


window.onload = () => { 
    checarSeEstaLogado()   
    let header1 = document.getElementById("criatopo")
    header1.appendChild(criaHeader(2))      
    let editCad = 2;
    editCad = sessionStorage.getItem("editarCadastrar") /* Variavel para defiinir se irá abrir a tela como cadastro ou editar */

    document.getElementById("botao-logout").addEventListener('click', logout)
    document.getElementById("goIndex").addEventListener('click', goMinhasVacinas)
    document.getElementById("botao-vacinas").addEventListener('click', goMinhasVacinas)

    if(editCad == 2){ 
        /* Se for cadastro */
        document.getElementsByClassName("botaoembaixo")[0].addEventListener('click', cadastrar)
        document.getElementsByClassName("botao-excluir")[0].style.display = "none";
        document.getElementById("div-botao").innerHTML = '<br><br>'
        document.getElementsByClassName("botaoembaixo")[0].innerHTML = 'Cadastrar'

    }else{
        /* Se for Editar */
        document.getElementById("excluir").addEventListener('click', abrirPopUp)
        preencheCampos(sessionStorage.getItem("idVacina"))
        document.getElementsByClassName("botaoembaixo")[0].addEventListener('click', editarVacina)  
    }

    document.getElementById("my_file").addEventListener('change', function(event){
        file = event.target.files[0]
        document.getElementById("img-cad").src = URL.createObjectURL(file)
    })

    var filhos = document.getElementById("optRadio").childNodes
    
    for(i of filhos){
        i.addEventListener('change', function(event)
        {
            if(event.target.getAttribute('id') == "Dose única" && event.target.checked == true){ 
                document.getElementById("data2").value = "";
                document.getElementById("prox").style.display = "none";
                document.getElementById("data2").style.display = "none";
            }else{
                document.getElementById("prox").style.display = "block";
                document.getElementById("data2").style.display = "flex";              
            }
        })
    }
}