const login2 = document.getElementById("login");
login2.addEventListener('focus', () => {
    login2.classList.remove('vermelho');
    login2.placeholder='';
});
const password2 = document.getElementById("password");
password2.addEventListener('focus', () => {
    password2.classList.remove('vermelho');
    password2.placeholder='';
});
const erro= document.getElementById("erro");
erro.addEventListener('focus', () =>{
    erro.classList.add('apaga');
})
async function verificaLogin() {
    let dados;
    let login1=String(document.getElementById("login").value);
    let password1=String(document.getElementById("password").value);
    await fetch("http://localhost:8080",{
        method:"GET"
    }).then(response => response.json())
    .then(data => dados=data)
    .catch(error => console.error('Error:', error));
    let tam=dados.length;
    let bol=false;
    let posicao=-1;
    for(var i=0;i<tam;i++){
        if(login1===dados[i].login&&password1===dados[i].password){
            bol=true;
            posicao=i;
        }
    }
    if(bol){window.location.href="loggedIn.html";}
    else{
        password2.classList.add('vermelho');
        password2.value = "";
        login2.classList.add('vermelho');
        login2.value = "";
        erro.classList.remove('apaga');
    }
    localStorage.setItem('data',posicao);
}