import {app, auth} from '../config/firebase.js'
import {signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js"

var i = 0;

const getEmail = () =>{
    return document.getElementById("email").value
}

const getSenha = () =>{
    return document.getElementById("senha").value
}

const entrar = () =>{ 
           
        let email = getEmail()
        let senha = getSenha()

        // auth é passado o endereço, que vem do arquivo firebase.
        signInWithEmailAndPassword(auth, email, senha)
        .then( (user) => {
            sessionStorage.setItem("user", auth.currentUser.uid);
            window.location.href = "../home/home.html"
        })
        .catch( (error) => {
            if(i < 1){
                document.getElementsByClassName("flex-filho-Entradas")[0].innerHTML += 
                '<h5 style = "color:#FD7979; text-align:center; padding-right: 15%; font-size: 24px"> Email e/ou senha inválidos </h5>';
            }
            i = 1;
        })
        .finally( () => {

        })

}

const trocaSenha = () =>{ 
    
    const email = getEmail()

    sendPasswordResetEmail(auth, email)
    .then(() => {
        document.getElementsByClassName("flex-filho-Entradas")[0].innerHTML += 
        '<h5 style = "color:#FD7979; text-align:center; padding-right: 15%; font-size: 24px"> Foi enviado um email para sua conta! </h5>';
    })
    .catch(() => {
        document.getElementsByClassName("flex-filho-Entradas")[0].innerHTML += 
        '<h5 style = "color:#FD7979; text-align:center; padding-right: 15%; font-size: 24px"> Houve um erro! </h5>';
    })
}

const goSenhaTela = () =>{  
    document.location = "../recuperar-senha/recuperarsenha.html"   
}

window.onload = () => {

    /* Função para criar o topo */
    let header1 = document.getElementById("criatopo")
    header1.appendChild(criaHeader(0))     
    
    document.getElementById("goIndex").addEventListener('click', goHome)
    if(sessionStorage.getItem("recuperar") == 1){
        document.getElementsByClassName("botaoembaixo")[0].addEventListener('click', trocaSenha)
    }else{
        document.getElementsByClassName("botaoembaixo")[0].addEventListener('click', entrar)
    }
    
    document.getElementById("goSenha").addEventListener('click', goSenhaTela)
    
}
