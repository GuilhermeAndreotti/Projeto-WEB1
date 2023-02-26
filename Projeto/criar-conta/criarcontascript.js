import {app, auth} from '../config/firebase.js'
import {createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js"
import {db} from '../config/firebase.js'
import { addDoc, collection, setDoc, doc} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";

var i = 0;
var j = 0;

const senhaInvalida = () =>{
    j = 0
    if(i == 0){
        document.getElementById('aviso').innerHTML =
        '<h5 style = "color:#FD7979; margin-left:40%;font-size: 24px;"> Email e/ou Senha não confere! </h5>';
    }
    i = 1;
}

const senhaInvalida2 = () =>{
    i = 0
    if(j == 0){
        document.getElementById('aviso').innerHTML = 
        '<h5 style = "color:#FD7979; margin-left:40%;font-size: 24px;"> Campo(s) em branco ou inválido(s)! </h5>';
    }
    j = 1;
}

const retornaNomeCompleto = () =>{
    return document.getElementById("inputNome").value
}

const retornaSexoEscolhido = () =>{
    
    let checkedSexo = null;
    
    if(document.querySelector('.form1Radio:checked')){
        if(document.querySelector('.form1Radio:checked').value == 1){
            checkedSexo = "Masculino";
        }else{
            checkedSexo = "Feminino";
        }
    }    
    return checkedSexo

}

const ValidaVazio = () =>{

    let senha1 = document.getElementById("senha1").value
    let senha2 = document.getElementById("senha2").value
    let nomeCompleto = retornaNomeCompleto()
    let genero = retornaSexoEscolhido()
    let nascimento = retornaDataNasc()

    if(senha1 == "" || senha2 == "" || senha1 != senha2 || nomeCompleto == "" || genero == null || nascimento == ""){
        return (false)
    }else{
        return (true)
    }

}

const  ValidaConta = () =>{

    let email = document.getElementById("email").value

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        return (true)
    }else{
        return (false)
    }
    return (false)
}

const retornaDataNasc = () =>{
    let Nasc = document.getElementById("data1").value
    let dataNasc = Nasc.split("-").reverse().join("-")
    return dataNasc
}

const preenche = () =>{

    let email = document.getElementById("email").value
    let senha1 = document.getElementById("senha1").value
    let senha2 = document.getElementById("senha2").value
    let nomeCompleto = retornaNomeCompleto()
    let genero = retornaSexoEscolhido()
    let nascimento = retornaDataNasc()
    

    if(ValidaConta() == false){
        senhaInvalida()
    }else if(ValidaVazio() == false){
        senhaInvalida2()
    }else{
        createUserWithEmailAndPassword(auth, email, senha1)
        .then((user) => {           
                sessionStorage.setItem("user", auth.currentUser.uid);
                cadastrar(email, nomeCompleto, nascimento, genero)            
        })
        .catch((error) => {
            if (error.code === "auth/email-already-in-use"){
                senhaInvalida()
            }              
        })
    }  
 }

 const cadastrar = (email, nome, nascimento, genero) => {
    
    setDoc(doc(db, "usuarios", auth.currentUser.uid), {
        useremail: email,
        usernome: nome,
        userdataNascimento: nascimento,
        usergenero: genero
    })
    .then((result) => {
        console.log(JSON.stringify(result))
        window.location.href = "../home/home.html"
    })
    .catch((error) => {
        alert(error)
    })
}

window.onload = () => {
  
    /* Criar o topo da página */
    let header1 = document.getElementById("criatopo")
    header1.appendChild(criaHeader(header1, 0))
    
    document.getElementsByClassName("botaoembaixo")[0].addEventListener('click', preenche)
    document.getElementById("goIndex").addEventListener('click', goHome)
}
