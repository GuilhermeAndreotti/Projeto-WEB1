const goCriar = () => {
    document.location = "../criar-conta/criarconta.html"
}

window.onload = () => {
    
    let header1 = document.getElementById("criatopo")
    header1.appendChild(criaHeader(1))    
    
    document.getElementById("goEntrar").addEventListener('click', goContaLogin)
    document.getElementsByClassName("botaoembaixo")[0].addEventListener('click', goCriar)

}