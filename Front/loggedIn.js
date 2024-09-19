const apiKey = "a510d6f748149777617549e156ce784f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";
const apiTimeUrl = `https://timeapi.io/api/time/current/coordinate?latitude=`;
function pesquisa() {
    var city = document.getElementById("input").value;
    verificaTempo(city);
}

const input = document.querySelector("input");
input.addEventListener('focus', () => {
    input.classList.remove('vermelho');
    const favImg = document.querySelector('button img');
    favImg.src = "./assets/fav-vazio.svg";
    document.getElementById("search-button").disabled=true;
});

let verificaPesquisa=false;
async function verificaTempo(city) {
    try {
        clearInterval(intervalo);
        const input = document.querySelector("input");
        input.classList.remove('vermelho');
        const resultado = await fetch(apiUrl + "&appid=" + apiKey + "&q=" + city);
        const dados = await resultado.json();
        if (dados.cod != 200) {
            throw dados.cod;
        }
        verificaPesquisa=true;
        document.getElementById("search-button").disabled=false;
        var celcius = parseInt(dados.main.temp) + "°C";
        var cidade = dados.name;
        localStorage.setItem('cidade',cidade);
        var humidade = dados.main.humidity + "%";
        var vento = dados.wind.speed + "km/h";
        var ceu = dados.weather[0].main;
        localStorage.setItem('ceu',ceu);
        var lon = dados.coord.lon;
        var lat = dados.coord.lat;
        const resultadoTempo = await fetch(apiTimeUrl + lat + "&longitude=" + lon);
        const dadosTempo = await resultadoTempo.json();
        relogio(dadosTempo);
        const horario = document.querySelector('.relogio');
        horario.classList.remove('some');
        var hour = parseInt(dadosTempo.hour);
        localStorage.setItem('hour',hour);
        document.getElementById("temp").innerHTML = celcius;
        document.getElementById("city").innerHTML = cidade;
        document.getElementById("humidity").innerHTML = humidade;
        document.getElementById("wind").innerHTML = vento;
        var dia=dadosTempo.day;
        var mes=dadosTempo.month;
        var ano=dadosTempo.year;
        var diaMesAno=dia+"/"+mes+"/"+ano;
        await historico(cidade,diaMesAno,parseInt(dados.main.temp),parseInt(dados.main.humidity),ceu,parseFloat(vento),parseInt(hour));
        await pegaHistorico();
        if (hour > 5 && hour < 18) {
            ceuImg(ceu);
        } else {
            nightImg(ceu);
        }
    } catch (error) {
        console.log("Erro " + error);
        input.classList.add('vermelho');
        input.value = "";
        input.placeholder = "Inexistent city";
    }
}


async function ceuImg(ceu) {
    await pegaFavoritos();
    const itensHistorico = document.querySelectorAll('.item-geral');
    if (ceu == "Haze" || ceu == "Mist") {
        ceu = "HazeMist";
    }
    document.querySelector(".wind").classList.remove("image-display");
    document.querySelector(".humidity").classList.remove("image-display");
    document.getElementById("climai").classList.remove("image-display");
    switch (ceu) {
        case "Clear":
            document.getElementById("climai").src = "./assets/Sunday-Clear.svg";
            document.getElementById("dentro").style = "background:linear-gradient(#D5E5EE,#5EB8ED);";
            document.getElementById("fora").style = "background:linear-gradient(#5CC2FD,#FFFFFF);";
            itensHistorico.forEach((item) => {
                item.style = "background:linear-gradient(#D5E5EE,#5EB8ED);";
            });
            break;
        case "Rain":
            document.getElementById("climai").src = "./assets/RainDay.svg";
            document.getElementById("dentro").style = "background:linear-gradient(#86B1CA,#005C91);";
            document.getElementById("fora").style = "background:linear-gradient(#075980,#B2D0DD);";
            itensHistorico.forEach((item) => {
                item.style = "background:linear-gradient(#86B1CA,#005C91);";
            });
            break;
        case "Storm":
            document.getElementById("climai").src = "./assets/storm.svg";
            document.getElementById("dentro").style = "background:linear-gradient(#9C90F0,#142C98);";
            document.getElementById("fora").style = "background:linear-gradient(#02167A,#7E6ECF);";
            itensHistorico.forEach((item) => {
                item.style = "background:linear-gradient(#9C90F0,#142C98);";
            });
            break;
        case "Clouds":
            document.getElementById("climai").src = "./assets/CloudyDay.svg";
            document.getElementById("dentro").style = "background:linear-gradient(#BEE6EF,#303F4E);";
            document.getElementById("fora").style = "background:linear-gradient(#435356,#9BB5C5);";
            itensHistorico.forEach((item) => {
                item.style = "background:linear-gradient(#BEE6EF,#303F4E);";
            });
            break;
        case "HazeMist":
            itensHistorico.forEach((item) => {
                item.style = "background:linear-gradient(#ADD3D5,#65AFB5);";
            });
            mistHaze();
            break;

        case "Snow":
            itensHistorico.forEach((item) => {
                item.style = "background:linear-gradient(#D6F0FF,#00AEFF);";
            });
            snow();
            break;
        default:
            break;
    }
}


async function defaultApp() {
    await pegaFavoritos();
    await pegaHistorico();
    const itensHistorico = document.querySelectorAll('.item-geral');
    document.querySelector(".wind").classList.add("image-display");
    document.querySelector(".humidity").classList.add("image-display");
    document.querySelector("#climai").classList.add("image-display");
    document.getElementById("dentro").style = "background:linear-gradient(#2B3C45,#024360);";
    document.getElementById("fora").style = "background:linear-gradient(#3A4D68,#04283E);";
    itensHistorico.forEach((item) => {
        item.style = "background:linear-gradient(#2B3C45,#024360);";
    });
}

async function nightImg(night) {
    await pegaFavoritos();
    const itensHistorico = document.querySelectorAll('.item-geral');
    if (night == "Haze" || night == "Mist") {
        night = "HazeMist"
    }
    document.querySelector(".wind").classList.remove("image-display");
    document.querySelector(".humidity").classList.remove("image-display");
    document.getElementById("climai").classList.remove("image-display");
    switch (night) {
        case "Clear":
            document.getElementById("climai").src = "./assets/MoonNight-Clear.svg";
            document.getElementById("dentro").style = "background:linear-gradient(#06527E,#1D1B1B);";
            document.getElementById("fora").style = "background:linear-gradient(#000304,#0C6AA0);";
            itensHistorico.forEach((item) => {
                item.style = "background:linear-gradient(#06527E,#1D1B1B);";
            });
            break;
        case "Rain":
            document.getElementById("climai").src = "./assets/RainNight.svg";
            document.getElementById("dentro").style = "background:linear-gradient(#000000,#000681);";
            document.getElementById("fora").style = "background:linear-gradient(#015382,#08113F);";
            itensHistorico.forEach((item) => {
                item.style = "background:linear-gradient(#000000,#000681);";
            });
            break;
        case "Storm":
            document.getElementById("climai").src = "./assets/storm.svg";
            document.getElementById("dentro").style = "background:linear-gradient(#33394C,#000000);";
            document.getElementById("fora").style = "background:linear-gradient(#000000,#2F3352);";
            itensHistorico.forEach((item) => {
                item.style = "background:linear-gradient(#33394C,#000000);";
            });
            break;
        case "Clouds":
            document.getElementById("climai").src = "./assets/CloudyNight.svg";
            document.getElementById("dentro").style = "background:linear-gradient(#8D95A8,#161621);";
            document.getElementById("fora").style = "background:linear-gradient(#000000,#49555C);";
            itensHistorico.forEach((item) => {
                item.style = "background:linear-gradient(#8D95A8,#161621);";
            });
            break;
        case "HazeMist":
            itensHistorico.forEach((item) => {
                item.style = "background:linear-gradient(#ADD3D5,#65AFB5);";
            });
            mistHaze();
            break;
        case "Snow":
            itensHistorico.forEach((item) => {
                item.style = "background:linear-gradient(#D6F0FF,#00AEFF);";
            });
            snow();
            break;
        default:
            break;
    }

}


function mistHaze() {
    document.getElementById("climai").src = "./assets/HazeMist.svg";
    document.getElementById("dentro").style = "background:linear-gradient(#ADD3D5, #65AFB5);";
    document.getElementById("fora").style = "background:linear-gradient(#6F99A3,#DDE8EB);";
}
function snow() {
    document.getElementById("climai").src = "./assets/Snowing.svg";
    document.getElementById("dentro").style = "background:linear-gradient(#D6F0FF,#00AEFF);";
    document.getElementById("fora").style = "background:linear-gradient(#00A2FF,#FFFFFF);";
}

document.addEventListener('keydown', (e) => {
    if (e.key == "Enter") {
        pesquisa();
    }
});

let intervalo;

function relogio(dadosTempo) {
    const horas = document.querySelector('.horas');
    const minutos = document.querySelector('.minutos');
    const segundos = document.querySelector('.segundos');
    let num;
    if (parseInt(dadosTempo.hour) < 10) {
        num = parseInt(dadosTempo.hour);
        horas.innerText = `0${num}`;
    } else {
        horas.innerText = parseInt(dadosTempo.hour);
    }

    if (parseInt(dadosTempo.minute) < 10) {
        num = parseInt(dadosTempo.minute);
        minutos.innerText = `0${num}`;
    } else {
        minutos.innerText = parseInt(dadosTempo.minute);
    }

    if (parseInt(dadosTempo.seconds) < 10) {
        num = parseInt(dadosTempo.seconds);
        segundos.innerText = `0${num}`;
    } else {
        segundos.innerText = parseInt(dadosTempo.seconds);
    }

    intervalo = setInterval(addSeg, 1000);
    function addSeg() {
        if (parseInt(segundos.innerText) != 59) {
            if (parseInt(segundos.innerText) + 1 < 10) {
                let seg = parseInt(segundos.innerText) + 1;
                segundos.innerText = `0${seg}`;
            } else {
                segundos.innerText = parseInt(segundos.innerText) + 1;
            }
        } else {
            segundos.innerText = '00';
            if (parseInt(minutos.innerText) != 59) {
                if (parseInt(minutos.innerText) + 1 < 10) {
                    let min = parseInt(minutos.innerText) + 1;
                    minutos.innerText = `0${min}`;
                } else {
                    minutos.innerText = parseInt(minutos.innerText) + 1;
                }
            } else {
                minutos.innerText = '00';
                if (parseInt(horas.innerText) != 23) {
                    if (parseInt(horas.innerText) + 1 < 10) {
                        let hora = parseInt(horas.innerText) + 1;
                        horas.innerText = `0${hora}`;
                    } else {
                        horas.innerText = parseInt(horas.innerText) + 1;
                    }
                } else {
                    horas.innerText = '00';
                }
            }
        }
    }
}
let posicao = localStorage.getItem('data');
let id = dados();
async function dados() {
    let dados;
    await fetch("http://localhost:8080", {
        method: "GET"
    }).then(response => response.json())
        .then(data => dados = data)
        .catch(error => console.error('Error:', error));
    console.log(dados);
    id = dados[posicao].id;
    return id;
}
async function favoritos() {
    const favImg = document.querySelector('button img');
    if (favImg.getAttribute("src") == "./assets/fav-cheio.svg") {
        favImg.src = "./assets/fav-vazio.svg";
    } else {
        favImg.src = "./assets/fav-cheio.svg";
    }
    let cidade = localStorage.getItem('cidade');
    localStorage.removeItem('cidade');
    let bol = await verificaCidadeFavorita(cidade);
    if ((cidade != '') && bol) {
        novaCidadeFav(cidade);
    }
}
async function novaCidadeFav(cidade) {
    let dados;
    await fetch("http://localhost:8080/favorite", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "city": cidade,
            "id": id
        })
    }).then(response => response.json())
        .then(data => dados = data)
        .catch(error => console.error('Error:', error));
    await pegaFavoritos();
    var ceu=localStorage.getItem('ceu');
    var hour=localStorage.getItem('hour');
    atualizaFav(hour,ceu);
    localStorage.removeItem('ceu');
    localStorage.removeItem('hour');
}
async function verificaCidadeFavorita(city) {
    let dados;
    await fetch("http://localhost:8080", {
        method: "GET"
    }).then(response => response.json())
        .then(data => dados = data)
        .catch(error => console.error('Error:', error));
    let bol = true;
    if (dados[posicao].favorites.length != 0) {
        for (i = 0; i < dados[posicao].favorites.length; i++) {
            if (city.toLowerCase() == String(dados[posicao].favorites[i].city).toLowerCase()) {
                bol = false;
            }
        }
    }
    return bol;
}
async function pegaFavoritos() {
    let dados;
    await fetch("http://localhost:8080", {
        method: "GET"
    }).then(response => response.json())
        .then(data => dados = data)
        .catch(error => console.error('Error:', error));
    if (dados[posicao].favorites.length != 0) {
        document.getElementById("favoritos").innerHTML = "";
        dados[posicao].favorites.map(favorite => {
            var div = document.createElement("div");
            div.classList.add("item-favorito");
            div.classList.add("item-geral");
            div.innerHTML = favorite.city;
            div.onclick = function(){
                const cidade = div.innerHTML;
                document.getElementById("input").value=cidade;
                pesquisa();
            }
            document.getElementById("favoritos").appendChild(div);
        })
    }
}
async function pegaHistorico() {
    let dados;
    await fetch("http://localhost:8080", {
        method: "GET"
    }).then(response => response.json())
        .then(data => dados = data)
        .catch(error => console.error('Error:', error));
    if (dados[posicao].histories!=null&&dados[posicao].histories.length != 0) {
        document.getElementById("historico").innerHTML = "";
        dados[posicao].histories.map(hist => {
            var div = document.createElement("div");
            div.classList.add("item-historico");
            div.classList.add("item-geral");
            div.innerHTML = "<span class='texto'>"+hist.city+"</span><span class='texto'>"+hist.day
            +"</span><span class='texto'>"+hist.temperature+
            "°C</span><div class='info'><img src='./assets/iconegota.svg' class='icone'><span class='icone-txt' id='humidity'>"+
            hist.humidity+"%</span></div>"+"<img src="+getImg(hist.hour,hist.weather)+" alt='' class='clima'>"+
            "<div class='info'><img src='./assets/Wind.svg'class='icone'><span class='icone-txt' id='wind'>"+hist.wind+
            "km/h</span></div>";
            document.getElementById("historico").appendChild(div);
        })
    }
}

async function historico(cidade,dia,temperatura,humidade,clima,vento,hora){
    let dados;
    await fetch("http://localhost:8080/history", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "city": cidade,
            "day":dia,
            "humidity":humidade,
            "temperature":temperatura,
            "weather":clima,
            "wind":vento,
            "hour":hora,
            "id": id
        })
    }).then(response => response.json())
        .then(data => dados = data)
        .catch(error => console.error('Error:', error));
}
function getImg(hora,clima){
    if (clima == "Haze" || clima == "Mist") {
        clima = "HazeMist";
    }
    if(hora > 5 && hora < 18){
        switch(clima){
            case "Clear":
                return "./assets/Sunday-Clear.svg";
            case "Rain":
                return "./assets/RainDay.svg";
            case "Storm":
                return "./assets/storm.svg";
            case "Clouds":
                return "./assets/CloudyDay.svg";
            case "HazeMist":
                return "./assets/HazeMist.svg";
            case "Snow":
                return "./assets/Snowing.svg";
            default:
                break;
        }
    }else{
        switch(clima){
            case "Clear":
                return "./assets/MoonNight-Clear.svg";
            case "Rain":
                return "./assets/RainNight.svg";
            case "Storm":
                return "./assets/storm.svg";
            case "Clouds":
                return "./assets/CloudyNight.svg";
            case "HazeMist":
                return "./assets/HazeMist.svg";
            case "Snow":
                return "./assets/Snowing.svg";
            default:
                break;
        }
    }
}
function atualizaFav(hora,clima){
    const itensHistorico = document.querySelectorAll('.item-geral');
    if (clima == "Haze" || clima == "Mist") {
        clima = "HazeMist";
    }
    if(hora > 5 && hora < 18){
        switch(clima){
            case "Clear":
                itensHistorico.forEach((item) => {
                    item.style = "background:linear-gradient(#D5E5EE,#5EB8ED);";
                });
                break;
            case "Rain":
                itensHistorico.forEach((item) => {
                    item.style = "background:linear-gradient(#86B1CA,#005C91);";
                });
                break;
            case "Storm":
                itensHistorico.forEach((item) => {
                    item.style = "background:linear-gradient(#9C90F0,#142C98);";
                });
                break;
            case "Clouds":
                itensHistorico.forEach((item) => {
                    item.style = "background:linear-gradient(#BEE6EF,#303F4E);";
                });
                break;
            case "HazeMist":
                itensHistorico.forEach((item) => {
                    item.style = "background:linear-gradient(#ADD3D5,#65AFB5);";
                });
                break;
            case "Snow":
                itensHistorico.forEach((item) => {
                    item.style = "background:linear-gradient(#D6F0FF,#00AEFF);";
                });
                break;
            default:
                break;
        }
    }else{
        switch(clima){
            case "Clear":
                itensHistorico.forEach((item) => {
                    item.style = "background:linear-gradient(#06527E,#1D1B1B);";
                });
                break;
            case "Rain":
                itensHistorico.forEach((item) => {
                    item.style = "background:linear-gradient(#000000,#000681);";
                });
                break;
            case "Storm":
                itensHistorico.forEach((item) => {
                    item.style = "background:linear-gradient(#33394C,#000000);";
                });
                break;
            case "Clouds":
                itensHistorico.forEach((item) => {
                    item.style = "background:linear-gradient(#8D95A8,#161621);";
                });
            case "HazeMist":
                itensHistorico.forEach((item) => {
                    item.style = "background:linear-gradient(#ADD3D5,#65AFB5);";
                });
                break;
            case "Snow":
                itensHistorico.forEach((item) => {
                    item.style = "background:linear-gradient(#D6F0FF,#00AEFF);";
                });
                break;
            default:
                break;
        }
    }
}
defaultApp();
