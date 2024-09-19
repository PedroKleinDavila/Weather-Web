const login = document.getElementById("login");
login.addEventListener('focus', () => {
    login.classList.remove('vermelho');
    login.placeholder='';
});
const password = document.getElementById("password");
password.addEventListener('focus', () => {
    password.classList.remove('vermelho');
    password.placeholder='';
});
async function verificaLogin() {
    login1=String(document.getElementById("login").value);
    password1=String(document.getElementById("password").value);
    if(login1.length>0){
        if(password1.length>0){
            let dados;
            await fetch("http://localhost:8080",{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "login": login1,
                    "password": password1
                })
            }).then(response => response.json())
            .then(data => dados=data)
            .catch(error => console.error('Error:', error));
            if(dados.status==500){
                login.classList.add('vermelho');
                login.value = "";
                login.placeholder = "Invalid Login";
            }
            else{window.location.href="login.html";}
        }else{
            password.classList.add('vermelho');
            password.value = "";
            password.placeholder = "Invalid Password";
        }
    }else{
        login.classList.add('vermelho');
        login.value = "";
        login.placeholder = "Invalid Login";
    }
}