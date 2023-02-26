const criaHeader = (valor) =>{   
      
    let header1 = document.createElement("div")
    header1.classList.add("divHeader")
    let geral = document.createElement("div")
    geral.classList.add("geral")
    geral.innerHTML = '<img src="../img/icon-vaccine.png" class="Logo"/> MyHealth'
    geral.setAttribute("id", "goIndex")

    let criaul = document.createElement("ul")
    let criali = document.createElement("li")
    let criali2 = document.createElement("li")
    let criabotao = document.createElement("button")
    criabotao.classList.add("botaotopo")
    let criabotao2 = document.createElement("button")
    criabotao2.classList.add("botaotopo2")
    
    if(valor == 1){
        criabotao.innerHTML = "Já tenho conta" 
        criabotao.setAttribute("id", "goEntrar")
        criali.appendChild(criabotao) 
        
    }else if(valor == 2){
        criabotao.innerHTML = "Minhas Vacinas"
        criabotao2.innerHTML = "Logout"
        criali.appendChild(criabotao)
        criali2.appendChild(criabotao2)
        criabotao.setAttribute("id", "botao-vacinas")
        criabotao2.setAttribute("id", "botao-logout")
    }
    
    header1.appendChild(geral)
    criaul.appendChild(criali)
    criaul.appendChild(criali2)
    header1.appendChild(criaul)  

    return header1
}

const goHome = () =>{   
    document.location = "../index/principal.html"   
}
const goContaLogin = () =>{   
    document.location = "../entrar/entrar.html" 
}

const goMinhasVacinas = () =>{   
    document.location = "../home/home.html" 
}